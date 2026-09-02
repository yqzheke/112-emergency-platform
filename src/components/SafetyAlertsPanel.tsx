import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { API_URL } from '../lib/api'

import type {
  AlertSeverity,
  SafetyAlert,
} from '../types/alert'

type OperatorLanguage =
  | 'en'
  | 'ru'
  | 'kk'

const alertTranslations = {
  en: {
    publicSafety:
      'PUBLIC SAFETY',

    title:
      'ResQ Alerts',

    description:
      'Publish official safety information for users of the ResQ application.',

    alertTitle:
      'Alert title',

    alertTitlePlaceholder:
      'Severe Weather Warning',

    region:
      'Region',

    regionPlaceholder:
      'Astana',

    severity:
      'Severity',

    information:
      'Information',

    warning:
      'Warning',

    critical:
      'Critical',

    publicMessage:
      'Public message',

    messagePlaceholder:
      'Enter the safety information users should receive...',

    publishing:
      'Publishing...',

    publish:
      'Publish safety alert',

    publishedAlerts:
      'Published alerts',

    loading:
      'Loading alerts...',

    noAlerts:
      'No safety alerts have been published.',

    active:
      'ACTIVE',

    inactive:
      'INACTIVE',

    updating:
      'Updating...',

    deactivate:
      'Deactivate',

    activate:
      'Activate',

    authenticationRequired:
      'Authentication required',

    requiredFields:
      'Title, message and region are required.',

    couldNotLoad:
      'Could not load alerts',

    couldNotPublish:
      'Could not publish alert',

    couldNotUpdate:
      'Could not update alert',
  },

  ru: {
    publicSafety:
      'ОБЩЕСТВЕННАЯ БЕЗОПАСНОСТЬ',

    title:
      'Оповещения ResQ',

    description:
      'Публикуйте официальную информацию о безопасности для пользователей приложения ResQ.',

    alertTitle:
      'Название оповещения',

    alertTitlePlaceholder:
      'Предупреждение о сильной погоде',

    region:
      'Регион',

    regionPlaceholder:
      'Астана',

    severity:
      'Уровень опасности',

    information:
      'Информация',

    warning:
      'Предупреждение',

    critical:
      'Критический',

    publicMessage:
      'Сообщение для населения',

    messagePlaceholder:
      'Введите информацию о безопасности для пользователей...',

    publishing:
      'Публикация...',

    publish:
      'Опубликовать оповещение',

    publishedAlerts:
      'Опубликованные оповещения',

    loading:
      'Загрузка оповещений...',

    noAlerts:
      'Оповещения о безопасности пока не опубликованы.',

    active:
      'АКТИВНО',

    inactive:
      'НЕАКТИВНО',

    updating:
      'Обновление...',

    deactivate:
      'Деактивировать',

    activate:
      'Активировать',

    authenticationRequired:
      'Требуется авторизация',

    requiredFields:
      'Название, сообщение и регион обязательны.',

    couldNotLoad:
      'Не удалось загрузить оповещения',

    couldNotPublish:
      'Не удалось опубликовать оповещение',

    couldNotUpdate:
      'Не удалось обновить оповещение',
  },

  kk: {
    publicSafety:
      'ҚОҒАМДЫҚ ҚАУІПСІЗДІК',

    title:
      'ResQ хабарламалары',

    description:
      'ResQ қолданбасының пайдаланушылары үшін ресми қауіпсіздік ақпаратын жариялаңыз.',

    alertTitle:
      'Хабарлама атауы',

    alertTitlePlaceholder:
      'Қатты ауа райы туралы ескерту',

    region:
      'Өңір',

    regionPlaceholder:
      'Астана',

    severity:
      'Қауіп деңгейі',

    information:
      'Ақпарат',

    warning:
      'Ескерту',

    critical:
      'Сындарлы',

    publicMessage:
      'Қоғамдық хабарлама',

    messagePlaceholder:
      'Пайдаланушыларға арналған қауіпсіздік ақпаратын енгізіңіз...',

    publishing:
      'Жариялануда...',

    publish:
      'Қауіпсіздік хабарламасын жариялау',

    publishedAlerts:
      'Жарияланған хабарламалар',

    loading:
      'Хабарламалар жүктелуде...',

    noAlerts:
      'Қауіпсіздік хабарламалары әлі жарияланбаған.',

    active:
      'БЕЛСЕНДІ',

    inactive:
      'БЕЛСЕНДІ ЕМЕС',

    updating:
      'Жаңартылуда...',

    deactivate:
      'Өшіру',

    activate:
      'Белсендіру',

    authenticationRequired:
      'Авторизация қажет',

    requiredFields:
      'Атауы, хабарлама және өңір міндетті.',

    couldNotLoad:
      'Хабарламаларды жүктеу мүмкін болмады',

    couldNotPublish:
      'Хабарламаны жариялау мүмкін болмады',

    couldNotUpdate:
      'Хабарламаны жаңарту мүмкін болмады',
  },
} as const

