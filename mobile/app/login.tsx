import { useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'

import { saveAuth } from '../lib/auth'
import { login } from '../services/authService'

export default function LoginScreen() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] =
    useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] =
    useState(false)

  const handleLogin = async () => {
    setError('')

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setError('Email is required')
      return
    }

    if (!password) {
      setError('Password is required')
      return
    }

    try {
      setLoading(true)

      const result = await login(
        trimmedEmail,
        password,
      )

      if (
        result.user.role === 'OPERATOR' ||
        result.user.role === 'ADMIN'
      ) {
        setError(
          'Operator accounts use the web control center.',
        )
        return
      }

      await saveAuth(
        result.token,
        result.user,
      )

      if (
        result.user.role === 'RESPONDER'
      ) {
        router.replace('/responder')
        return
      }

      router.replace('/dashboard')
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Could not sign in',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <View style={styles.container}>
          <Text style={styles.logo}>
            112
          </Text>

          <Text style={styles.eyebrow}>
            EMERGENCY RESPONSE PLATFORM
          </Text>

          <Text style={styles.title}>
            Welcome back
          </Text>

          <Text style={styles.subtitle}>
            Sign in to access emergency
            assistance.
          </Text>

          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>
            Password
          </Text>

          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />

          {error ? (
            <Text style={styles.error}>
              {error}
            </Text>
          ) : null}

          <Pressable
            style={[
              styles.primaryButton,
              loading &&
                styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                style={styles.primaryButtonText}
              >
                Login
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() =>
              router.push('/register')
            }
          >
            <Text style={styles.link}>
              Don&apos;t have an account?{' '}
              <Text style={styles.linkStrong}>
                Register now
              </Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  logo: {
    fontSize: 54,
    fontWeight: '900',
    color: '#111827',
  },

  eyebrow: {
    marginTop: 16,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#9CA3AF',
  },

  title: {
    marginTop: 8,
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 30,
    fontSize: 15,
    lineHeight: 21,
    color: '#6B7280',
  },

  label: {
    marginBottom: 7,
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },

  input: {
    height: 52,
    marginBottom: 18,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 13,
    backgroundColor: '#F9FAFB',
    fontSize: 15,
    color: '#111827',
  },

  error: {
    marginBottom: 14,
    color: '#DC2626',
    fontSize: 13,
  },

  primaryButton: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#111827',
  },

  disabledButton: {
    opacity: 0.6,
  },

  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },

  link: {
    marginTop: 24,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
  },

  linkStrong: {
    color: '#111827',
    fontWeight: '800',
  },
})