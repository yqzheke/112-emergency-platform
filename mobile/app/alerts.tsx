import BottomNav from '../components/BottomNav'

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

import { getAlerts } from '../services/alertService'

import type {
  AlertSeverity,
  SafetyAlert,
} from '../types/alert'

const severityNames: Record<
  AlertSeverity,
  string
> = {
  INFO: 'INFORMATION',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL',
}

export default function AlertsScreen() {
  const router = useRouter()

  const [alerts, setAlerts] =
    useState<SafetyAlert[]>([])

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  const [error, setError] = useState('')

  const loadAlerts = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) {
          setRefreshing(true)
        }

        const result = await getAlerts()

        setAlerts(result)
        setError('')
      } catch (error) {
        console.error(error)

        setError(
          error instanceof Error
            ? error.message
            : 'Could not load alerts',
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [],
  )

  useFocusEffect(
    useCallback(() => {
      loadAlerts()
    }, [loadAlerts]),
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

          <Text style={styles.loadingText}>
            Loading safety alerts...
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadAlerts(true)
            }
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              112
            </Text>

            <Text style={styles.eyebrow}>
              PUBLIC SAFETY
            </Text>

            <Text style={styles.title}>
              Alerts
            </Text>
          </View>

        </View>

        <Text style={styles.subtitle}>
          Official safety information and
          important notices for your area.
        </Text>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>
              Could not load alerts
            </Text>

            <Text style={styles.errorText}>
              {error}
            </Text>

            <Pressable
              onPress={() => loadAlerts()}
            >
              <Text style={styles.retry}>
                Try again
              </Text>
            </Pressable>
          </View>
        ) : null}

        {!error &&
        alerts.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.safeBadge}>
              <Text style={styles.safeBadgeText}>
                ALL CLEAR
              </Text>
            </View>

            <Text style={styles.emptyTitle}>
              No active safety alerts
            </Text>

            <Text style={styles.emptyText}>
              There are currently no active public
              safety notices.
            </Text>
          </View>
        ) : null}

        <View style={styles.alertList}>
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
            />
          ))}
        </View>

        <Text style={styles.footerNote}>
          Safety alerts shown here are published
          through the 112 operator system.
        </Text>
            </ScrollView>

      <BottomNav active="alerts" />
    </SafeAreaView>
  )
}

function AlertCard({
  alert,
}: {
  alert: SafetyAlert
}) {
  return (
    <View
      style={[
        styles.alertCard,

        alert.severity === 'INFO' &&
          styles.infoCard,

        alert.severity === 'WARNING' &&
          styles.warningCard,

        alert.severity === 'CRITICAL' &&
          styles.criticalCard,
      ]}
    >
      <View style={styles.alertTop}>
        <View
          style={[
            styles.severityBadge,

            alert.severity === 'INFO' &&
              styles.infoBadge,

            alert.severity === 'WARNING' &&
              styles.warningBadge,

            alert.severity === 'CRITICAL' &&
              styles.criticalBadge,
          ]}
        >
          <Text
            style={[
              styles.severityText,

              alert.severity === 'INFO' &&
                styles.infoText,

              alert.severity === 'WARNING' &&
                styles.warningText,

              alert.severity === 'CRITICAL' &&
                styles.criticalText,
            ]}
          >
            {severityNames[alert.severity]}
          </Text>
        </View>

        <Text style={styles.alertRegion}>
          {alert.region}
        </Text>
      </View>

      <Text style={styles.alertTitle}>
        {alert.title}
      </Text>

      <Text style={styles.alertMessage}>
        {alert.message}
      </Text>

      <View style={styles.divider} />

      <Text style={styles.alertDate}>
        {new Date(
          alert.createdAt,
        ).toLocaleString()}
      </Text>
    </View>
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
    paddingBottom: 25,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loader: {
    marginTop: 25,
  },

  loadingText: {
    marginTop: 12,
    color: '#7A838D',
    fontSize: 13,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
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

  subtitle: {
    maxWidth: 300,
    marginTop: 10,
    marginBottom: 28,
    color: '#7A838D',
    fontSize: 14,
    lineHeight: 20,
  },

  alertList: {
    gap: 12,
  },

  alertCard: {
    padding: 19,
    borderLeftWidth: 4,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },

  infoCard: {
    borderLeftColor: '#6977A8',
  },

  warningCard: {
    borderLeftColor: '#C88026',
  },

  criticalCard: {
    borderLeftColor: '#B42318',
  },

  alertTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  severityBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
  },

  infoBadge: {
    backgroundColor: '#EDF0F8',
  },

  warningBadge: {
    backgroundColor: '#FFF1DF',
  },

  criticalBadge: {
    backgroundColor: '#FEE9E7',
  },

  severityText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  infoText: {
    color: '#59678F',
  },

  warningText: {
    color: '#A25D13',
  },

  criticalText: {
    color: '#B42318',
  },

  alertRegion: {
    color: '#929AA4',
    fontSize: 10,
    fontWeight: '700',
  },

  alertTitle: {
    marginTop: 17,
    color: '#202831',
    fontSize: 18,
    fontWeight: '800',
  },

  alertMessage: {
    marginTop: 8,
    color: '#59636D',
    fontSize: 13,
    lineHeight: 20,
  },

  divider: {
    height: 1,
    marginVertical: 15,
    backgroundColor: '#ECEFF2',
  },

  alertDate: {
    color: '#929AA4',
    fontSize: 10,
  },

  emptyCard: {
    padding: 22,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },

  safeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#E2F5ED',
  },

  safeBadgeText: {
    color: '#277355',
    fontSize: 8,
    fontWeight: '900',
  },

  emptyTitle: {
    marginTop: 15,
    color: '#202831',
    fontSize: 17,
    fontWeight: '800',
  },

  emptyText: {
    marginTop: 5,
    color: '#929AA4',
    fontSize: 11,
    lineHeight: 17,
  },

  errorCard: {
    padding: 18,
    marginBottom: 15,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },

  errorTitle: {
    color: '#B42318',
    fontSize: 14,
    fontWeight: '800',
  },

  errorText: {
    marginTop: 5,
    color: '#7A838D',
    fontSize: 11,
  },

  retry: {
    marginTop: 12,
    color: '#111827',
    fontSize: 12,
    fontWeight: '800',
  },

  footerNote: {
    marginTop: 25,
    textAlign: 'center',
    color: '#A0A7AF',
    fontSize: 9,
    lineHeight: 14,
  },
})