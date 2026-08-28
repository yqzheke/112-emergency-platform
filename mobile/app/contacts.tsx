import {
  useCallback,
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
  useFocusEffect,
  useRouter,
} from 'expo-router'

import {
  createContact,
  deleteContact,
  getContacts,
} from '../services/contactService'

import type { Contact } from '../types/contact'

export default function ContactsScreen() {
  const router = useRouter()

  const [contacts, setContacts] =
    useState<Contact[]>([])

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [deletingId, setDeletingId] =
    useState<number | null>(null)

  const [nameError, setNameError] =
    useState('')

  const [phoneError, setPhoneError] =
    useState('')

  const [serverError, setServerError] =
    useState('')

  const loadContacts = useCallback(async () => {
    try {
      setLoading(true)

      const result = await getContacts()

      setContacts(result)
      setServerError('')
    } catch (error) {
      console.error(error)

      setServerError(
        error instanceof Error
          ? error.message
          : 'Could not load contacts',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadContacts()
    }, [loadContacts]),
  )

  const handleAdd = async () => {
    setNameError('')
    setPhoneError('')
    setServerError('')

    const trimmedName = name.trim()
    const trimmedPhone = phone.trim()

    let hasError = false

    if (!trimmedName) {
      setNameError(
        'Contact name is required',
      )
      hasError = true
    }

    if (!trimmedPhone) {
      setPhoneError(
        'Phone number is required',
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
      console.error(error)

      setServerError(
        error instanceof Error
          ? error.message
          : 'Could not add contact',
      )
    } finally {
      setSaving(false)
    }
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
      console.error(error)

      setServerError(
        error instanceof Error
          ? error.message
          : 'Could not delete contact',
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
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.logo}>
                112
              </Text>

              <Text style={styles.eyebrow}>
                SAFETY NETWORK
              </Text>

              <Text style={styles.title}>
                Emergency contacts
              </Text>
            </View>

            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>
                ←
              </Text>
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            Add people who may need to be
            contacted during an emergency.
          </Text>

          <Text style={styles.sectionLabel}>
            ADD CONTACT
          </Text>

          <View style={styles.formCard}>
            <Text style={styles.label}>
              Name
            </Text>

            <TextInput
              style={[
                styles.input,
                nameError
                  ? styles.inputError
                  : null,
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Example: Mom"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />

            {nameError ? (
              <Text style={styles.error}>
                {nameError}
              </Text>
            ) : null}

            <Text style={styles.label}>
              Phone number
            </Text>

            <TextInput
              style={[
                styles.input,
                phoneError
                  ? styles.inputError
                  : null,
              ]}
              value={phone}
              onChangeText={setPhone}
              placeholder="+7 700 000 00 00"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />

            {phoneError ? (
              <Text style={styles.error}>
                {phoneError}
              </Text>
            ) : null}

            {serverError ? (
              <Text style={styles.serverError}>
                {serverError}
              </Text>
            ) : null}

            <Pressable
              style={[
                styles.primaryButton,
                saving &&
                  styles.disabledButton,
              ]}
              onPress={handleAdd}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <Text
                  style={
                    styles.primaryButtonText
                  }
                >
                  Add emergency contact
                </Text>
              )}
            </Pressable>
          </View>

          <Text style={styles.sectionLabel}>
            SAVED CONTACTS
          </Text>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator
                color="#111827"
              />
            </View>
          ) : contacts.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                No contacts yet
              </Text>

              <Text style={styles.emptyText}>
                Add someone you trust using the
                form above.
              </Text>
            </View>
          ) : (
            <View style={styles.contactList}>
              {contacts.map((contact) => (
                <View
                  key={contact.id}
                  style={styles.contactCard}
                >
                  <View
                    style={styles.contactAvatar}
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
                      style={styles.contactName}
                    >
                      {contact.name}
                    </Text>

                    <Text
                      style={styles.contactPhone}
                    >
                      {contact.phone}
                    </Text>
                  </View>

                  <Pressable
                    style={styles.deleteButton}
                    onPress={() =>
                      handleDelete(contact.id)
                    }
                    disabled={
                      deletingId === contact.id
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
                        style={styles.deleteText}
                      >
                        Delete
                      </Text>
                    )}
                  </Pressable>
                </View>
              ))}
            </View>
          )}
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
    justifyContent: 'space-between',
  },

  logo: {
    fontSize: 23,
    fontWeight: '900',
    color: '#111827',
  },

  eyebrow: {
    marginTop: 24,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#929AA4',
  },

  title: {
    marginTop: 7,
    fontSize: 30,
    fontWeight: '800',
    color: '#18212B',
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
  },

  backText: {
    color: '#111827',
    fontSize: 25,
  },

  subtitle: {
    marginTop: 10,
    maxWidth: 310,
    fontSize: 14,
    lineHeight: 20,
    color: '#7A838D',
  },

  sectionLabel: {
    marginTop: 27,
    marginBottom: 10,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#929AA4',
  },

  formCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },

  label: {
    marginBottom: 7,
    fontSize: 12,
    fontWeight: '700',
    color: '#39444F',
  },

  input: {
    height: 52,
    marginBottom: 7,
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
  },

  error: {
    marginBottom: 13,
    color: '#B42318',
    fontSize: 11,
  },

  serverError: {
    marginTop: 10,
    color: '#B42318',
    fontSize: 11,
  },

  primaryButton: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    borderRadius: 15,
    backgroundColor: '#111827',
  },

  disabledButton: {
    opacity: 0.5,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  loadingBox: {
    padding: 30,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },

  emptyCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#29333D',
  },

  emptyText: {
    marginTop: 5,
    color: '#929AA4',
    fontSize: 11,
    lineHeight: 17,
  },

  contactList: {
    gap: 9,
  },

  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
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
    fontWeight: '800',
  },

  contactPhone: {
    marginTop: 3,
    color: '#8B949E',
    fontSize: 11,
  },

  deleteButton: {
    minWidth: 55,
    alignItems: 'flex-end',
    paddingVertical: 8,
  },

  deleteText: {
    color: '#B42318',
    fontSize: 11,
    fontWeight: '800',
  },
})