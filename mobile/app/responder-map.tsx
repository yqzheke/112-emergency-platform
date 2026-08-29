import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  ActivityIndicator,
  Linking,
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

import MapView, {
  Marker,
  type Region,
} from 'react-native-maps'

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

export default function ResponderMapScreen() {
  const router = useRouter()

  const mapRef =
    useRef<MapView | null>(null)

  const [
    emergencies,
    setEmergencies,
  ] = useState<ResponderEmergency[]>([])

  const [
    selectedEmergencyId,
    setSelectedEmergencyId,
  ] = useState<number | null>(null)

  const [
    responderLocation,
    setResponderLocation,
  ] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    locationLoading,
    setLocationLoading,
  ] = useState(true)

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

        setSelectedEmergencyId(
          (currentId) => {
            if (
              currentId &&
              data.some(
                (item) =>
                  item.id === currentId,
              )
            ) {
              return currentId
            }

            return data[0]?.id ?? null
          },
        )

        setError('')
      } catch (error) {
        console.error(
          'Responder map assignment error:',
          error,
        )

        setError(
          error instanceof Error
            ? error.message
            : 'Could not load assignments',
        )
      } finally {
        setLoading(false)
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

  useEffect(() => {
    let subscription:
      | Location.LocationSubscription
      | null = null

    const startLocation = async () => {
      try {
        const permission =
          await Location.requestForegroundPermissionsAsync()

        if (
          permission.status !==
          'granted'
        ) {
          setLocationLoading(false)
          return
        }

        const current =
          await Location.getCurrentPositionAsync({
            accuracy:
              Location.Accuracy.High,
          })

        setResponderLocation({
          latitude:
            current.coords.latitude,

          longitude:
            current.coords.longitude,
        })

        subscription =
          await Location.watchPositionAsync(
            {
              accuracy:
                Location.Accuracy.High,

              timeInterval: 5000,

              distanceInterval: 10,
            },

            (location) => {
              setResponderLocation({
                latitude:
                  location.coords.latitude,

                longitude:
                  location.coords.longitude,
              })
            },
          )
      } catch (error) {
        console.error(
          'Responder map location error:',
          error,
        )
      } finally {
        setLocationLoading(false)
      }
    }

    startLocation()

    return () => {
      subscription?.remove()
    }
  }, [])

  const selectedEmergency =
    useMemo(
      () =>
        emergencies.find(
          (emergency) =>
            emergency.id ===
            selectedEmergencyId,
        ) ?? null,
      [
        emergencies,
        selectedEmergencyId,
      ],
    )

  const region =
    useMemo<Region>(() => {
      if (selectedEmergency) {
        return {
          latitude:
            selectedEmergency.latitude,

          longitude:
            selectedEmergency.longitude,

          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        }
      }

      if (responderLocation) {
        return {
          latitude:
            responderLocation.latitude,

          longitude:
            responderLocation.longitude,

          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        }
      }

      return {
        latitude: 51.1694,
        longitude: 71.4491,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }
    }, [
      selectedEmergency,
      responderLocation,
    ])

  useEffect(() => {
    if (!selectedEmergency) {
      return
    }

    const coordinates = [
      {
        latitude:
          selectedEmergency.latitude,

        longitude:
          selectedEmergency.longitude,
      },
    ]

    if (responderLocation) {
      coordinates.push(
        responderLocation,
      )
    }

    setTimeout(() => {
      mapRef.current?.fitToCoordinates(
        coordinates,
        {
          edgePadding: {
            top: 70,
            right: 55,
            bottom: 70,
            left: 55,
          },

          animated: true,
        },
      )
    }, 250)
  }, [
    selectedEmergency,
    responderLocation,
  ])

  const openNavigation = async () => {
    if (!selectedEmergency) {
      return
    }

    const latitude =
      selectedEmergency.latitude

    const longitude =
      selectedEmergency.longitude

    const url =
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`

    try {
      await Linking.openURL(url)
    } catch (error) {
      console.error(
        'Navigation error:',
        error,
      )

      setError(
        'Could not open navigation.',
      )
    }
  }

  const centerMap = () => {
    if (
      !selectedEmergency &&
      !responderLocation
    ) {
      return
    }

    const coordinates: {
      latitude: number
      longitude: number
    }[] = []

    if (selectedEmergency) {
      coordinates.push({
        latitude:
          selectedEmergency.latitude,

        longitude:
          selectedEmergency.longitude,
      })
    }

    if (responderLocation) {
      coordinates.push(
        responderLocation,
      )
    }

    mapRef.current?.fitToCoordinates(
      coordinates,
      {
        edgePadding: {
          top: 70,
          right: 55,
          bottom: 70,
          left: 55,
        },

        animated: true,
      },
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
              styles.loadingLogo
            }
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
            style={
              styles.loadingIndicator
            }
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Loading responder map...
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
            style={
              styles.headerCenter
            }
          >
            <Text
              style={
                styles.headerEyebrow
              }
            >
              FIELD OPERATIONS
            </Text>

            <Text
              style={
                styles.headerTitle
              }
            >
              Response map
            </Text>
          </View>

          <View
            style={styles.logoBadge}
          >
            <Text
              style={styles.logoText}
            >
              112
            </Text>
          </View>
        </View>

        {/* MAP */}

        <View
          style={styles.mapCard}
        >
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={region}
            showsCompass={false}
            showsScale={false}
            showsUserLocation={false}
            toolbarEnabled={false}
          >
            {emergencies.map(
              (emergency) => {
                const meta =
                  emergencyMeta[
                    emergency.type
                  ]

                return (
                  <Marker
                    key={emergency.id}
                    coordinate={{
                      latitude:
                        emergency.latitude,

                      longitude:
                        emergency.longitude,
                    }}
                    title={
                      meta.title
                    }
                    description={`Incident #${emergency.id}`}
                    onPress={() =>
                      setSelectedEmergencyId(
                        emergency.id,
                      )
                    }
                  >
                    <View
                      style={[
                        styles.emergencyMarker,

                        {
                          backgroundColor:
                            meta.color,
                        },
                      ]}
                    >
                      <Ionicons
                        name={meta.icon}
                        size={17}
                        color="#FFFFFF"
                      />
                    </View>
                  </Marker>
                )
              },
            )}

            {responderLocation ? (
              <Marker
                coordinate={
                  responderLocation
                }
                title="Your position"
                anchor={{
                  x: 0.5,
                  y: 0.5,
                }}
              >
                <View
                  style={
                    styles.responderMarkerOuter
                  }
                >
                  <View
                    style={
                      styles.responderMarker
                    }
                  >
                    <Ionicons
                      name="navigate"
                      size={15}
                      color="#FFFFFF"
                    />
                  </View>
                </View>
              </Marker>
            ) : null}
          </MapView>

          {/* MAP TOP BAR */}

          <View
            style={
              styles.mapTopBar
            }
          >
            <View
              style={
                styles.liveBadge
              }
            >
              <View
                style={
                  styles.liveDot
                }
              />

              <Text
                style={
                  styles.liveText
                }
              >
                LIVE MAP
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.centerButton,

                pressed
                  ? styles.pressed
                  : null,
              ]}
              onPress={centerMap}
            >
              <Ionicons
                name="locate"
                size={18}
                color="#111827"
              />
            </Pressable>
          </View>

          {/* MAP LEGEND */}

          <View
            style={
              styles.mapLegend
            }
          >
            <View
              style={
                styles.legendItem
              }
            >
              <View
                style={
                  styles.responderLegendDot
                }
              />

              <Text
                style={
                  styles.legendText
                }
              >
                You
              </Text>
            </View>

            <View
              style={
                styles.legendItem
              }
            >
              <View
                style={
                  styles.emergencyLegendDot
                }
              />

              <Text
                style={
                  styles.legendText
                }
              >
                Incident
              </Text>
            </View>
          </View>
        </View>

        {/* LOCATION STATUS */}

        <View
          style={styles.gpsStatus}
        >
          <View
            style={[
              styles.gpsStatusIcon,

              responderLocation
                ? styles.gpsOnlineIcon
                : styles.gpsOfflineIcon,
            ]}
          >
            {locationLoading ? (
              <ActivityIndicator
                size="small"
                color="#111827"
              />
            ) : (
              <Ionicons
                name={
                  responderLocation
                    ? 'navigate'
                    : 'location-outline'
                }
                size={18}
                color={
                  responderLocation
                    ? '#166534'
                    : '#6B7280'
                }
              />
            )}
          </View>

          <View
            style={
              styles.gpsStatusContent
            }
          >
            <Text
              style={
                styles.gpsStatusTitle
              }
            >
              {responderLocation
                ? 'Device GPS available'
                : 'GPS unavailable'}
            </Text>

            <Text
              style={
                styles.gpsStatusDescription
              }
            >
              {responderLocation
                ? 'Your local position is shown on the field map.'
                : 'Allow location access to show your position.'}
            </Text>
          </View>

          <View
            style={[
              styles.gpsIndicator,

              responderLocation
                ? styles.gpsIndicatorOnline
                : styles.gpsIndicatorOffline,
            ]}
          />
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

        {/* INCIDENT SELECTION */}

        {emergencies.length > 1 ? (
          <>
            <Text
              style={
                styles.sectionLabel
              }
            >
              ASSIGNED INCIDENTS
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.incidentPicker
              }
            >
              {emergencies.map(
                (emergency) => {
                  const selected =
                    emergency.id ===
                    selectedEmergencyId

                  const meta =
                    emergencyMeta[
                      emergency.type
                    ]

                  return (
                    <Pressable
                      key={
                        emergency.id
                      }
                      style={({
                        pressed,
                      }) => [
                        styles.incidentChip,

                        selected
                          ? styles.incidentChipSelected
                          : null,

                        pressed
                          ? styles.pressed
                          : null,
                      ]}
                      onPress={() =>
                        setSelectedEmergencyId(
                          emergency.id,
                        )
                      }
                    >
                      <View
                        style={[
                          styles.incidentChipIcon,

                          {
                            backgroundColor:
                              meta.background,
                          },
                        ]}
                      >
                        <Ionicons
                          name={
                            meta.icon
                          }
                          size={15}
                          color={
                            meta.color
                          }
                        />
                      </View>

                      <View>
                        <Text
                          style={[
                            styles.incidentChipNumber,

                            selected
                              ? styles.incidentChipNumberSelected
                              : null,
                          ]}
                        >
                          #
                          {emergency.id}
                        </Text>

                        <Text
                          style={[
                            styles.incidentChipType,

                            selected
                              ? styles.incidentChipTypeSelected
                              : null,
                          ]}
                        >
                          {
                            emergency.type
                          }
                        </Text>
                      </View>
                    </Pressable>
                  )
                },
              )}
            </ScrollView>
          </>
        ) : null}

        {/* SELECTED INCIDENT */}

        <Text
          style={styles.sectionLabel}
        >
          INCIDENT DETAILS
        </Text>

        {selectedEmergency ? (
          <View
            style={
              styles.incidentCard
            }
          >
            <View
              style={
                styles.incidentHeader
              }
            >
              <View
                style={[
                  styles.incidentIcon,

                  {
                    backgroundColor:
                      emergencyMeta[
                        selectedEmergency
                          .type
                      ].background,
                  },
                ]}
              >
                <Ionicons
                  name={
                    emergencyMeta[
                      selectedEmergency
                        .type
                    ].icon
                  }
                  size={23}
                  color={
                    emergencyMeta[
                      selectedEmergency
                        .type
                    ].color
                  }
                />
              </View>

              <View
                style={
                  styles.incidentTitleArea
                }
              >
                <Text
                  style={
                    styles.incidentNumber
                  }
                >
                  INCIDENT #
                  {
                    selectedEmergency.id
                  }
                </Text>

                <Text
                  style={
                    styles.incidentTitle
                  }
                >
                  {
                    emergencyMeta[
                      selectedEmergency
                        .type
                    ].title
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
                  {selectedEmergency
                    .responderArrivedAt
                    ? 'ON SCENE'
                    : selectedEmergency
                          .responderAcceptedAt
                      ? 'EN ROUTE'
                      : 'DISPATCHED'}
                </Text>
              </View>
            </View>

            <Text
              style={
                styles.description
              }
            >
              {
                selectedEmergency.description
              }
            </Text>

            <View
              style={
                styles.divider
              }
            />

            <View
              style={
                styles.infoRow
              }
            >
              <View
                style={styles.infoIcon}
              >
                <Ionicons
                  name="person-outline"
                  size={17}
                  color="#6B7280"
                />
              </View>

              <View
                style={
                  styles.infoContent
                }
              >
                <Text
                  style={
                    styles.infoLabel
                  }
                >
                  CALLER
                </Text>

                <Text
                  style={
                    styles.infoValue
                  }
                >
                  {
                    selectedEmergency
                      .user.fullName
                  }
                </Text>
              </View>
            </View>

            <View
              style={
                styles.infoRow
              }
            >
              <View
                style={styles.infoIcon}
              >
                <Ionicons
                  name="location-outline"
                  size={17}
                  color="#6B7280"
                />
              </View>

              <View
                style={
                  styles.infoContent
                }
              >
                <Text
                  style={
                    styles.infoLabel
                  }
                >
                  EMERGENCY LOCATION
                </Text>

                <Text
                  style={
                    styles.infoValue
                  }
                >
                  {selectedEmergency.latitude.toFixed(
                    5,
                  )}
                  ,{' '}
                  {selectedEmergency.longitude.toFixed(
                    5,
                  )}
                </Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.navigationButton,

                pressed
                  ? styles.pressed
                  : null,
              ]}
              onPress={openNavigation}
            >
              <View
                style={
                  styles.navigationButtonLeft
                }
              >
                <Ionicons
                  name="navigate"
                  size={19}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.navigationButtonText
                  }
                >
                  Start navigation
                </Text>
              </View>

              <Ionicons
                name="open-outline"
                size={17}
                color="#FFFFFF"
              />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.assignmentButton,

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
              <Text
                style={
                  styles.assignmentButtonText
                }
              >
                Open assignment controls
              </Text>

              <Ionicons
                name="arrow-forward"
                size={17}
                color="#111827"
              />
            </Pressable>
          </View>
        ) : (
          <View
            style={styles.emptyCard}
          >
            <View
              style={styles.emptyIcon}
            >
              <Ionicons
                name="map-outline"
                size={24}
                color="#111827"
              />
            </View>

            <Text
              style={styles.emptyTitle}
            >
              No assigned incidents
            </Text>

            <Text
              style={styles.emptyText}
            >
              The map will automatically
              display incidents assigned by
              the control center.
            </Text>
          </View>
        )}

        <View
          style={styles.notice}
        >
          <Ionicons
            name="information-circle-outline"
            size={15}
            color="#7A838D"
          />

          <Text
            style={styles.noticeText}
          >
            This map displays your device
            position locally. Official live
            responder tracking is controlled
            from the assignment response
            screen.
          </Text>
        </View>
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
    paddingBottom: 36,
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

  loadingIndicator: {
    marginTop: 20,
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

  mapCard: {
    height: 390,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  mapTopBar: {
    position: 'absolute',
    top: 13,
    left: 13,
    right: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },

  liveDot: {
    width: 7,
    height: 7,
    marginRight: 6,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },

  liveText: {
    color: '#111827',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  centerButton: {
    width: 39,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },

  mapLegend: {
    position: 'absolute',
    left: 13,
    bottom: 13,
    flexDirection: 'row',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  legendText: {
    marginLeft: 5,
    color: '#59626D',
    fontSize: 8,
    fontWeight: '700',
  },

  responderLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#111827',
  },

  emergencyLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },

  emergencyMarker: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 19,
  },

  responderMarkerOuter: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: 'rgba(17, 24, 39, 0.18)',
  },

  responderMarker: {
    width: 29,
    height: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 15,
    backgroundColor: '#111827',
  },

  gpsStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 13,
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },

  gpsStatusIcon: {
    width: 39,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 13,
  },

  gpsOnlineIcon: {
    backgroundColor: '#ECFDF3',
  },

  gpsOfflineIcon: {
    backgroundColor: '#F3F4F6',
  },

  gpsStatusContent: {
    flex: 1,
  },

  gpsStatusTitle: {
    color: '#29333D',
    fontSize: 10,
    fontWeight: '900',
  },

  gpsStatusDescription: {
    marginTop: 3,
    color: '#8A939D',
    fontSize: 8,
    lineHeight: 12,
  },

  gpsIndicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  gpsIndicatorOnline: {
    backgroundColor: '#16A34A',
  },

  gpsIndicatorOffline: {
    backgroundColor: '#9CA3AF',
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
    fontSize: 9,
    lineHeight: 14,
  },

  sectionLabel: {
    marginTop: 25,
    marginBottom: 10,
    color: '#929AA4',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  incidentPicker: {
    paddingRight: 10,
  },

  incidentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 9,
    padding: 10,
    paddingRight: 14,
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
  },

  incidentChipSelected: {
    borderColor: '#111827',
    backgroundColor: '#111827',
  },

  incidentChipIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderRadius: 10,
  },

  incidentChipNumber: {
    color: '#111827',
    fontSize: 9,
    fontWeight: '900',
  },

  incidentChipNumberSelected: {
    color: '#FFFFFF',
  },

  incidentChipType: {
    marginTop: 2,
    color: '#929AA4',
    fontSize: 7,
    fontWeight: '800',
  },

  incidentChipTypeSelected: {
    color: '#C7CDD6',
  },

  incidentCard: {
    padding: 17,
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
  },

  incidentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  incidentIcon: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
    borderRadius: 15,
  },

  incidentTitleArea: {
    flex: 1,
    paddingRight: 7,
  },

  incidentNumber: {
    color: '#9CA3AF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  incidentTitle: {
    marginTop: 4,
    color: '#111827',
    fontSize: 14,
    fontWeight: '900',
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 9,
    backgroundColor: '#EEF2F6',
  },

  statusBadgeText: {
    color: '#4B5563',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  description: {
    marginTop: 15,
    color: '#59626D',
    fontSize: 11,
    lineHeight: 17,
  },

  divider: {
    height: 1,
    marginVertical: 15,
    backgroundColor: '#EEF0F2',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  infoIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
    borderRadius: 11,
    backgroundColor: '#F3F4F6',
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    color: '#9CA3AF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  infoValue: {
    marginTop: 3,
    color: '#29333D',
    fontSize: 10,
    fontWeight: '800',
  },

  navigationButton: {
    minHeight: 49,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingHorizontal: 15,
    borderRadius: 14,
    backgroundColor: '#111827',
  },

  navigationButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  navigationButtonText: {
    marginLeft: 9,
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  assignmentButton: {
    minHeight: 47,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 9,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },

  assignmentButtonText: {
    color: '#111827',
    fontSize: 10,
    fontWeight: '900',
  },

  emptyCard: {
    alignItems: 'center',
    padding: 27,
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
    backgroundColor: '#EEF2F6',
  },

  emptyTitle: {
    marginTop: 12,
    color: '#111827',
    fontSize: 14,
    fontWeight: '900',
  },

  emptyText: {
    marginTop: 6,
    textAlign: 'center',
    color: '#7A838D',
    fontSize: 9,
    lineHeight: 14,
  },

  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    paddingHorizontal: 3,
  },

  noticeText: {
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
})