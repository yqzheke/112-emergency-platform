import { useEffect, useState } from 'react'
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'

import { getStoredUser } from '../lib/auth'

import type { User } from '../types/auth'
import type { EmergencyRequestType } from '../types/emergency'
import BottomNav from '../components/BottomNav'

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
      params: { type },
    })
  }

  const firstName =
    user?.fullName.split(' ')[0] || 'User'

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hey {firstName},
            </Text>

            <Text style={styles.greetingSub}>
              We&apos;re here for you.
            </Text>
          </View>

          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>
              112
            </Text>
          </View>
        </View>

        {/* EMERGENCY ASSISTANCE */}

        <Text style={styles.sectionLabel}>
          EMERGENCY ASSISTANCE
        </Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>
            Need emergency help?
          </Text>

          <Text style={styles.heroDescription}>
            Choose the service you need and
            we&apos;ll guide you through the request.
          </Text>

          <Pressable
            style={styles.heroButton}
            onPress={() =>
              openEmergency('medical')
            }
          >
            <Text style={styles.heroButtonText}>
              Start emergency request
            </Text>
          </Pressable>
        </View>

        {/* ONE-TAP SERVICES */}

        <Text style={styles.sectionLabel}>
          ONE-TAP SERVICES
        </Text>

        <Pressable
          style={[
            styles.emergencyCard,
            styles.medicalCard,
          ]}
          onPress={() =>
            openEmergency('medical')
          }
        >
          <View>
            <Text style={styles.cardIcon}>
              ✚
            </Text>

            <Text style={styles.cardTitle}>
              Medical
            </Text>

            <Text style={styles.cardSubtitle}>
              Ambulance assistance
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.emergencyCard,
            styles.policeCard,
          ]}
          onPress={() =>
            openEmergency('police')
          }
        >
          <View>
            <Text style={styles.cardIcon}>
              ◈
            </Text>

            <Text style={styles.cardTitle}>
              Police
            </Text>

            <Text style={styles.cardSubtitle}>
              Police assistance
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.emergencyCard,
            styles.fireCard,
          ]}
          onPress={() =>
            openEmergency('fire')
          }
        >
          <View>
            <Text style={styles.cardIcon}>
              △
            </Text>

            <Text style={styles.cardTitle}>
              Fire & Rescue
            </Text>

            <Text style={styles.cardSubtitle}>
              Fire and rescue assistance
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </Pressable>

        {/* MORE */}

        <Text style={styles.sectionLabel}>
          MORE
        </Text>

        <Pressable
          style={[
            styles.secondaryCard,
            styles.secondaryCardSpacing,
          ]}
          onPress={() =>
            router.push('/contacts')
          }
        >
          <View style={styles.secondaryContent}>
            <Text style={styles.secondaryTitle}>
              Emergency Contacts
            </Text>

            <Text
              style={styles.secondarySubtitle}
            >
              Manage your emergency contact list
            </Text>
          </View>

          <Text style={styles.secondaryArrow}>
            ›
          </Text>
        </Pressable>

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
    paddingTop: 20,
    paddingBottom: 25,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  greeting: {
    fontSize: 27,
    fontWeight: '800',
    color: '#17202A',
  },

  greetingSub: {
    marginTop: 3,
    fontSize: 15,
    color: '#7B8490',
  },

  logoBadge: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#111827',
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  sectionLabel: {
    marginTop: 8,
    marginBottom: 10,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#929AA4',
  },

  heroCard: {
    padding: 22,
    marginBottom: 22,
    borderRadius: 24,
    backgroundColor: '#111827',
  },

  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },

  heroDescription: {
    marginTop: 8,
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
  },

  heroButton: {
    alignSelf: 'flex-start',
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },

  heroButtonText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '800',
  },

  emergencyCard: {
    minHeight: 130,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    padding: 20,
    borderRadius: 22,
  },

  medicalCard: {
    backgroundColor: '#E7E9FF',
  },

  policeCard: {
    backgroundColor: '#FFE9DF',
  },

  fireCard: {
    backgroundColor: '#E2F5ED',
  },

  cardIcon: {
    marginBottom: 15,
    fontSize: 25,
    fontWeight: '800',
    color: '#25303B',
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1F2933',
  },

  cardSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#727C87',
  },

  arrow: {
    fontSize: 34,
    color: '#727C87',
  },

  secondaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
  },

  secondaryCardSpacing: {
    marginBottom: 10,
  },

  secondaryContent: {
    flex: 1,
    paddingRight: 15,
  },

  secondaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#26313C',
  },

  secondarySubtitle: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 16,
    color: '#8A939D',
  },

  secondaryArrow: {
    fontSize: 27,
    color: '#9AA2AA',
  },
})