import {
  useCallback,
  useState,
} from 'react'

import {
  ActivityIndicator,
  Alert,
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
  useFocusEffect,
  useRouter,
} from 'expo-router'

import { useTranslation } from 'react-i18next'

import {
  createContact,
  deleteContact,
  getContacts,
} from '../services/contactService'

import type { Contact } from '../types/contact'

export default function ContactsScreen() {
  const router = useRouter()
  const { t } = useTranslation()

  const [contacts, setContacts] =
    useState<Contact[]>([])

  const [name, setName] =
    useState('')

  const [phone, setPhone] =
    useState('')

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [deletingId, setDeletingId] =
    useState<number | null>(null)

  const [nameError, setNameError] =
    useState('')

  const [phoneError, setPhoneError] =
    useState('')

  const [serverError, setServerError] =
    useState('')

  const loadContacts =
    useCallback(async () => {
      try {
        setLoading(true)

        const result =
          await getContacts()

        setContacts(result)
        setServerError('')
      } catch (error) {
        console.error(
          'Contact loading error:',
          error,
        )

        setServerError(
          error instanceof Error
            ? error.message
            : t(
                'couldNotLoadContacts',
              ),
        )
      } finally {
        setLoading(false)
      }
    }, [t])

  useFocusEffect(
    useCallback(() => {
      loadContacts()
    }, [loadContacts]),
  )

  const handleAdd = async () => {
    setNameError('')
    setPhoneError('')
    setServerError('')

    const trimmedName =
      name.trim()

    const trimmedPhone =
      phone.trim()

    let hasError = false

    if (!trimmedName) {
      setNameError(
        t('contactNameRequired'),
      )

      hasError = true
    }

    if (!trimmedPhone) {
      setPhoneError(
        t('phoneNumberRequired'),
      )

      hasError = true
    }

    if (hasError) {
      return
    }

    try {
      setSaving(true)

      await createContact(
        trimmedName,
        trimmedPhone,
      )

      setName('')
      setPhone('')

      await loadContacts()
    } catch (error) {
      console.error(
        'Contact creation error:',
        error,
      )

      setServerError(
        error instanceof Error
          ? error.message
          : t(
              'couldNotAddContact',
            ),
      )
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = (
    contact: Contact,
  ) => {
    Alert.alert(
      t('deleteContactPrompt'),
      t(
        'deleteContactNamedDescription',
        {
          name: contact.name,
        },
      ),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },

        {
          text: t('delete'),
          style: 'destructive',

          onPress: () => {
            handleDelete(contact.id)
          },
        },
      ],
    )
  }

  const handleDelete = async (
    contactId: number,
  ) => {
    try {
      setDeletingId(contactId)
      setServerError('')

      await deleteContact(contactId)

      setContacts((current) =>
        current.filter(
          (contact) =>
            contact.id !== contactId,
        ),
      )
    } catch (error) {
      console.error(
        'Contact deletion error:',
        error,
      )

      setServerError(
        error instanceof Error
          ? error.message
          : t(
              'couldNotDeleteContact',
            ),
      )
    } finally {
      setDeletingId(null)
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
            styles.content
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          {/* HEADER */}

          <View style={styles.header}>
            <View
              style={styles.headerText}
            >
              <Text style={styles.logo}>
                ResQ
              </Text>

              <Text
                style={styles.eyebrow}
              >
                {t('safetyNetwork')}
              </Text>

              <Text style={styles.title}>
                {t('emergencyContacts')}
              </Text>

              <Text
                style={styles.subtitle}
              >
                {t(
                  'contactsPageSubtitle',
                )}
              </Text>
            </View>

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
                style={styles.backText}
              >
                ←
              </Text>
            </Pressable>
          </View>

          {/* SUMMARY */}

          <View
            style={styles.summaryCard}
          >
            <View
              style={styles.summaryIcon}
            >
              <Text
                style={
                  styles.summaryIconText
                }
              >
                +
              </Text>
            </View>

            <View
              style={
                styles.summaryContent
              }
            >
              <Text
                style={
                  styles.summaryTitle
                }
              >
                {t('savedContact', {
                  count:
                    contacts.length,
                })}
              </Text>

              <Text
                style={
                  styles.summaryText
                }
              >
                {t(
                  'savedContactsDescription',
                )}
              </Text>
            </View>
          </View>

          {/* ADD CONTACT */}

          <Text
            style={styles.sectionLabel}
          >
            {t('addContactSection')}
          </Text>

          <View
            style={styles.formCard}
          >
            <Text style={styles.label}>
              {t('name')}
            </Text>

            <TextInput
              style={[
                styles.input,

                nameError
                  ? styles.inputError
                  : null,
              ]}
              value={name}
              onChangeText={(value) => {
                setName(value)
                setNameError('')
                setServerError('')
              }}
              placeholder={t(
                'nameExample',
              )}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />

            {nameError ? (
              <Text
                style={styles.error}
              >
                {nameError}
              </Text>
            ) : null}

            <Text
              style={styles.labelSpacing}
            >
              {t('phoneNumber')}
            </Text>

            <TextInput
              style={[
                styles.input,

                phoneError
                  ? styles.inputError
                  : null,
              ]}
              value={phone}
              onChangeText={(value) => {
                setPhone(value)
                setPhoneError('')
                setServerError('')
              }}
              placeholder="+7 700 000 00 00"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />

            {phoneError ? (
              <Text
                style={styles.error}
              >
                {phoneError}
              </Text>
            ) : null}

            {serverError ? (
              <View
                style={
                  styles.serverErrorCard
                }
              >
                <Text
                  style={
                    styles.serverErrorTitle
                  }
                >
                  {t('actionFailed')}
                </Text>

                <Text
                  style={
                    styles.serverError
                  }
                >
                  {serverError}
                </Text>
              </View>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,

                saving
                  ? styles.disabledButton
                  : null,

                pressed &&
                !saving
                  ? styles.buttonPressed
                  : null,
              ]}
              onPress={handleAdd}
              disabled={saving}
            >
              {saving ? (
                <>
                  <ActivityIndicator
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.savingText
                    }
                  >
                    {t('addingContact')}
                  </Text>
                </>
              ) : (
                <Text
                  style={
                    styles.primaryButtonText
                  }
                >
                  {t(
                    'addEmergencyContact',
                  )}
                </Text>
              )}
            </Pressable>
          </View>

          {/* SAVED CONTACTS */}

          <View
            style={styles.sectionHeader}
          >
            <Text
              style={styles.sectionLabel}
            >
              {t(
                'savedContactsSection',
              )}
            </Text>

            {!loading ? (
              <Text
                style={
                  styles.sectionCount
                }
              >
                {contacts.length}
              </Text>
            ) : null}
          </View>

          {loading ? (
            <View
              style={styles.loadingBox}
            >
              <ActivityIndicator
                color="#111827"
              />

              <Text
                style={
                  styles.loadingText
                }
              >
                {t('loadingContacts')}
              </Text>
            </View>
          ) : contacts.length === 0 ? (
            <View
              style={styles.emptyCard}
            >
              <View
                style={styles.emptyIcon}
              >
                <Text
                  style={
                    styles.emptyIconText
                  }
                >
                  +
                </Text>
              </View>

              <Text
                style={styles.emptyTitle}
              >
                {t('noContactsYet')}
              </Text>

              <Text
                style={styles.emptyText}
              >
                {t(
                  'noContactsYetDescription',
                )}
              </Text>
            </View>
          ) : (
            <View
              style={styles.contactList}
            >
              {contacts.map(
                (contact) => (
                  <View
                    key={contact.id}
                    style={
                      styles.contactCard
                    }
                  >
                    <View
                      style={
                        styles.contactAvatar
                      }
                    >
                      <Text
                        style={
                          styles.contactAvatarText
                        }
                      >
                        {contact.name
                          .charAt(0)
                          .toUpperCase()}
                      </Text>
                    </View>

                    <View
                      style={
                        styles.contactInformation
                      }
                    >
                      <Text
                        style={
                          styles.contactName
                        }
                      >
                        {contact.name}
                      </Text>

                      <Text
                        style={
                          styles.contactPhone
                        }
                      >
                        {contact.phone}
                      </Text>
                    </View>

                    <Pressable
                      style={({
                        pressed,
                      }) => [
                        styles.deleteButton,

                        pressed
                          ? styles.deleteButtonPressed
                          : null,
                      ]}
                      onPress={() =>
                        confirmDelete(
                          contact,
                        )
                      }
                      disabled={
                        deletingId ===
                        contact.id
                      }
                    >
                      {deletingId ===
                      contact.id ? (
                        <ActivityIndicator
                          size="small"
                          color="#B42318"
                        />
                      ) : (
                        <Text
                          style={
                            styles.deleteText
                          }
                        >
                          {t('delete')}
                        </Text>
                      )}
                    </Pressable>
                  </View>
                ),
              )}
            </View>
          )}

          {/* NOTICE */}

          <View style={styles.infoCard}>
            <View
              style={styles.infoDot}
            />

            <Text
              style={styles.infoText}
            >
              {t(
                'trustedContactsNotice',
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
    backgroundColor: '#F5F6F8',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 50,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent:
      'space-between',
  },

  headerText: {
    flex: 1,
    paddingRight: 15,
  },

  logo: {
    color: '#111827',
    fontSize: 23,
    fontWeight: '900',
  },

  eyebrow: {
    marginTop: 22,
    color: '#929AA4',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  title: {
    marginTop: 6,
    color: '#18212B',
    fontSize: 29,
    fontWeight: '900',
  },

  subtitle: {
    marginTop: 7,
    maxWidth: 300,
    color: '#7A838D',
    fontSize: 12,
    lineHeight: 18,
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

  backText: {
    marginTop: -2,
    color: '#111827',
    fontSize: 24,
    fontWeight: '700',
  },

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    borderRadius: 18,
    backgroundColor: '#111827',
  },

  summaryIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderRadius: 14,
    backgroundColor: '#25303E',
  },

  summaryIconText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '500',
  },

  summaryContent: {
    flex: 1,
  },

  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  summaryText: {
    marginTop: 4,
    color: '#AEB6C1',
    fontSize: 9,
    lineHeight: 14,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 27,
    marginBottom: 10,
  },

  sectionLabel: {
    marginTop: 27,
    marginBottom: 10,
    color: '#929AA4',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  sectionCount: {
    marginTop: 27,
    color: '#9CA3AF',
    fontSize: 9,
    fontWeight: '900',
  },

  formCard: {
    padding: 18,
    borderWidth: 1,
    borderColor: '#E7EAEE',
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
    marginTop: 10,
    marginBottom: 7,
    color: '#39444F',
    fontSize: 12,
    fontWeight: '800',
  },

  input: {
    height: 52,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E2E6EA',
    borderRadius: 14,
    backgroundColor: '#F8F9FA',
    color: '#18212B',
    fontSize: 14,
  },

  inputError: {
    borderColor: '#F0A7A2',
    backgroundColor: '#FFF8F8',
  },

  error: {
    marginTop: 5,
    color: '#B42318',
    fontSize: 10,
  },

  serverErrorCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
  },

  serverErrorTitle: {
    color: '#991B1B',
    fontSize: 10,
    fontWeight: '900',
  },

  serverError: {
    marginTop: 3,
    color: '#B42318',
    fontSize: 9,
    lineHeight: 14,
  },

  primaryButton: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: '#111827',
  },

  disabledButton: {
    opacity: 0.5,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  savingText: {
    marginLeft: 9,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  loadingBox: {
    alignItems: 'center',
    padding: 28,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },

  loadingText: {
    marginTop: 9,
    color: '#929AA4',
    fontSize: 10,
  },

  emptyCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },

  emptyIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#EEF2F6',
  },

  emptyIconText: {
    color: '#111827',
    fontSize: 21,
    fontWeight: '500',
  },

  emptyTitle: {
    marginTop: 13,
    color: '#29333D',
    fontSize: 15,
    fontWeight: '900',
  },

  emptyText: {
    marginTop: 5,
    color: '#929AA4',
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
  },

  contactList: {
    gap: 9,
  },

  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    borderWidth: 1,
    borderColor: '#E7EAEE',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },

  contactAvatar: {
    width: 43,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderRadius: 14,
    backgroundColor: '#111827',
  },

  contactAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  contactInformation: {
    flex: 1,
  },

  contactName: {
    color: '#29333D',
    fontSize: 13,
    fontWeight: '900',
  },

  contactPhone: {
    marginTop: 3,
    color: '#8B949E',
    fontSize: 10,
  },

  deleteButton: {
    minWidth: 56,
    alignItems: 'flex-end',
    paddingVertical: 8,
  },

  deleteButtonPressed: {
    opacity: 0.55,
  },

  deleteText: {
    color: '#B42318',
    fontSize: 10,
    fontWeight: '900',
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 14,
    paddingHorizontal: 4,
  },

  infoDot: {
    width: 6,
    height: 6,
    marginTop: 4,
    marginRight: 7,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
  },

  infoText: {
    flex: 1,
    color: '#929AA4',
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