function SafetyAlertsPanel() {
  const savedLanguage =
    localStorage.getItem(
      'resq-operator-language',
    )

  const language:
    OperatorLanguage =
    savedLanguage === 'ru' ||
    savedLanguage === 'kk'
      ? savedLanguage
      : 'en'

  const t =
    alertTranslations[language]

  const [alerts, setAlerts] =
    useState<SafetyAlert[]>([])

  const [title, setTitle] =
    useState('')

  const [message, setMessage] =
    useState('')

  const [region, setRegion] =
    useState('')

  const [severity, setSeverity] =
    useState<AlertSeverity>(
      'INFO',
    )

  const [loading, setLoading] =
    useState(true)

  const [
    publishing,
    setPublishing,
  ] = useState(false)

  const [
    updatingId,
    setUpdatingId,
  ] =
    useState<number | null>(
      null,
    )

  const [error, setError] =
    useState('')

  const getToken = () =>
    localStorage.getItem(
      'token',
    )

  const loadAlerts =
    useCallback(
      async () => {
        const token =
          getToken()

        if (!token) {
          setError(
            t.authenticationRequired,
          )

          setLoading(false)

          return
        }

        try {
          const response =
            await fetch(
              `${API_URL}/alerts/manage`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              },
            )

          const data =
            (await response.json()) as {
              alerts?:
                SafetyAlert[]
              message?: string
            }

          if (!response.ok) {
            throw new Error(
              data.message ||
                t.couldNotLoad,
            )
          }

          setAlerts(
            data.alerts ?? [],
          )

          setError('')
        } catch (error) {
          console.error(error)

          setError(
            error instanceof Error
              ? error.message
              : t.couldNotLoad,
          )
        } finally {
          setLoading(false)
        }
      },
      [t],
    )

  useEffect(() => {
    loadAlerts()
  }, [loadAlerts])

  const handlePublish =
    async () => {
      const cleanTitle =
        title.trim()

      const cleanMessage =
        message.trim()

      const cleanRegion =
        region.trim()

      setError('')

      if (
        !cleanTitle ||
        !cleanMessage ||
        !cleanRegion
      ) {
        setError(
          t.requiredFields,
        )

        return
      }

      const token =
        getToken()

      if (!token) {
        setError(
          t.authenticationRequired,
        )

        return
      }

      try {
        setPublishing(true)

        const response =
          await fetch(
            `${API_URL}/alerts`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  title:
                    cleanTitle,

                  message:
                    cleanMessage,

                  region:
                    cleanRegion,

                  severity,
                }),
            },
          )

        const data =
          (await response.json()) as {
            alert?: SafetyAlert
            message?: string
          }

        if (!response.ok) {
          throw new Error(
            data.message ||
              t.couldNotPublish,
          )
        }

        setTitle('')
        setMessage('')
        setRegion('')

        setSeverity(
          'INFO',
        )

        await loadAlerts()
      } catch (error) {
        console.error(error)

        setError(
          error instanceof Error
            ? error.message
            : t.couldNotPublish,
        )
      } finally {
        setPublishing(false)
      }
    }

  const handleToggle =
    async (
      alert: SafetyAlert,
    ) => {
      const token =
        getToken()

      if (!token) {
        setError(
          t.authenticationRequired,
        )

        return
      }

      try {
        setUpdatingId(
          alert.id,
        )

        setError('')

        const response =
          await fetch(
            `${API_URL}/alerts/${alert.id}`,
            {
              method:
                'PATCH',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  isActive:
                    !alert.isActive,
                }),
            },
          )

        const data =
          (await response.json()) as {
            alert?: SafetyAlert
            message?: string
          }

        if (!response.ok) {
          throw new Error(
            data.message ||
              t.couldNotUpdate,
          )
        }

        await loadAlerts()
      } catch (error) {
        console.error(error)

        setError(
          error instanceof Error
            ? error.message
            : t.couldNotUpdate,
        )
      } finally {
        setUpdatingId(null)
      }
    }

  const locale =
    language === 'ru'
      ? 'ru-RU'
      : language === 'kk'
        ? 'kk-KZ'
        : 'en-US'

  const getSeverityText = (
    alertSeverity:
      AlertSeverity,
  ) => {
    if (
      alertSeverity === 'INFO'
    ) {
      return t.information
    }

    if (
      alertSeverity ===
      'WARNING'
    ) {
      return t.warning
    }

    return t.critical
  }

  return (
    <section className="alerts-panel">
      <div className="alerts-heading">
        <div>
          <p className="alerts-eyebrow">
            {t.publicSafety}
          </p>

          <h2>
            {t.title}
          </h2>

          <p className="alerts-description">
            {t.description}
          </p>
        </div>
      </div>

      <div className="alert-form-card">
        <div className="alert-form-grid">
          <div className="alert-field">
            <label htmlFor="alert-title">
              {t.alertTitle}
            </label>

            <input
              id="alert-title"
              value={title}
              onChange={(
                event,
              ) =>
                setTitle(
                  event.target
                    .value,
                )
              }
              placeholder={
                t.alertTitlePlaceholder
              }
            />
          </div>

          <div className="alert-field">
            <label htmlFor="alert-region">
              {t.region}
            </label>

            <input
              id="alert-region"
              value={region}
              onChange={(
                event,
              ) =>
                setRegion(
                  event.target
                    .value,
                )
              }
              placeholder={
                t.regionPlaceholder
              }
            />
          </div>

          <div className="alert-field">
            <label htmlFor="alert-severity">
              {t.severity}
            </label>

            <select
              id="alert-severity"
              value={severity}
              onChange={(
                event,
              ) =>
                setSeverity(
                  event.target
                    .value as AlertSeverity,
                )
              }
            >
              <option value="INFO">
                {t.information}
              </option>

              <option value="WARNING">
                {t.warning}
              </option>

              <option value="CRITICAL">
                {t.critical}
              </option>
            </select>
          </div>
        </div>

        <div className="alert-field">
          <label htmlFor="alert-message">
            {t.publicMessage}
          </label>

          <textarea
            id="alert-message"
            value={message}
            onChange={(
              event,
            ) =>
              setMessage(
                event.target
                  .value,
              )
            }
            placeholder={
              t.messagePlaceholder
            }
            rows={4}
            maxLength={800}
          />

          <span className="alert-counter">
            {message.length}
            /800
          </span>
        </div>

        {error && (
          <p className="alert-error">
            {error}
          </p>
        )}

        <button
          className="alert-publish-button"
          type="button"
          disabled={publishing}
          onClick={
            handlePublish
          }
        >
          {publishing
            ? t.publishing
            : t.publish}
        </button>
      </div>

      <div className="alerts-list-heading">
        <h3>
          {t.publishedAlerts}
        </h3>

        <span>
          {alerts.length}
        </span>
      </div>

      {loading ? (
        <div className="alert-empty">
          {t.loading}
        </div>
      ) : alerts.length ===
        0 ? (
        <div className="alert-empty">
          {t.noAlerts}
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map(
            (alert) => (
              <article
                key={alert.id}
                className={`operator-alert-card severity-${alert.severity.toLowerCase()}`}
              >
                <div className="operator-alert-top">
                  <div>
                    <div className="operator-alert-badges">
                      <span
                        className={`severity-badge severity-badge-${alert.severity.toLowerCase()}`}
                      >
                        {getSeverityText(
                          alert.severity,
                        )}
                      </span>

                      <span
                        className={
                          alert.isActive
                            ? 'active-badge'
                            : 'inactive-badge'
                        }
                      >
                        {alert.isActive
                          ? t.active
                          : t.inactive}
                      </span>
                    </div>

                    <h4>
                      {alert.title}
                    </h4>
                  </div>

                  <button
                    type="button"
                    className="alert-toggle-button"
                    disabled={
                      updatingId ===
                      alert.id
                    }
                    onClick={() =>
                      handleToggle(
                        alert,
                      )
                    }
                  >
                    {updatingId ===
                    alert.id
                      ? t.updating
                      : alert.isActive
                        ? t.deactivate
                        : t.activate}
                  </button>
                </div>

                <p className="operator-alert-message">
                  {alert.message}
                </p>

                <div className="operator-alert-footer">
                  <span>
                    {alert.region}
                  </span>

                  <span>
                    {new Date(
                      alert.createdAt,
                    ).toLocaleString(
                      locale,
                    )}
                  </span>
                </div>
              </article>
            ),
          )}
        </div>
      )}
    </section>
  )
}

export default SafetyAlertsPanel