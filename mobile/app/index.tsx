import { useEffect } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'

import {
  clearAuth,
  getStoredUser,
  getToken,
  isTokenExpired,
} from '../lib/auth'

export default function IndexScreen() {
  const router = useRouter()

  useEffect(() => {
    const openApp = async () => {
      try {
        const token = await getToken()
        const user = await getStoredUser()

        if (
          !token ||
          !user ||
          isTokenExpired(token)
        ) {
          await clearAuth()
          router.replace('/login')
          return
        }

        if (
          user.role === 'OPERATOR' ||
          user.role === 'ADMIN'
        ) {
          await clearAuth()
          router.replace('/login')
          return
        }

        if (user.role === 'RESPONDER') {
          router.replace('/responder')
          return
        }

        router.replace('/dashboard')
      } catch (error) {
        console.error(
          'Startup authentication error:',
          error,
        )

        await clearAuth()
        router.replace('/login')
      }
    }

    openApp()
  }, [router])

  return (
    <View style={styles.screen}>
      <ActivityIndicator
        size="large"
        color="#111827"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
})