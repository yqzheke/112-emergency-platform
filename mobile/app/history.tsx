import BottomNav from '../components/BottomNav'
import {
  useCallback,
  useEffect,
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
  useFocusEffect,
  useRouter,
} from 'expo-router'

import { getEmergencies } from '../services/emergencyService'

import type {
  Emergency,
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

export default function HistoryScreen() {
  const router = useRouter()

  const [emergencies, setEmergencies] =
    useState<Emergency[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true)

      const result = await getEmergencies()

      setEmergencies(result)
      setError('')
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error
          ? error.message
          : 'Could not load history',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadHistory()
    }, [loadHistory]),
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingContainer}>
          <Text style={styles.logo}>
            112
          </Text>

          <ActivityIndicator
            size="large"
            color="#111827"
            style={styles.loader}
          />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              112
            </Text>

            <Text style={styles.eyebrow}>
              YOUR REQUESTS
            </Text>

            <Text style={styles.title}>
              Emergency history
            </Text>
          </View>

          <Pressable
            style={styles.backButton}
            onPress={() =>
              router.replace('/dashboard')
            }
          >
            <Text style={styles.backText}>
              ←
            </Text>
          </Pressable>
        </View>

        {error ? (
          <Text style={styles.error}>
            {error}
          </Text>
        ) : null}

        {!error &&
        emergencies.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              No emergencies yet
            </Text>

            <Text style={styles.emptyText}>
              Your previous emergency requests
              will appear here.
            </Text>
          </View>
        ) : null}

        <View style={styles.list}>
          {emergencies.map((emergency) => (
            <Pressable
              key={emergency.id}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname:
                    '/emergency-status',
                  params: {
                    id: String(emergency.id),
                  },
                })
              }
            >
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.requestId}>
                    REQUEST #{emergency.id}
                  </Text>

                  <Text style={styles.type}>
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
                    emergency.status ===
                      'COMPLETED' &&
                      styles.completedBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      emergency.status ===
                        'COMPLETED' &&
                        styles.completedText,
                    ]}
                  >
                    {emergency.status}
                  </Text>
                </View>
              </View>

              <Text
                style={styles.description}
                numberOfLines={2}
              >
                {emergency.description}
              </Text>

              <View style={styles.cardBottom}>
                <Text style={styles.date}>
                  {new Date(
                    emergency.createdAt,
                  ).toLocaleString()}
                </Text>

                <Text style={styles.arrow}>
                  ›
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
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
    paddingBottom: 20,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loader: {
    marginTop: 25,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },

  logo: {
    fontSize: 23,
    fontWeight: '900',
    color: '#111827',
  },

  eyebrow: {
    marginTop: 24,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#929AA4',
  },

  title: {
    marginTop: 7,
    fontSize: 30,
    fontWeight: '800',
    color: '#18212B',
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
  },

  backText: {
    fontSize: 25,
    color: '#111827',
  },

  error: {
    marginBottom: 15,
    color: '#DC2626',
  },

  emptyCard: {
    padding: 22,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#202831',
  },

  emptyText: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
    color: '#929AA4',
  },

  list: {
    gap: 12,
  },

  card: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  requestId: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#929AA4',
  },

  type: {
    marginTop: 5,
    fontSize: 17,
    fontWeight: '800',
    color: '#202831',
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#EEF0F3',
  },

  completedBadge: {
    backgroundColor: '#E2F5ED',
  },

  statusText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#68717B',
  },

  completedText: {
    color: '#277355',
  },

  description: {
    marginTop: 15,
    fontSize: 13,
    lineHeight: 19,
    color: '#59636D',
  },

  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
  },

  date: {
    fontSize: 10,
    color: '#929AA4',
  },

  arrow: {
    fontSize: 26,
    color: '#929AA4',
  },
})