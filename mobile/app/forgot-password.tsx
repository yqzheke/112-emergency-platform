import { useState } from 'react'

import {
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
import { useTranslation } from 'react-i18next'

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const { t } = useTranslation()

  const [email, setEmail] =
    useState('')

  const [message, setMessage] =
    useState('')

  const handleContinue = () => {
    const trimmedEmail =
      email.trim()

    if (!trimmedEmail) {
      setMessage(
        t('enterEmailAddress'),
      )

      return
    }

    if (!trimmedEmail.includes('@')) {
      setMessage(
        t('invalidEmail'),
      )

      return
    }

    setMessage(
      t(
        'passwordRecoveryUnavailable',
      ),
    )
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
          {/* HEADER */}

          <View style={styles.topRow}>
            <Pressable
              style={({ pressed }) => [
                styles.backButton,

                pressed
                  ? styles.buttonPressed
                  : null,
              ]}
              onPress={() =>
                router.back()
              }
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color="#111827"
              />
            </Pressable>

            <View
              style={styles.logoBadge}
            >
              <Text
                style={styles.logoText}
              >
                ResQ
              </Text>
            </View>
          </View>

          {/* INTRO */}

          <Text style={styles.eyebrow}>
            {t('accountRecovery')}
          </Text>

          <Text style={styles.title}>
            {t('forgotPasswordTitle')}
          </Text>

          <Text style={styles.subtitle}>
            {t(
              'forgotPasswordEmailDescription',
            )}
          </Text>

          {/* FORM */}

          <View style={styles.formCard}>
            <Text style={styles.label}>
              {t('email')}
            </Text>

            <View
              style={styles.inputWrapper}
            >
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
                  setMessage('')
                }}
                placeholder="name@example.com"
                placeholderTextColor="#A0A7AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {message ? (
              <View
                style={
                  styles.messageCard
                }
              >
                <Ionicons
                  name="information-circle-outline"
                  size={17}
                  color="#59636D"
                />

                <Text
                  style={
                    styles.messageText
                  }
                >
                  {message}
                </Text>
              </View>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,

                pressed
                  ? styles.buttonPressed
                  : null,
              ]}
              onPress={handleContinue}
            >
              <Text
                style={
                  styles.primaryButtonText
                }
              >
                {t('continue')}
              </Text>

              <Ionicons
                name="arrow-forward"
                size={17}
                color="#FFFFFF"
              />
            </Pressable>
          </View>

          {/* BACK TO LOGIN */}

          <View style={styles.loginRow}>
            <Text
              style={styles.loginText}
            >
              {t('rememberPassword')}
            </Text>

            <Pressable
              onPress={() =>
                router.replace('/login')
              }
            >
              <Text
                style={styles.loginLink}
              >
                {t('signIn')}
              </Text>
            </Pressable>
          </View>

          {/* INFO */}

          <View style={styles.footer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={14}
              color="#8B949E"
            />

            <Text
              style={styles.footerText}
            >
              {t(
                'passwordRecoveryPlaceholderNotice',
              )}
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

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    marginBottom: 45,
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

  logoBadge: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: '#111827',
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
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
    marginBottom: 24,
    maxWidth: 320,
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

  messageCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 13,
    padding: 11,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },

  messageText: {
    flex: 1,
    marginLeft: 7,
    color: '#59636D',
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

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
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
    opacity: 0.86,

    transform: [
      {
        scale: 0.99,
      },
    ],
  },
})