import {
  useEffect,
  useState,
} from 'react'

import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { getStoredUser } from '../lib/auth'
import BottomNav from '../components/BottomNav'

import type { User } from '../types/auth'

type EmergencyRequestType =
  | 'medical'
  | 'police'
  | 'fire'

export default function DashboardScreen() {
  const router = useRouter()

  const [user, setUser] =
    useState<User | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      const storedUser =
        await getStoredUser()

      if (!storedUser) {
        router.replace('/login')
        return
      }

      setUser(storedUser)
    }

    loadUser()
  }, [router])

  const openEmergency = (
    type: EmergencyRequestType,
  ) => {
    router.push({
      pathname: '/emergency',
      params: {
        type,
      },
    })
  }

  const firstName =
    user?.fullName
      ?.trim()
      .split(' ')[0] || 'User'

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
          <View style={styles.headerText}>
            <Text style={styles.greeting}>
              Hey {firstName},
            </Text>

            <Text
              style={styles.greetingSub}
            >
              How can 112 help you today?
            </Text>
          </View>

          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>
              112
            </Text>
          </View>
        </View>

        {/* HERO */}

        <Text style={styles.sectionLabel}>
          EMERGENCY ASSISTANCE
        </Text>

        <View style={styles.heroCard}>
          <View
            style={styles.heroStatusRow}
          >
            <View
              style={styles.heroStatusDot}
            />

            <Text
              style={styles.heroStatusText}
            >
              112 READY
            </Text>
          </View>

          <Text style={styles.heroTitle}>
            Need emergency help?
          </Text>

          <Text
            style={styles.heroDescription}
          >
            Choose the emergency service
            you need and share your
            location with the response
            system.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.heroButton,

              pressed
                ? styles.buttonPressed
                : null,
            ]}
            onPress={() =>
              openEmergency('medical')
            }
          >
            <Text
              style={styles.heroButtonText}
            >
              Start emergency request
            </Text>

            <Ionicons
              name="arrow-forward"
              size={16}
              color="#111827"
              style={styles.heroButtonIcon}
            />
          </Pressable>
        </View>

        {/* SERVICES */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>
            ONE-TAP SERVICES
          </Text>

          <Text
            style={
              styles.sectionDescription
            }
          >
            Select the emergency service
            you need.
          </Text>
        </View>

        {/* MEDICAL */}

        <Pressable
          style={({ pressed }) => [
            styles.emergencyCard,

            pressed
              ? styles.cardPressed
              : null,
          ]}
          onPress={() =>
            openEmergency('medical')
          }
        >
          <View
            style={[
              styles.serviceAccent,
              styles.medicalAccent,
            ]}
          />

          <View style={styles.cardContent}>
            <View
              style={[
                styles.serviceIcon,
                styles.medicalIcon,
              ]}
            >
              <Ionicons
                name="medical"
                size={24}
                color="#DC2626"
              />
            </View>

            <View
              style={styles.cardTextContent}
            >
              <Text style={styles.cardTitle}>
                Medical
              </Text>

              <Text
                style={styles.cardSubtitle}
              >
                Ambulance and medical
                assistance
              </Text>
            </View>
          </View>

          <View style={styles.arrowCircle}>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="#6B7280"
            />
          </View>
        </Pressable>

        {/* POLICE */}

        <Pressable
          style={({ pressed }) => [
            styles.emergencyCard,

            pressed
              ? styles.cardPressed
              : null,
          ]}
          onPress={() =>
            openEmergency('police')
          }
        >
          <View
            style={[
              styles.serviceAccent,
              styles.policeAccent,
            ]}
          />

          <View style={styles.cardContent}>
            <View
              style={[
                styles.serviceIcon,
                styles.policeIcon,
              ]}
            >
              <Ionicons
                name="shield-checkmark"
                size={24}
                color="#2563EB"
              />
            </View>

            <View
              style={styles.cardTextContent}
            >
              <Text style={styles.cardTitle}>
                Police
              </Text>

              <Text
                style={styles.cardSubtitle}
              >
                Police and security
                assistance
              </Text>
            </View>
          </View>

          <View style={styles.arrowCircle}>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="#6B7280"
            />
          </View>
        </Pressable>

        {/* FIRE */}

        <Pressable
          style={({ pressed }) => [
            styles.emergencyCard,

            pressed
              ? styles.cardPressed
              : null,
          ]}
          onPress={() =>
            openEmergency('fire')
          }
        >
          <View
            style={[
              styles.serviceAccent,
              styles.fireAccent,
            ]}
          />

          <View style={styles.cardContent}>
            <View
              style={[
                styles.serviceIcon,
                styles.fireIcon,
              ]}
            >
              <Ionicons
                name="flame"
                size={24}
                color="#EA580C"
              />
            </View>

            <View
              style={styles.cardTextContent}
            >
              <Text style={styles.cardTitle}>
                Fire & Rescue
              </Text>

              <Text
                style={styles.cardSubtitle}
              >
                Fire and rescue assistance
              </Text>
            </View>
          </View>

          <View style={styles.arrowCircle}>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="#6B7280"
            />
          </View>
        </Pressable>

        {/* MORE */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>
            MORE
          </Text>

          <Text
            style={
              styles.sectionDescription
            }
          >
            Manage your emergency setup.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryCard,

            pressed
              ? styles.cardPressed
              : null,
          ]}
          onPress={() =>
            router.push('/contacts')
          }
        >
          <View style={styles.secondaryIcon}>
            <Ionicons
              name="people-outline"
              size={21}
              color="#111827"
            />
          </View>

          <View
            style={styles.secondaryContent}
          >
            <Text
              style={styles.secondaryTitle}
            >
              Emergency Contacts
            </Text>

            <Text
              style={
                styles.secondarySubtitle
              }
            >
              Manage people linked to your
              emergency profile.
            </Text>
          </View>

          <View
            style={
              styles.secondaryArrowCircle
            }
          >
            <Ionicons
              name="chevron-forward"
              size={17}
              color="#7A838D"
            />
          </View>
        </Pressable>

        {/* LOCATION */}

        <View style={styles.footerCard}>
          <Ionicons
            name="location-outline"
            size={15}
            color="#8B949E"
          />

          <Text style={styles.footerText}>
            Your location is shared when you
            submit an emergency request so
            responders can locate you.
          </Text>
        </View>
      </ScrollView>

      <BottomNav active="home" />
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
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    marginBottom: 28,
  },

  headerText: {
    flex: 1,
    paddingRight: 16,
  },

  greeting: {
    color: '#17202A',
    fontSize: 27,
    fontWeight: '900',
  },

  greetingSub: {
    marginTop: 4,
    color: '#7B8490',
    fontSize: 14,
    lineHeight: 20,
  },

  logoBadge: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: '#111827',
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  sectionHeader: {
    marginTop: 8,
    marginBottom: 10,
  },

  sectionLabel: {
    marginBottom: 8,
    color: '#929AA4',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  sectionDescription: {
    marginTop: -3,
    color: '#9AA2AA',
    fontSize: 10,
  },

  heroCard: {
    marginBottom: 24,
    padding: 22,
    borderRadius: 24,
    backgroundColor: '#111827',
  },

  heroStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },

  heroStatusDot: {
    width: 7,
    height: 7,
    marginRight: 7,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },

  heroStatusText: {
    color: '#AEB6C1',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  heroTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
  },

  heroDescription: {
    marginTop: 8,
    maxWidth: 310,
    color: '#C7CDD6',
    fontSize: 13,
    lineHeight: 20,
  },

  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 19,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },

  heroButtonText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '900',
  },

  heroButtonIcon: {
    marginLeft: 9,
  },

  emergencyCard: {
    position: 'relative',
    minHeight: 96,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    overflow: 'hidden',
    marginBottom: 10,
    paddingVertical: 15,
    paddingLeft: 18,
    paddingRight: 15,
    borderWidth: 1,
    borderColor: '#E6E9ED',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },

  serviceAccent: {
    position: 'absolute',
    left: 0,
    top: 18,
    bottom: 18,
    width: 4,
    borderRadius: 4,
  },

  medicalAccent: {
    backgroundColor: '#DC2626',
  },

  policeAccent: {
    backgroundColor: '#2563EB',
  },

  fireAccent: {
    backgroundColor: '#EA580C',
  },

  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  serviceIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderRadius: 15,
  },

  medicalIcon: {
    backgroundColor: '#FEF2F2',
  },

  policeIcon: {
    backgroundColor: '#EFF6FF',
  },

  fireIcon: {
    backgroundColor: '#FFF7ED',
  },

  cardTextContent: {
    flex: 1,
    paddingRight: 8,
  },

  cardTitle: {
    color: '#1F2933',
    fontSize: 17,
    fontWeight: '900',
  },

  cardSubtitle: {
    marginTop: 4,
    color: '#727C87',
    fontSize: 11,
    lineHeight: 16,
  },

  arrowCircle: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: '#F4F5F7',
  },

  secondaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },

  secondaryIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderRadius: 14,
    backgroundColor: '#EEF2F6',
  },

  secondaryContent: {
    flex: 1,
    paddingRight: 10,
  },

  secondaryTitle: {
    color: '#26313C',
    fontSize: 14,
    fontWeight: '900',
  },

  secondarySubtitle: {
    marginTop: 3,
    color: '#8A939D',
    fontSize: 10,
    lineHeight: 15,
  },

  secondaryArrowCircle: {
    width: 31,
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#F4F5F7',
  },

  footerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 14,
    paddingHorizontal: 4,
  },

  footerText: {
    flex: 1,
    marginLeft: 7,
    color: '#929AA4',
    fontSize: 9,
    lineHeight: 14,
  },

  buttonPressed: {
    opacity: 0.88,

    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  cardPressed: {
    opacity: 0.72,

    transform: [
      {
        scale: 0.99,
      },
    ],
  },
})