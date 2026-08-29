import ResponderBottomNav from '../components/ResponderBottomNav'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
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

import {
  getResponderEmergencies,
  type ResponderEmergency,
} from '../services/responderService'

const emergencyMeta = {
  MEDICAL: {
    title: 'Medical emergency',
    icon: 'medical' as const,
    color: '#DC2626',
    background: '#FEF2F2',
  },

  POLICE: {
    title: 'Police emergency',
    icon: 'shield-checkmark' as const,
    color: '#2563EB',
    background: '#EFF6FF',
  },

  FIRE: {
    title: 'Fire emergency',
    icon: 'flame' as const,
    color: '#EA580C',
    background: '#FFF7ED',
  },
}

export default function ResponderDashboard() {
  const router = useRouter()

  const [
    emergencies,
    setEmergencies,
  ] = useState<ResponderEmergency[]>([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    refreshing,
    setRefreshing,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const loadEmergencies =
    useCallback(async () => {
      try {
        const data =
          await getResponderEmergencies()

        setEmergencies(data)

        setError('')
      } catch (error) {
        console.error(
          'Responder dashboard error:',
          error,
        )

        setError(
          error instanceof Error
            ? error.message
            : 'Could not load responder data',
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    }, [])

  useEffect(() => {
    loadEmergencies()

    const interval =
      setInterval(
        loadEmergencies,
        5000,
      )

    return () =>
      clearInterval(interval)
  }, [loadEmergencies])

  const activeEmergency =
    useMemo(
      () =>
        emergencies.find(
          (emergency) =>
            emergency.status ===
              'RESPONDING' ||
            emergency.status ===
              'DISPATCHED',
        ) ?? emergencies[0],
      [emergencies],
    )

  const acceptedEmergency =
    emergencies.find(
      (emergency) =>
        Boolean(
          emergency.responderAcceptedAt,
        ),
    )

  const isResponding =
    Boolean(acceptedEmergency)

  const handleRefresh = () => {
    setRefreshing(true)

    loadEmergencies()
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
            style={styles.loadingLogo}
          >
            <Text
              style={
                styles.loadingLogoText
              }
            >
              112
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
            Loading responder system...
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={
              handleRefresh
            }
            tintColor="#111827"
          />
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View
            style={styles.brandRow}
          >
            <View
              style={
                styles.logoBadge
              }
            >
              <Text
                style={
                  styles.logoText
                }
              >
                112
              </Text>
            </View>

            <View>
              <Text
                style={
                  styles.brandTitle
                }
              >
                Responder
              </Text>

              <Text
                style={
                  styles.brandSubtitle
                }
              >
                Field operations
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,

              isResponding
                ? styles.busyBadge
                : styles.readyBadge,
            ]}
          >
            <View
              style={[
                styles.statusDot,

                isResponding
                  ? styles.busyDot
                  : styles.readyDot,
              ]}
            />

            <Text
              style={
                styles.statusText
              }
            >
              {isResponding
                ? 'BUSY'
                : 'AVAILABLE'}
            </Text>
          </View>
        </View>

        {/* HERO */}

        <View style={styles.hero}>
          <View
            style={styles.heroTop}
          >
            <View>
              <Text
                style={
                  styles.heroEyebrow
                }
              >
                ACTIVE DUTY
              </Text>

              <Text
                style={
                  styles.heroTitle
                }
              >
                Field dashboard
              </Text>
            </View>

            <View
              style={
                styles.heroIcon
              }
            >
              <Ionicons
                name="radio"
                size={23}
                color="#FFFFFF"
              />
            </View>
          </View>

          <Text
            style={
              styles.heroSubtitle
            }
          >
            Monitor your dispatch status
            and manage active emergency
            assignments.
          </Text>

          <View
            style={styles.statsRow}
          >
            <View
              style={styles.heroStat}
            >
              <Text
                style={
                  styles.heroStatValue
                }
              >
                {emergencies.length}
              </Text>

              <Text
                style={
                  styles.heroStatLabel
                }
              >
                Assignments
              </Text>
            </View>

            <View
              style={
                styles.heroDivider
              }
            />

            <View
              style={styles.heroStat}
            >
              <Text
                style={[
                  styles.heroStatValue,

                  isResponding
                    ? styles.activeValue
                    : null,
                ]}
              >
                {isResponding
                  ? 'ACTIVE'
                  : 'READY'}
              </Text>

              <Text
                style={
                  styles.heroStatLabel
                }
              >
                Duty status
              </Text>
            </View>
          </View>
        </View>

        {error ? (
          <View
            style={styles.errorCard}
          >
            <Ionicons
              name="warning-outline"
              size={18}
              color="#B42318"
            />

            <Text
              style={styles.errorText}
            >
              {error}
            </Text>
          </View>
        ) : null}

        {/* ACTIVE ASSIGNMENT */}

        <View
          style={
            styles.sectionHeader
          }
        >
          <View>
            <Text
              style={
                styles.sectionLabel
              }
            >
              CURRENT RESPONSE
            </Text>

            <Text
              style={
                styles.sectionTitle
              }
            >
              Active assignment
            </Text>
          </View>

          <Pressable
            onPress={() =>
              router.push(
                '/responder-assignments'
              )
            }
          >
            <Text
              style={
                styles.viewAllText
              }
            >
              View all
            </Text>
          </Pressable>
        </View>

        {activeEmergency ? (
          <Pressable
            style={({
              pressed,
            }) => [
              styles.assignmentCard,

              pressed
                ? styles.pressed
                : null,
            ]}
            onPress={() =>
              router.push(
                '/responder-assignments'
              )
            }
          >
            <View
              style={
                styles.assignmentHeader
              }
            >
              <View
                style={[
                  styles.emergencyIcon,

                  {
                    backgroundColor:
                      emergencyMeta[
                        activeEmergency
                          .type
                      ].background,
                  },
                ]}
              >
                <Ionicons
                  name={
                    emergencyMeta[
                      activeEmergency
                        .type
                    ].icon
                  }
                  size={22}
                  color={
                    emergencyMeta[
                      activeEmergency
                        .type
                    ].color
                  }
                />
              </View>

              <View
                style={
                  styles.assignmentTitleArea
                }
              >
                <Text
                  style={
                    styles.incidentNumber
                  }
                >
                  INCIDENT #
                  {activeEmergency.id}
                </Text>

                <Text
                  style={
                    styles.assignmentTitle
                  }
                >
                  {
                    emergencyMeta[
                      activeEmergency
                        .type
                    ].title
                  }
                </Text>
              </View>

              <View
                style={
                  styles.assignmentBadge
                }
              >
                <Text
                  style={
                    styles.assignmentBadgeText
                  }
                >
                  {activeEmergency
                    .responderArrivedAt
                    ? 'ON SCENE'
                    : activeEmergency
                          .responderAcceptedAt
                      ? 'EN ROUTE'
                      : 'DISPATCHED'}
                </Text>
              </View>
            </View>

            <Text
              style={
                styles.assignmentDescription
              }
              numberOfLines={2}
            >
              {
                activeEmergency.description
              }
            </Text>

            <View
              style={
                styles.assignmentDivider
              }
            />

            <View
              style={
                styles.assignmentMetaRow
              }
            >
              <View
                style={
                  styles.assignmentMeta
                }
              >
                <Ionicons
                  name="person-outline"
                  size={15}
                  color="#6B7280"
                />

                <Text
                  style={
                    styles.assignmentMetaText
                  }
                  numberOfLines={1}
                >
                  {
                    activeEmergency.user
                      .fullName
                  }
                </Text>
              </View>

              <View
                style={
                  styles.assignmentMeta
                }
              >
                <Ionicons
                  name="location-outline"
                  size={15}
                  color="#6B7280"
                />

                <Text
                  style={
                    styles.assignmentMetaText
                  }
                >
                  GPS available
                </Text>
              </View>
            </View>

            <View
              style={
                styles.openAssignment
              }
            >
              <Text
                style={
                  styles.openAssignmentText
                }
              >
                Open assignment
              </Text>

              <Ionicons
                name="arrow-forward"
                size={17}
                color="#FFFFFF"
              />
            </View>
          </Pressable>
        ) : (
          <View
            style={styles.emptyCard}
          >
            <View
              style={styles.emptyIcon}
            >
              <Ionicons
                name="checkmark"
                size={24}
                color="#166534"
              />
            </View>

            <Text
              style={
                styles.emptyTitle
              }
            >
              Ready for dispatch
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              You currently have no active
              assignments. New incidents
              assigned by the control
              center will appear
              automatically.
            </Text>
          </View>
        )}

        {/* OPERATIONS */}

        <Text
          style={
            styles.operationsLabel
          }
        >
          OPERATIONS
        </Text>

        <View
          style={styles.quickGrid}
        >
          <Pressable
            style={({
              pressed,
            }) => [
              styles.quickCard,

              pressed
                ? styles.pressed
                : null,
            ]}
            onPress={() =>
              router.push(
                '/responder-assignments'
              )
            }
          >
            <View
              style={
                styles.quickIcon
              }
            >
              <Ionicons
                name="clipboard-outline"
                size={22}
                color="#111827"
              />
            </View>

            <Text
              style={
                styles.quickTitle
              }
            >
              Assignments
            </Text>

            <Text
              style={
                styles.quickSubtitle
              }
            >
              Open dispatch queue
            </Text>
          </Pressable>

          <Pressable
            style={({
              pressed,
            }) => [
              styles.quickCard,

              pressed
                ? styles.pressed
                : null,
            ]}
            onPress={() =>
              router.push(
                '/responder-map'
              )
            }
          >
            <View
              style={
                styles.quickIcon
              }
            >
              <Ionicons
                name="map-outline"
                size={22}
                color="#111827"
              />
            </View>

            <Text
              style={
                styles.quickTitle
              }
            >
              Map
            </Text>

            <Text
              style={
                styles.quickSubtitle
              }
            >
              Incident navigation
            </Text>
          </Pressable>

          <Pressable
            style={({
              pressed,
            }) => [
              styles.quickCard,

              pressed
                ? styles.pressed
                : null,
            ]}
            onPress={() =>
              router.push(
                '/responder-history'
              )
            }
          >
            <View
              style={
                styles.quickIcon
              }
            >
              <Ionicons
                name="time-outline"
                size={22}
                color="#111827"
              />
            </View>

            <Text
              style={
                styles.quickTitle
              }
            >
              History
            </Text>

            <Text
              style={
                styles.quickSubtitle
              }
            >
              Previous incidents
            </Text>
          </Pressable>

          <Pressable
            style={({
              pressed,
            }) => [
              styles.quickCard,

              pressed
                ? styles.pressed
                : null,
            ]}
            onPress={() =>
              router.push('/responder-profile')
            }
          >
            <View
              style={
                styles.quickIcon
              }
            >
              <Ionicons
                name="person-outline"
                size={22}
                color="#111827"
              />
            </View>

            <Text
              style={
                styles.quickTitle
              }
            >
              Profile
            </Text>

            <Text
              style={
                styles.quickSubtitle
              }
            >
              Account & duty
            </Text>
          </Pressable>
        </View>

        {/* SYSTEM */}

        <View
          style={styles.systemCard}
        >
          <View
            style={styles.systemIcon}
          >
            <Ionicons
              name="shield-checkmark"
              size={21}
              color="#166534"
            />
          </View>

          <View
            style={
              styles.systemContent
            }
          >
            <Text
              style={
                styles.systemTitle
              }
            >
              Responder system online
            </Text>

            <Text
              style={
                styles.systemText
              }
            >
              Dispatch synchronization is
              active.
            </Text>
          </View>

          <View
            style={styles.onlineDot}
          />
        </View>

        <Text style={styles.footer}>
          112 Responder Platform
        </Text>
      </ScrollView>
      <ResponderBottomNav active="home" />
    </SafeAreaView>
  )
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: '#F5F6F8',
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 40,
    },

    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    loadingLogo: {
      width: 58,
      height: 58,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
      backgroundColor: '#111827',
    },

    loadingLogoText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '900',
    },

    loadingText: {
      marginTop: 12,
      color: '#7A838D',
      fontSize: 11,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginBottom: 20,
    },

    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    logoBadge: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      borderRadius: 14,
      backgroundColor: '#111827',
    },

    logoText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '900',
    },

    brandTitle: {
      color: '#18212B',
      fontSize: 14,
      fontWeight: '900',
    },

    brandSubtitle: {
      marginTop: 2,
      color: '#929AA4',
      fontSize: 9,
    },

    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 999,
    },

    readyBadge: {
      backgroundColor: '#E9F8EF',
    },

    busyBadge: {
      backgroundColor: '#FFF7ED',
    },

    statusDot: {
      width: 7,
      height: 7,
      marginRight: 6,
      borderRadius: 4,
    },

    readyDot: {
      backgroundColor: '#16A34A',
    },

    busyDot: {
      backgroundColor: '#EA580C',
    },

    statusText: {
      color: '#374151',
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 0.6,
    },

    hero: {
      padding: 21,
      borderRadius: 24,
      backgroundColor: '#111827',
    },

    heroTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent:
        'space-between',
    },

    heroEyebrow: {
      color: '#9CA3AF',
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 1.1,
    },

    heroTitle: {
      marginTop: 6,
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: '900',
    },

    heroIcon: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 15,
      backgroundColor: '#253043',
    },

    heroSubtitle: {
      marginTop: 9,
      maxWidth: 300,
      color: '#C7CDD6',
      fontSize: 11,
      lineHeight: 17,
    },

    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 23,
    },

    heroStat: {
      flex: 1,
    },

    heroStatValue: {
      color: '#FFFFFF',
      fontSize: 19,
      fontWeight: '900',
    },

    activeValue: {
      color: '#4ADE80',
      fontSize: 13,
    },

    heroStatLabel: {
      marginTop: 3,
      color: '#9CA3AF',
      fontSize: 9,
    },

    heroDivider: {
      width: 1,
      height: 35,
      marginHorizontal: 18,
      backgroundColor: '#374151',
    },

    errorCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: 12,
      padding: 13,
      borderRadius: 14,
      backgroundColor: '#FEF2F2',
    },

    errorText: {
      flex: 1,
      marginLeft: 8,
      color: '#B42318',
      fontSize: 10,
      lineHeight: 15,
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent:
        'space-between',
      marginTop: 27,
      marginBottom: 11,
    },

    sectionLabel: {
      color: '#929AA4',
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 1,
    },

    sectionTitle: {
      marginTop: 4,
      color: '#18212B',
      fontSize: 20,
      fontWeight: '900',
    },

    viewAllText: {
      color: '#111827',
      fontSize: 10,
      fontWeight: '800',
    },

    assignmentCard: {
      padding: 17,
      borderWidth: 1,
      borderColor: '#E4E7EB',
      borderRadius: 21,
      backgroundColor: '#FFFFFF',
    },

    assignmentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    emergencyIcon: {
      width: 46,
      height: 46,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 11,
      borderRadius: 15,
    },

    assignmentTitleArea: {
      flex: 1,
      paddingRight: 8,
    },

    incidentNumber: {
      color: '#9CA3AF',
      fontSize: 7,
      fontWeight: '900',
      letterSpacing: 0.8,
    },

    assignmentTitle: {
      marginTop: 4,
      color: '#111827',
      fontSize: 15,
      fontWeight: '900',
    },

    assignmentBadge: {
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 9,
      backgroundColor: '#EEF2F6',
    },

    assignmentBadgeText: {
      color: '#4B5563',
      fontSize: 7,
      fontWeight: '900',
      letterSpacing: 0.5,
    },

    assignmentDescription: {
      marginTop: 15,
      color: '#59626D',
      fontSize: 11,
      lineHeight: 17,
    },

    assignmentDivider: {
      height: 1,
      marginVertical: 14,
      backgroundColor: '#EEF0F2',
    },

    assignmentMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
    },

    assignmentMeta: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },

    assignmentMetaText: {
      flex: 1,
      marginLeft: 5,
      color: '#6B7280',
      fontSize: 9,
    },

    openAssignment: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginTop: 15,
      paddingHorizontal: 14,
      minHeight: 46,
      borderRadius: 13,
      backgroundColor: '#111827',
    },

    openAssignmentText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '900',
    },

    emptyCard: {
      alignItems: 'center',
      padding: 26,
      borderWidth: 1,
      borderColor: '#E4E7EB',
      borderRadius: 21,
      backgroundColor: '#FFFFFF',
    },

    emptyIcon: {
      width: 45,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 15,
      backgroundColor: '#ECFDF3',
    },

    emptyTitle: {
      marginTop: 13,
      color: '#111827',
      fontSize: 15,
      fontWeight: '900',
    },

    emptyText: {
      marginTop: 6,
      textAlign: 'center',
      color: '#7A838D',
      fontSize: 10,
      lineHeight: 16,
    },

    operationsLabel: {
      marginTop: 27,
      marginBottom: 10,
      color: '#929AA4',
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 1,
    },

    quickGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent:
        'space-between',
      rowGap: 10,
    },

    quickCard: {
      width: '48.5%',
      minHeight: 135,
      padding: 15,
      borderWidth: 1,
      borderColor: '#E4E7EB',
      borderRadius: 18,
      backgroundColor: '#FFFFFF',
    },

    quickIcon: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 13,
      backgroundColor: '#EEF2F6',
    },

    quickTitle: {
      marginTop: 17,
      color: '#111827',
      fontSize: 12,
      fontWeight: '900',
    },

    quickSubtitle: {
      marginTop: 3,
      color: '#929AA4',
      fontSize: 8,
    },

    systemCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
      padding: 14,
      borderRadius: 17,
      backgroundColor: '#ECFDF3',
    },

    systemIcon: {
      width: 39,
      height: 39,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      borderRadius: 13,
      backgroundColor: '#D1FAE5',
    },

    systemContent: {
      flex: 1,
    },

    systemTitle: {
      color: '#166534',
      fontSize: 10,
      fontWeight: '900',
    },

    systemText: {
      marginTop: 3,
      color: '#398056',
      fontSize: 8,
    },

    onlineDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: '#16A34A',
    },

    footer: {
      marginTop: 20,
      textAlign: 'center',
      color: '#A1A8B0',
      fontSize: 8,
    },

    pressed: {
      opacity: 0.82,

      transform: [
        {
          scale: 0.99,
        },
      ],
    },
  })