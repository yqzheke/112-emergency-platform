import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router'

import MapView, {
  Marker,
} from 'react-native-maps'

import { getEmergency } from '../services/emergencyService'

import type {
  EmergencyStatus,
  EmergencyType,
  EmergencyWithContacts,
} from '../types/emergency'

const emergencyNames: Record<
  EmergencyType,
  string
> = {
  MEDICAL: 'Medical Emergency',
  POLICE: 'Police Emergency',
  FIRE: 'Fire & Rescue Emergency',
}

const statusNames: Record<
  EmergencyStatus,
  string
> = {
  PENDING: 'Waiting for operator',
  ACCEPTED: 'Request accepted',
  DISPATCHED: 'Responder dispatched',
  RESPONDING: 'Responder on the way',
  COMPLETED: 'Emergency completed',
  CANCELLED: 'Request cancelled',
}

const progressStatuses: EmergencyStatus[] = [
  'PENDING',
  'ACCEPTED',
  'DISPATCHED',
  'RESPONDING',
  'COMPLETED',
]

interface ProgressStepProps {
  number: string
  title: string
  description: string
  completed: boolean
}

function ProgressStep({
  number,
  title,
  description,
  completed,
}: ProgressStepProps) {
  return (
    <View style={styles.progressStep}>
      <View
        style={[
          styles.progressCircle,
          completed &&
            styles.progressCircleCompleted,
        ]}
      >
        <Text
          style={[
            styles.progressNumber,
            completed &&
              styles.progressNumberCompleted,
          ]}
        >
          {completed ? '✓' : number}
        </Text>
      </View>

      <View style={styles.progressContent}>
        <Text
          style={[
            styles.progressTitle,
            completed &&
              styles.progressTitleCompleted,
          ]}
        >
          {title}
        </Text>

        <Text style={styles.progressDescription}>
          {description}
        </Text>
      </View>
    </View>
  )
}

/*
  Calculates straight-line distance
  between two GPS coordinates.

  This is not road/navigation distance.
*/
function calculateDistanceKm(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number,
) {
  const earthRadiusKm = 6371

  const toRadians = (value: number) =>
    (value * Math.PI) / 180

  const latitudeDifference =
    toRadians(latitude2 - latitude1)

  const longitudeDifference =
    toRadians(longitude2 - longitude1)

  const firstLatitude =
    toRadians(latitude1)

  const secondLatitude =
    toRadians(latitude2)

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDifference / 2) **
        2

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a),
    )

  return earthRadiusKm * c
}

/*
  Prototype ETA only.

  Uses straight-line distance and a
  simple assumed average response speed.

  Later we should replace this with a
  real routing provider.
*/
function calculatePrototypeEtaMinutes(
  distanceKm: number,
) {
  const assumedSpeedKmH = 35

  const hours =
    distanceKm / assumedSpeedKmH

  const minutes =
    Math.ceil(hours * 60)

  return Math.max(1, minutes)
}

function formatDistance(
  distanceKm: number,
) {
  if (distanceKm < 1) {
    return `${Math.round(
      distanceKm * 1000,
    )} m`
  }

  return `${distanceKm.toFixed(1)} km`
}

