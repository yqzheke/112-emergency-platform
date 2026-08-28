import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
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
  EmergencyRequestType,
  EmergencyType,
} from '../types/emergency'

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

  const params = useLocalSearchParams<{
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

  const [loadingLocation, setLoadingLocation] =
    useState(true)

  const [locationError, setLocationError] =
    useState('')

  const [serverError, setServerError] =
    useState('')

  const [sending, setSending] =
    useState(false)

  useEffect(() => {
    const detectLocation = async () => {
      try {
        setLoadingLocation(true)
        setLocationError('')

        const permission =
          await Location.requestForegroundPermissionsAsync()

        if (permission.status !== 'granted') {
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
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      } catch (error) {
        console.error(error)

        setLocationError(
          'We could not determine your location.',
        )
      } finally {
        setLoadingLocation(false)
      }
    }

    detectLocation()
  }, [])

  const handleConfirm = async () => {
    setServerError('')

    if (!type) {
      router.replace('/dashboard')
      return
    }

    if (!description) {
      router.replace({
        pathname: '/emergency',
        params: { type },
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
    type: type.toUpperCase() as EmergencyType,
    description,
    latitude: location.latitude,
    longitude: location.longitude,

    aiService:
      aiService || undefined,

    aiSummary:
      aiSummary || undefined,

    aiUrgency:
      aiUrgency || undefined,

    aiImportantDetails:
      aiImportantDetails || undefined,
  })

      router.replace({
        pathname: '/emergency-status',
        params: {
          id: String(emergency.id),
        },
      })
    } catch (error) {
      console.error(error)

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
        <View style={styles.container}>
          <Text style={styles.logo}>
            112
          </Text>

          <Text style={styles.title}>
            Invalid emergency
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              router.replace('/dashboard')
            }
          >
            <Text style={styles.primaryButtonText}>
              Back to dashboard
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backButton}>
              ←
            </Text>
          </Pressable>

          <Text style={styles.logo}>
            112
          </Text>
        </View>

        <Text style={styles.eyebrow}>
          FINAL STEP
        </Text>

        <Text style={styles.title}>
          Confirm emergency
        </Text>

        <Text style={styles.subtitle}>
          Review the information before sending
          your request.
        </Text>

        <View style={styles.card}>
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

          <Text style={styles.description}>
            {description}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.cardLabel}>
            LOCATION
          </Text>

          {loadingLocation ? (
            <View style={styles.locationRow}>
              <ActivityIndicator />

              <Text style={styles.locationText}>
                Detecting your location...
              </Text>
            </View>
          ) : location ? (
            <>
              <View style={styles.locationSuccess}>
                <Text style={styles.locationDot}>
                  ●
                </Text>

                <Text style={styles.locationSuccessText}>
                  Location detected
                </Text>
              </View>

              <Text style={styles.coordinates}>
                {location.latitude.toFixed(6)},{' '}
                {location.longitude.toFixed(6)}
              </Text>
            </>
          ) : (
            <Text style={styles.error}>
              {locationError}
            </Text>
          )}
        </View>

        {locationError && location ? (
          <Text style={styles.error}>
            {locationError}
          </Text>
        ) : null}

        {serverError ? (
          <Text style={styles.error}>
            {serverError}
          </Text>
        ) : null}

        <Pressable
          style={[
            styles.primaryButton,
            (!location || sending) &&
              styles.disabledButton,
          ]}
          onPress={handleConfirm}
          disabled={!location || sending}
        >
          {sending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>
              Send emergency request
            </Text>
          )}
        </Pressable>

        <Text style={styles.safetyNote}>
          Your location will be shared with the
          emergency response system.
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 50,
  },

  backButton: {
    fontSize: 30,
    color: '#26313C',
  },

  logo: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#969EA7',
  },

  title: {
    marginTop: 8,
    fontSize: 30,
    fontWeight: '800',
    color: '#18212B',
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    fontSize: 15,
    lineHeight: 21,
    color: '#7A838D',
  },

  card: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
  },

  cardLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: '#929AA4',
  },

  cardValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '800',
    color: '#202831',
  },

  description: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#3F4A55',
  },

  divider: {
    height: 1,
    marginVertical: 18,
    backgroundColor: '#E1E5E9',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  locationText: {
    marginLeft: 10,
    color: '#67717C',
  },

  locationSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  locationDot: {
    marginRight: 8,
    color: '#2E8B62',
    fontSize: 11,
  },

  locationSuccessText: {
    color: '#277355',
    fontSize: 14,
    fontWeight: '700',
  },

  coordinates: {
    marginTop: 6,
    fontSize: 11,
    color: '#8B949E',
  },

  error: {
    marginTop: 14,
    color: '#DC2626',
    fontSize: 12,
    lineHeight: 18,
  },

  primaryButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    borderRadius: 16,
    backgroundColor: '#111827',
  },

  disabledButton: {
    opacity: 0.45,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  safetyNote: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 15,
    color: '#929AA4',
  },
})