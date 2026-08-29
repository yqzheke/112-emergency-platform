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

interface NavButtonProps {
  item: NavItem
  label: string
  active: NavItem
  icon:
    | 'home'
    | 'notifications'
    | 'time'
    | 'person'
  outlineIcon:
    | 'home-outline'
    | 'notifications-outline'
    | 'time-outline'
    | 'person-outline'
  onPress: () => void
}

function NavButton({
  item,
  label,
  active,
  icon,
  outlineIcon,
  onPress,
}: NavButtonProps) {
  const isActive =
    active === item

  return (
    <Pressable
      style={({ pressed }) => [
        styles.item,
        pressed &&
          !isActive &&
          styles.itemPressed,
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconContainer,

          isActive
            ? styles.activeIconContainer
            : null,
        ]}
      >
        <Ionicons
          name={
            isActive
              ? icon
              : outlineIcon
          }
          size={20}
          color={
            isActive
              ? '#FFFFFF'
              : '#98A0AA'
          }
        />
      </View>

      <Text
        style={[
          styles.label,

          isActive
            ? styles.activeLabel
            : null,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  )
}

export default function BottomNav({
  active,
}: BottomNavProps) {
  const router = useRouter()

  const navigate = (
    item: NavItem,
  ) => {
    if (item === active) {
      return
    }

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
        <NavButton
          item="home"
          label="Home"
          active={active}
          icon="home"
          outlineIcon="home-outline"
          onPress={() =>
            navigate('home')
          }
        />

        <NavButton
          item="alerts"
          label="Alerts"
          active={active}
          icon="notifications"
          outlineIcon="notifications-outline"
          onPress={() =>
            navigate('alerts')
          }
        />

        <NavButton
          item="history"
          label="History"
          active={active}
          icon="time"
          outlineIcon="time-outline"
          onPress={() =>
            navigate('history')
          }
        />

        <NavButton
          item="profile"
          label="Profile"
          active={active}
          icon="person"
          outlineIcon="person-outline"
          onPress={() =>
            navigate('profile')
          }
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#F5F6F8',
  },

  bar: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
  },

  item: {
    flex: 1,
    minHeight: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
  },

  itemPressed: {
    opacity: 0.55,
  },

  iconContainer: {
    width: 34,
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },

  activeIconContainer: {
    backgroundColor: '#111827',
  },

  label: {
    marginTop: 3,
    color: '#98A0AA',
    fontSize: 8,
    fontWeight: '700',
  },

  activeLabel: {
    color: '#111827',
    fontWeight: '900',
  },
})