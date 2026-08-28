import BottomNav from '../components/BottomNav'
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'

import {
  clearAuth,
  getStoredUser,
} from '../lib/auth'

import type { User } from '../types/auth'

export default function ProfileScreen() {
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

  const handleLogout = async () => {
    await clearAuth()
    router.replace('/login')
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
              YOUR ACCOUNT
            </Text>

            <Text style={styles.title}>
              Profile
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

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullName
                .charAt(0)
                .toUpperCase() || 'U'}
            </Text>
          </View>

          <View style={styles.profileInformation}>
            <Text style={styles.name}>
              {user?.fullName ||
                'Loading...'}
            </Text>

            <Text style={styles.email}>
              {user?.email || ''}
            </Text>
          </View>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {user?.role || 'USER'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>
          SAFETY SETTINGS
        </Text>

        <View style={styles.settingCard}>
          <View>
            <Text style={styles.settingTitle}>
              Automatic GPS Sharing
            </Text>

            <Text style={styles.settingDescription}>
              Your location is shared when an
              emergency request is sent.
            </Text>
          </View>

          <View style={styles.enabledBadge}>
            <Text style={styles.enabledText}>
              Enabled
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.settingCard}
          onPress={() =>
            router.push('/contacts')
          }
        >
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>
              Emergency Contacts
            </Text>

            <Text style={styles.settingDescription}>
              Manage people connected to your
              emergency requests.
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </Pressable>

        <Text style={styles.sectionLabel}>
          SUPPORT
        </Text>

        <Pressable style={styles.settingCard}>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>
              Help & Support
            </Text>

            <Text style={styles.settingDescription}>
              Assistance and information about 112.
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </Pressable>

        <Text style={styles.sectionLabel}>
          ACCOUNT
        </Text>

        <Pressable
          style={styles.logoutCard}
          onPress={handleLogout}
        >
          <View>
            <Text style={styles.logoutTitle}>
              Logout
            </Text>

            <Text style={styles.logoutDescription}>
              Sign out from your account.
            </Text>
          </View>

          <Text style={styles.logoutArrow}>
            ›
          </Text>
        </Pressable>
            </ScrollView>

      <BottomNav active="profile" />
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
    paddingBottom: 25,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
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

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#111827',
  },

  avatar: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },

  avatarText: {
    color: '#111827',
    fontSize: 19,
    fontWeight: '900',
  },

  profileInformation: {
    flex: 1,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

  email: {
    marginTop: 4,
    color: '#C7CDD4',
    fontSize: 11,
  },

  roleBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#273244',
  },

  roleText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },

  sectionLabel: {
    marginTop: 27,
    marginBottom: 10,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#929AA4',
  },

  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 17,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },

  settingContent: {
    flex: 1,
    paddingRight: 15,
  },

  settingTitle: {
    color: '#29333D',
    fontSize: 14,
    fontWeight: '800',
  },

  settingDescription: {
    maxWidth: 250,
    marginTop: 4,
    color: '#8A939D',
    fontSize: 10,
    lineHeight: 15,
  },

  enabledBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#E2F5ED',
  },

  enabledText: {
    color: '#277355',
    fontSize: 9,
    fontWeight: '800',
  },

  arrow: {
    color: '#9AA2AA',
    fontSize: 27,
  },

  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 17,
    borderWidth: 1,
    borderColor: '#F1D5D2',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },

  logoutTitle: {
    color: '#B42318',
    fontSize: 14,
    fontWeight: '800',
  },

  logoutDescription: {
    marginTop: 4,
    color: '#9B8583',
    fontSize: 10,
  },

  logoutArrow: {
    color: '#C89A96',
    fontSize: 27,
  },
})