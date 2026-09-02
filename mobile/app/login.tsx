import {
  useEffect,
  useState,
} from 'react'

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

import {
  useRouter,
} from 'expo-router'

import {
  Ionicons,
} from '@expo/vector-icons'

import {
  useTranslation,
} from 'react-i18next'

import {
  changeAppLanguage,
  loadStoredLanguage,
  type AppLanguage,
} from '../i18n'

import {
  saveAuth,
} from '../lib/auth'

import {
  login,
} from '../services/authService'

const languages: {
  code: AppLanguage
  label: string
}[] = [
  {
    code: 'kk',
    label: 'ҚАЗ',
  },
  {
    code: 'ru',
    label: 'РУС',
  },
  {
    code: 'en',
    label: 'ENG',
  },
]

export default function LoginScreen() {
  const router = useRouter()

  const {
    t,
    i18n,
  } = useTranslation()

  const [
    email,
    setEmail,
  ] = useState('')

  const [
    password,
    setPassword,
  ] = useState('')

  const [
    showPassword,
    setShowPassword,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const [
    loading,
    setLoading,
  ] = useState(false)

  const [
    languageLoading,
    setLanguageLoading,
  ] = useState(true)

  useEffect(() => {
    const loadLanguage = async () => {
      await loadStoredLanguage()

      setLanguageLoading(false)
    }

    loadLanguage()
  }, [])

  const handleLanguageChange =
    async (
      language: AppLanguage,
    ) => {
      await changeAppLanguage(
        language,
      )
    }

  const handleLogin = async () => {
    setError('')

    const trimmedEmail =
      email.trim()

    if (!trimmedEmail) {
      setError(
        t('emailRequired'),
      )

      return
    }

    if (!password) {
      setError(
        t('passwordRequired'),
      )

      return
    }

    try {
      setLoading(true)

      const result =
        await login(
          trimmedEmail,
          password,
        )

      if (
        result.user.role ===
          'OPERATOR' ||
        result.user.role ===
          'ADMIN'
      ) {
        setError(
          t('operatorWebOnly'),
        )

        return
      }

      await saveAuth(
        result.token,
        result.user,
      )

      if (
        result.user.role ===
        'RESPONDER'
      ) {
        router.replace(
          '/responder',
        )

        return
      }

      router.replace(
        '/dashboard',
      )
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : t(
              'couldNotSignIn',
            ),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView
      style={styles.screen}
    >
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
          {/* LANGUAGE */}

          <View
            style={
              styles.languageRow
            }
          >
            <View
              style={
                styles.languageSelector
              }
            >
              {languageLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#111827"
                />
              ) : (
                languages.map(
                  (language) => {
                    const active =
                      i18n.language ===
                      language.code

                    return (
                      <Pressable
                        key={
                          language.code
                        }
                        style={({
                          pressed,
                        }) => [
                          styles.languageButton,

                          active
                            ? styles.languageButtonActive
                            : null,

                          pressed
                            ? styles.languagePressed
                            : null,
                        ]}
                        onPress={() =>
                          handleLanguageChange(
                            language.code,
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.languageText,

                            active
                              ? styles.languageTextActive
                              : null,
                          ]}
                        >
                          {
                            language.label
                          }
                        </Text>
                      </Pressable>
                    )
                  },
                )
              )}
            </View>
          </View>

          {/* BRAND */}

          <View
            style={
              styles.brandRow
            }
          >
            <View
              style={
                styles.logoBadge
              }
            >
              <Text
                style={
                  styles.logoText
                }
              >
                ResQ
              </Text>
            </View>

            <View
              style={
                styles.brandText
              }
            >
              <Text
                style={
                  styles.brandTitle
                }
              >
                {t(
                  'emergencyResponse',
                )}
              </Text>

              <Text
                style={
                  styles.brandSubtitle
                }
              >
                {t(
                  'secureAccess',
                )}
              </Text>
            </View>
          </View>

          {/* INTRO */}

          <View
            style={styles.intro}
          >
            <Text
              style={styles.eyebrow}
            >
              {t('welcomeBack')}
            </Text>

            <Text
              style={styles.title}
            >
              {t('signInTitle')}
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              {t(
                'signInSubtitle',
              )}
            </Text>
          </View>

          {/* FORM */}

          <View
            style={
              styles.formCard
            }
          >
            <Text
              style={styles.label}
            >
              {t('email')}
            </Text>

            <View
              style={
                styles.inputWrapper
              }
            >
              <Ionicons
                name="mail-outline"
                size={19}
                color="#8A939D"
              />

              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(
                  value,
                ) => {
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

            <View
              style={
                styles.passwordHeader
              }
            >
              <Text
                style={styles.label}
              >
                {t('password')}
              </Text>

              <Pressable
                onPress={() =>
                  router.push(
                    '/forgot-password',
                  )
                }
              >
                <Text
                  style={
                    styles.forgotText
                  }
                >
                  {t(
                    'forgotPassword',
                  )}
                </Text>
              </Pressable>
            </View>

            <View
              style={
                styles.inputWrapper
              }
            >
              <Ionicons
                name="lock-closed-outline"
                size={19}
                color="#8A939D"
              />

              <TextInput
                style={styles.input}
                value={password}
                onChangeText={(
                  value,
                ) => {
                  setPassword(
                    value,
                  )

                  setError('')
                }}
                placeholder={t(
                  'enterPassword',
                )}
                placeholderTextColor="#A0A7AF"
                secureTextEntry={
                  !showPassword
                }
                autoCapitalize="none"
                editable={!loading}
              />

              <Pressable
                style={
                  styles.eyeButton
                }
                onPress={() =>
                  setShowPassword(
                    (
                      current,
                    ) => !current,
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
              <View
                style={
                  styles.errorCard
                }
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={17}
                  color="#B42318"
                />

                <Text
                  style={
                    styles.errorText
                  }
                >
                  {error}
                </Text>
              </View>
            ) : null}

            <Pressable
              style={({
                pressed,
              }) => [
                styles.primaryButton,

                loading
                  ? styles.disabledButton
                  : null,

                pressed &&
                !loading
                  ? styles.buttonPressed
                  : null,
              ]}
              onPress={
                handleLogin
              }
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
                    {t(
                      'signingIn',
                    )}
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={
                      styles.primaryButtonText
                    }
                  >
                    {t('signIn')}
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

          <View
            style={
              styles.registerRow
            }
          >
            <Text
              style={
                styles.registerText
              }
            >
              {t('newTo112')}
            </Text>

            <Pressable
              onPress={() =>
                router.push(
                  '/register',
                )
              }
            >
              <Text
                style={
                  styles.registerLink
                }
              >
                {t(
                  'createAccount',
                )}
              </Text>
            </Pressable>
          </View>

          {/* FOOTER */}

          <View
            style={styles.footer}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={14}
              color="#8B949E"
            />

            <Text
              style={
                styles.footerText
              }
            >
              {t('footer')}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor:
        '#F7F8FA',
    },

    container: {
      flexGrow: 1,
      justifyContent:
        'center',
      paddingHorizontal: 22,
      paddingTop: 24,
      paddingBottom: 34,
    },

    languageRow: {
      flexDirection: 'row',
      justifyContent:
        'flex-end',
      marginBottom: 22,
    },

    languageSelector: {
      minHeight: 38,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 4,
      borderWidth: 1,
      borderColor: '#E4E7EB',
      borderRadius: 13,
      backgroundColor:
        '#FFFFFF',
    },

    languageButton: {
      minWidth: 49,
      minHeight: 30,
      alignItems: 'center',
      justifyContent:
        'center',
      paddingHorizontal: 8,
      borderRadius: 9,
    },

    languageButtonActive: {
      backgroundColor:
        '#111827',
    },

    languageText: {
      color: '#8A939D',
      fontSize: 8,
      fontWeight: '900',
      letterSpacing: 0.4,
    },

    languageTextActive: {
      color: '#FFFFFF',
    },

    languagePressed: {
      opacity: 0.72,
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
      justifyContent:
        'center',
      marginRight: 13,
      borderRadius: 18,
      backgroundColor:
        '#111827',
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
      backgroundColor:
        '#FFFFFF',
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
      justifyContent:
        'space-between',
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
      backgroundColor:
        '#F8F9FA',
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
      alignItems:
        'flex-start',
      marginTop: 13,
      padding: 11,
      borderRadius: 12,
      backgroundColor:
        '#FEF2F2',
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
      justifyContent:
        'center',
      gap: 8,
      marginTop: 18,
      borderRadius: 15,
      backgroundColor:
        '#111827',
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
      justifyContent:
        'center',
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
      alignItems:
        'flex-start',
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