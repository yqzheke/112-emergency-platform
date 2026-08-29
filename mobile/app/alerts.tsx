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
} from 'expo-router'

import BottomNav from '../components/BottomNav'

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
  const [alerts, setAlerts] =
    useState<SafetyAlert[]>([])

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  const [error, setError] =
    useState('')

  const loadAlerts = useCallback(
    async (
      refresh = false,
    ) => {
      try {
        if (refresh) {
          setRefreshing(true)
        }

        const result =
          await getAlerts()

        setAlerts(result)
        setError('')
      } catch (error) {
        console.error(
          'Safety alert loading error:',
          error,
        )

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
            Loading safety alerts...
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
            onRefresh={() =>
              loadAlerts(true)
            }
            tintColor="#111827"
          />
        }
      >
        {/* HEADER */}

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

            <Text
              style={styles.subtitle}
            >
              Official safety information
              and important notices for
              your area.
            </Text>
          </View>
        </View>

        {/* STATUS SUMMARY */}

        <View style={styles.summaryCard}>
          <View
            style={styles.summaryIcon}
          >
            <Text
              style={styles.summaryIconText}
            >
              !
            </Text>
          </View>

          <View
            style={styles.summaryContent}
          >
            <Text
              style={styles.summaryTitle}
            >
              {alerts.length === 0
                ? 'No active alerts'
                : `${alerts.length} ${
                    alerts.length === 1
                      ? 'active alert'
                      : 'active alerts'
                  }`}
            </Text>

            <Text
              style={styles.summaryText}
            >
              Safety notices are published
              through the 112 operator
              system.
            </Text>
          </View>
        </View>

        {/* ERROR */}

        {error ? (
          <View style={styles.errorCard}>
            <Text
              style={styles.errorTitle}
            >
              Could not load alerts
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
                loadAlerts()
              }
            >
              <Text
                style={styles.retryText}
              >
                Try again
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* EMPTY */}

        {!error &&
        alerts.length === 0 ? (
          <View style={styles.emptyCard}>
            <View
              style={styles.safeBadge}
            >
              <View
                style={styles.safeDot}
              />

              <Text
                style={
                  styles.safeBadgeText
                }
              >
                ALL CLEAR
              </Text>
            </View>

            <Text
              style={styles.emptyTitle}
            >
              No active safety alerts
            </Text>

            <Text
              style={styles.emptyText}
            >
              There are currently no active
              public safety notices.
            </Text>
          </View>
        ) : null}

        {/* ALERTS */}

        {alerts.length > 0 ? (
          <>
            <View
              style={styles.sectionHeader}
            >
              <Text
                style={
                  styles.sectionLabel
                }
              >
                ACTIVE NOTICES
              </Text>

              <Text
                style={
                  styles.sectionCount
                }
              >
                {alerts.length}
              </Text>
            </View>

            <View
              style={styles.alertList}
            >
              {alerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                />
              ))}
            </View>
          </>
        ) : null}

        <View style={styles.footerInfo}>
          <View style={styles.footerDot} />

          <Text
            style={styles.footerNote}
          >
            Pull down to refresh for the
            latest public safety
            information.
          </Text>
        </View>
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
  const critical =
    alert.severity === 'CRITICAL'

  const warning =
    alert.severity === 'WARNING'

  const info =
    alert.severity === 'INFO'

  return (
    <View
      style={[
        styles.alertCard,

        info
          ? styles.infoCard
          : null,

        warning
          ? styles.warningCard
          : null,

        critical
          ? styles.criticalCard
          : null,
      ]}
    >
      <View style={styles.alertTop}>
        <View
          style={[
            styles.severityBadge,

            info
              ? styles.infoBadge
              : null,

            warning
              ? styles.warningBadge
              : null,

            critical
              ? styles.criticalBadge
              : null,
          ]}
        >
          <View
            style={[
              styles.severityDot,

              info
                ? styles.infoDot
                : null,

              warning
                ? styles.warningDot
                : null,

              critical
                ? styles.criticalDot
                : null,
            ]}
          />

          <Text
            style={[
              styles.severityText,

              info
                ? styles.infoText
                : null,

              warning
                ? styles.warningText
                : null,

              critical
                ? styles.criticalText
                : null,
            ]}
          >
            {severityNames[alert.severity]}
          </Text>
        </View>

        <Text
          style={styles.alertRegion}
          numberOfLines={1}
        >
          {alert.region}
        </Text>
      </View>

      <Text style={styles.alertTitle}>
        {alert.title}
      </Text>

      <Text
        style={styles.alertMessage}
      >
        {alert.message}
      </Text>

      <View style={styles.divider} />

      <View
        style={styles.alertFooter}
      >
        <Text
          style={styles.alertDateLabel}
        >
          PUBLISHED
        </Text>

        <Text
          style={styles.alertDate}
        >
          {new Date(
            alert.createdAt,
          ).toLocaleString()}
        </Text>
      </View>
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
    marginBottom: 20,
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
    maxWidth: 310,
    marginTop: 7,
    color: '#7A838D',
    fontSize: 12,
    lineHeight: 18,
  },

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    borderRadius: 18,
    backgroundColor: '#111827',
  },

  summaryIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderRadius: 14,
    backgroundColor: '#25303E',
  },

  summaryIconText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  summaryContent: {
    flex: 1,
  },

  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  summaryText: {
    marginTop: 4,
    color: '#AEB6C1',
    fontSize: 9,
    lineHeight: 14,
  },

  errorCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
  },

  errorTitle: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '900',
  },

  errorText: {
    marginTop: 5,
    color: '#B42318',
    fontSize: 10,
    lineHeight: 15,
  },

  retryButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },

  retryText: {
    color: '#991B1B',
    fontSize: 9,
    fontWeight: '900',
  },

  emptyCard: {
    padding: 22,
    borderWidth: 1,
    borderColor: '#E7EAEE',
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },

  safeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#E2F5ED',
  },

  safeDot: {
    width: 6,
    height: 6,
    marginRight: 5,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },

  safeBadgeText: {
    color: '#277355',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  emptyTitle: {
    marginTop: 15,
    color: '#202831',
    fontSize: 17,
    fontWeight: '900',
  },

  emptyText: {
    marginTop: 5,
    color: '#929AA4',
    fontSize: 10,
    lineHeight: 16,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  sectionLabel: {
    color: '#929AA4',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  sectionCount: {
    color: '#9CA3AF',
    fontSize: 9,
    fontWeight: '900',
  },

  alertList: {
    gap: 11,
  },

  alertCard: {
    padding: 18,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },

  infoCard: {
    borderColor: '#E3E7F0',
    borderLeftColor: '#6977A8',
  },

  warningCard: {
    borderColor: '#F3E2C6',
    borderLeftColor: '#C88026',
  },

  criticalCard: {
    borderColor: '#F2D7D4',
    borderLeftColor: '#B42318',
  },

  alertTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
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

  severityDot: {
    width: 6,
    height: 6,
    marginRight: 5,
    borderRadius: 3,
  },

  infoDot: {
    backgroundColor: '#59678F',
  },

  warningDot: {
    backgroundColor: '#C88026',
  },

  criticalDot: {
    backgroundColor: '#B42318',
  },

  severityText: {
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.6,
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
    maxWidth: 125,
    color: '#929AA4',
    fontSize: 9,
    fontWeight: '700',
  },

  alertTitle: {
    marginTop: 16,
    color: '#202831',
    fontSize: 17,
    fontWeight: '900',
  },

  alertMessage: {
    marginTop: 7,
    color: '#59636D',
    fontSize: 12,
    lineHeight: 19,
  },

  divider: {
    height: 1,
    marginVertical: 14,
    backgroundColor: '#ECEFF2',
  },

  alertFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  alertDateLabel: {
    color: '#A0A7AF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  alertDate: {
    color: '#929AA4',
    fontSize: 9,
  },

  footerInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 18,
    paddingHorizontal: 4,
  },

  footerDot: {
    width: 6,
    height: 6,
    marginTop: 4,
    marginRight: 7,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
  },

  footerNote: {
    flex: 1,
    color: '#A0A7AF',
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
})