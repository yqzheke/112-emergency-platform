import ResponderBottomNav from '../components/ResponderBottomNav'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {
  Ionicons,
} from '@expo/vector-icons'

import {
  useRouter,
} from 'expo-router'

import * as Location from 'expo-location'

import {
  clearAuth,
  getStoredUser,
} from '../lib/auth'

import {
  getResponderEmergencies,
  type ResponderEmergency,
} from '../services/responderService'

import type {
  User,
} from '../types/auth'

export default function ResponderProfileScreen() {
  const router = useRouter()

  const [
    user,
    setUser,
  ] = useState<User | null>(null)

  const [
    emergencies,
    setEmergencies,
  ] = useState<ResponderEmergency[]>([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    gpsGranted,
    setGpsGranted,
  ] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedUser =
          await getStoredUser()

        if (!storedUser) {
          router.replace('/login')
          return
        }

        setUser(storedUser)

        const data =
          await getResponderEmergencies()

        setEmergencies(data)

        const permission =
          await Location.getForegroundPermissionsAsync()

        setGpsGranted(
          permission.status === 'granted',
        )
      } catch (error) {
        console.error(
          'Responder profile error:',
          error,
        )
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const isBusy =
    useMemo(
      () =>
        emergencies.some(
          (emergency) =>
            Boolean(
              emergency.responderAcceptedAt,
            ) &&
            !emergency.responderArrivedAt,
        ),
      [emergencies],
    )

  const activeCount =
    emergencies.length

  const firstLetter =
    user?.fullName
      ?.trim()
      .charAt(0)
      .toUpperCase() || 'R'

  const handleLogout = () => {
    Alert.alert(
      'Log out?',
      'You will need to sign in again to access the responder system.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log out',
          style: 'destructive',

          onPress: async () => {
            await clearAuth()

            router.replace('/login')
          },
        },
      ],
    )
  }

  if (loading) {
    return (
      <SafeAreaView
        style={styles.screen}
      >
        <View
          style={
            styles.loadingContainer
          }
        >
          <View
            style={
              styles.logoBadge
            }
          >
            <Text
              style={styles.logoText}
            >
              ResQ
            </Text>
          </View>

          <ActivityIndicator
            size="large"
            color="#111827"
            style={{
              marginTop: 20,
            }}
          />

          <Text
            style={styles.loadingText}
          >
            Loading responder profile...
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,

              pressed
                ? styles.pressed
                : null,
            ]}
            onPress={() =>
              router.back()
            }
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color="#111827"
            />
          </Pressable>

          <View
            style={styles.headerCenter}
          >
            <Text
              style={
                styles.headerEyebrow
              }
            >
              RESPONDER SYSTEM
            </Text>

            <Text
              style={
                styles.headerTitle
              }
            >
              Profile
            </Text>
          </View>

          <View
            style={styles.logoBadge}
          >
            <Text
              style={styles.logoText}
            >
              ResQ
            </Text>
          </View>
        </View>

        {/* PROFILE CARD */}

        <View
          style={styles.profileCard}
        >
          <View
            style={styles.profileTop}
          >
            <View
              style={styles.avatar}
            >
              <Text
                style={
                  styles.avatarText
                }
              >
                {firstLetter}
              </Text>
            </View>

            <View
              style={
                styles.profileInfo
              }
            >
              <Text
                style={styles.name}
              >
                {user?.fullName ||
                  'Responder'}
              </Text>

              <Text
                style={styles.email}
              >
                {user?.email || ''}
              </Text>
            </View>

            <View
              style={styles.roleBadge}
            >
              <Text
                style={styles.roleText}
              >
                {user?.role ||
                  'RESPONDER'}
              </Text>
            </View>
          </View>

          <View
            style={styles.divider}
          />

          <View
            style={
              styles.dutyRow
            }
          >
            <View
              style={styles.dutyLeft}
            >
              <View
                style={[
                  styles.dutyDot,

                  isBusy
                    ? styles.busyDot
                    : styles.availableDot,
                ]}
              />

              <View>
                <Text
                  style={
                    styles.dutyTitle
                  }
                >
                  Duty status
                </Text>

                <Text
                  style={
                    styles.dutySubtitle
                  }
                >
                  {isBusy
                    ? 'Active response in progress'
                    : 'Ready for dispatch'}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.dutyBadge,

                isBusy
                  ? styles.busyBadge
                  : styles.availableBadge,
              ]}
            >
              <Text
                style={
                  styles.dutyBadgeText
                }
              >
                {isBusy
                  ? 'BUSY'
                  : 'AVAILABLE'}
              </Text>
            </View>
          </View>
        </View>

        {/* FIELD STATUS */}

        <Text
          style={styles.sectionLabel}
        >
          FIELD STATUS
        </Text>

        <View
          style={styles.statusGrid}
        >
          <View
            style={styles.statusCard}
          >
            <View
              style={
                styles.statusIcon
              }
            >
              <Ionicons
                name="clipboard-outline"
                size={21}
                color="#111827"
              />
            </View>

            <Text
              style={
                styles.statusValue
              }
            >
              {activeCount}
            </Text>

            <Text
              style={
                styles.statusLabel
              }
            >
              Active assignments
            </Text>
          </View>

          <View
            style={styles.statusCard}
          >
            <View
              style={[
                styles.statusIcon,

                gpsGranted
                  ? styles.gpsStatusIcon
                  : null,
              ]}
            >
              <Ionicons
                name="location-outline"
                size={21}
                color={
                  gpsGranted
                    ? '#166534'
                    : '#111827'
                }
              />
            </View>

            <Text
              style={[
                styles.statusValue,

                gpsGranted
                  ? styles.gpsValue
                  : null,
              ]}
            >
              {gpsGranted
                ? 'READY'
                : 'OFF'}
            </Text>

            <Text
              style={
                styles.statusLabel
              }
            >
              GPS permission
            </Text>
          </View>
        </View>

        {/* SYSTEM */}

        <Text
          style={styles.sectionLabel}
        >
          SYSTEM
        </Text>

        <View
          style={styles.settingCard}
        >
          <View
            style={[
              styles.settingIcon,
              styles.onlineIcon,
            ]}
          >
            <Ionicons
              name="radio-outline"
              size={20}
              color="#166534"
            />
          </View>

          <View
            style={styles.settingContent}
          >
            <Text
              style={styles.settingTitle}
            >
              Dispatch connection
            </Text>

            <Text
              style={
                styles.settingDescription
              }
            >
              Connected to the ResQ
              emergency dispatch system.
            </Text>
          </View>

          <View
            style={styles.onlineBadge}
          >
            <View
              style={styles.onlineDot}
            />

            <Text
              style={styles.onlineText}
            >
              ONLINE
            </Text>
          </View>
        </View>

        <View
          style={styles.settingCard}
        >
          <View
            style={styles.settingIcon}
          >
            <Ionicons
              name="location-outline"
              size={20}
              color="#111827"
            />
          </View>

          <View
            style={styles.settingContent}
          >
            <Text
              style={styles.settingTitle}
            >
              Location services
            </Text>

            <Text
              style={
                styles.settingDescription
              }
            >
              Required for live responder
              tracking during active
              emergencies.
            </Text>
          </View>

          <View
            style={[
              styles.permissionBadge,

              gpsGranted
                ? styles.permissionGranted
                : styles.permissionMissing,
            ]}
          >
            <Text
              style={[
                styles.permissionText,

                gpsGranted
                  ? styles.permissionTextGranted
                  : styles.permissionTextMissing,
              ]}
            >
              {gpsGranted
                ? 'ENABLED'
                : 'REQUIRED'}
            </Text>
          </View>
        </View>

        {/* QUICK ACCESS */}

        <Text
          style={styles.sectionLabel}
        >
          QUICK ACCESS
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.settingCard,

            pressed
              ? styles.pressed
              : null,
          ]}
          onPress={() =>
            router.push(
              '/responder-assignments',
            )
          }
        >
          <View
            style={styles.settingIcon}
          >
            <Ionicons
              name="clipboard-outline"
              size={20}
              color="#111827"
            />
          </View>

          <View
            style={styles.settingContent}
          >
            <Text
              style={styles.settingTitle}
            >
              Assignments
            </Text>

            <Text
              style={
                styles.settingDescription
              }
            >
              Open active incident controls
              and response actions.
            </Text>
          </View>

          <View
            style={styles.arrowCircle}
          >
            <Ionicons
              name="chevron-forward"
              size={17}
              color="#7A838D"
            />
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.settingCard,

            pressed
              ? styles.pressed
              : null,
          ]}
          onPress={() =>
            router.push(
              '/responder-history',
            )
          }
        >
          <View
            style={styles.settingIcon}
          >
            <Ionicons
              name="time-outline"
              size={20}
              color="#111827"
            />
          </View>

          <View
            style={styles.settingContent}
          >
            <Text
              style={styles.settingTitle}
            >
              Response history
            </Text>

            <Text
              style={
                styles.settingDescription
              }
            >
              Review completed incidents
              assigned to your account.
            </Text>
          </View>

          <View
            style={styles.arrowCircle}
          >
            <Ionicons
              name="chevron-forward"
              size={17}
              color="#7A838D"
            />
          </View>
        </Pressable>

        {/* ACCOUNT */}

        <Text
          style={styles.sectionLabel}
        >
          ACCOUNT
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.logoutCard,

            pressed
              ? styles.logoutPressed
              : null,
          ]}
          onPress={handleLogout}
        >
          <View
            style={styles.logoutIcon}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#B42318"
            />
          </View>

          <View
            style={styles.logoutContent}
          >
            <Text
              style={styles.logoutTitle}
            >
              Log out
            </Text>

            <Text
              style={
                styles.logoutDescription
              }
            >
              Sign out of the responder
              system on this device.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#C89A96"
          />
        </Pressable>

        {/* SECURITY */}

        <View
          style={styles.securityNotice}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={16}
            color="#7A838D"
          />

          <Text
            style={
              styles.securityText
            }
          >
            This responder account is
            authorized for emergency field
            operations. Keep account access
            secure.
          </Text>
        </View>
      </ScrollView>
      <ResponderBottomNav active="profile" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 36,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    color: '#7A838D',
    fontSize: 11,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },

  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },

  headerEyebrow: {
    color: '#929AA4',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  headerTitle: {
    marginTop: 3,
    color: '#18212B',
    fontSize: 19,
    fontWeight: '900',
  },

  logoBadge: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#111827',
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  profileCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#111827',
  },

  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },

  avatarText: {
    color: '#111827',
    fontSize: 19,
    fontWeight: '900',
  },

  profileInfo: {
    flex: 1,
    paddingRight: 8,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  email: {
    marginTop: 4,
    color: '#C7CDD4',
    fontSize: 9,
  },

  roleBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#273244',
  },

  roleText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  divider: {
    height: 1,
    marginVertical: 16,
    backgroundColor: '#303A49',
  },

  dutyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dutyLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },

  dutyDot: {
    width: 8,
    height: 8,
    marginRight: 9,
    borderRadius: 4,
  },

  availableDot: {
    backgroundColor: '#4ADE80',
  },

  busyDot: {
    backgroundColor: '#FB923C',
  },

  dutyTitle: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  dutySubtitle: {
    marginTop: 3,
    color: '#AEB6C1',
    fontSize: 8,
  },

  dutyBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
  },

  availableBadge: {
    backgroundColor: '#163D2B',
  },

  busyBadge: {
    backgroundColor: '#4A2A16',
  },

  dutyBadgeText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  sectionLabel: {
    marginTop: 27,
    marginBottom: 10,
    color: '#929AA4',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statusCard: {
    width: '48.5%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },

  statusIcon: {
    width: 39,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#EEF2F6',
  },

  gpsStatusIcon: {
    backgroundColor: '#ECFDF3',
  },

  statusValue: {
    marginTop: 16,
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
  },

  gpsValue: {
    color: '#166534',
    fontSize: 12,
  },

  statusLabel: {
    marginTop: 4,
    color: '#929AA4',
    fontSize: 8,
  },

  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },

  settingIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderRadius: 14,
    backgroundColor: '#EEF2F6',
  },

  onlineIcon: {
    backgroundColor: '#ECFDF3',
  },

  settingContent: {
    flex: 1,
    paddingRight: 10,
  },

  settingTitle: {
    color: '#29333D',
    fontSize: 12,
    fontWeight: '900',
  },

  settingDescription: {
    marginTop: 4,
    color: '#8A939D',
    fontSize: 9,
    lineHeight: 14,
  },

  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#ECFDF3',
  },

  onlineDot: {
    width: 6,
    height: 6,
    marginRight: 5,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },

  onlineText: {
    color: '#166534',
    fontSize: 7,
    fontWeight: '900',
  },

  permissionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
  },

  permissionGranted: {
    backgroundColor: '#ECFDF3',
  },

  permissionMissing: {
    backgroundColor: '#FFF7ED',
  },

  permissionText: {
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  permissionTextGranted: {
    color: '#166534',
  },

  permissionTextMissing: {
    color: '#C2410C',
  },

  arrowCircle: {
    width: 31,
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },

  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#F1D5D2',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },

  logoutIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
  },

  logoutContent: {
    flex: 1,
    paddingRight: 10,
  },

  logoutTitle: {
    color: '#B42318',
    fontSize: 12,
    fontWeight: '900',
  },

  logoutDescription: {
    marginTop: 4,
    color: '#9B8583',
    fontSize: 9,
    lineHeight: 14,
  },

  securityNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 17,
    paddingHorizontal: 3,
  },

  securityText: {
    flex: 1,
    marginLeft: 7,
    color: '#929AA4',
    fontSize: 8,
    lineHeight: 13,
  },

  pressed: {
    opacity: 0.82,

    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  logoutPressed: {
    opacity: 0.7,

    transform: [
      {
        scale: 0.99,
      },
    ],
  },
})