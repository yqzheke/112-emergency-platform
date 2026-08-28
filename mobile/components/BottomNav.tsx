import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

type NavItem =
  | 'home'
  | 'alerts'
  | 'history'
  | 'profile'

interface BottomNavProps {
  active: NavItem
}

export default function BottomNav({
  active,
}: BottomNavProps) {
  const router = useRouter()

  const navigate = (
    item: NavItem,
  ) => {
    if (item === active) return

    switch (item) {
      case 'home':
        router.replace('/dashboard')
        break

      case 'alerts':
        router.replace('/alerts')
        break

      case 'history':
        router.replace('/history')
        break

      case 'profile':
        router.replace('/profile')
        break
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        <Pressable
          style={styles.item}
          onPress={() =>
            navigate('home')
          }
        >
          <Ionicons
            name={
              active === 'home'
                ? 'home'
                : 'home-outline'
            }
            size={21}
            color={
              active === 'home'
                ? '#111827'
                : '#98A0AA'
            }
          />

          <Text
            style={[
              styles.label,
              active === 'home' &&
                styles.activeLabel,
            ]}
          >
            Home
          </Text>
        </Pressable>

        <Pressable
          style={styles.item}
          onPress={() =>
            navigate('alerts')
          }
        >
          <Ionicons
            name={
              active === 'alerts'
                ? 'notifications'
                : 'notifications-outline'
            }
            size={21}
            color={
              active === 'alerts'
                ? '#111827'
                : '#98A0AA'
            }
          />

          <Text
            style={[
              styles.label,
              active === 'alerts' &&
                styles.activeLabel,
            ]}
          >
            Alerts
          </Text>
        </Pressable>

        <Pressable
          style={styles.item}
          onPress={() =>
            navigate('history')
          }
        >
          <Ionicons
            name={
              active === 'history'
                ? 'time'
                : 'time-outline'
            }
            size={21}
            color={
              active === 'history'
                ? '#111827'
                : '#98A0AA'
            }
          />

          <Text
            style={[
              styles.label,
              active === 'history' &&
                styles.activeLabel,
            ]}
          >
            History
          </Text>
        </Pressable>

        <Pressable
          style={styles.item}
          onPress={() =>
            navigate('profile')
          }
        >
          <Ionicons
            name={
              active === 'profile'
                ? 'person'
                : 'person-outline'
            }
            size={21}
            color={
              active === 'profile'
                ? '#111827'
                : '#98A0AA'
            }
          />

          <Text
            style={[
              styles.label,
              active === 'profile' &&
                styles.activeLabel,
            ]}
          >
            Profile
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 14,
    paddingTop: 8,
    backgroundColor: '#F5F6F8',
  },

  bar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },

  item: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    marginTop: 4,
    color: '#98A0AA',
    fontSize: 9,
    fontWeight: '700',
  },

  activeLabel: {
    color: '#111827',
    fontWeight: '900',
  },
})