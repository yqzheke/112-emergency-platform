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

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router'

import { useTranslation } from 'react-i18next'

import { analyzeEmergency } from '../services/aiService'

import type {
  EmergencyAIAnalysis,
} from '../types/ai'

type EmergencyRequestType =
  | 'medical'
  | 'police'
  | 'fire'

function isEmergencyType(
  value: unknown,
): value is EmergencyRequestType {
  return (
    value === 'medical' ||
    value === 'police' ||
    value === 'fire'
  )
}

export default function EmergencyScreen() {
  const router = useRouter()
  const { t } = useTranslation()

  const params =
    useLocalSearchParams<{
      type?: string
    }>()

  const type = isEmergencyType(params.type)
    ? params.type
    : null

  const [description, setDescription] =
    useState('')

  const [error, setError] =
    useState('')

  const [aiAnalysis, setAiAnalysis] =
    useState<EmergencyAIAnalysis | null>(
      null,
    )

  const [aiLoading, setAiLoading] =
    useState(false)

  const [aiError, setAiError] =
    useState('')

  const emergencyNames: Record<
    EmergencyRequestType,
    string
  > = {
    medical: t('medicalEmergency'),
    police: t('policeEmergency'),
    fire: t('fireEmergency'),
  }

  const emergencyLabels: Record<
    EmergencyRequestType,
    string
  > = {
    medical: t('medicalLabel'),
    police: t('policeLabel'),
    fire: t('fireLabel'),
  }

  const handleAnalyze = async () => {
    const cleanDescription =
      description.trim()

    setAiError('')

    if (!cleanDescription) {
      setAiError(
        t('describeBeforeAI'),
      )
      return
    }

    try {
      setAiLoading(true)

      const analysis =
        await analyzeEmergency(
          cleanDescription,
        )

      setAiAnalysis(analysis)
    } catch (error) {
      console.error(
        'AI emergency analysis error:',
        error,
      )

      setAiError(
        error instanceof Error
          ? error.message
          : t('aiAssistUnavailable'),
      )
    } finally {
      setAiLoading(false)
    }
  }

  const handleContinue = () => {
    setError('')

    const cleanDescription =
      description.trim()

    if (!cleanDescription) {
      setError(
        t('brieflyDescribeEmergency'),
      )
      return
    }

    if (!type) {
      router.replace('/dashboard')
      return
    }

    router.push({
      pathname: '/emergency-confirm',

      params: {
        type,

        description:
          cleanDescription,

        aiService:
          aiAnalysis?.service ?? '',

        aiSummary:
          aiAnalysis?.summary ?? '',

        aiUrgency:
          aiAnalysis?.urgency ?? '',

        aiImportantDetails:
          aiAnalysis
            ? JSON.stringify(
                aiAnalysis.importantDetails,
              )
            : '',
      },
    })
  }

  if (!type) {
    return (
      <SafeAreaView style={styles.screen}>
        <View
          style={styles.invalidContainer}
        >
          <Text
            style={styles.invalidLogo}
          >
            ResQ
          </Text>

          <Text
            style={styles.invalidTitle}
          >
            {t('invalidEmergencyType')}
          </Text>

          <Text
            style={styles.invalidText}
          >
            {t(
              'invalidEmergencyTypeDescription',
            )}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,

              pressed
                ? styles.buttonPressed
                : null,
            ]}
            onPress={() =>
              router.replace(
                '/dashboard',
              )
            }
          >
            <Text
              style={
                styles.primaryButtonText
              }
            >
              {t('backToDashboard')}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
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
              <Text
                style={
                  styles.backButtonText
                }
              >
                ←
              </Text>
            </Pressable>

            <View
              style={styles.logoBadge}
            >
              <Text style={styles.logo}>
                ResQ
              </Text>
            </View>
          </View>

          {/* EMERGENCY TYPE */}

          <View
            style={styles.serviceBadge}
          >
            <View
              style={
                styles.serviceBadgeDot
              }
            />

            <Text
              style={
                styles.serviceBadgeText
              }
            >
              {emergencyLabels[type]}
            </Text>
          </View>

          <Text style={styles.title}>
            {emergencyNames[type]}
          </Text>

          <Text style={styles.subtitle}>
            {t(
              'emergencyDescriptionIntro',
            )}
          </Text>

          {/* DESCRIPTION */}

          <View
            style={
              styles.inputSectionHeader
            }
          >
            <Text style={styles.label}>
              {t('whatHappened')}
            </Text>

            <Text
              style={styles.requiredText}
            >
              {t('fieldRequired')}
            </Text>
          </View>

          <TextInput
            style={[
              styles.textArea,

              error
                ? styles.textAreaError
                : null,
            ]}
            value={description}
            onChangeText={(value) => {
              setDescription(value)
              setError('')
              setAiError('')

              if (aiAnalysis) {
                setAiAnalysis(null)
              }
            }}
            placeholder={t(
              'emergencyExample',
            )}
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            maxLength={500}
          />

          <View
            style={styles.inputFooter}
          >
            <Text
              style={
                styles.inputFooterText
              }
            >
              {t(
                'importantDetailsFirst',
              )}
            </Text>

            <Text
              style={styles.counter}
            >
              {description.length}/500
            </Text>
          </View>

          {error ? (
            <View
              style={styles.errorCard}
            >
              <Text
                style={styles.errorText}
              >
                {error}
              </Text>
            </View>
          ) : null}

          {/* AI ASSIST */}

          <View style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <View
                style={styles.aiTitleArea}
              >
                <Text
                  style={styles.aiEyebrow}
                >
                  {t('aiEmergencyAssist')}
                </Text>

                <Text
                  style={styles.aiTitle}
                >
                  {t('organizeReport')}
                </Text>
              </View>

              <View
                style={styles.aiBadge}
              >
                <Text
                  style={
                    styles.aiBadgeText
                  }
                >
                  AI
                </Text>
              </View>
            </View>

            <Text
              style={styles.aiDescription}
            >
              {t(
                'aiEmergencyDescription',
              )}
            </Text>

            <View style={styles.aiInfoRow}>
              <View
                style={styles.aiInfoDot}
              />

              <Text
                style={styles.aiInfoText}
              >
                {t('aiOptional')}
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.aiButton,

                aiLoading
                  ? styles.disabledButton
                  : null,

                pressed &&
                !aiLoading
                  ? styles.buttonPressed
                  : null,
              ]}
              disabled={aiLoading}
              onPress={handleAnalyze}
            >
              {aiLoading ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color="#111827"
                  />

                  <Text
                    style={
                      styles.aiLoadingText
                    }
                  >
                    {t('analyzing')}
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={
                      styles.aiButtonText
                    }
                  >
                    {t('analyzeWithAI')}
                  </Text>

                  <Text
                    style={
                      styles.aiButtonArrow
                    }
                  >
                    ›
                  </Text>
                </>
              )}
            </Pressable>

            {aiError ? (
              <Text
                style={styles.aiError}
              >
                {aiError}
              </Text>
            ) : null}
          </View>

          {/* AI RESULT */}

          {aiAnalysis ? (
            <View
              style={styles.analysisCard}
            >
              <View
                style={styles.analysisTop}
              >
                <View>
                  <Text
                    style={
                      styles.analysisEyebrow
                    }
                  >
                    {t('aiAnalysis')}
                  </Text>

                  <Text
                    style={
                      styles.analysisTitle
                    }
                  >
                    {t('intakeSummary')}
                  </Text>
                </View>

                <View
                  style={
                    styles.analysisReady
                  }
                >
                  <View
                    style={
                      styles.analysisReadyDot
                    }
                  />

                  <Text
                    style={
                      styles.analysisReadyText
                    }
                  >
                    {t('ready')}
                  </Text>
                </View>
              </View>

              <Text
                style={styles.resultLabel}
              >
                {t('likelyService')}
              </Text>

              <Text
                style={styles.resultPrimary}
              >
                {aiAnalysis.service}
              </Text>

              <View
                style={styles.divider}
              />

              <Text
                style={styles.resultLabel}
              >
                {t('operatorSummary')}
              </Text>

              <Text
                style={styles.resultText}
              >
                {aiAnalysis.summary}
              </Text>

              <View
                style={styles.divider}
              />

              <Text
                style={styles.resultLabel}
              >
                {t('urgency')}
              </Text>

              <Text
                style={styles.resultPrimary}
              >
                {aiAnalysis.urgency}
              </Text>

              {aiAnalysis
                .importantDetails.length >
                0 && (
                <>
                  <View
                    style={styles.divider}
                  />

                  <Text
                    style={
                      styles.resultLabel
                    }
                  >
                    {t('importantDetails')}
                  </Text>

                  {aiAnalysis.importantDetails.map(
                    (
                      detail,
                      index,
                    ) => (
                      <View
                        key={`${detail}-${index}`}
                        style={
                          styles.detailRow
                        }
                      >
                        <View
                          style={
                            styles.detailBullet
                          }
                        />

                        <Text
                          style={
                            styles.detailItem
                          }
                        >
                          {detail}
                        </Text>
                      </View>
                    ),
                  )}
                </>
              )}

              {aiAnalysis.followUpQuestion ? (
                <>
                  <View
                    style={styles.divider}
                  />

                  <Text
                    style={
                      styles.resultLabel
                    }
                  >
                    {t('optionalFollowUp')}
                  </Text>

                  <Text
                    style={styles.resultText}
                  >
                    {
                      aiAnalysis.followUpQuestion
                    }
                  </Text>
                </>
              ) : null}

              <View
                style={
                  styles.aiDisclaimerCard
                }
              >
                <Text
                  style={
                    styles.aiDisclaimer
                  }
                >
                  {t(
                    'aiIntakeDisclaimer',
                  )}
                </Text>
              </View>
            </View>
          ) : null}

          {/* CONTINUE */}

          <View
            style={styles.continueSection}
          >
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

              <Text
                style={
                  styles.primaryButtonArrow
                }
              >
                ›
              </Text>
            </Pressable>

            <Text
              style={styles.continueNote}
            >
              {t(
                'continueEmergencyNote',
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
    backgroundColor: '#FFFFFF',
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 40,
  },

  invalidContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 22,
  },

  invalidLogo: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '900',
  },

  invalidTitle: {
    marginTop: 22,
    color: '#18212B',
    fontSize: 28,
    fontWeight: '900',
  },

  invalidText: {
    marginTop: 8,
    color: '#7A838D',
    fontSize: 13,
    lineHeight: 19,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 38,
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },

  backButtonText: {
    marginTop: -2,
    color: '#26313C',
    fontSize: 23,
    fontWeight: '700',
  },

  logoBadge: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#111827',
  },

  logo: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  serviceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },

  serviceBadgeDot: {
    width: 6,
    height: 6,
    marginRight: 6,
    borderRadius: 3,
    backgroundColor: '#111827',
  },

  serviceBadgeText: {
    color: '#5B6470',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.9,
  },

  title: {
    color: '#18212B',
    fontSize: 30,
    fontWeight: '900',
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    maxWidth: 340,
    color: '#7A838D',
    fontSize: 13,
    lineHeight: 20,
  },

  inputSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  label: {
    color: '#38434E',
    fontSize: 13,
    fontWeight: '800',
  },

  requiredText: {
    color: '#9CA3AF',
    fontSize: 9,
    fontWeight: '700',
  },

  textArea: {
    minHeight: 145,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    color: '#18212B',
    fontSize: 14,
    lineHeight: 21,
  },

  textAreaError: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFF7F7',
  },

  inputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 7,
  },

  inputFooterText: {
    flex: 1,
    paddingRight: 12,
    color: '#9AA2AA',
    fontSize: 9,
  },

  counter: {
    color: '#9AA2AA',
    fontSize: 9,
  },

  errorCard: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
  },

  errorText: {
    color: '#B91C1C',
    fontSize: 10,
    lineHeight: 15,
  },

  aiCard: {
    marginTop: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E3E6EA',
    borderRadius: 20,
    backgroundColor: '#F5F6F8',
  },

  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  aiTitleArea: {
    flex: 1,
    paddingRight: 12,
  },

  aiEyebrow: {
    color: '#929AA4',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  aiTitle: {
    marginTop: 5,
    color: '#202831',
    fontSize: 17,
    fontWeight: '900',
  },

  aiBadge: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#111827',
  },

  aiBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  aiDescription: {
    marginTop: 11,
    color: '#7A838D',
    fontSize: 11,
    lineHeight: 17,
  },

  aiInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  aiInfoDot: {
    width: 6,
    height: 6,
    marginRight: 6,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
  },

  aiInfoText: {
    flex: 1,
    color: '#8A929C',
    fontSize: 9,
    lineHeight: 14,
  },

  aiButton: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#D8DDE3',
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },

  aiButtonText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '900',
  },

  aiButtonArrow: {
    marginLeft: 10,
    color: '#111827',
    fontSize: 20,
  },

  aiLoadingText: {
    marginLeft: 9,
    color: '#111827',
    fontSize: 11,
    fontWeight: '800',
  },

  disabledButton: {
    opacity: 0.55,
  },

  aiError: {
    marginTop: 10,
    color: '#B42318',
    fontSize: 10,
    lineHeight: 15,
  },

  analysisCard: {
    marginTop: 12,
    padding: 19,
    borderRadius: 20,
    backgroundColor: '#111827',
  },

  analysisTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  analysisEyebrow: {
    color: '#AEB6C2',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  analysisTitle: {
    marginTop: 4,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  analysisReady: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#273244',
  },

  analysisReadyDot: {
    width: 6,
    height: 6,
    marginRight: 5,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
  },

  analysisReadyText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '900',
  },

  resultLabel: {
    color: '#929CAB',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  resultPrimary: {
    marginTop: 5,
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  resultText: {
    marginTop: 6,
    color: '#E3E7EC',
    fontSize: 11,
    lineHeight: 18,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 7,
  },

  detailBullet: {
    width: 5,
    height: 5,
    marginTop: 6,
    marginRight: 8,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
  },

  detailItem: {
    flex: 1,
    color: '#E3E7EC',
    fontSize: 11,
    lineHeight: 17,
  },

  divider: {
    height: 1,
    marginVertical: 15,
    backgroundColor: '#303A49',
  },

  aiDisclaimerCard: {
    marginTop: 18,
    padding: 11,
    borderRadius: 12,
    backgroundColor: '#182230',
  },

  aiDisclaimer: {
    color: '#8993A1',
    fontSize: 8,
    lineHeight: 13,
  },

  continueSection: {
    marginTop: 24,
  },

  primaryButton: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 15,
    backgroundColor: '#111827',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  primaryButtonArrow: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 22,
  },

  continueNote: {
    marginTop: 9,
    paddingHorizontal: 18,
    textAlign: 'center',
    color: '#9AA2AA',
    fontSize: 9,
    lineHeight: 14,
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