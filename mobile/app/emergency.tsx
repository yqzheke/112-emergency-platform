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

import { analyzeEmergency } from '../services/aiService'

import type {
  EmergencyRequestType,
} from '../types/emergency'

import type {
  EmergencyAIAnalysis,
} from '../types/ai'

const emergencyNames: Record<
  EmergencyRequestType,
  string
> = {
  medical: 'Medical Emergency',
  police: 'Police Emergency',
  fire: 'Fire Emergency',
}

const emergencyDescriptions: Record<
  EmergencyRequestType,
  string
> = {
  medical: 'Ambulance assistance',
  police: 'Police assistance',
  fire: 'Fire and rescue assistance',
}

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

  const handleAnalyze = async () => {
    const cleanDescription =
      description.trim()

    setAiError('')

    if (!cleanDescription) {
      setAiError(
        'Describe the emergency before using AI Assist.',
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
      console.error(error)

      setAiError(
        error instanceof Error
          ? error.message
          : 'AI Assist is unavailable',
      )
    } finally {
      setAiLoading(false)
    }
  }

  const handleContinue = () => {
    setError('')

    const trimmedDescription =
      description.trim()

    if (!trimmedDescription) {
      setError(
        'Please briefly describe the emergency.',
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
    description: trimmedDescription,

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
        <View style={styles.invalidContainer}>
          <Text style={styles.logo}>
            112
          </Text>

          <Text style={styles.title}>
            Invalid emergency type
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              router.replace('/dashboard')
            }
          >
            <Text
              style={
                styles.primaryButtonText
              }
            >
              Back to dashboard
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
          <View style={styles.topRow}>
            <Pressable
              onPress={() => router.back()}
            >
              <Text style={styles.backButton}>
                ←
              </Text>
            </Pressable>

            <Text style={styles.logo}>
              112
            </Text>
          </View>

          <Text style={styles.eyebrow}>
            {emergencyDescriptions[
              type
            ].toUpperCase()}
          </Text>

          <Text style={styles.title}>
            {emergencyNames[type]}
          </Text>

          <Text style={styles.subtitle}>
            Tell us briefly what happened.
          </Text>

          <Text style={styles.label}>
            What happened?
          </Text>

          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={(value) => {
              setDescription(value)

              // Previous AI result no longer
              // represents the edited description.
              if (aiAnalysis) {
                setAiAnalysis(null)
              }
            }}
            placeholder="Describe the emergency"
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            maxLength={500}
          />

          <Text style={styles.counter}>
            {description.length}/500
          </Text>

          {error ? (
            <Text style={styles.error}>
              {error}
            </Text>
          ) : null}

          {/* AI ASSIST */}

          <View style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <View>
                <Text style={styles.aiEyebrow}>
                  AI EMERGENCY ASSIST
                </Text>

                <Text style={styles.aiTitle}>
                  Analyze description
                </Text>
              </View>

              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>
                  AI
                </Text>
              </View>
            </View>

            <Text style={styles.aiDescription}>
              AI can organize your report into a
              concise emergency summary. This is
              optional and does not delay your
              request.
            </Text>

            <Pressable
              style={[
                styles.aiButton,
                aiLoading &&
                  styles.disabledButton,
              ]}
              onPress={handleAnalyze}
              disabled={aiLoading}
            >
              {aiLoading ? (
                <ActivityIndicator
                  color="#111827"
                />
              ) : (
                <Text style={styles.aiButtonText}>
                  Analyze with AI
                </Text>
              )}
            </Pressable>

            {aiError ? (
              <Text style={styles.aiError}>
                {aiError}
              </Text>
            ) : null}
          </View>

          {aiAnalysis ? (
            <View style={styles.analysisCard}>
              <View style={styles.analysisTop}>
                <Text style={styles.analysisEyebrow}>
                  AI ANALYSIS
                </Text>

                <View style={styles.analysisReady}>
                  <Text
                    style={
                      styles.analysisReadyText
                    }
                  >
                    READY
                  </Text>
                </View>
              </View>

              <Text style={styles.resultLabel}>
                LIKELY SERVICE
              </Text>

              <Text style={styles.resultPrimary}>
                {aiAnalysis.service}
              </Text>

              <View style={styles.divider} />

              <Text style={styles.resultLabel}>
                OPERATOR SUMMARY
              </Text>

              <Text style={styles.resultText}>
                {aiAnalysis.summary}
              </Text>

              <View style={styles.divider} />

              <Text style={styles.resultLabel}>
                URGENCY
              </Text>

              <Text style={styles.resultPrimary}>
                {aiAnalysis.urgency}
              </Text>

              {aiAnalysis.importantDetails
                .length > 0 && (
                <>
                  <View style={styles.divider} />

                  <Text
                    style={
                      styles.resultLabel
                    }
                  >
                    IMPORTANT DETAILS
                  </Text>

                  {aiAnalysis.importantDetails.map(
                    (detail, index) => (
                      <Text
                        key={`${detail}-${index}`}
                        style={
                          styles.detailItem
                        }
                      >
                        • {detail}
                      </Text>
                    ),
                  )}
                </>
              )}

              {aiAnalysis.followUpQuestion ? (
                <>
                  <View style={styles.divider} />

                  <Text
                    style={
                      styles.resultLabel
                    }
                  >
                    OPTIONAL FOLLOW-UP
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

              <Text style={styles.aiDisclaimer}>
                AI analysis assists emergency
                intake and may be inaccurate.
              </Text>
            </View>
          ) : null}

          {/* Continue always remains available */}

          <Pressable
            style={styles.primaryButton}
            onPress={handleContinue}
          >
            <Text
              style={styles.primaryButtonText}
            >
              Continue
            </Text>
          </Pressable>

          <Text style={styles.continueNote}>
            You can continue without using AI
            Assist.
          </Text>
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
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 40,
  },

  invalidContainer: {
    flex: 1,
    padding: 22,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 55,
  },

  backButton: {
    fontSize: 30,
    color: '#26313C',
  },

  logo: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#969EA7',
  },

  title: {
    marginTop: 8,
    fontSize: 30,
    fontWeight: '800',
    color: '#18212B',
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 32,
    fontSize: 15,
    color: '#7A838D',
  },

  label: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#38434E',
  },

  textArea: {
    minHeight: 150,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderRadius: 17,
    backgroundColor: '#F8F9FA',
    fontSize: 15,
    lineHeight: 21,
    color: '#18212B',
  },

  counter: {
    marginTop: 7,
    textAlign: 'right',
    fontSize: 10,
    color: '#9AA2AA',
  },

  error: {
    marginTop: 10,
    color: '#DC2626',
    fontSize: 12,
  },

  aiCard: {
    marginTop: 24,
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

  aiEyebrow: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
    color: '#929AA4',
  },

  aiTitle: {
    marginTop: 5,
    fontSize: 17,
    fontWeight: '800',
    color: '#202831',
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
    fontSize: 11,
    lineHeight: 17,
    color: '#7A838D',
  },

  aiButton: {
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#D8DDE3',
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },

  aiButtonText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '800',
  },

  disabledButton: {
    opacity: 0.55,
  },

  aiError: {
    marginTop: 10,
    color: '#B42318',
    fontSize: 11,
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
    marginBottom: 19,
  },

  analysisEyebrow: {
    color: '#AEB6C2',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  analysisReady: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#273244',
  },

  analysisReadyText: {
    color: '#FFFFFF',
    fontSize: 8,
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
    fontWeight: '800',
  },

  resultText: {
    marginTop: 6,
    color: '#E3E7EC',
    fontSize: 12,
    lineHeight: 18,
  },

  detailItem: {
    marginTop: 6,
    color: '#E3E7EC',
    fontSize: 12,
    lineHeight: 18,
  },

  divider: {
    height: 1,
    marginVertical: 15,
    backgroundColor: '#303A49',
  },

  aiDisclaimer: {
    marginTop: 20,
    color: '#8993A1',
    fontSize: 9,
    lineHeight: 14,
  },

  primaryButton: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    borderRadius: 15,
    backgroundColor: '#111827',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  continueNote: {
    marginTop: 9,
    textAlign: 'center',
    color: '#9AA2AA',
    fontSize: 9,
  },
})