export default function EmergencyStatusScreen() {
  const router = useRouter()

  const mapRef =
    useRef<MapView | null>(null)

  const params = useLocalSearchParams<{
    id?: string
  }>()

  const emergencyId = Number(params.id)

  const [emergency, setEmergency] =
    useState<EmergencyWithContacts | null>(
      null,
    )

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const loadEmergency = useCallback(
    async (showLoading = false) => {
      if (
        !Number.isInteger(emergencyId) ||
        emergencyId <= 0
      ) {
        setError(
          'Invalid emergency ID',
        )

        setLoading(false)

        return
      }

      try {
        if (showLoading) {
          setLoading(true)
        }

        const result =
          await getEmergency(emergencyId)

        setEmergency(result)
        setError('')
      } catch (error) {
        console.error(error)

        setError(
          error instanceof Error
            ? error.message
            : 'Could not load emergency',
        )
      } finally {
        if (showLoading) {
          setLoading(false)
        }
      }
    },
    [emergencyId],
  )

  useEffect(() => {
    loadEmergency(true)

    const intervalId = setInterval(
      () => {
        loadEmergency(false)
      },
      3000,
    )

    return () => {
      clearInterval(intervalId)
    }
  }, [loadEmergency])

  const hasResponderLocation =
    emergency?.responderLatitude != null &&
    emergency?.responderLongitude != null

  const responderDistanceKm =
    useMemo(() => {
      if (
        !emergency ||
        emergency.responderLatitude == null ||
        emergency.responderLongitude == null
      ) {
        return null
      }

      return calculateDistanceKm(
        emergency.latitude,
        emergency.longitude,
        emergency.responderLatitude,
        emergency.responderLongitude,
      )
    }, [emergency])

  const estimatedMinutes =
    useMemo(() => {
      if (
        responderDistanceKm == null
      ) {
        return null
      }

      return calculatePrototypeEtaMinutes(
        responderDistanceKm,
      )
    }, [responderDistanceKm])

  /*
    When responder GPS appears or changes,
    keep both emergency and responder visible.
  */
  useEffect(() => {
    if (
      !emergency ||
      emergency.responderLatitude == null ||
      emergency.responderLongitude == null
    ) {
      return
    }

    mapRef.current?.fitToCoordinates(
      [
        {
          latitude:
            emergency.latitude,

          longitude:
            emergency.longitude,
        },

        {
          latitude:
            emergency.responderLatitude,

          longitude:
            emergency.responderLongitude,
        },
      ],
      {
        edgePadding: {
          top: 60,
          right: 60,
          bottom: 60,
          left: 60,
        },

        animated: true,
      },
    )
  }, [
    emergency?.latitude,
    emergency?.longitude,
    emergency?.responderLatitude,
    emergency?.responderLongitude,
  ])

  const hasReached = (
    status: EmergencyStatus,
  ) => {
    if (!emergency) {
      return false
    }

    if (
      emergency.status ===
      'CANCELLED'
    ) {
      return false
    }

    return (
      progressStatuses.indexOf(
        emergency.status,
      ) >=
      progressStatuses.indexOf(
        status,
      )
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View
          style={
            styles.loadingContainer
          }
        >
          <Text style={styles.logo}>
            112
          </Text>

          <ActivityIndicator
            size="large"
            color="#111827"
            style={styles.loader}
          />

          <Text
            style={styles.loadingText}
          >
            Loading emergency...
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error || !emergency) {
    return (
      <SafeAreaView style={styles.screen}>
        <View
          style={styles.errorContainer}
        >
          <Text style={styles.logo}>
            112
          </Text>

          <Text
            style={styles.errorTitle}
          >
            Emergency request
          </Text>

          <Text style={styles.error}>
            {error ||
              'Emergency request not found'}
          </Text>

          <Pressable
            style={
              styles.primaryButton
            }
            onPress={() =>
              router.replace(
                '/dashboard',
              )
            }
          >
            <Text
              style={
                styles.primaryButtonText
              }
            >
              Dashboard
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  const responderArrived =
    Boolean(
      emergency.responderArrivedAt,
    )

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
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              112
            </Text>

            <Text
              style={
                styles.requestNumber
              }
            >
              REQUEST #{emergency.id}
            </Text>
          </View>

          <View style={styles.liveBadge}>
            <View
              style={styles.liveDot}
            />

            <Text
              style={styles.liveText}
            >
              LIVE
            </Text>
          </View>
        </View>

        <Text style={styles.title}>
          {
            emergencyNames[
              emergency.type
            ]
          }
        </Text>

        <Text style={styles.subtitle}>
          Status updates automatically.
        </Text>

        <View
          style={[
            styles.currentStatusCard,

            emergency.status ===
              'CANCELLED' &&
              styles.cancelledCard,
          ]}
        >
          <Text
            style={styles.statusLabel}
          >
            CURRENT STATUS
          </Text>

          <Text
            style={styles.statusValue}
          >
            {responderArrived
              ? 'Responder has arrived'
              : statusNames[
                  emergency.status
                ]}
          </Text>

          <Text
            style={styles.statusCode}
          >
            {responderArrived
              ? 'ON SCENE'
              : emergency.status}
          </Text>
        </View>

        {emergency.assignedResponderId &&
          emergency.status !==
            'COMPLETED' &&
          emergency.status !==
            'CANCELLED' && (
            <>
              <Text
                style={styles.sectionLabel}
              >
                RESPONDER
              </Text>

              <View
                style={
                  styles.responderCard
                }
              >
                <View
                  style={
                    styles.responderCardHeader
                  }
                >
                  <View>
                    <Text
                      style={
                        styles.responderEyebrow
                      }
                    >
                      ASSIGNED UNIT
                    </Text>

                    <Text
                      style={
                        styles.responderTitle
                      }
                    >
                      Emergency responder
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.responderStatusBadge,

                      responderArrived &&
                        styles.responderArrivedBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.responderStatusText,

                        responderArrived &&
                          styles.responderArrivedText,
                      ]}
                    >
                      {responderArrived
                        ? 'ARRIVED'
                        : emergency.status ===
                            'RESPONDING'
                          ? 'EN ROUTE'
                          : 'DISPATCHED'}
                    </Text>
                  </View>
                </View>

                {responderArrived ? (
                  <View
                    style={
                      styles.arrivedNotice
                    }
                  >
                    <Text
                      style={
                        styles.arrivedNoticeTitle
                      }
                    >
                      Responder is on scene
                    </Text>

                    <Text
                      style={
                        styles.arrivedNoticeText
                      }
                    >
                      Emergency services have
                      reached your location.
                    </Text>
                  </View>
                ) : hasResponderLocation &&
                  responderDistanceKm !=
                    null ? (
                  <>
                    <View
                      style={
                        styles.responderStats
                      }
                    >
                      <View
                        style={
                          styles.responderStat
                        }
                      >
                        <Text
                          style={
                            styles.responderStatLabel
                          }
                        >
                          DISTANCE
                        </Text>

                        <Text
                          style={
                            styles.responderStatValue
                          }
                        >
                          {formatDistance(
                            responderDistanceKm,
                          )}
                        </Text>
                      </View>

                      <View
                        style={
                          styles.responderStatDivider
                        }
                      />

                      <View
                        style={
                          styles.responderStat
                        }
                      >
                        <Text
                          style={
                            styles.responderStatLabel
                          }
                        >
                          EST. ARRIVAL
                        </Text>

                        <Text
                          style={
                            styles.responderStatValue
                          }
                        >
                          ~
                          {
                            estimatedMinutes
                          }{' '}
                          min
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={
                        styles.etaDisclaimer
                      }
                    >
                      Prototype estimate based
                      on straight-line distance.
                      Actual travel time may
                      differ.
                    </Text>

                    {emergency.responderLocationUpdatedAt && (
                      <Text
                        style={
                          styles.locationUpdatedText
                        }
                      >
                        Location updated{' '}
                        {new Date(
                          emergency.responderLocationUpdatedAt,
                        ).toLocaleTimeString(
                          [],
                          {
                            hour:
                              '2-digit',
                            minute:
                              '2-digit',
                            second:
                              '2-digit',
                          },
                        )}
                      </Text>
                    )}
                  </>
                ) : (
                  <View
                    style={
                      styles.waitingLocationCard
                    }
                  >
                    <ActivityIndicator
                      size="small"
                      color="#111827"
                    />

                    <View
                      style={
                        styles.waitingLocationContent
                      }
                    >
                      <Text
                        style={
                          styles.waitingLocationTitle
                        }
                      >
                        Waiting for responder
                        GPS
                      </Text>

                      <Text
                        style={
                          styles.waitingLocationText
                        }
                      >
                        Live tracking will
                        appear when the
                        responder begins
                        sharing location.
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </>
          )}

        <Text
          style={styles.sectionLabel}
        >
          RESPONSE PROGRESS
        </Text>

        <View style={styles.progressCard}>
          <ProgressStep
            number="1"
            title="Request sent"
            description="Your emergency request was submitted."
            completed={
              emergency.status !==
              'CANCELLED'
            }
          />

          <ProgressStep
            number="2"
            title="Request accepted"
            description="An operator has accepted your request."
            completed={hasReached(
              'ACCEPTED',
            )}
          />

          <ProgressStep
            number="3"
            title="Responder dispatched"
            description="A responder has been assigned."
            completed={hasReached(
              'DISPATCHED',
            )}
          />

          <ProgressStep
            number="4"
            title="Responder on the way"
            description={
              responderArrived
                ? 'Responder reached your location.'
                : 'Emergency services are responding.'
            }
            completed={hasReached(
              'RESPONDING',
            )}
          />

          <ProgressStep
            number="5"
            title="Completed"
            description="Emergency response completed."
            completed={hasReached(
              'COMPLETED',
            )}
          />
        </View>

        <Text
          style={styles.sectionLabel}
        >
          LIVE RESPONSE MAP
        </Text>

        <View
          style={styles.mapContainer}
        >
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude:
                emergency.latitude,

              longitude:
                emergency.longitude,

              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
            scrollEnabled
            zoomEnabled
          >
            <Marker
              coordinate={{
                latitude:
                  emergency.latitude,

                longitude:
                  emergency.longitude,
              }}
              title="Your emergency location"
              description={
                emergencyNames[
                  emergency.type
                ]
              }
              pinColor="#DC2626"
            />

            {hasResponderLocation && (
              <Marker
                coordinate={{
                  latitude:
                    emergency.responderLatitude!,

                  longitude:
                    emergency.responderLongitude!,
                }}
                title="Responder"
                description={
                  responderArrived
                    ? 'Responder has arrived'
                    : 'Responder location'
                }
                pinColor="#111827"
              />
            )}
          </MapView>

          <View
            style={styles.mapLegend}
          >
            <View
              style={
                styles.mapLegendItem
              }
            >
              <View
                style={[
                  styles.legendDot,
                  styles.emergencyDot,
                ]}
              />

              <Text
                style={
                  styles.mapLegendText
                }
              >
                You
              </Text>
            </View>

            {hasResponderLocation && (
              <View
                style={
                  styles.mapLegendItem
                }
              >
                <View
                  style={[
                    styles.legendDot,
                    styles.responderDot,
                  ]}
                />

                <Text
                  style={
                    styles.mapLegendText
                  }
                >
                  Responder
                </Text>
              </View>
            )}
          </View>
        </View>

        <Text
          style={styles.coordinates}
        >
          Emergency:{' '}
          {emergency.latitude.toFixed(
            6,
          )}
          ,{' '}
          {emergency.longitude.toFixed(
            6,
          )}
        </Text>

        {hasResponderLocation && (
          <Text
            style={styles.coordinates}
          >
            Responder:{' '}
            {emergency.responderLatitude!.toFixed(
              6,
            )}
            ,{' '}
            {emergency.responderLongitude!.toFixed(
              6,
            )}
          </Text>
        )}

        <Text
          style={styles.sectionLabel}
        >
          EMERGENCY DETAILS
        </Text>

        <View style={styles.detailsCard}>
          <Text
            style={styles.detailLabel}
          >
            DESCRIPTION
          </Text>

          <Text
            style={styles.detailValue}
          >
            {emergency.description}
          </Text>

          <View style={styles.divider} />

          <Text
            style={styles.detailLabel}
          >
            CREATED
          </Text>

          <Text
            style={styles.detailValue}
          >
            {new Date(
              emergency.createdAt,
            ).toLocaleString()}
          </Text>

          {emergency.responderAssignedAt && (
            <>
              <View
                style={styles.divider}
              />

              <Text
                style={
                  styles.detailLabel
                }
              >
                RESPONDER ASSIGNED
              </Text>

              <Text
                style={
                  styles.detailValue
                }
              >
                {new Date(
                  emergency.responderAssignedAt,
                ).toLocaleString()}
              </Text>
            </>
          )}
        </View>

        <Text
          style={styles.sectionLabel}
        >
          EMERGENCY CONTACTS
        </Text>

        {emergency.notifiedContacts
          .length === 0 ? (
          <View
            style={styles.emptyContacts}
          >
            <Text
              style={
                styles.emptyContactsTitle
              }
            >
              No contacts attached
            </Text>

            <Text
              style={
                styles.emptyContactsText
              }
            >
              No emergency contacts were
              saved when this request was
              created.
            </Text>
          </View>
        ) : (
          <View
            style={styles.contactsList}
          >
            {emergency.notifiedContacts.map(
              (contact) => (
                <View
                  key={contact.id}
                  style={
                    styles.contactCard
                  }
                >
                  <View
                    style={
                      styles.contactAvatar
                    }
                  >
                    <Text
                      style={
                        styles.contactAvatarText
                      }
                    >
                      {contact.name
                        .charAt(0)
                        .toUpperCase()}
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={
                        styles.contactName
                      }
                    >
                      {contact.name}
                    </Text>

                    <Text
                      style={
                        styles.contactPhone
                      }
                    >
                      {contact.phone}
                    </Text>
                  </View>
                </View>
              ),
            )}
          </View>
        )}

        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            router.replace(
              '/dashboard',
            )
          }
        >
          <Text
            style={
              styles.primaryButtonText
            }
          >
            Dashboard
          </Text>
        </Pressable>
      </ScrollView>
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
    paddingBottom: 45,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  logo: {
    fontSize: 23,
    fontWeight: '900',
    color: '#111827',
  },

  loader: {
    marginTop: 25,
  },

  loadingText: {
    marginTop: 12,
    color: '#7A838D',
  },

  errorTitle: {
    marginTop: 25,
    fontSize: 28,
    fontWeight: '800',
    color: '#18212B',
  },

  error: {
    marginTop: 12,
    color: '#DC2626',
    fontSize: 13,
    lineHeight: 19,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  requestNumber: {
    marginTop: 5,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#929AA4',
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },

  liveDot: {
    width: 7,
    height: 7,
    marginRight: 6,
    borderRadius: 4,
    backgroundColor: '#32A06D',
  },

  liveText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#58616B',
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#18212B',
  },

  subtitle: {
    marginTop: 6,
    color: '#7A838D',
    fontSize: 14,
  },

  currentStatusCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 22,
    backgroundColor: '#111827',
  },

  cancelledCard: {
    backgroundColor: '#7F1D1D',
  },

  statusLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#9CA3AF',
  },

  statusValue: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },

  statusCode: {
    marginTop: 4,
    color: '#D1D5DB',
    fontSize: 10,
    fontWeight: '700',
  },

  sectionLabel: {
    marginTop: 26,
    marginBottom: 10,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#929AA4',
  },

  responderCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },

  responderCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  responderEyebrow: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#9CA3AF',
  },

  responderTitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },

  responderStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#EEF2F6',
  },

  responderStatusText: {
    color: '#111827',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  responderArrivedBadge: {
    backgroundColor: '#DCFCE7',
  },

  responderArrivedText: {
    color: '#166534',
  },

  responderStats: {
    flexDirection: 'row',
    marginTop: 18,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F7F8FA',
  },

  responderStat: {
    flex: 1,
  },

  responderStatLabel: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: '#9CA3AF',
  },

  responderStatValue: {
    marginTop: 6,
    fontSize: 19,
    fontWeight: '900',
    color: '#111827',
  },

  responderStatDivider: {
    width: 1,
    marginHorizontal: 18,
    backgroundColor: '#E2E6EA',
  },

  etaDisclaimer: {
    marginTop: 10,
    fontSize: 9,
    lineHeight: 14,
    color: '#9CA3AF',
  },

  locationUpdatedText: {
    marginTop: 7,
    fontSize: 9,
    color: '#7A838D',
  },

  waitingLocationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    padding: 14,
    borderRadius: 15,
    backgroundColor: '#F7F8FA',
  },

  waitingLocationContent: {
    flex: 1,
    marginLeft: 12,
  },

  waitingLocationTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },

  waitingLocationText: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 15,
    color: '#7A838D',
  },

  arrivedNotice: {
    marginTop: 18,
    padding: 14,
    borderRadius: 15,
    backgroundColor: '#ECFDF3',
  },

  arrivedNoticeTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#166534',
  },

  arrivedNoticeText: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 15,
    color: '#398056',
  },

  progressCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },

  progressStep: {
    flexDirection: 'row',
    marginBottom: 18,
  },

  progressCircle: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
    borderRadius: 15,
    backgroundColor: '#ECEFF2',
  },

  progressCircleCompleted: {
    backgroundColor: '#111827',
  },

  progressNumber: {
    color: '#929AA4',
    fontSize: 11,
    fontWeight: '800',
  },

  progressNumberCompleted: {
    color: '#FFFFFF',
  },

  progressContent: {
    flex: 1,
  },

  progressTitle: {
    color: '#9AA2AA',
    fontSize: 14,
    fontWeight: '700',
  },

  progressTitleCompleted: {
    color: '#202831',
  },

  progressDescription: {
    marginTop: 3,
    color: '#929AA4',
    fontSize: 11,
    lineHeight: 16,
  },

  mapContainer: {
    height: 280,
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapLegend: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },

  mapLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  legendDot: {
    width: 8,
    height: 8,
    marginRight: 5,
    borderRadius: 4,
  },

  emergencyDot: {
    backgroundColor: '#DC2626',
  },

  responderDot: {
    backgroundColor: '#111827',
  },

  mapLegendText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4B5563',
  },

  coordinates: {
    marginTop: 8,
    textAlign: 'right',
    color: '#929AA4',
    fontSize: 10,
  },

  detailsCard: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },

  detailLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#929AA4',
  },

  detailValue: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    color: '#303A44',
  },

  divider: {
    height: 1,
    marginVertical: 15,
    backgroundColor: '#ECEFF2',
  },

  emptyContacts: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },

  emptyContactsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#303A44',
  },

  emptyContactsText: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    color: '#929AA4',
  },

  contactsList: {
    gap: 8,
  },

  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
  },

  contactAvatar: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderRadius: 14,
    backgroundColor: '#111827',
  },

  contactAvatarText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },

  contactName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#29333D',
  },

  contactPhone: {
    marginTop: 3,
    color: '#8C959E',
    fontSize: 11,
  },

  primaryButton: {
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    borderRadius: 16,
    backgroundColor: '#111827',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
})