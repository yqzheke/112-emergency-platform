import {
  useEffect,
  useState,
} from 'react'

import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { useRouter } from 'expo-router'

import BottomNav from '../components/BottomNav'

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

  const handleLogout = () => {
    Alert.alert(
      'Log out?',
      'You will need to sign in again to access your account.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: async () => {
            await clearAuth()
            router.replace('/login')
          },
        },
      ],
    )
  }

  const firstLetter =
    user?.fullName
      ?.trim()
      .charAt(0)
      .toUpperCase() || 'U'

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
            <Text style={styles.logo}>
              112
            </Text>

            <Text style={styles.eyebrow}>
              YOUR ACCOUNT
            </Text>

            <Text style={styles.title}>
              Profile
            </Text>

            <Text style={styles.subtitle}>
              Manage your emergency profile
              and safety preferences.
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed &&
                styles.buttonPressed,
            ]}
            onPress={() =>
              router.replace('/dashboard')
            }
          >
            <Text
              style={styles.backText}
            >
              ←
            </Text>
          </Pressable>
        </View>

        {/* PROFILE CARD */}

        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Text
                style={styles.avatarText}
              >
                {firstLetter}
              </Text>
            </View>

            <View
              style={
                styles.profileInformation
              }
            >
              <Text style={styles.name}>
                {user?.fullName ||
                  'Loading...'}
              </Text>

              <Text style={styles.email}>
                {user?.email || ''}
              </Text>
            </View>

            <View style={styles.roleBadge}>
              <Text
                style={styles.roleText}
              >
                {user?.role || 'USER'}
              </Text>
            </View>
          </View>

          <View style={styles.profileDivider} />

          <View style={styles.accountStatusRow}>
            <View style={styles.accountStatusLeft}>
              <View
                style={styles.accountStatusDot}
              />

              <Text
                style={styles.accountStatusText}
              >
                Account ready for emergency use
              </Text>
            </View>

            <Text style={styles.accountStatusLabel}>
              ACTIVE
            </Text>
          </View>
        </View>

        {/* SAFETY */}

        <Text style={styles.sectionLabel}>
          SAFETY SETTINGS
        </Text>

        <View style={styles.settingCard}>
          <View style={styles.settingIcon}>
            <Text style={styles.settingIconText}>
              GPS
            </Text>
          </View>

          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>
              Automatic GPS Sharing
            </Text>

            <Text
              style={
                styles.settingDescription
              }
            >
              Your location is shared when
              you submit an emergency
              request.
            </Text>
          </View>

          <View style={styles.enabledBadge}>
            <View style={styles.enabledDot} />

            <Text style={styles.enabledText}>
              Enabled
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.settingCard,
            pressed &&
              styles.cardPressed,
          ]}
          onPress={() =>
            router.push('/contacts')
          }
        >
          <View style={styles.settingIcon}>
            <Text
              style={styles.settingIconText}
            >
              +
            </Text>
          </View>

          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>
              Emergency Contacts
            </Text>

            <Text
              style={
                styles.settingDescription
              }
            >
              Manage trusted people linked
              to your emergency requests.
            </Text>
          </View>

          <View style={styles.arrowCircle}>
            <Text style={styles.arrow}>
              ›
            </Text>
          </View>
        </Pressable>

        {/* SUPPORT */}

        <Text style={styles.sectionLabel}>
          SUPPORT
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.settingCard,
            pressed &&
              styles.cardPressed,
          ]}
        >
          <View style={styles.settingIcon}>
            <Text
              style={styles.settingIconText}
            >
              ?
            </Text>
          </View>

          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>
              Help & Support
            </Text>

            <Text
              style={
                styles.settingDescription
              }
            >
              Information about using the
              112 emergency platform.
            </Text>
          </View>

          <View style={styles.arrowCircle}>
            <Text style={styles.arrow}>
              ›
            </Text>
          </View>
        </Pressable>

        {/* ACCOUNT */}

        <Text style={styles.sectionLabel}>
          ACCOUNT
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.logoutCard,
            pressed &&
              styles.logoutPressed,
          ]}
          onPress={handleLogout}
        >
          <View style={styles.logoutContent}>
            <Text style={styles.logoutTitle}>
              Logout
            </Text>

            <Text
              style={
                styles.logoutDescription
              }
            >
              Sign out from this device.
            </Text>
          </View>

          <Text
            style={styles.logoutArrow}
          >
            ›
          </Text>
        </Pressable>

        <View style={styles.footerInfo}>
          <View style={styles.footerDot} />

          <Text style={styles.footerText}>
            Keep your account information and
            emergency contacts up to date.
          </Text>
        </View>
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
    paddingBottom: 28,
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

  profileCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#111827',
  },

  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingRight: 10,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  email: {
    marginTop: 4,
    color: '#C7CDD4',
    fontSize: 10,
  },

  roleBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 11,
    backgroundColor: '#273244',
  },

  roleText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  profileDivider: {
    height: 1,
    marginVertical: 16,
    backgroundColor: '#303A49',
  },

  accountStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  accountStatusLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },

  accountStatusDot: {
    width: 7,
    height: 7,
    marginRight: 7,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },

  accountStatusText: {
    flex: 1,
    color: '#C7CDD4',
    fontSize: 9,
  },

  accountStatusLabel: {
    color: '#A7F3D0',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  sectionLabel: {
    marginTop: 27,
    marginBottom: 10,
    color: '#929AA4',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E7EAEE',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },

  settingIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderRadius: 14,
    backgroundColor: '#EEF2F6',
  },

  settingIconText: {
    color: '#111827',
    fontSize: 11,
    fontWeight: '900',
  },

  settingContent: {
    flex: 1,
    paddingRight: 10,
  },

  settingTitle: {
    color: '#29333D',
    fontSize: 13,
    fontWeight: '900',
  },

  settingDescription: {
    marginTop: 4,
    color: '#8A939D',
    fontSize: 9,
    lineHeight: 14,
  },

  enabledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 11,
    backgroundColor: '#E2F5ED',
  },

  enabledDot: {
    width: 6,
    height: 6,
    marginRight: 5,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },

  enabledText: {
    color: '#277355',
    fontSize: 8,
    fontWeight: '900',
  },

  arrowCircle: {
    width: 31,
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },

  arrow: {
    marginTop: -2,
    color: '#7A838D',
    fontSize: 22,
  },

  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1D5D2',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },

  logoutContent: {
    flex: 1,
  },

  logoutTitle: {
    color: '#B42318',
    fontSize: 13,
    fontWeight: '900',
  },

  logoutDescription: {
    marginTop: 4,
    color: '#9B8583',
    fontSize: 9,
  },

  logoutArrow: {
    color: '#C89A96',
    fontSize: 25,
  },

  footerInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 14,
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

  footerText: {
    flex: 1,
    color: '#929AA4',
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

  cardPressed: {
    opacity: 0.82,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  logoutPressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },
})