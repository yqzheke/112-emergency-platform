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

import { register } from '../services/authService'

export default function RegisterScreen() {
  const router = useRouter()

  const [fullName, setFullName] =
    useState('')

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

  const handleRegister = async () => {
    setError('')

    const trimmedName =
      fullName.trim()

    const trimmedEmail =
      email.trim()

    if (!trimmedName) {
      setError(
        'Full name is required',
      )
      return
    }

    if (!trimmedEmail) {
      setError('Email is required')
      return
    }

    if (
      !trimmedEmail.includes('@')
    ) {
      setError(
        'Enter a valid email',
      )
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
                Create your secure 112 account
              </Text>
            </View>
          </View>

          {/* INTRO */}

          <View style={styles.intro}>
            <Text style={styles.eyebrow}>
              CREATE ACCOUNT
            </Text>

            <Text style={styles.title}>
              Join 112
            </Text>

            <Text style={styles.subtitle}>
              Create your account to request
              emergency assistance, receive
              safety alerts, and track active
              responses.
            </Text>
          </View>

          {/* FORM */}

          <View style={styles.formCard}>
            <Text style={styles.label}>
              Full name
            </Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={19}
                color="#8A939D"
              />

              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={(value) => {
                  setFullName(value)
                  setError('')
                }}
                placeholder="Enter your full name"
                placeholderTextColor="#A0A7AF"
                autoCapitalize="words"
                editable={!loading}
              />
            </View>

            <Text style={styles.labelSpacing}>
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

            <Text style={styles.labelSpacing}>
              Password
            </Text>

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
                placeholder="Minimum 8 characters"
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

            <View style={styles.passwordHintRow}>
              <Ionicons
                name="information-circle-outline"
                size={14}
                color="#929AA4"
              />

              <Text style={styles.passwordHint}>
                Use at least 8 characters.
              </Text>
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
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <>
                  <ActivityIndicator
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.loadingButtonText
                    }
                  >
                    Creating account...
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={
                      styles.primaryButtonText
                    }
                  >
                    Create account
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

          {/* LOGIN */}

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <Pressable
              onPress={() =>
                router.replace('/login')
              }
            >
              <Text style={styles.loginLink}>
                Sign in
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
              Your account information is used
              to securely provide emergency
              response services.
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
    marginBottom: 34,
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

  labelSpacing: {
    marginTop: 16,
    marginBottom: 7,
    color: '#39444F',
    fontSize: 12,
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

  passwordHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  passwordHint: {
    marginLeft: 5,
    color: '#929AA4',
    fontSize: 9,
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

  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  loginText: {
    color: '#7A838D',
    fontSize: 12,
  },

  loginLink: {
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