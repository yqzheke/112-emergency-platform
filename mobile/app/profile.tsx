import {
  useEffect,
  useState,
} from 'react'

import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import BottomNav from '../components/BottomNav'

import {
  clearAuth,
  getStoredUser,
} from '../lib/auth'

import type { User } from '../types/auth'

export default function ProfileScreen() {
  const router = useRouter()

  const [user, setUser] =
    useState<User | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      const storedUser =
        await getStoredUser()

      if (!storedUser) {
        router.replace('/login')
        return
      }

      setUser(storedUser)
    }

    loadUser()
  }, [router])

  const handleLogout = () => {
    Alert.alert(
      'Log out?',
      'You will need to sign in again to access your account.',
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

  const firstLetter =
    user?.fullName
      ?.trim()
      .charAt(0)
      .toUpperCase() || 'U'

  return (
    <SafeAreaView style={styles.screen}>
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
          <View style={styles.headerText}>
            <View style={styles.brandRow}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoText}>
                  112
                </Text>
              </View>

              <View>
                <Text style={styles.brandTitle}>
                  Your account
                </Text>

                <Text
                  style={
                    styles.brandSubtitle
                  }
                >
                  Emergency profile
                </Text>
              </View>
            </View>

            <Text style={styles.eyebrow}>
              PROFILE
            </Text>

            <Text style={styles.title}>
              Account & safety
            </Text>

            <Text style={styles.subtitle}>
              Manage your emergency profile,
              contacts, support options, and
              account access.
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.backButton,

              pressed
                ? styles.buttonPressed
                : null,
            ]}
            onPress={() =>
              router.replace('/dashboard')
            }
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color="#111827"
            />
          </Pressable>
        </View>

        {/* PROFILE CARD */}

        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Text
                style={styles.avatarText}
              >
                {firstLetter}
              </Text>
            </View>

            <View
              style={
                styles.profileInformation
              }
            >
              <Text style={styles.name}>
                {user?.fullName ||
                  'Loading...'}
              </Text>

              <Text style={styles.email}>
                {user?.email || ''}
              </Text>
            </View>

            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {user?.role || 'USER'}
              </Text>
            </View>
          </View>

          <View
            style={styles.profileDivider}
          />

          <View
            style={
              styles.accountStatusRow
            }
          >
            <View
              style={
                styles.accountStatusLeft
              }
            >
              <View
                style={
                  styles.accountStatusDot
                }
              />

              <Text
                style={
                  styles.accountStatusText
                }
              >
                Account ready for emergency
                use
              </Text>
            </View>

            <Text
              style={
                styles.accountStatusLabel
              }
            >
              ACTIVE
            </Text>
          </View>
        </View>

        {/* SAFETY */}

        <Text style={styles.sectionLabel}>
          SAFETY SETTINGS
        </Text>

        <View style={styles.settingCard}>
          <View
            style={[
              styles.settingIcon,
              styles.gpsIcon,
            ]}
          >
            <Ionicons
              name="location"
              size={20}
              color="#2563EB"
            />
          </View>

          <View
            style={styles.settingContent}
          >
            <Text
              style={styles.settingTitle}
            >
              Automatic GPS Sharing
            </Text>

            <Text
              style={
                styles.settingDescription
              }
            >
              Your location is shared when
              you submit an emergency
              request.
            </Text>
          </View>

          <View style={styles.enabledBadge}>
            <View
              style={styles.enabledDot}
            />

            <Text
              style={styles.enabledText}
            >
              Enabled
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.settingCard,

            pressed
              ? styles.cardPressed
              : null,
          ]}
          onPress={() =>
            router.push('/contacts')
          }
        >
          <View
            style={[
              styles.settingIcon,
              styles.contactsIcon,
            ]}
          >
            <Ionicons
              name="people-outline"
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
              Emergency Contacts
            </Text>

            <Text
              style={
                styles.settingDescription
              }
            >
              Manage trusted people linked
              to your emergency requests.
            </Text>
          </View>

          <View style={styles.arrowCircle}>
            <Ionicons
              name="chevron-forward"
              size={17}
              color="#7A838D"
            />
          </View>
        </Pressable>

        {/* SUPPORT */}

        <Text style={styles.sectionLabel}>
          SUPPORT
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.settingCard,

            pressed
              ? styles.cardPressed
              : null,
          ]}
          onPress={() =>
            router.push(
              '/help-support' as never,
            )
          }
        >
          <View
            style={[
              styles.settingIcon,
              styles.supportIcon,
            ]}
          >
            <Ionicons
              name="help-circle-outline"
              size={21}
              color="#111827"
            />
          </View>

          <View
            style={styles.settingContent}
          >
            <Text
              style={styles.settingTitle}
            >
              Help & Support
            </Text>

            <Text
              style={
                styles.settingDescription
              }
            >
              Get answers, contact support,
              or ask 112 AI for help.
            </Text>
          </View>

          <View style={styles.arrowCircle}>
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
              ? styles.cardPressed
              : null,
          ]}
          onPress={() =>
            router.push(
              '/ai-chat' as never,
            )
          }
        >
          <View
            style={[
              styles.settingIcon,
              styles.aiIcon,
            ]}
          >
            <Ionicons
              name="sparkles"
              size={20}
              color="#FFFFFF"
            />
          </View>

          <View
            style={styles.settingContent}
          >
            <Text
              style={styles.settingTitle}
            >
              Ask 112 AI
            </Text>

            <Text
              style={
                styles.settingDescription
              }
            >
              Ask questions about safety,
              emergency services, and using
              the platform.
            </Text>
          </View>

          <View style={styles.arrowCircle}>
            <Ionicons
              name="chevron-forward"
              size={17}
              color="#7A838D"
            />
          </View>
        </Pressable>

        {/* ACCOUNT */}

        <Text style={styles.sectionLabel}>
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
              Sign out from this device.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#C89A96"
          />
        </Pressable>

        {/* FOOTER */}

        <View style={styles.footerInfo}>
          <Ionicons
            name="shield-checkmark-outline"
            size={14}
            color="#929AA4"
          />

          <Text style={styles.footerText}>
            Keep your account information
            and emergency contacts up to
            date.
          </Text>
        </View>
      </ScrollView>

      <BottomNav active="profile" />
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
    paddingBottom: 28,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent:
      'space-between',
    marginBottom: 22,
  },

  headerText: {
    flex: 1,
    paddingRight: 15,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoBadge: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 14,
    backgroundColor: '#111827',
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  brandTitle: {
    color: '#29333D',
    fontSize: 11,
    fontWeight: '900',
  },

  brandSubtitle: {
    marginTop: 2,
    color: '#929AA4',
    fontSize: 8,
  },

  eyebrow: {
    marginTop: 24,
    color: '#929AA4',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  title: {
    marginTop: 6,
    color: '#18212B',
    fontSize: 29,
    fontWeight: '900',
  },

  subtitle: {
    marginTop: 6,
    maxWidth: 290,
    color: '#7A838D',
    fontSize: 12,
    lineHeight: 18,
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
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
    width: 52,
    height: 52,
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

  profileInformation: {
    flex: 1,
    paddingRight: 10,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  email: {
    marginTop: 4,
    color: '#C7CDD4',
    fontSize: 10,
  },

  roleBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 11,
    backgroundColor: '#273244',
  },

  roleText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  profileDivider: {
    height: 1,
    marginVertical: 16,
    backgroundColor: '#303A49',
  },

  accountStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  accountStatusLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },

  accountStatusDot: {
    width: 7,
    height: 7,
    marginRight: 7,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },

  accountStatusText: {
    flex: 1,
    color: '#C7CDD4',
    fontSize: 9,
  },

  accountStatusLabel: {
    color: '#A7F3D0',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  sectionLabel: {
    marginTop: 27,
    marginBottom: 10,
    color: '#929AA4',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E7EAEE',
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
  },

  gpsIcon: {
    backgroundColor: '#EFF6FF',
  },

  contactsIcon: {
    backgroundColor: '#EEF2F6',
  },

  supportIcon: {
    backgroundColor: '#EEF2F6',
  },

  aiIcon: {
    backgroundColor: '#111827',
  },

  settingContent: {
    flex: 1,
    paddingRight: 10,
  },

  settingTitle: {
    color: '#29333D',
    fontSize: 13,
    fontWeight: '900',
  },

  settingDescription: {
    marginTop: 4,
    color: '#8A939D',
    fontSize: 9,
    lineHeight: 14,
  },

  enabledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 11,
    backgroundColor: '#E2F5ED',
  },

  enabledDot: {
    width: 6,
    height: 6,
    marginRight: 5,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },

  enabledText: {
    color: '#277355',
    fontSize: 8,
    fontWeight: '900',
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
    fontSize: 13,
    fontWeight: '900',
  },

  logoutDescription: {
    marginTop: 4,
    color: '#9B8583',
    fontSize: 9,
  },

  footerInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 14,
    paddingHorizontal: 4,
  },

  footerText: {
    flex: 1,
    marginLeft: 7,
    color: '#929AA4',
    fontSize: 8,
    lineHeight: 13,
  },

  buttonPressed: {
    opacity: 0.86,

    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  cardPressed: {
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