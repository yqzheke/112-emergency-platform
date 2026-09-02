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
  getResponderHistory,
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

function formatDate(
  value: string | null | undefined,
) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  return date.toLocaleDateString(
    undefined,
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  )
}

function formatTime(
  value: string | null | undefined,
) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  return date.toLocaleTimeString(
    undefined,
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  )
}

export default function ResponderHistoryScreen() {
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

  const loadHistory =
    useCallback(async () => {
      try {
        const data =
          await getResponderHistory()

        setEmergencies(data)
        setError('')
      } catch (error) {
        console.error(
          'Responder history error:',
          error,
        )

        setError(
          error instanceof Error
            ? error.message
            : 'Could not load responder history',
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const todayCount =
    useMemo(() => {
      const today =
        new Date().toDateString()

      return emergencies.filter(
        (emergency) =>
          new Date(
            emergency.updatedAt,
          ).toDateString() === today,
      ).length
    }, [emergencies])

  const handleRefresh = () => {
    setRefreshing(true)
    loadHistory()
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
            style={styles.logoBadge}
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
            Loading response history...
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
            onRefresh={handleRefresh}
            tintColor="#111827"
          />
        }
      >
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
              FIELD OPERATIONS
            </Text>

            <Text
              style={
                styles.headerTitle
              }
            >
              Response history
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
                RESPONSE RECORD
              </Text>

              <Text
                style={
                  styles.heroTitle
                }
              >
                Completed incidents
              </Text>
            </View>

            <View
              style={styles.heroIcon}
            >
              <Ionicons
                name="time-outline"
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
            Review emergencies you have
            completed while assigned as a
            responder.
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
                Total completed
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
                style={
                  styles.heroStatValue
                }
              >
                {todayCount}
              </Text>

              <Text
                style={
                  styles.heroStatLabel
                }
              >
                Completed today
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

        <Text
          style={styles.sectionLabel}
        >
          COMPLETED ASSIGNMENTS
        </Text>

        {emergencies.length === 0 ? (
          <View
            style={styles.emptyCard}
          >
            <View
              style={styles.emptyIcon}
            >
              <Ionicons
                name="checkmark-done-outline"
                size={25}
                color="#111827"
              />
            </View>

            <Text
              style={styles.emptyTitle}
            >
              No completed incidents yet
            </Text>

            <Text
              style={styles.emptyText}
            >
              Completed emergency responses
              assigned to your responder
              account will appear here.
            </Text>
          </View>
        ) : (
          emergencies.map(
            (emergency) => {
              const meta =
                emergencyMeta[
                  emergency.type
                ]

              return (
                <View
                  key={emergency.id}
                  style={
                    styles.historyCard
                  }
                >
                  <View
                    style={
                      styles.historyHeader
                    }
                  >
                    <View
                      style={[
                        styles.emergencyIcon,

                        {
                          backgroundColor:
                            meta.background,
                        },
                      ]}
                    >
                      <Ionicons
                        name={meta.icon}
                        size={21}
                        color={meta.color}
                      />
                    </View>

                    <View
                      style={
                        styles.historyTitleArea
                      }
                    >
                      <Text
                        style={
                          styles.incidentNumber
                        }
                      >
                        INCIDENT #
                        {emergency.id}
                      </Text>

                      <Text
                        style={
                          styles.historyTitle
                        }
                      >
                        {meta.title}
                      </Text>
                    </View>

                    <View
                      style={
                        styles.completedBadge
                      }
                    >
                      <Ionicons
                        name="checkmark"
                        size={12}
                        color="#166534"
                      />

                      <Text
                        style={
                          styles.completedBadgeText
                        }
                      >
                        COMPLETED
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={
                      styles.description
                    }
                    numberOfLines={3}
                  >
                    {
                      emergency.description
                    }
                  </Text>

                  <View
                    style={styles.divider}
                  />

                  <View
                    style={styles.infoRow}
                  >
                    <View
                      style={
                        styles.infoIcon
                      }
                    >
                      <Ionicons
                        name="person-outline"
                        size={16}
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
                          emergency.user
                            .fullName
                        }
                      </Text>
                    </View>
                  </View>

                  <View
                    style={styles.infoRow}
                  >
                    <View
                      style={
                        styles.infoIcon
                      }
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={16}
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
                        COMPLETED
                      </Text>

                      <Text
                        style={
                          styles.infoValue
                        }
                      >
                        {formatDate(
                          emergency.updatedAt,
                        )}
                        {' · '}
                        {formatTime(
                          emergency.updatedAt,
                        )}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={
                      styles.timeline
                    }
                  >
                    <View
                      style={
                        styles.timelineItem
                      }
                    >
                      <View
                        style={
                          styles.timelineDot
                        }
                      />

                      <View
                        style={
                          styles.timelineContent
                        }
                      >
                        <Text
                          style={
                            styles.timelineLabel
                          }
                        >
                          DISPATCHED
                        </Text>

                        <Text
                          style={
                            styles.timelineValue
                          }
                        >
                          {formatTime(
                            emergency.responderAssignedAt,
                          )}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={
                        styles.timelineLine
                      }
                    />

                    <View
                      style={
                        styles.timelineItem
                      }
                    >
                      <View
                        style={
                          styles.timelineDot
                        }
                      />

                      <View
                        style={
                          styles.timelineContent
                        }
                      >
                        <Text
                          style={
                            styles.timelineLabel
                          }
                        >
                          ACCEPTED
                        </Text>

                        <Text
                          style={
                            styles.timelineValue
                          }
                        >
                          {formatTime(
                            emergency.responderAcceptedAt,
                          )}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={
                        styles.timelineLine
                      }
                    />

                    <View
                      style={
                        styles.timelineItem
                      }
                    >
                      <View
                        style={[
                          styles.timelineDot,
                          styles.timelineDotComplete,
                        ]}
                      />

                      <View
                        style={
                          styles.timelineContent
                        }
                      >
                        <Text
                          style={
                            styles.timelineLabel
                          }
                        >
                          ARRIVED
                        </Text>

                        <Text
                          style={
                            styles.timelineValue
                          }
                        >
                          {formatTime(
                            emergency.responderArrivedAt,
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )
            },
          )
        )}

        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={15}
            color="#7A838D"
          />

          <Text style={styles.noticeText}>
            Response history is linked to
            your responder account and only
            includes incidents completed by
            you.
          </Text>
        </View>
      </ScrollView>
      <ResponderBottomNav active="history" />
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

  hero: {
    padding: 21,
    borderRadius: 24,
    backgroundColor: '#111827',
  },

  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
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
    fontSize: 23,
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
    fontSize: 9,
    lineHeight: 14,
  },

  sectionLabel: {
    marginTop: 26,
    marginBottom: 10,
    color: '#929AA4',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  historyCard: {
    marginBottom: 12,
    padding: 17,
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
  },

  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  emergencyIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 14,
  },

  historyTitleArea: {
    flex: 1,
    paddingRight: 7,
  },

  incidentNumber: {
    color: '#9CA3AF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  historyTitle: {
    marginTop: 4,
    color: '#111827',
    fontSize: 14,
    fontWeight: '900',
  },

  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 9,
    backgroundColor: '#ECFDF3',
  },

  completedBadgeText: {
    marginLeft: 3,
    color: '#166534',
    fontSize: 6,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  description: {
    marginTop: 14,
    color: '#59626D',
    fontSize: 10,
    lineHeight: 16,
  },

  divider: {
    height: 1,
    marginVertical: 14,
    backgroundColor: '#EEF0F2',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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

  timeline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 7,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F7F8FA',
  },

  timelineItem: {
    flex: 1,
    alignItems: 'center',
  },

  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#111827',
  },

  timelineDotComplete: {
    backgroundColor: '#16A34A',
  },

  timelineLine: {
    flex: 0.6,
    height: 1,
    marginTop: 4,
    backgroundColor: '#D9DDE2',
  },

  timelineContent: {
    alignItems: 'center',
    marginTop: 7,
  },

  timelineLabel: {
    color: '#9CA3AF',
    fontSize: 6,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  timelineValue: {
    marginTop: 3,
    color: '#374151',
    fontSize: 8,
    fontWeight: '800',
  },

  emptyCard: {
    alignItems: 'center',
    padding: 28,
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