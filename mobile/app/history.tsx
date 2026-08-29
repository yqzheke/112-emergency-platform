import {
  useCallback,
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
  useFocusEffect,
  useRouter,
} from 'expo-router'

import BottomNav from '../components/BottomNav'

import { getEmergencies } from '../services/emergencyService'

import type {
  Emergency,
  EmergencyStatus,
  EmergencyType,
} from '../types/emergency'

const emergencyNames: Record<
  EmergencyType,
  string
> = {
  MEDICAL: 'Medical',
  POLICE: 'Police',
  FIRE: 'Fire & Rescue',
}

const statusLabels: Record<
  EmergencyStatus,
  string
> = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  DISPATCHED: 'Dispatched',
  RESPONDING: 'Responding',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

export default function HistoryScreen() {
  const router = useRouter()

  const [emergencies, setEmergencies] =
    useState<Emergency[]>([])

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  const [error, setError] =
    useState('')

  const loadHistory = useCallback(
    async (
      showLoading = false,
    ) => {
      try {
        if (showLoading) {
          setLoading(true)
        }

        const result =
          await getEmergencies()

        setEmergencies(result)
        setError('')
      } catch (error) {
        console.error(
          'Emergency history loading error:',
          error,
        )

        setError(
          error instanceof Error
            ? error.message
            : 'Could not load emergency history',
        )
      } finally {
        if (showLoading) {
          setLoading(false)
        }

        setRefreshing(false)
      }
    },
    [],
  )

  useFocusEffect(
    useCallback(() => {
      loadHistory(true)
    }, [loadHistory]),
  )

  const handleRefresh = () => {
    setRefreshing(true)
    loadHistory(false)
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
            Loading history...
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.screen}>
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
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.logo}>
              112
            </Text>

            <Text style={styles.eyebrow}>
              YOUR REQUESTS
            </Text>

            <Text style={styles.title}>
              Emergency history
            </Text>

            <Text
              style={styles.subtitle}
            >
              Review your active and
              previous emergency requests.
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed &&
                styles.buttonPressed,
            ]}
            onPress={() =>
              router.replace(
                '/dashboard',
              )
            }
          >
            <Text
              style={styles.backText}
            >
              ←
            </Text>
          </Pressable>
        </View>

        {/* SUMMARY */}

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text
              style={
                styles.summaryValue
              }
            >
              {emergencies.length}
            </Text>

            <Text
              style={
                styles.summaryLabel
              }
            >
              Total requests
            </Text>
          </View>

          <View
            style={styles.summaryDivider}
          />

          <View style={styles.summaryItem}>
            <Text
              style={
                styles.summaryValue
              }
            >
              {
                emergencies.filter(
                  (item) =>
                    item.status !==
                      'COMPLETED' &&
                    item.status !==
                      'CANCELLED',
                ).length
              }
            </Text>

            <Text
              style={
                styles.summaryLabel
              }
            >
              Active
            </Text>
          </View>

          <View
            style={styles.summaryDivider}
          />

          <View style={styles.summaryItem}>
            <Text
              style={
                styles.summaryValue
              }
            >
              {
                emergencies.filter(
                  (item) =>
                    item.status ===
                    'COMPLETED',
                ).length
              }
            </Text>

            <Text
              style={
                styles.summaryLabel
              }
            >
              Completed
            </Text>
          </View>
        </View>

        {/* ERROR */}

        {error ? (
          <View style={styles.errorCard}>
            <Text
              style={styles.errorTitle}
            >
              Could not refresh history
            </Text>

            <Text
              style={styles.errorText}
            >
              {error}
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.retryButton,
                pressed &&
                  styles.buttonPressed,
              ]}
              onPress={() =>
                loadHistory(true)
              }
            >
              <Text
                style={
                  styles.retryButtonText
                }
              >
                Try again
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* EMPTY */}

        {!error &&
        emergencies.length === 0 ? (
          <View style={styles.emptyCard}>
            <View
              style={styles.emptyIcon}
            >
              <Text
                style={
                  styles.emptyIconText
                }
              >
                112
              </Text>
            </View>

            <Text
              style={styles.emptyTitle}
            >
              No emergencies yet
            </Text>

            <Text
              style={styles.emptyText}
            >
              Your emergency requests will
              appear here after you submit
              them.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.emptyButton,
                pressed &&
                  styles.buttonPressed,
              ]}
              onPress={() =>
                router.replace(
                  '/dashboard',
                )
              }
            >
              <Text
                style={
                  styles.emptyButtonText
                }
              >
                Back to dashboard
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* LIST */}

        {emergencies.length > 0 ? (
          <>
            <View
              style={styles.listHeader}
            >
              <Text
                style={
                  styles.listEyebrow
                }
              >
                ALL REQUESTS
              </Text>

              <Text
                style={
                  styles.listCount
                }
              >
                {emergencies.length}
              </Text>
            </View>

            <View style={styles.list}>
              {emergencies.map(
                (emergency) => {
                  const completed =
                    emergency.status ===
                    'COMPLETED'

                  const cancelled =
                    emergency.status ===
                    'CANCELLED'

                  const active =
                    !completed &&
                    !cancelled

                  return (
                    <Pressable
                      key={emergency.id}
                      style={({
                        pressed,
                      }) => [
                        styles.card,

                        active &&
                          styles.activeCard,

                        pressed &&
                          styles.cardPressed,
                      ]}
                      onPress={() =>
                        router.push({
                          pathname:
                            '/emergency-status',

                          params: {
                            id: String(
                              emergency.id,
                            ),
                          },
                        })
                      }
                    >
                      <View
                        style={
                          styles.cardTop
                        }
                      >
                        <View
                          style={
                            styles.cardTitleArea
                          }
                        >
                          <Text
                            style={
                              styles.requestId
                            }
                          >
                            REQUEST #
                            {emergency.id}
                          </Text>

                          <Text
                            style={
                              styles.type
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
                          style={[
                            styles.statusBadge,

                            active
                              ? styles.activeBadge
                              : null,

                            completed
                              ? styles.completedBadge
                              : null,

                            cancelled
                              ? styles.cancelledBadge
                              : null,
                          ]}
                        >
                          <View
                            style={[
                              styles.statusDot,

                              active
                                ? styles.activeDot
                                : null,

                              completed
                                ? styles.completedDot
                                : null,

                              cancelled
                                ? styles.cancelledDot
                                : null,
                            ]}
                          />

                          <Text
                            style={[
                              styles.statusText,

                              active
                                ? styles.activeText
                                : null,

                              completed
                                ? styles.completedText
                                : null,

                              cancelled
                                ? styles.cancelledText
                                : null,
                            ]}
                          >
                            {
                              statusLabels[
                                emergency.status
                              ]
                            }
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={
                          styles.description
                        }
                        numberOfLines={2}
                      >
                        {
                          emergency.description
                        }
                      </Text>

                      <View
                        style={
                          styles.cardDivider
                        }
                      />

                      <View
                        style={
                          styles.cardBottom
                        }
                      >
                        <View>
                          <Text
                            style={
                              styles.dateLabel
                            }
                          >
                            CREATED
                          </Text>

                          <Text
                            style={
                              styles.date
                            }
                          >
                            {new Date(
                              emergency.createdAt,
                            ).toLocaleString()}
                          </Text>
                        </View>

                        <View
                          style={
                            styles.arrowCircle
                          }
                        >
                          <Text
                            style={
                              styles.arrow
                            }
                          >
                            ›
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  )
                },
              )}
            </View>
          </>
        ) : null}

        <Text style={styles.footerText}>
          Pull down to refresh your emergency
          history.
        </Text>
      </ScrollView>

      <BottomNav active="history" />
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

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 11,
    color: '#7A838D',
    fontSize: 12,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  headerText: {
    flex: 1,
    paddingRight: 15,
  },

  logo: {
    color: '#111827',
    fontSize: 23,
    fontWeight: '900',
  },

  eyebrow: {
    marginTop: 22,
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
    maxWidth: 280,
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

  backText: {
    marginTop: -2,
    color: '#111827',
    fontSize: 24,
    fontWeight: '700',
  },

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#111827',
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },

  summaryValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },

  summaryLabel: {
    marginTop: 3,
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 8,
    lineHeight: 12,
  },

  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#374151',
  },

  errorCard: {
    marginBottom: 14,
    padding: 14,
    borderRadius: 15,
    backgroundColor: '#FEF2F2',
  },

  errorTitle: {
    color: '#991B1B',
    fontSize: 11,
    fontWeight: '900',
  },

  errorText: {
    marginTop: 4,
    color: '#B91C1C',
    fontSize: 10,
    lineHeight: 15,
  },

  retryButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },

  retryButtonText: {
    color: '#991B1B',
    fontSize: 9,
    fontWeight: '900',
  },

  emptyCard: {
    alignItems: 'center',
    padding: 28,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },

  emptyIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#111827',
  },

  emptyIconText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  emptyTitle: {
    marginTop: 15,
    color: '#202831',
    fontSize: 16,
    fontWeight: '900',
  },

  emptyText: {
    marginTop: 6,
    maxWidth: 280,
    textAlign: 'center',
    color: '#929AA4',
    fontSize: 11,
    lineHeight: 17,
  },

  emptyButton: {
    marginTop: 17,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#111827',
  },

  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  listEyebrow: {
    color: '#929AA4',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  listCount: {
    color: '#9CA3AF',
    fontSize: 9,
    fontWeight: '800',
  },

  list: {
    gap: 10,
  },

  card: {
    padding: 17,
    borderWidth: 1,
    borderColor: '#E7EAEE',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },

  activeCard: {
    borderColor: '#D9DEE4',
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  cardTitleArea: {
    flex: 1,
    paddingRight: 10,
  },

  requestId: {
    color: '#929AA4',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.9,
  },

  type: {
    marginTop: 5,
    color: '#202831',
    fontSize: 17,
    fontWeight: '900',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#EEF0F3',
  },

  activeBadge: {
    backgroundColor: '#EEF2FF',
  },

  completedBadge: {
    backgroundColor: '#E2F5ED',
  },

  cancelledBadge: {
    backgroundColor: '#FEE2E2',
  },

  statusDot: {
    width: 6,
    height: 6,
    marginRight: 5,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
  },

  activeDot: {
    backgroundColor: '#4F46E5',
  },

  completedDot: {
    backgroundColor: '#16A34A',
  },

  cancelledDot: {
    backgroundColor: '#DC2626',
  },

  statusText: {
    color: '#68717B',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  activeText: {
    color: '#3730A3',
  },

  completedText: {
    color: '#277355',
  },

  cancelledText: {
    color: '#991B1B',
  },

  description: {
    marginTop: 13,
    color: '#59636D',
    fontSize: 12,
    lineHeight: 18,
  },

  cardDivider: {
    height: 1,
    marginVertical: 14,
    backgroundColor: '#ECEFF2',
  },

  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dateLabel: {
    color: '#A0A7AF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  date: {
    marginTop: 4,
    color: '#929AA4',
    fontSize: 9,
  },

  arrowCircle: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },

  arrow: {
    marginTop: -2,
    color: '#59636D',
    fontSize: 22,
  },

  footerText: {
    marginTop: 14,
    textAlign: 'center',
    color: '#A1A8B0',
    fontSize: 8,
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
})