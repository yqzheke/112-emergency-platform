import { useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native'
import { useRouter } from 'expo-router'

import { register } from '../services/authService'

export default function RegisterScreen() {
  const router = useRouter()

  const [fullName, setFullName] =
    useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] =
    useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] =
    useState(false)

  const handleRegister = async () => {
    setError('')

    const trimmedName = fullName.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName) {
      setError('Full name is required')
      return
    }

    if (!trimmedEmail) {
      setError('Email is required')
      return
    }

    if (!trimmedEmail.includes('@')) {
      setError('Enter a valid email')
      return
    }

    if (password.length < 8) {
      setError(
        'Password must contain at least 8 characters',
      )
      return
    }

    try {
      setLoading(true)

      await register(
        trimmedName,
        trimmedEmail,
        password,
      )

      router.replace('/login')
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Could not register',
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
        <ScrollView
          contentContainerStyle={
            styles.container
          }
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.logo}>
            112
          </Text>

          <Text style={styles.eyebrow}>
            CREATE YOUR ACCOUNT
          </Text>

          <Text style={styles.title}>
            Join 112
          </Text>

          <Text style={styles.subtitle}>
            Create an account to request
            emergency assistance.
          </Text>

          <Text style={styles.label}>
            Full name
          </Text>

          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            autoCapitalize="words"
          />

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
            placeholder="Create a password"
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
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                style={styles.primaryButtonText}
              >
                Register
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() =>
              router.replace('/login')
            }
          >
            <Text style={styles.link}>
              Already have an account?{' '}
              <Text style={styles.linkStrong}>
                Login
              </Text>
            </Text>
          </Pressable>
        </ScrollView>
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
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
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