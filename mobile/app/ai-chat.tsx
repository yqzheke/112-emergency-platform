import {
  useMemo,
  useRef,
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

import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

import { sendAIChatMessage } from '../services/aiChatService'

import type {
  AIChatHistoryMessage,
  AIChatResult,
  SuggestedEmergencyService,
} from '../types/aiChat'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  result?: AIChatResult
}

const serviceRouteMap: Record<
  Exclude<SuggestedEmergencyService, null>,
  'medical' | 'police' | 'fire'
> = {
  MEDICAL: 'medical',
  POLICE: 'police',
  FIRE: 'fire',
}

function createMessageId() {
  return `${Date.now()}-${Math.random()}`
}

export default function AIChatScreen() {
  const router = useRouter()
  const { t } = useTranslation()

  const scrollRef =
    useRef<ScrollView | null>(null)

  const [input, setInput] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const [messages, setMessages] =
    useState<ChatMessage[]>([
      {
        id: 'welcome',
        role: 'assistant',
        text: t('aiChatWelcome'),
      },
    ])

  const history =
    useMemo<AIChatHistoryMessage[]>(
      () =>
        messages
          .filter(
            (message) =>
              message.id !== 'welcome',
          )
          .map((message) => ({
            role: message.role,
            text: message.text,
          })),
      [messages],
    )

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({
        animated: true,
      })
    })
  }

  const handleSend = async () => {
    const cleanInput =
      input.trim()

    if (!cleanInput || loading) {
      return
    }

    setError('')

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: 'user',
      text: cleanInput,
    }

    setMessages((current) => [
      ...current,
      userMessage,
    ])

    setInput('')
    setLoading(true)

    scrollToBottom()

    try {
      const result =
        await sendAIChatMessage(
          cleanInput,
          history,
        )

      const assistantMessage: ChatMessage = {
        id: createMessageId(),
        role: 'assistant',
        text: result.reply,
        result,
      }

      setMessages((current) => [
        ...current,
        assistantMessage,
      ])

      scrollToBottom()
    } catch (error) {
      console.error(
        'ResQ AI chat error:',
        error,
      )

      setError(
        error instanceof Error
          ? error.message
          : t('aiUnavailable'),
      )
    } finally {
      setLoading(false)
    }
  }

  const openEmergency = (
    service: SuggestedEmergencyService,
  ) => {
    if (!service) {
      return
    }

    router.push({
      pathname: '/emergency',
      params: {
        type: serviceRouteMap[service],
      },
    })
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
        <View style={styles.screen}>
          {/* HEADER */}

          <View style={styles.header}>
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
              style={styles.headerCenter}
            >
              <Text
                style={
                  styles.headerEyebrow
                }
              >
                ResQ AI
              </Text>

              <Text
                style={
                  styles.headerTitle
                }
              >
                {t('safetyAssistant')}
              </Text>
            </View>

            <View style={styles.aiBadge}>
              <Text
                style={styles.aiBadgeText}
              >
                AI
              </Text>
            </View>
          </View>

          {/* SAFETY BANNER */}

          <View
            style={styles.safetyBanner}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#111827"
            />

            <Text
              style={
                styles.safetyBannerText
              }
            >
              {t('aiChatSafetyBanner')}
            </Text>
          </View>

          {/* CHAT */}

          <ScrollView
            ref={scrollRef}
            style={styles.chat}
            contentContainerStyle={
              styles.chatContent
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={
              false
            }
            onContentSizeChange={
              scrollToBottom
            }
          >
            {messages.map((message) => {
              const isUser =
                message.role === 'user'

              return (
                <View
                  key={message.id}
                  style={[
                    styles.messageRow,

                    isUser
                      ? styles.userMessageRow
                      : styles.aiMessageRow,
                  ]}
                >
                  {!isUser ? (
                    <View
                      style={
                        styles.messageAvatar
                      }
                    >
                      <Text
                        style={
                          styles.messageAvatarText
                        }
                      >
                        AI
                      </Text>
                    </View>
                  ) : null}

                  <View
                    style={[
                      styles.messageBubble,

                      isUser
                        ? styles.userBubble
                        : styles.aiBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,

                        isUser
                          ? styles.userMessageText
                          : styles.aiMessageText,
                      ]}
                    >
                      {message.text}
                    </Text>

                    {message.result
                      ?.emergencyRecommended &&
                    message.result
                      .suggestedService ? (
                      <Pressable
                        style={({ pressed }) => [
                          styles.emergencyAction,

                          pressed
                            ? styles.emergencyActionPressed
                            : null,
                        ]}
                        onPress={() =>
                          openEmergency(
                            message.result
                              ?.suggestedService ??
                              null,
                          )
                        }
                      >
                        <View>
                          <Text
                            style={
                              styles.emergencyActionEyebrow
                            }
                          >
                            {t('emergencyAction')}
                          </Text>

                          <Text
                            style={
                              styles.emergencyActionText
                            }
                          >
                            {message.result
                              .actionLabel ||
                              t(
                                'startEmergencyRequest',
                              )}
                          </Text>
                        </View>

                        <Ionicons
                          name="arrow-forward"
                          size={18}
                          color="#FFFFFF"
                        />
                      </Pressable>
                    ) : null}
                  </View>
                </View>
              )
            })}

            {loading ? (
              <View
                style={[
                  styles.messageRow,
                  styles.aiMessageRow,
                ]}
              >
                <View
                  style={
                    styles.messageAvatar
                  }
                >
                  <Text
                    style={
                      styles.messageAvatarText
                    }
                  >
                    AI
                  </Text>
                </View>

                <View
                  style={[
                    styles.messageBubble,
                    styles.aiBubble,
                    styles.typingBubble,
                  ]}
                >
                  <ActivityIndicator
                    size="small"
                    color="#111827"
                  />

                  <Text
                    style={
                      styles.typingText
                    }
                  >
                    {t('aiThinking')}
                  </Text>
                </View>
              </View>
            ) : null}

            {error ? (
              <View
                style={styles.errorCard}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={17}
                  color="#B42318"
                />

                <Text
                  style={styles.errorText}
                >
                  {error}
                </Text>
              </View>
            ) : null}
          </ScrollView>

          {/* INPUT */}

          <View style={styles.inputArea}>
            <View
              style={
                styles.inputContainer
              }
            >
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={(value) => {
                  setInput(value)
                  setError('')
                }}
                placeholder={t(
                  'askResQPlaceholder',
                )}
                placeholderTextColor="#9CA3AF"
                multiline
                maxLength={1500}
                editable={!loading}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.sendButton,

                  (!input.trim() ||
                    loading)
                    ? styles.sendButtonDisabled
                    : null,

                  pressed &&
                  input.trim() &&
                  !loading
                    ? styles.sendButtonPressed
                    : null,
                ]}
                onPress={handleSend}
                disabled={
                  !input.trim() ||
                  loading
                }
              >
                <Ionicons
                  name="arrow-up"
                  size={20}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <Text
              style={styles.inputHint}
            >
              {t('aiUrgentHint')}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
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

  headerCenter: {
    flex: 1,
    marginHorizontal: 12,
  },

  headerEyebrow: {
    color: '#929AA4',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  headerTitle: {
    marginTop: 3,
    color: '#18212B',
    fontSize: 16,
    fontWeight: '900',
  },

  aiBadge: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#111827',
  },

  aiBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 18,
    marginBottom: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },

  safetyBannerText: {
    flex: 1,
    marginLeft: 8,
    color: '#59636D',
    fontSize: 9,
    lineHeight: 14,
  },

  chat: {
    flex: 1,
  },

  chatContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 18,
  },

  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  aiMessageRow: {
    alignItems: 'flex-start',
  },

  userMessageRow: {
    justifyContent: 'flex-end',
  },

  messageAvatar: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderRadius: 11,
    backgroundColor: '#111827',
  },

  messageAvatarText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },

  messageBubble: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
  },

  aiBubble: {
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },

  userBubble: {
    borderTopRightRadius: 6,
    backgroundColor: '#111827',
  },

  messageText: {
    fontSize: 12,
    lineHeight: 18,
  },

  aiMessageText: {
    color: '#303A44',
  },

  userMessageText: {
    color: '#FFFFFF',
  },

  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  typingText: {
    marginLeft: 8,
    color: '#7A838D',
    fontSize: 10,
  },

  emergencyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 13,
    backgroundColor: '#111827',
  },

  emergencyActionPressed: {
    opacity: 0.82,
  },

  emergencyActionEyebrow: {
    color: '#AEB6C1',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  emergencyActionText: {
    marginTop: 3,
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  errorCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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

  inputArea: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F5F6F8',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#DFE3E8',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },

  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    paddingTop: 11,
    paddingBottom: 10,
    paddingRight: 10,
    color: '#18212B',
    fontSize: 13,
    lineHeight: 18,
  },

  sendButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#111827',
  },

  sendButtonDisabled: {
    opacity: 0.35,
  },

  sendButtonPressed: {
    opacity: 0.78,

    transform: [
      {
        scale: 0.97,
      },
    ],
  },

  inputHint: {
    marginTop: 7,
    paddingHorizontal: 5,
    textAlign: 'center',
    color: '#9AA2AA',
    fontSize: 8,
    lineHeight: 12,
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