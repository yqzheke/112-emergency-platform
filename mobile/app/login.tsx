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
  View,
} from 'react-native'

import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { saveAuth } from '../lib/auth'
import { login } from '../services/authService'

export default function LoginScreen() {
  const router = useRouter()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [error, setError] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const handleLogin = async () => {
    setError('')

    const trimmedEmail =
      email.trim()

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
        <ScrollView
          contentContainerStyle={
            styles.container
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          {/* BRAND */}

          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>
                112
              </Text>
            </View>

            <View style={styles.brandText}>
              <Text style={styles.brandTitle}>
                Emergency Response
              </Text>

              <Text style={styles.brandSubtitle}>
                Secure access to 112 services
              </Text>
            </View>
          </View>

          {/* INTRO */}

          <View style={styles.intro}>
            <Text style={styles.eyebrow}>
              WELCOME BACK
            </Text>

            <Text style={styles.title}>
              Sign in to your account
            </Text>

            <Text style={styles.subtitle}>
              Access emergency assistance,
              safety alerts, request history,
              and responder tracking.
            </Text>
          </View>

          {/* FORM */}

          <View style={styles.formCard}>
            <Text style={styles.label}>
              Email
            </Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={19}
                color="#8A939D"
              />

              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(value) => {
                  setEmail(value)
                  setError('')
                }}
                placeholder="name@example.com"
                placeholderTextColor="#A0A7AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View style={styles.passwordHeader}>
              <Text style={styles.label}>
                Password
              </Text>

              <Pressable
                onPress={() =>
                  router.push(
                    '/forgot-password',
                  )
                }
              >
                <Text
                  style={styles.forgotText}
                >
                  Forgot password?
                </Text>
              </Pressable>
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={19}
                color="#8A939D"
              />

              <TextInput
                style={styles.input}
                value={password}
                onChangeText={(value) => {
                  setPassword(value)
                  setError('')
                }}
                placeholder="Enter password"
                placeholderTextColor="#A0A7AF"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!loading}
              />

              <Pressable
                style={styles.eyeButton}
                onPress={() =>
                  setShowPassword(
                    (current) => !current,
                  )
                }
              >
                <Ionicons
                  name={
                    showPassword
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={20}
                  color="#8A939D"
                />
              </Pressable>
            </View>

            {error ? (
              <View style={styles.errorCard}>
                <Ionicons
                  name="alert-circle-outline"
                  size={17}
                  color="#B42318"
                />

                <Text style={styles.errorText}>
                  {error}
                </Text>
              </View>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,

                loading
                  ? styles.disabledButton
                  : null,

                pressed &&
                !loading
                  ? styles.buttonPressed
                  : null,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <ActivityIndicator
                    color="#FFFFFF"
                  />

                  <Text
                    style={styles.loadingButtonText}
                  >
                    Signing in...
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={styles.primaryButtonText}
                  >
                    Sign in
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={17}
                    color="#FFFFFF"
                  />
                </>
              )}
            </Pressable>
          </View>

          {/* REGISTER */}

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>
              New to 112?
            </Text>

            <Pressable
              onPress={() =>
                router.push('/register')
              }
            >
              <Text
                style={styles.registerLink}
              >
                Create account
              </Text>
            </Pressable>
          </View>

          {/* FOOTER */}

          <View style={styles.footer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={14}
              color="#8B949E"
            />

            <Text style={styles.footerText}>
              Your account is used to securely
              access emergency services and
              request information.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 34,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 38,
  },

  logoBadge: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
    borderRadius: 18,
    backgroundColor: '#111827',
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  brandText: {
    flex: 1,
  },

  brandTitle: {
    color: '#202831',
    fontSize: 14,
    fontWeight: '900',
  },

  brandSubtitle: {
    marginTop: 3,
    color: '#929AA4',
    fontSize: 9,
  },

  intro: {
    marginBottom: 24,
  },

  eyebrow: {
    color: '#929AA4',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  title: {
    marginTop: 7,
    color: '#18212B',
    fontSize: 30,
    fontWeight: '900',
  },

  subtitle: {
    marginTop: 8,
    maxWidth: 330,
    color: '#7A838D',
    fontSize: 12,
    lineHeight: 18,
  },

  formCard: {
    padding: 18,
    borderWidth: 1,
    borderColor: '#E6E9ED',
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },

  label: {
    marginBottom: 7,
    color: '#39444F',
    fontSize: 12,
    fontWeight: '800',
  },

  passwordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  forgotText: {
    marginBottom: 7,
    color: '#111827',
    fontSize: 10,
    fontWeight: '800',
  },

  inputWrapper: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 14,
    backgroundColor: '#F8F9FA',
  },

  input: {
    flex: 1,
    height: 52,
    marginLeft: 10,
    color: '#18212B',
    fontSize: 14,
  },

  eyeButton: {
    paddingLeft: 10,
    paddingVertical: 10,
  },

  errorCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 13,
    padding: 11,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
  },

  errorText: {
    flex: 1,
    marginLeft: 7,
    color: '#B42318',
    fontSize: 10,
    lineHeight: 15,
  },

  primaryButton: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
    borderRadius: 15,
    backgroundColor: '#111827',
  },

  disabledButton: {
    opacity: 0.55,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  loadingButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  registerText: {
    color: '#7A838D',
    fontSize: 12,
  },

  registerLink: {
    marginLeft: 5,
    color: '#111827',
    fontSize: 12,
    fontWeight: '900',
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 28,
    paddingHorizontal: 10,
  },

  footerText: {
    flex: 1,
    marginLeft: 7,
    color: '#929AA4',
    fontSize: 8,
    lineHeight: 13,
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },
})