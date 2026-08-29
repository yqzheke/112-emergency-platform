import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

type ResponderTab =
  | 'home'
  | 'assignments'
  | 'map'
  | 'history'
  | 'profile'

interface Props {
  active: ResponderTab
}

const items = [
  {
    key: 'home' as const,
    label: 'Home',
    icon: 'home-outline' as const,
    activeIcon: 'home' as const,
    route: '/responder',
  },
  {
    key: 'assignments' as const,
    label: 'Assignments',
    icon: 'clipboard-outline' as const,
    activeIcon: 'clipboard' as const,
    route: '/responder-assignments',
  },
  {
    key: 'map' as const,
    label: 'Map',
    icon: 'map-outline' as const,
    activeIcon: 'map' as const,
    route: '/responder-map',
  },
  {
    key: 'history' as const,
    label: 'History',
    icon: 'time-outline' as const,
    activeIcon: 'time' as const,
    route: '/responder-history',
  },
  {
    key: 'profile' as const,
    label: 'Profile',
    icon: 'person-outline' as const,
    activeIcon: 'person' as const,
    route: '/responder-profile',
  },
]

export default function ResponderBottomNav({
  active,
}: Props) {
  const router = useRouter()

  return (
    <View style={styles.wrapper}>
      <View style={styles.nav}>
        {items.map((item) => {
          const selected =
            active === item.key

          return (
            <Pressable
              key={item.key}
              style={({ pressed }) => [
                styles.item,
                pressed
                  ? styles.pressed
                  : null,
              ]}
              onPress={() => {
                if (!selected) {
                  router.replace(
                    item.route as never,
                  )
                }
              }}
            >
              <View
                style={[
                  styles.iconContainer,

                  selected
                    ? styles.iconContainerActive
                    : null,
                ]}
              >
                <Ionicons
                  name={
                    selected
                      ? item.activeIcon
                      : item.icon
                  }
                  size={20}
                  color={
                    selected
                      ? '#FFFFFF'
                      : '#8B949E'
                  }
                />
              </View>

              <Text
                style={[
                  styles.label,

                  selected
                    ? styles.labelActive
                    : null,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          )
        })}
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

  nav: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },

  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    width: 34,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },

  iconContainerActive: {
    backgroundColor: '#111827',
  },

  label: {
    marginTop: 4,
    color: '#8B949E',
    fontSize: 7,
    fontWeight: '800',
  },

  labelActive: {
    color: '#111827',
  },

  pressed: {
    opacity: 0.7,
  },
})