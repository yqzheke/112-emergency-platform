import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '../components/Button'
import Input from '../components/Input'

import { API_URL } from '../lib/api'
import { clearAuth } from '../lib/auth'

import type { Contact } from '../types/contact'

function EmergencyContacts() {
  const navigate = useNavigate()

  const [contacts, setContacts] =
    useState<Contact[]>([])

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const [nameError, setNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [serverError, setServerError] =
    useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [deletingId, setDeletingId] =
    useState<number | null>(null)

  const loadContacts = useCallback(async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      clearAuth()
      navigate('/login')
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/contacts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = (await response.json()) as {
        contacts?: Contact[]
        message?: string
      }

      if (response.status === 401) {
        clearAuth()
        navigate('/login')
        return
      }

      if (!response.ok) {
        setServerError(
          data.message ||
            'Could not load emergency contacts',
        )
        return
      }

      setContacts(data.contacts ?? [])
      setServerError('')
    } catch (error) {
      console.error(error)

      setServerError(
        'Could not connect to the server',
      )
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    loadContacts()
  }, [loadContacts])

  const handleAddContact = async () => {
    setNameError('')
    setPhoneError('')
    setServerError('')

    const trimmedName = name.trim()
    const trimmedPhone = phone.trim()

    let hasError = false

    if (!trimmedName) {
      setNameError('Contact name is required')
      hasError = true
    }

    if (!trimmedPhone) {
      setPhoneError('Phone number is required')
      hasError = true
    }

    if (hasError) {
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      clearAuth()
      navigate('/login')
      return
    }

    try {
      setSaving(true)

      const response = await fetch(
        `${API_URL}/contacts`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: trimmedName,
            phone: trimmedPhone,
          }),
        },
      )

      const data = (await response.json()) as {
        contact?: Contact
        message?: string
      }

      if (response.status === 401) {
        clearAuth()
        navigate('/login')
        return
      }

      if (!response.ok) {
        setServerError(
          data.message ||
            'Could not add emergency contact',
        )
        return
      }

      setName('')
      setPhone('')

      await loadContacts()
    } catch (error) {
      console.error(error)

      setServerError(
        'Could not connect to the server',
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (
    contactId: number,
  ) => {
    const token = localStorage.getItem('token')

    if (!token) {
      clearAuth()
      navigate('/login')
      return
    }

    try {
      setDeletingId(contactId)

      const response = await fetch(
        `${API_URL}/contacts/${contactId}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = (await response.json()) as {
        message?: string
      }

      if (response.status === 401) {
        clearAuth()
        navigate('/login')
        return
      }

      if (!response.ok) {
        setServerError(
          data.message ||
            'Could not delete emergency contact',
        )
        return
      }

      await loadContacts()
    } catch (error) {
      console.error(error)

      setServerError(
        'Could not connect to the server',
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mobile-shell">
      <div className="page-content">
        <div className="mobile-header">
          <div>
            <p className="dashboard-label">
              112 EMERGENCY SERVICE
            </p>

            <h1>Emergency contacts</h1>

            <p className="subtitle">
              People who may need to be contacted
              during an emergency.
            </p>
          </div>

          <button
            className="icon-circle"
            onClick={() => navigate('/profile')}
            aria-label="Back to profile"
          >
            ←
          </button>
        </div>

        <p className="section-title">
          Add contact
        </p>

        <Input
          label="Name"
          type="text"
          placeholder="Example: Mom"
          value={name}
          onChange={setName}
          error={nameError}
        />

        <Input
          label="Phone number"
          type="tel"
          placeholder="+7 700 000 00 00"
          value={phone}
          onChange={setPhone}
          error={phoneError}
        />

        {serverError && (
          <p className="input-error">
            {serverError}
          </p>
        )}

        <Button
          onClick={handleAddContact}
          disabled={saving}
        >
          {saving
            ? 'Adding contact...'
            : 'Add emergency contact'}
        </Button>

        <p className="section-title">
          Saved contacts
        </p>

        {loading && (
          <p className="subtitle">
            Loading contacts...
          </p>
        )}

        {!loading &&
          contacts.length === 0 && (
            <div className="contacts-empty">
              <strong>No contacts yet</strong>

              <span>
                Add someone you trust above.
              </span>
            </div>
          )}

        <div className="contacts-list">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="contact-card"
            >
              <div className="contact-avatar">
                {contact.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="contact-info">
                <strong>
                  {contact.name}
                </strong>

                <span>
                  {contact.phone}
                </span>
              </div>

              <button
                className="contact-delete"
                disabled={
                  deletingId === contact.id
                }
                onClick={() =>
                  handleDelete(contact.id)
                }
                aria-label={`Delete ${contact.name}`}
              >
                {deletingId === contact.id
                  ? '...'
                  : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmergencyContacts