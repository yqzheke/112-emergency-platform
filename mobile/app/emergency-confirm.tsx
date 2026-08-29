import { useEffect, useState } from 'react'

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

import * as Location from 'expo-location'

import { createEmergency } from '../services/emergencyService'

import type {
  EmergencyType,
} from '../types/emergency'

type EmergencyRequestType =
  | 'medical'
  | 'police'
  | 'fire'

interface Coordinates {
  latitude: number
  longitude: number
}

const emergencyNames: Record<
  EmergencyRequestType,
  string
> = {
  medical: 'Medical Emergency',
  police: 'Police Emergency',
  fire: 'Fire & Rescue Emergency',
}

const emergencyLabels: Record<
  EmergencyRequestType,
  string
> = {
  medical: 'MEDICAL',
  police: 'POLICE',
  fire: 'FIRE & RESCUE',
}

function isEmergencyType(
  value: unknown,
): value is EmergencyRequestType {
  return (
    value === 'medical' ||
    value === 'police' ||
    value === 'fire'
  )
}

export default function EmergencyConfirmScreen() {
  const router = useRouter()

  const params =
    useLocalSearchParams<{
      type?: string
      description?: string
      aiService?: string
      aiSummary?: string
      aiUrgency?: string
      aiImportantDetails?: string
    }>()

  const type = isEmergencyType(params.type)
    ? params.type
    : null

  const description =
    typeof params.description === 'string'
      ? params.description
      : ''

  const aiService =
    typeof params.aiService === 'string'
      ? params.aiService
      : ''

  const aiSummary =
    typeof params.aiSummary === 'string'
      ? params.aiSummary
      : ''

  const aiUrgency =
    typeof params.aiUrgency === 'string'
      ? params.aiUrgency
      : ''

  const aiImportantDetails =
    typeof params.aiImportantDetails === 'string'
      ? params.aiImportantDetails
      : ''

  const [location, setLocation] =
    useState<Coordinates | null>(null)

  const [
    loadingLocation,
    setLoadingLocation,
  ] = useState(true)

  const [
    locationError,
    setLocationError,
  ] = useState('')

  const [serverError, setServerError] =
    useState('')

  const [sending, setSending] =
    useState(false)

  const detectLocation = async () => {
    try {
      setLoadingLocation(true)
      setLocationError('')

      const permission =
        await Location.requestForegroundPermissionsAsync()

      if (
        permission.status !== 'granted'
      ) {
        setLocation(null)

        setLocationError(
          'Location permission is required to send an emergency request.',
        )

        return
      }

      const position =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        })

      setLocation({
        latitude:
          position.coords.latitude,

        longitude:
          position.coords.longitude,
      })
    } catch (error) {
      console.error(
        'Location detection error:',
        error,
      )

      setLocation(null)

      setLocationError(
        'We could not determine your location. Please try again.',
      )
    } finally {
      setLoadingLocation(false)
    }
  }

  useEffect(() => {
    detectLocation()
  }, [])

  const handleConfirm = async () => {
    setServerError('')

    if (!type) {
      router.replace('/dashboard')
      return
    }

    if (!description.trim()) {
      router.replace({
        pathname: '/emergency',

        params: {
          type,
        },
      })

      return
    }

    if (!location) {
      setLocationError(
        'Your location is required before the emergency can be sent.',
      )

      return
    }

    try {
      setSending(true)

      const emergency =
        await createEmergency({
          type:
            type.toUpperCase() as EmergencyType,

          description:
            description.trim(),

          latitude:
            location.latitude,

          longitude:
            location.longitude,

          aiService:
            aiService || undefined,

          aiSummary:
            aiSummary || undefined,

          aiUrgency:
            aiUrgency || undefined,

          aiImportantDetails:
            aiImportantDetails ||
            undefined,
        })

      router.replace({
        pathname:
          '/emergency-status',

        params: {
          id: String(emergency.id),
        },
      })
    } catch (error) {
      console.error(
        'Emergency creation error:',
        error,
      )

      setServerError(
        error instanceof Error
          ? error.message
          : 'Could not send emergency request',
      )
    } finally {
      setSending(false)
    }
  }

  if (!type) {
    return (
      <SafeAreaView style={styles.screen}>
        <View
          style={styles.invalidContainer}
        >
          <Text
            style={styles.invalidLogo}
          >
            112
          </Text>

          <Text
            style={styles.invalidTitle}
          >
            Invalid emergency
          </Text>

          <Text
            style={styles.invalidText}
          >
            Return to the dashboard and
            choose an emergency service.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
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
                styles.primaryButtonText
              }
            >
              Back to dashboard
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* HEADER */}

        <View style={styles.topRow}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed &&
                styles.buttonPressed,
            ]}
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={styles.backButtonText}
            >
              ←
            </Text>
          </Pressable>

          <View
            style={styles.logoBadge}
          >
            <Text style={styles.logo}>
              112
            </Text>
          </View>
        </View>

        {/* TITLE */}

        <View style={styles.stepBadge}>
          <View style={styles.stepDot} />

          <Text style={styles.stepText}>
            FINAL STEP
          </Text>
        </View>

        <Text style={styles.title}>
          Confirm emergency
        </Text>

        <Text style={styles.subtitle}>
          Review your emergency details
          and current location before
          sending the request.
        </Text>

        {/* REQUEST SUMMARY */}

        <View
          style={styles.summaryCard}
        >
          <View
            style={styles.summaryHeader}
          >
            <View
              style={styles.serviceBadge}
            >
              <Text
                style={
                  styles.serviceBadgeText
                }
              >
                {emergencyLabels[type]}
              </Text>
            </View>

            <Text
              style={
                styles.summaryHeaderText
              }
            >
              REQUEST SUMMARY
            </Text>
          </View>

          <Text style={styles.cardLabel}>
            SERVICE
          </Text>

          <Text style={styles.cardValue}>
            {emergencyNames[type]}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.cardLabel}>
            DESCRIPTION
          </Text>

          <Text
            style={styles.description}
          >
            {description}
          </Text>

          {aiSummary ? (
            <>
              <View
                style={styles.divider}
              />

              <View
                style={
                  styles.aiSummaryHeader
                }
              >
                <Text
                  style={styles.cardLabel}
                >
                  AI ASSIST
                </Text>

                <View
                  style={
                    styles.aiReadyBadge
                  }
                >
                  <Text
                    style={
                      styles.aiReadyText
                    }
                  >
                    READY
                  </Text>
                </View>
              </View>

              <Text
                style={
                  styles.aiSummaryText
                }
              >
                {aiSummary}
              </Text>
            </>
          ) : null}
        </View>

        {/* LOCATION */}

        <Text
          style={styles.sectionLabel}
        >
          LOCATION
        </Text>

        <View
          style={[
            styles.locationCard,

            location
              ? styles.locationCardReady
              : null,

            locationError &&
            !location
              ? styles.locationCardError
              : null,
          ]}
        >
          {loadingLocation ? (
            <View
              style={
                styles.locationLoading
              }
            >
              <View
                style={styles.locationIcon}
              >
                <ActivityIndicator
                  size="small"
                  color="#111827"
                />
              </View>

              <View
                style={
                  styles.locationContent
                }
              >
                <Text
                  style={
                    styles.locationTitle
                  }
                >
                  Detecting location
                </Text>

                <Text
                  style={
                    styles.locationText
                  }
                >
                  Getting your current GPS
                  coordinates.
                </Text>
              </View>
            </View>
          ) : location ? (
            <>
              <View
                style={
                  styles.locationSuccessRow
                }
              >
                <View
                  style={
                    styles.locationSuccessIcon
                  }
                >
                  <Text
                    style={
                      styles.locationSuccessIconText
                    }
                  >
                    ✓
                  </Text>
                </View>

                <View
                  style={
                    styles.locationContent
                  }
                >
                  <Text
                    style={
                      styles.locationSuccessTitle
                    }
                  >
                    Location ready
                  </Text>

                  <Text
                    style={
                      styles.locationText
                    }
                  >
                    Your location will be
                    attached to the
                    emergency request.
                  </Text>
                </View>
              </View>

              <View
                style={
                  styles.coordinatesCard
                }
              >
                <Text
                  style={
                    styles.coordinatesLabel
                  }
                >
                  GPS COORDINATES
                </Text>

                <Text
                  style={styles.coordinates}
                >
                  {location.latitude.toFixed(
                    6,
                  )}
                  ,{' '}
                  {location.longitude.toFixed(
                    6,
                  )}
                </Text>
              </View>
            </>
          ) : (
            <>
              <Text
                style={
                  styles.locationErrorTitle
                }
              >
                Location unavailable
              </Text>

              <Text
                style={
                  styles.locationErrorText
                }
              >
                {locationError}
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.retryButton,

                  pressed &&
                    styles.buttonPressed,
                ]}
                onPress={detectLocation}
              >
                <Text
                  style={
                    styles.retryButtonText
                  }
                >
                  Try location again
                </Text>
              </Pressable>
            </>
          )}
        </View>

        {/* SERVER ERROR */}

        {serverError ? (
          <View
            style={styles.errorCard}
          >
            <Text
              style={styles.errorTitle}
            >
              Request not sent
            </Text>

            <Text
              style={styles.errorText}
            >
              {serverError}
            </Text>
          </View>
        ) : null}

        {/* SEND */}

        <View
          style={styles.sendSection}
        >
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,

              (!location || sending) &&
                styles.disabledButton,

              pressed &&
              location &&
              !sending
                ? styles.buttonPressed
                : null,
            ]}
            onPress={handleConfirm}
            disabled={
              !location || sending
            }
          >
            {sending ? (
              <>
                <ActivityIndicator
                  color="#FFFFFF"
                />

                <Text
                  style={styles.sendingText}
                >
                  Sending request...
                </Text>
              </>
            ) : (
              <>
                <Text
                  style={
                    styles.primaryButtonText
                  }
                >
                  Send emergency request
                </Text>

                <Text
                  style={
                    styles.primaryButtonArrow
                  }
                >
                  ›
                </Text>
              </>
            )}
          </Pressable>

          <View style={styles.safetyRow}>
            <View style={styles.safetyDot} />

            <Text style={styles.safetyNote}>
              Your emergency details and
              current location will be sent
              to the 112 response platform.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 40,
  },

  invalidContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 22,
  },

  invalidLogo: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '900',
  },

  invalidTitle: {
    marginTop: 20,
    color: '#18212B',
    fontSize: 28,
    fontWeight: '900',
  },

  invalidText: {
    marginTop: 8,
    color: '#7A838D',
    fontSize: 13,
    lineHeight: 19,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 38,
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },

  backButtonText: {
    marginTop: -2,
    color: '#26313C',
    fontSize: 23,
    fontWeight: '700',
  },

  logoBadge: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#111827',
  },

  logo: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },

  stepDot: {
    width: 6,
    height: 6,
    marginRight: 6,
    borderRadius: 3,
    backgroundColor: '#111827',
  },

  stepText: {
    color: '#5B6470',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.9,
  },

  title: {
    color: '#18212B',
    fontSize: 30,
    fontWeight: '900',
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    maxWidth: 340,
    color: '#7A838D',
    fontSize: 13,
    lineHeight: 20,
  },

  summaryCard: {
    padding: 18,
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
  },

  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  serviceBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#111827',
  },

  serviceBadgeText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  summaryHeaderText: {
    color: '#A0A7AF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  cardLabel: {
    color: '#929AA4',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  cardValue: {
    marginTop: 6,
    color: '#202831',
    fontSize: 18,
    fontWeight: '900',
  },

  description: {
    marginTop: 6,
    color: '#3F4A55',
    fontSize: 13,
    lineHeight: 20,
  },

  divider: {
    height: 1,
    marginVertical: 17,
    backgroundColor: '#E1E5E9',
  },

  aiSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  aiReadyBadge: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#DCFCE7',
  },

  aiReadyText: {
    color: '#166534',
    fontSize: 7,
    fontWeight: '900',
  },

  aiSummaryText: {
    marginTop: 7,
    color: '#4B5563',
    fontSize: 11,
    lineHeight: 17,
  },

  sectionLabel: {
    marginTop: 24,
    marginBottom: 9,
    color: '#929AA4',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  locationCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },

  locationCardReady: {
    borderColor: '#BBF7D0',
    backgroundColor: '#F7FCF9',
  },

  locationCardError: {
    borderColor: '#FECACA',
    backgroundColor: '#FFF8F8',
  },

  locationLoading: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },

  locationContent: {
    flex: 1,
  },

  locationTitle: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '900',
  },

  locationText: {
    marginTop: 4,
    color: '#7A838D',
    fontSize: 10,
    lineHeight: 15,
  },

  locationSuccessRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationSuccessIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderRadius: 14,
    backgroundColor: '#166534',
  },

  locationSuccessIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  locationSuccessTitle: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '900',
  },

  coordinatesCard: {
    marginTop: 13,
    padding: 12,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },

  coordinatesLabel: {
    color: '#9CA3AF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  coordinates: {
    marginTop: 5,
    color: '#4B5563',
    fontSize: 10,
    fontWeight: '700',
  },

  locationErrorTitle: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '900',
  },

  locationErrorText: {
    marginTop: 5,
    color: '#B91C1C',
    fontSize: 10,
    lineHeight: 15,
  },

  retryButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
  },

  retryButtonText: {
    color: '#991B1B',
    fontSize: 10,
    fontWeight: '900',
  },

  errorCard: {
    marginTop: 13,
    padding: 13,
    borderRadius: 14,
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

  sendSection: {
    marginTop: 23,
  },

  primaryButton: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#111827',
  },

  disabledButton: {
    opacity: 0.45,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  primaryButtonArrow: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 22,
  },

  sendingText: {
    marginLeft: 9,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  safetyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 11,
    paddingHorizontal: 7,
  },

  safetyDot: {
    width: 6,
    height: 6,
    marginTop: 4,
    marginRight: 7,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
  },

  safetyNote: {
    flex: 1,
    color: '#929AA4',
    fontSize: 9,
    lineHeight: 14,
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