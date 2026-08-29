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
          completed
            ? styles.progressCircleCompleted
            : null,
        ]}
      >
        <Text
          style={[
            styles.progressNumber,
            completed
              ? styles.progressNumberCompleted
              : null,
          ]}
        >
          {completed ? '✓' : number}
        </Text>
      </View>

      <View style={styles.progressContent}>
        <Text
          style={[
            styles.progressTitle,
            completed
              ? styles.progressTitleCompleted
              : null,
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
      Math.sin(longitudeDifference / 2) ** 2

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a),
    )

  return earthRadiusKm * c
}

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

  const params =
    useLocalSearchParams<{
      id?: string
    }>()

  const emergencyId =
    Number(params.id)

  const [
    emergency,
    setEmergency,
  ] =
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
          await getEmergency(
            emergencyId,
          )

        setEmergency(result)
        setError('')
      } catch (error) {
        console.error(
          'Emergency loading error:',
          error,
        )

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

    const intervalId =
      setInterval(() => {
        loadEmergency(false)
      }, 3000)

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
          <Text
            style={styles.loadingLogo}
          >
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
          <Text
            style={styles.loadingLogo}
          >
            112
          </Text>

          <Text
            style={styles.errorTitle}
          >
            Emergency request
          </Text>

          <Text style={styles.errorText}>
            {error ||
              'Emergency request not found'}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed
                ? styles.buttonPressed
                : null,
            ]}
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

  const isClosed =
    emergency.status === 'COMPLETED' ||
    emergency.status === 'CANCELLED'

  const isCompleted =
    emergency.status === 'COMPLETED'

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
          <View>
            <Text style={styles.logo}>
              112
            </Text>

            <Text
              style={styles.requestNumber}
            >
              REQUEST #{emergency.id}
            </Text>
          </View>

          <View
            style={[
              styles.liveBadge,

              isClosed
                ? styles.closedBadge
                : null,
            ]}
          >
            <View
              style={[
                styles.liveDot,

                isClosed
                  ? styles.closedDot
                  : null,
              ]}
            />

            <Text style={styles.liveText}>
              {isCompleted
                ? 'COMPLETED'
                : emergency.status ===
                    'CANCELLED'
                  ? 'CANCELLED'
                  : 'LIVE'}
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
          {isClosed
            ? 'This emergency request is no longer active.'
            : 'Status updates automatically while the request is active.'}
        </Text>

        {/* MAIN STATUS */}

        <View
          style={[
            styles.currentStatusCard,

            emergency.status ===
            'CANCELLED'
              ? styles.cancelledCard
              : null,

            emergency.status ===
            'COMPLETED'
              ? styles.completedCard
              : null,
          ]}
        >
          <View
            style={styles.statusTopRow}
          >
            <Text
              style={styles.statusLabel}
            >
              CURRENT STATUS
            </Text>

            {!isClosed ? (
              <View
                style={
                  styles.statusLiveIndicator
                }
              >
                <View
                  style={
                    styles.statusLiveDot
                  }
                />

                <Text
                  style={
                    styles.statusLiveText
                  }
                >
                  LIVE
                </Text>
              </View>
            ) : null}
          </View>

          <Text
            style={styles.statusValue}
          >
            {responderArrived &&
            !isCompleted
              ? 'Responder has arrived'
              : statusNames[
                  emergency.status
                ]}
          </Text>

          <Text
            style={styles.statusCode}
          >
            {responderArrived &&
            !isCompleted
              ? 'ON SCENE'
              : emergency.status}
          </Text>
        </View>

        {/* RESPONDER */}

        {emergency.assignedResponderId &&
        !isClosed ? (
          <>
            <Text
              style={styles.sectionLabel}
            >
              RESPONDER TRACKING
            </Text>

            <View
              style={styles.responderCard}
            >
              <View
                style={
                  styles.responderCardHeader
                }
              >
                <View
                  style={
                    styles.responderIdentity
                  }
                >
                  <View
                    style={
                      styles.responderIcon
                    }
                  >
                    <Text
                      style={
                        styles.responderIconText
                      }
                    >
                      112
                    </Text>
                  </View>

                  <View
                    style={
                      styles.responderNameArea
                    }
                  >
                    <Text
                      style={
                        styles.responderEyebrow
                      }
                    >
                      ASSIGNED RESPONSE UNIT
                    </Text>

                    <Text
                      style={
                        styles.responderTitle
                      }
                    >
                      Emergency responder
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.responderStatusBadge,

                    emergency.status ===
                    'RESPONDING'
                      ? styles.responderEnRouteBadge
                      : null,

                    responderArrived
                      ? styles.responderArrivedBadge
                      : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.responderStatusText,

                      emergency.status ===
                      'RESPONDING'
                        ? styles.responderEnRouteText
                        : null,

                      responderArrived
                        ? styles.responderArrivedText
                        : null,
                    ]}
                  >
                    {responderArrived
                      ? 'ON SCENE'
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
                  <View
                    style={
                      styles.arrivedIcon
                    }
                  >
                    <Text
                      style={
                        styles.arrivedIconText
                      }
                    >
                      ✓
                    </Text>
                  </View>

                  <View
                    style={
                      styles.arrivedNoticeContent
                    }
                  >
                    <Text
                      style={
                        styles.arrivedNoticeTitle
                      }
                    >
                      Responder has arrived
                    </Text>

                    <Text
                      style={
                        styles.arrivedNoticeText
                      }
                    >
                      Emergency services are
                      now at your location
                      and handling the
                      incident.
                    </Text>
                  </View>
                </View>
              ) : hasResponderLocation &&
                responderDistanceKm !=
                  null ? (
                <>
                  <View
                    style={
                      styles.liveTrackingHeader
                    }
                  >
                    <View
                      style={
                        styles.liveTrackingLeft
                      }
                    >
                      <View
                        style={
                          styles.liveTrackingDot
                        }
                      />

                      <Text
                        style={
                          styles.liveTrackingText
                        }
                      >
                        Live location active
                      </Text>
                    </View>

                    {emergency.responderLocationUpdatedAt ? (
                      <Text
                        style={
                          styles.liveUpdatedText
                        }
                      >
                        Updated{' '}
                        {new Date(
                          emergency.responderLocationUpdatedAt,
                        ).toLocaleTimeString(
                          [],
                          {
                            hour:
                              '2-digit',
                            minute:
                              '2-digit',
                          },
                        )}
                      </Text>
                    ) : null}
                  </View>

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

                      <Text
                        style={
                          styles.responderStatHint
                        }
                      >
                        from your location
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
                        ~{estimatedMinutes} min
                      </Text>

                      <Text
                        style={
                          styles.responderStatHint
                        }
                      >
                        approximate
                      </Text>
                    </View>
                  </View>

                  <View
                    style={styles.etaInfo}
                  >
                    <Text
                      style={
                        styles.etaInfoText
                      }
                    >
                      ETA is estimated from
                      live GPS distance and
                      is not yet based on
                      road routing.
                    </Text>
                  </View>
                </>
              ) : (
                <View
                  style={
                    styles.waitingLocationCard
                  }
                >
                  <View
                    style={
                      styles.waitingLocationIcon
                    }
                  >
                    <ActivityIndicator
                      size="small"
                      color="#111827"
                    />
                  </View>

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
                      Responder assigned
                    </Text>

                    <Text
                      style={
                        styles.waitingLocationText
                      }
                    >
                      Waiting for the
                      responder to accept
                      dispatch and begin
                      sharing live location.
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </>
        ) : null}

        {/* COMPLETED MESSAGE */}

        {isCompleted ? (
          <>
            <Text
              style={styles.sectionLabel}
            >
              RESPONSE COMPLETE
            </Text>

            <View
              style={styles.completeCard}
            >
              <View
                style={styles.completeIcon}
              >
                <Text
                  style={
                    styles.completeIconText
                  }
                >
                  ✓
                </Text>
              </View>

              <View
                style={styles.completeContent}
              >
                <Text
                  style={styles.completeTitle}
                >
                  Emergency completed
                </Text>

                <Text
                  style={styles.completeText}
                >
                  This response has been
                  marked complete and is
                  saved in your emergency
                  history.
                </Text>
              </View>
            </View>
          </>
        ) : null}

        {/* PROGRESS */}

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
            description="An operator accepted your request."
            completed={hasReached(
              'ACCEPTED',
            )}
          />

          <ProgressStep
            number="3"
            title="Responder dispatched"
            description="A responder was assigned to your emergency."
            completed={hasReached(
              'DISPATCHED',
            )}
          />

          <ProgressStep
            number="4"
            title={
              responderArrived
                ? 'Responder arrived'
                : 'Responder on the way'
            }
            description={
              responderArrived
                ? 'Emergency services reached your location.'
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

        {/* MAP */}

        <Text
          style={styles.sectionLabel}
        >
          LIVE RESPONSE MAP
        </Text>

        <View style={styles.mapContainer}>
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

            {hasResponderLocation ? (
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
            ) : null}
          </MapView>

          <View style={styles.mapLegend}>
            <View
              style={styles.mapLegendItem}
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

            {hasResponderLocation ? (
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
            ) : null}
          </View>
        </View>

        <View style={styles.mapInfoCard}>
          <Text style={styles.mapInfoLabel}>
            YOUR LOCATION
          </Text>

          <Text style={styles.mapInfoValue}>
            {emergency.latitude.toFixed(6)}
            {', '}
            {emergency.longitude.toFixed(6)}
          </Text>

          {hasResponderLocation ? (
            <>
              <View
                style={
                  styles.mapInfoDivider
                }
              />

              <Text
                style={
                  styles.mapInfoLabel
                }
              >
                RESPONDER LOCATION
              </Text>

              <Text
                style={
                  styles.mapInfoValue
                }
              >
                {emergency.responderLatitude!.toFixed(
                  6,
                )}
                {', '}
                {emergency.responderLongitude!.toFixed(
                  6,
                )}
              </Text>
            </>
          ) : null}
        </View>

        {/* DETAILS */}

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

          <View style={styles.dividerLight} />

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

          {emergency.responderAssignedAt ? (
            <>
              <View
                style={
                  styles.dividerLight
                }
              />

              <Text
                style={styles.detailLabel}
              >
                RESPONDER ASSIGNED
              </Text>

              <Text
                style={styles.detailValue}
              >
                {new Date(
                  emergency.responderAssignedAt,
                ).toLocaleString()}
              </Text>
            </>
          ) : null}
        </View>

        {/* CONTACTS */}

        <Text
          style={styles.sectionLabel}
        >
          EMERGENCY CONTACTS
        </Text>

        {emergency.notifiedContacts.length ===
        0 ? (
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
              attached to this request.
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

                  <View
                    style={
                      styles.contactContent
                    }
                  >
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

        {/* DASHBOARD */}

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,

            pressed
              ? styles.buttonPressed
              : null,
          ]}
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
            Back to dashboard
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

  loadingLogo: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '900',
  },

  loader: {
    marginTop: 24,
  },

  loadingText: {
    marginTop: 12,
    color: '#7A838D',
    fontSize: 13,
  },

  errorTitle: {
    marginTop: 24,
    color: '#18212B',
    fontSize: 28,
    fontWeight: '900',
  },

  errorText: {
    marginTop: 10,
    color: '#DC2626',
    fontSize: 12,
    lineHeight: 18,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },

  logo: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '900',
  },

  requestNumber: {
    marginTop: 4,
    color: '#929AA4',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },

  closedBadge: {
    backgroundColor: '#E9ECEF',
  },

  liveDot: {
    width: 7,
    height: 7,
    marginRight: 6,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },

  closedDot: {
    backgroundColor: '#9CA3AF',
  },

  liveText: {
    color: '#58616B',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  title: {
    color: '#18212B',
    fontSize: 30,
    fontWeight: '900',
  },

  subtitle: {
    marginTop: 6,
    color: '#7A838D',
    fontSize: 13,
    lineHeight: 19,
  },

  currentStatusCard: {
    marginTop: 22,
    padding: 20,
    borderRadius: 22,
    backgroundColor: '#111827',
  },

  cancelledCard: {
    backgroundColor: '#7F1D1D',
  },

  completedCard: {
    backgroundColor: '#14532D',
  },

  statusTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  statusLabel: {
    color: '#9CA3AF',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  statusLiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusLiveDot: {
    width: 6,
    height: 6,
    marginRight: 5,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
  },

  statusLiveText: {
    color: '#D1D5DB',
    fontSize: 7,
    fontWeight: '900',
  },

  statusValue: {
    marginTop: 9,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },

  statusCode: {
    marginTop: 4,
    color: '#D1D5DB',
    fontSize: 9,
    fontWeight: '800',
  },

  sectionLabel: {
    marginTop: 25,
    marginBottom: 10,
    color: '#929AA4',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  responderCard: {
    padding: 18,
    borderWidth: 1,
    borderColor: '#E7EAEE',
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },

  responderCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  responderIdentity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  responderNameArea: {
    flex: 1,
  },

  responderIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
    borderRadius: 14,
    backgroundColor: '#111827',
  },

  responderIconText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  responderEyebrow: {
    color: '#9CA3AF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.9,
  },

  responderTitle: {
    marginTop: 4,
    color: '#111827',
    fontSize: 14,
    fontWeight: '900',
  },

  responderStatusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 11,
    backgroundColor: '#F3F4F6',
  },

  responderStatusText: {
    color: '#4B5563',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  responderEnRouteBadge: {
    backgroundColor: '#EEF2FF',
  },

  responderEnRouteText: {
    color: '#3730A3',
  },

  responderArrivedBadge: {
    backgroundColor: '#DCFCE7',
  },

  responderArrivedText: {
    color: '#166534',
  },

  liveTrackingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
  },

  liveTrackingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  liveTrackingDot: {
    width: 8,
    height: 8,
    marginRight: 7,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },

  liveTrackingText: {
    color: '#374151',
    fontSize: 10,
    fontWeight: '900',
  },

  liveUpdatedText: {
    color: '#9CA3AF',
    fontSize: 8,
  },

  responderStats: {
    flexDirection: 'row',
    marginTop: 12,
    paddingVertical: 17,
    paddingHorizontal: 15,
    borderRadius: 17,
    backgroundColor: '#F7F8FA',
  },

  responderStat: {
    flex: 1,
  },

  responderStatLabel: {
    color: '#9CA3AF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  responderStatValue: {
    marginTop: 6,
    color: '#111827',
    fontSize: 20,
    fontWeight: '900',
  },

  responderStatHint: {
    marginTop: 3,
    color: '#9CA3AF',
    fontSize: 8,
  },

  responderStatDivider: {
    width: 1,
    marginHorizontal: 15,
    backgroundColor: '#E1E5E9',
  },

  etaInfo: {
    marginTop: 10,
    padding: 11,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },

  etaInfoText: {
    color: '#8A929C',
    fontSize: 8,
    lineHeight: 13,
  },

  waitingLocationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    padding: 15,
    borderRadius: 16,
    backgroundColor: '#F7F8FA',
  },

  waitingLocationIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },

  waitingLocationContent: {
    flex: 1,
    marginLeft: 12,
  },

  waitingLocationTitle: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '900',
  },

  waitingLocationText: {
    marginTop: 4,
    color: '#7A838D',
    fontSize: 10,
    lineHeight: 15,
  },

  arrivedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    padding: 15,
    borderRadius: 16,
    backgroundColor: '#ECFDF3',
  },

  arrivedIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#166534',
  },

  arrivedIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  arrivedNoticeContent: {
    flex: 1,
    marginLeft: 12,
  },

  arrivedNoticeTitle: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '900',
  },

  arrivedNoticeText: {
    marginTop: 4,
    color: '#398056',
    fontSize: 10,
    lineHeight: 15,
  },

  completeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#ECFDF3',
  },

  completeIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#166534',
  },

  completeIconText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  completeContent: {
    flex: 1,
    marginLeft: 12,
  },

  completeTitle: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '900',
  },

  completeText: {
    marginTop: 4,
    color: '#398056',
    fontSize: 10,
    lineHeight: 15,
  },

  progressCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },

  progressStep: {
    flexDirection: 'row',
    marginBottom: 17,
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
    fontSize: 10,
    fontWeight: '900',
  },

  progressNumberCompleted: {
    color: '#FFFFFF',
  },

  progressContent: {
    flex: 1,
  },

  progressTitle: {
    color: '#9AA2AA',
    fontSize: 13,
    fontWeight: '800',
  },

  progressTitleCompleted: {
    color: '#202831',
  },

  progressDescription: {
    marginTop: 3,
    color: '#929AA4',
    fontSize: 10,
    lineHeight: 15,
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
    backgroundColor:
      'rgba(255,255,255,0.94)',
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
    color: '#4B5563',
    fontSize: 9,
    fontWeight: '700',
  },

  mapInfoCard: {
    marginTop: 9,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },

  mapInfoLabel: {
    color: '#9CA3AF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  mapInfoValue: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: 9,
    fontWeight: '700',
  },

  mapInfoDivider: {
    height: 1,
    marginVertical: 10,
    backgroundColor: '#ECEFF2',
  },

  detailsCard: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },

  detailLabel: {
    color: '#929AA4',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.9,
  },

  detailValue: {
    marginTop: 5,
    color: '#303A44',
    fontSize: 12,
    lineHeight: 18,
  },

  dividerLight: {
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
    color: '#303A44',
    fontSize: 14,
    fontWeight: '900',
  },

  emptyContactsText: {
    marginTop: 4,
    color: '#929AA4',
    fontSize: 10,
    lineHeight: 15,
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

  contactContent: {
    flex: 1,
  },

  contactName: {
    color: '#29333D',
    fontSize: 13,
    fontWeight: '900',
  },

  contactPhone: {
    marginTop: 3,
    color: '#8C959E',
    fontSize: 10,
  },

  primaryButton: {
    minHeight: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 27,
    borderRadius: 16,
    backgroundColor: '#111827',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  buttonPressed: {
    opacity: 0.86,

    transform: [
      {
        scale: 0.99,
      },
    ],
  },
})