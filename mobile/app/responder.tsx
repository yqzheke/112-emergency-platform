import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { useRouter } from 'expo-router'
import * as Location from 'expo-location'

import { clearAuth } from '../lib/auth'

import {
  acceptResponderEmergency,
  completeResponderEmergency,
  getResponderEmergencies,
  markResponderArrived,
  updateResponderLocation,
  type ResponderEmergency,
} from '../services/responderService'

const emergencyNames = {
  MEDICAL: 'Medical emergency',
  POLICE: 'Police emergency',
  FIRE: 'Fire emergency',
} as const

export default function ResponderScreen() {
  const router = useRouter()

  const [emergencies, setEmergencies] =
    useState<ResponderEmergency[]>([])

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  const [error, setError] =
    useState('')

  const [actionId, setActionId] =
    useState<number | null>(null)

  const [sharingEmergencyId, setSharingEmergencyId] =
    useState<number | null>(null)

  const [lastLocation, setLastLocation] =
    useState<{
      latitude: number
      longitude: number
    } | null>(null)

  const locationSubscription =
    useRef<Location.LocationSubscription | null>(
      null,
    )

  const loadEmergencies =
    useCallback(async () => {
      try {
        const data =
          await getResponderEmergencies()

        setEmergencies(data)
        setError('')
      } catch (error) {
        console.error(
          'Responder emergency loading error:',
          error,
        )

        setError(
          error instanceof Error
            ? error.message
            : 'Could not load assigned emergencies',
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    }, [])

  useEffect(() => {
    loadEmergencies()

    const interval = setInterval(
      loadEmergencies,
      5000,
    )

    return () => {
      clearInterval(interval)

      locationSubscription.current?.remove()
      locationSubscription.current = null
    }
  }, [loadEmergencies])

  const handleRefresh = () => {
    setRefreshing(true)
    loadEmergencies()
  }

  const stopLocationSharing = () => {
    locationSubscription.current?.remove()
    locationSubscription.current = null

    setSharingEmergencyId(null)
  }

  const startLocationSharing = async (
    emergencyId: number,
  ) => {
    try {
      setError('')

      const permission =
        await Location.requestForegroundPermissionsAsync()

      if (
        permission.status !== 'granted'
      ) {
        setError(
          'Location permission is required to share responder position.',
        )
        return
      }

      stopLocationSharing()

      const current =
        await Location.getCurrentPositionAsync({
          accuracy:
            Location.Accuracy.High,
        })

      const {
        latitude,
        longitude,
      } = current.coords

      setLastLocation({
        latitude,
        longitude,
      })

      await updateResponderLocation(
        emergencyId,
        latitude,
        longitude,
      )

      const subscription =
        await Location.watchPositionAsync(
          {
            accuracy:
              Location.Accuracy.High,

            timeInterval: 5000,

            distanceInterval: 10,
          },

          async (location) => {
            const nextLatitude =
              location.coords.latitude

            const nextLongitude =
              location.coords.longitude

            setLastLocation({
              latitude:
                nextLatitude,

              longitude:
                nextLongitude,
            })

            try {
              await updateResponderLocation(
                emergencyId,
                nextLatitude,
                nextLongitude,
              )
            } catch (error) {
              console.error(
                'Responder live location update failed:',
                error,
              )
            }
          },
        )

      locationSubscription.current =
        subscription

      setSharingEmergencyId(
        emergencyId,
      )
    } catch (error) {
      console.error(
        'Location sharing error:',
        error,
      )

      setError(
        error instanceof Error
          ? error.message
          : 'Could not start location sharing',
      )
    }
  }

  const handleAccept = async (
    emergencyId: number,
  ) => {
    try {
      setActionId(emergencyId)
      setError('')

      await acceptResponderEmergency(
        emergencyId,
      )

      await loadEmergencies()

      await startLocationSharing(
        emergencyId,
      )
    } catch (error) {
      console.error(
        'Responder accept error:',
        error,
      )

      setError(
        error instanceof Error
          ? error.message
          : 'Could not accept assignment',
      )
    } finally {
      setActionId(null)
    }
  }

  const handleStartTracking = async (
    emergencyId: number,
  ) => {
    try {
      setActionId(emergencyId)

      await startLocationSharing(
        emergencyId,
      )
    } finally {
      setActionId(null)
    }
  }

  const handleArrived = async (
    emergencyId: number,
  ) => {
    try {
      setActionId(emergencyId)
      setError('')

      await markResponderArrived(
        emergencyId,
      )

      stopLocationSharing()

      await loadEmergencies()
    } catch (error) {
      console.error(
        'Responder arrival error:',
        error,
      )

      setError(
        error instanceof Error
          ? error.message
          : 'Could not mark arrival',
      )
    } finally {
      setActionId(null)
    }
  }

  const handleComplete = async (
    emergencyId: number,
  ) => {
    Alert.alert(
      'Complete emergency?',
      'This will close the emergency request.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Complete',
          style: 'default',

          onPress: async () => {
            try {
              setActionId(
                emergencyId,
              )

              setError('')

              await completeResponderEmergency(
                emergencyId,
              )

              stopLocationSharing()

              await loadEmergencies()
            } catch (error) {
              console.error(
                'Responder completion error:',
                error,
              )

              setError(
                error instanceof Error
                  ? error.message
                  : 'Could not complete emergency',
              )
            } finally {
              setActionId(null)
            }
          },
        },
      ],
    )
  }

  const handleLogout = async () => {
    stopLocationSharing()

    await clearAuth()

    router.replace('/login')
  }

  if (loading) {
    return (
      <SafeAreaView
        style={styles.screen}
      >
        <View
          style={styles.loadingContainer}
        >
          <ActivityIndicator
            size="large"
            color="#111827"
          />

          <Text
            style={styles.loadingText}
          >
            Loading assignments...
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        <View
          style={styles.header}
        >
          <View>
            <Text
              style={styles.logo}
            >
              112
            </Text>

            <Text
              style={styles.systemLabel}
            >
              RESPONDER SYSTEM
            </Text>
          </View>

          <Pressable
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text
              style={
                styles.logoutButtonText
              }
            >
              Logout
            </Text>
          </Pressable>
        </View>

        <View
          style={styles.hero}
        >
          <Text
            style={styles.heroEyebrow}
          >
            ACTIVE DUTY
          </Text>

          <Text
            style={styles.heroTitle}
          >
            Responder dashboard
          </Text>

          <Text
            style={styles.heroSubtitle}
          >
            Assigned incidents appear
            here in real time.
          </Text>

          <View
            style={
              styles.heroStatRow
            }
          >
            <View
              style={
                styles.heroStat
              }
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
                Active assignments
              </Text>
            </View>

            <View
              style={
                styles.heroDivider
              }
            />

            <View
              style={
                styles.heroStat
              }
            >
              <Text
                style={
                  styles.heroStatValue
                }
              >
                {sharingEmergencyId
                  ? 'ON'
                  : 'OFF'}
              </Text>

              <Text
                style={
                  styles.heroStatLabel
                }
              >
                Live GPS
              </Text>
            </View>
          </View>
        </View>

        {error ? (
          <View
            style={styles.errorCard}
          >
            <Text
              style={styles.errorText}
            >
              {error}
            </Text>
          </View>
        ) : null}

        <View
          style={styles.sectionHeader}
        >
          <Text
            style={
              styles.sectionEyebrow
            }
          >
            DISPATCH QUEUE
          </Text>

          <Text
            style={
              styles.sectionTitle
            }
          >
            Assigned emergencies
          </Text>
        </View>

        {emergencies.length === 0 ? (
          <View
            style={styles.emptyCard}
          >
            <View
              style={styles.emptyIcon}
            >
              <Text
                style={
                  styles.emptyIconText
                }
              >
                ✓
              </Text>
            </View>

            <Text
              style={styles.emptyTitle}
            >
              No active assignments
            </Text>

            <Text
              style={styles.emptyText}
            >
              New emergencies assigned
              by the control center will
              appear here automatically.
            </Text>
          </View>
        ) : (
          emergencies.map(
            (emergency) => {
              const accepted =
                Boolean(
                  emergency.responderAcceptedAt,
                ) ||
                emergency.status ===
                  'RESPONDING'

              const arrived =
                Boolean(
                  emergency.responderArrivedAt,
                )

              const isSharing =
                sharingEmergencyId ===
                emergency.id

              const busy =
                actionId ===
                emergency.id

              return (
                <View
                  key={emergency.id}
                  style={
                    styles.emergencyCard
                  }
                >
                  <View
                    style={
                      styles.emergencyHeader
                    }
                  >
                    <View>
                      <Text
                        style={
                          styles.emergencyNumber
                        }
                      >
                        INCIDENT #
                        {emergency.id}
                      </Text>

                      <Text
                        style={
                          styles.emergencyType
                        }
                      >
                        {
                          emergencyNames[
                            emergency.type
                          ]
                        }
                      </Text>
                    </View>

                    <View
                      style={
                        styles.statusBadge
                      }
                    >
                      <Text
                        style={
                          styles.statusBadgeText
                        }
                      >
                        {
                          emergency.status
                        }
                      </Text>
                    </View>
                  </View>

                  <View
                    style={
                      styles.descriptionCard
                    }
                  >
                    <Text
                      style={
                        styles.detailLabel
                      }
                    >
                      INCIDENT DESCRIPTION
                    </Text>

                    <Text
                      style={
                        styles.description
                      }
                    >
                      {
                        emergency.description
                      }
                    </Text>
                  </View>

                  <View
                    style={
                      styles.detailGrid
                    }
                  >
                    <View
                      style={
                        styles.detailBox
                      }
                    >
                      <Text
                        style={
                          styles.detailLabel
                        }
                      >
                        CALLER
                      </Text>

                      <Text
                        style={
                          styles.detailValue
                        }
                      >
                        {
                          emergency.user
                            .fullName
                        }
                      </Text>
                    </View>

                    <View
                      style={
                        styles.detailBox
                      }
                    >
                      <Text
                        style={
                          styles.detailLabel
                        }
                      >
                        STATUS
                      </Text>

                      <Text
                        style={
                          styles.detailValue
                        }
                      >
                        {arrived
                          ? 'ARRIVED'
                          : accepted
                            ? 'EN ROUTE'
                            : 'DISPATCHED'}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={
                      styles.locationCard
                    }
                  >
                    <Text
                      style={
                        styles.detailLabel
                      }
                    >
                      EMERGENCY LOCATION
                    </Text>

                    <Text
                      style={
                        styles.locationValue
                      }
                    >
                      {emergency.latitude.toFixed(
                        5,
                      )}
                      ,{' '}
                      {emergency.longitude.toFixed(
                        5,
                      )}
                    </Text>

                    <Text
                      style={
                        styles.locationHint
                      }
                    >
                      Exact coordinates
                      shared by caller
                    </Text>
                  </View>

                  {accepted &&
                    !arrived && (
                      <View
                        style={
                          styles.trackingCard
                        }
                      >
                        <View>
                          <Text
                            style={
                              styles.trackingTitle
                            }
                          >
                            Live location
                          </Text>

                          <Text
                            style={
                              styles.trackingText
                            }
                          >
                            {isSharing
                              ? 'Your location is being shared with the 112 platform.'
                              : 'Location sharing is currently stopped.'}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.liveDot,
                            isSharing
                              ? styles.liveDotActive
                              : styles.liveDotInactive,
                          ]}
                        />
                      </View>
                    )}

                  {isSharing &&
                    lastLocation && (
                      <Text
                        style={
                          styles.currentGps
                        }
                      >
                        GPS:{' '}
                        {lastLocation.latitude.toFixed(
                          5,
                        )}
                        ,{' '}
                        {lastLocation.longitude.toFixed(
                          5,
                        )}
                      </Text>
                    )}

                  {!accepted ? (
                    <Pressable
                      style={[
                        styles.primaryButton,
                        busy &&
                          styles.disabledButton,
                      ]}
                      disabled={busy}
                      onPress={() =>
                        handleAccept(
                          emergency.id,
                        )
                      }
                    >
                      {busy ? (
                        <ActivityIndicator
                          color="#ffffff"
                        />
                      ) : (
                        <Text
                          style={
                            styles.primaryButtonText
                          }
                        >
                          Accept assignment
                        </Text>
                      )}
                    </Pressable>
                  ) : null}

                  {accepted &&
                    !arrived &&
                    !isSharing ? (
                    <Pressable
                      style={[
                        styles.secondaryButton,
                        busy &&
                          styles.disabledButton,
                      ]}
                      disabled={busy}
                      onPress={() =>
                        handleStartTracking(
                          emergency.id,
                        )
                      }
                    >
                      <Text
                        style={
                          styles.secondaryButtonText
                        }
                      >
                        Start GPS sharing
                      </Text>
                    </Pressable>
                  ) : null}

                  {accepted &&
                    !arrived ? (
                    <Pressable
                      style={[
                        styles.primaryButton,
                        styles.buttonSpacing,
                        busy &&
                          styles.disabledButton,
                      ]}
                      disabled={busy}
                      onPress={() =>
                        handleArrived(
                          emergency.id,
                        )
                      }
                    >
                      {busy ? (
                        <ActivityIndicator
                          color="#ffffff"
                        />
                      ) : (
                        <Text
                          style={
                            styles.primaryButtonText
                          }
                        >
                          Mark as arrived
                        </Text>
                      )}
                    </Pressable>
                  ) : null}

                  {arrived ? (
                    <>
                      <View
                        style={
                          styles.arrivedCard
                        }
                      >
                        <Text
                          style={
                            styles.arrivedTitle
                          }
                        >
                          Responder arrived
                        </Text>

                        <Text
                          style={
                            styles.arrivedText
                          }
                        >
                          The incident is
                          currently being
                          handled on scene.
                        </Text>
                      </View>

                      <Pressable
                        style={[
                          styles.completeButton,
                          busy &&
                            styles.disabledButton,
                        ]}
                        disabled={busy}
                        onPress={() =>
                          handleComplete(
                            emergency.id,
                          )
                        }
                      >
                        {busy ? (
                          <ActivityIndicator
                            color="#ffffff"
                          />
                        ) : (
                          <Text
                            style={
                              styles.primaryButtonText
                            }
                          >
                            Complete emergency
                          </Text>
                        )}
                      </Pressable>
                    </>
                  ) : null}
                </View>
              )
            },
          )
        )}

        <Text
          style={styles.footerNote}
        >
          112 Responder Platform ·
          Prototype emergency response
          system
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7F9',
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 35,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 14,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  logo: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111827',
  },

  systemLabel: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#9CA3AF',
  },

  logoutButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },

  logoutButtonText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '700',
  },

  hero: {
    padding: 22,
    borderRadius: 24,
    backgroundColor: '#111827',
  },

  heroEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.3,
    color: '#9CA3AF',
  },

  heroTitle: {
    marginTop: 7,
    fontSize: 27,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  heroSubtitle: {
    marginTop: 7,
    maxWidth: 290,
    fontSize: 14,
    lineHeight: 20,
    color: '#C7CDD6',
  },

  heroStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },

  heroStat: {
    flex: 1,
  },

  heroStatValue: {
    fontSize: 21,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  heroStatLabel: {
    marginTop: 3,
    fontSize: 10,
    color: '#9CA3AF',
  },

  heroDivider: {
    width: 1,
    height: 37,
    marginHorizontal: 18,
    backgroundColor: '#374151',
  },

  errorCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
  },

  errorText: {
    color: '#B91C1C',
    fontSize: 12,
    lineHeight: 18,
  },

  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
  },

  sectionEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: '#9CA3AF',
  },

  sectionTitle: {
    marginTop: 4,
    fontSize: 21,
    fontWeight: '800',
    color: '#111827',
  },

  emptyCard: {
    alignItems: 'center',
    padding: 28,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },

  emptyIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#EEF2F6',
  },

  emptyIconText: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },

  emptyText: {
    marginTop: 7,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 19,
    color: '#6B7280',
  },

  emergencyCard: {
    marginBottom: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E3E7EC',
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },

  emergencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  emergencyNumber: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#9CA3AF',
  },

  emergencyType: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#EEF2F6',
  },

  statusBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.6,
    color: '#111827',
  },

  descriptionCard: {
    marginTop: 16,
    padding: 14,
    borderRadius: 15,
    backgroundColor: '#F7F8FA',
  },

  detailLabel: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: '#9CA3AF',
  },

  description: {
    marginTop: 7,
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },

  detailGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  detailBox: {
    flex: 1,
    padding: 13,
    borderWidth: 1,
    borderColor: '#ECEEF1',
    borderRadius: 14,
  },

  detailValue: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },

  locationCard: {
    marginTop: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E6E9ED',
    borderRadius: 15,
  },

  locationValue: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },

  locationHint: {
    marginTop: 4,
    fontSize: 10,
    color: '#9CA3AF',
  },

  trackingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    padding: 14,
    borderRadius: 15,
    backgroundColor: '#F7F8FA',
  },

  trackingTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },

  trackingText: {
    maxWidth: 265,
    marginTop: 3,
    fontSize: 10,
    lineHeight: 15,
    color: '#6B7280',
  },

  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  liveDotActive: {
    backgroundColor: '#16A34A',
  },

  liveDotInactive: {
    backgroundColor: '#9CA3AF',
  },

  currentGps: {
    marginTop: 9,
    fontSize: 9,
    color: '#6B7280',
  },

  primaryButton: {
    minHeight: 51,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#111827',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  secondaryButton: {
    minHeight: 49,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#DCE0E5',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },

  secondaryButtonText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '800',
  },

  buttonSpacing: {
    marginTop: 10,
  },

  disabledButton: {
    opacity: 0.5,
  },

  arrivedCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: 15,
    backgroundColor: '#ECFDF3',
  },

  arrivedTitle: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '900',
  },

  arrivedText: {
    marginTop: 4,
    color: '#398056',
    fontSize: 10,
    lineHeight: 15,
  },

  completeButton: {
    minHeight: 51,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#111827',
  },

  footerNote: {
    marginTop: 8,
    textAlign: 'center',
    color: '#A1A8B0',
    fontSize: 9,
  },
})