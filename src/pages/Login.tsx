import {
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import { API_URL } from '../lib/api'

import type {
  AuthResponse,
} from '../types/auth'

type OperatorLanguage =
  | 'en'
  | 'ru'
  | 'kk'

type IconProps = {
  size?: number
}

const translations = {
  en: {
    operationsPlatform:
      'Emergency Operations Platform',

    emergencyOperations:
      'EMERGENCY OPERATIONS',

    headlineOne:
      'One command center.',

    headlineTwo:
      'Every active response.',

    intro:
      'Secure operational access for emergency dispatch, coordination and live responder management.',

    incidentMonitoring:
      'Live incident monitoring',

    incidentMonitoringDescription:
      'Track active emergency requests and operational status in real time.',

    responderCoordination:
      'Responder coordination',

    responderCoordinationDescription:
      'Assign available responders and monitor live GPS updates.',

    secureOperations:
      'Secure operations',

    secureOperationsDescription:
      'Restricted access for authorized emergency personnel only.',

    systemOperational:
      'System operational',

    networkAvailable:
      'Emergency services network available',

    operatorPortal:
      'Operator Portal',

    secureAccess:
      'SECURE OPERATOR ACCESS',

    signInTitle:
      'Sign in to Control Center',

    signInDescription:
      'Use your authorized operator credentials to continue.',

    email:
      'Email address',

    emailPlaceholder:
      'operator@resq.kz',

    password:
      'Password',

    passwordPlaceholder:
      'Enter your password',

    hidePassword:
      'Hide password',

    showPassword:
      'Show password',

    emailRequired:
      'Email is required',

    passwordRequired:
      'Password is required',

    signInFailed:
      'Sign in failed',

    restricted:
      'This portal is restricted to authorized emergency operators.',

    connectionError:
      'Could not connect to the control center.',

    authenticating:
      'Authenticating...',

    signIn:
      'Sign in to Control Center',

    security:
      'Authorized personnel only. Access may be monitored and logged for operational security.',

    footer:
      'ResQ Emergency Operations Platform',
  },

  ru: {
    operationsPlatform:
      'Платформа экстренных операций',

    emergencyOperations:
      'ЭКСТРЕННЫЕ ОПЕРАЦИИ',

    headlineOne:
      'Единый центр управления.',

    headlineTwo:
      'Каждый активный вызов.',

    intro:
      'Безопасный доступ для диспетчеризации, координации и управления спасателями в реальном времени.',

    incidentMonitoring:
      'Мониторинг вызовов',

    incidentMonitoringDescription:
      'Отслеживайте активные экстренные вызовы и их статус в реальном времени.',

    responderCoordination:
      'Координация спасателей',

    responderCoordinationDescription:
      'Назначайте доступных спасателей и отслеживайте их GPS.',

    secureOperations:
      'Безопасная работа',

    secureOperationsDescription:
      'Доступ разрешён только авторизованному персоналу экстренных служб.',

    systemOperational:
      'Система работает',

    networkAvailable:
      'Сеть экстренных служб доступна',

    operatorPortal:
      'Портал оператора',

    secureAccess:
      'БЕЗОПАСНЫЙ ДОСТУП',

    signInTitle:
      'Вход в центр управления',

    signInDescription:
      'Используйте данные авторизованного оператора для продолжения.',

    email:
      'Электронная почта',

    emailPlaceholder:
      'operator@resq.kz',

    password:
      'Пароль',

    passwordPlaceholder:
      'Введите пароль',

    hidePassword:
      'Скрыть пароль',

    showPassword:
      'Показать пароль',

    emailRequired:
      'Введите электронную почту',

    passwordRequired:
      'Введите пароль',

    signInFailed:
      'Не удалось войти',

    restricted:
      'Доступ к этому порталу разрешён только авторизованным операторам экстренных служб.',

    connectionError:
      'Не удалось подключиться к центру управления.',

    authenticating:
      'Авторизация...',

    signIn:
      'Войти в центр управления',

    security:
      'Только для авторизованного персонала. Доступ может контролироваться и регистрироваться в целях безопасности.',

    footer:
      'Платформа экстренных операций ResQ',
  },

  kk: {
    operationsPlatform:
      'Төтенше операциялар платформасы',

    emergencyOperations:
      'ТӨТЕНШЕ ОПЕРАЦИЯЛАР',

    headlineOne:
      'Бірыңғай басқару орталығы.',

    headlineTwo:
      'Әрбір белсенді шақырту.',

    intro:
      'Диспетчерлеу, үйлестіру және құтқарушыларды тікелей басқару үшін қауіпсіз қолжетімділік.',

    incidentMonitoring:
      'Шақыртуларды бақылау',

    incidentMonitoringDescription:
      'Белсенді төтенше шақыртулар мен олардың күйін нақты уақытта бақылаңыз.',

    responderCoordination:
      'Құтқарушыларды үйлестіру',

    responderCoordinationDescription:
      'Қолжетімді құтқарушыларды тағайындап, олардың GPS орналасуын бақылаңыз.',

    secureOperations:
      'Қауіпсіз операциялар',

    secureOperationsDescription:
      'Қолжетімділік тек уәкілетті төтенше қызмет қызметкерлеріне беріледі.',

    systemOperational:
      'Жүйе жұмыс істеп тұр',

    networkAvailable:
      'Төтенше қызметтер желісі қолжетімді',

    operatorPortal:
      'Оператор порталы',

    secureAccess:
      'ҚАУІПСІЗ ОПЕРАТОР ҚОЛЖЕТІМДІЛІГІ',

    signInTitle:
      'Басқару орталығына кіру',

    signInDescription:
      'Жалғастыру үшін оператордың рұқсат етілген деректерін пайдаланыңыз.',

    email:
      'Электрондық пошта',

    emailPlaceholder:
      'operator@resq.kz',

    password:
      'Құпия сөз',

    passwordPlaceholder:
      'Құпия сөзді енгізіңіз',

    hidePassword:
      'Құпия сөзді жасыру',

    showPassword:
      'Құпия сөзді көрсету',

    emailRequired:
      'Электрондық поштаны енгізіңіз',

    passwordRequired:
      'Құпия сөзді енгізіңіз',

    signInFailed:
      'Кіру мүмкін болмады',

    restricted:
      'Бұл портал тек уәкілетті төтенше қызмет операторларына арналған.',

    connectionError:
      'Басқару орталығына қосылу мүмкін болмады.',

    authenticating:
      'Авторизация...',

    signIn:
      'Басқару орталығына кіру',

    security:
      'Тек уәкілетті қызметкерлерге арналған. Қауіпсіздік мақсатында қолжетімділік бақылануы және тіркелуі мүмкін.',

    footer:
      'ResQ төтенше операциялар платформасы',
  },
} as const

function MailIcon({
  size = 18,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="m5 7 7 5 7-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LockIcon({
  size = 18,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="10"
        width="16"
        height="11"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function EyeIcon({
  size = 18,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="12"
        cy="12"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function ShieldIcon({
  size = 18,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3 5 6v5c0 4.6 2.7 8.1 7 10 4.3-1.9 7-5.4 7-10V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ActivityIcon({
  size = 18,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 12h4l2-6 4 12 2-6h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function UsersIcon({
  size = 18,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="9"
        cy="8"
        r="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M16 6.5a3 3 0 0 1 0 5.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M17 15c2.3.7 3.6 2.3 4 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Login() {
  const navigate =
    useNavigate()

  const [
    language,
    setLanguage,
  ] = useState<OperatorLanguage>(() => {
    const saved =
      localStorage.getItem(
        'resq-operator-language',
      )

    if (
      saved === 'ru' ||
      saved === 'kk'
    ) {
      return saved
    }

    return 'en'
  })

  const t =
    translations[language]

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [
    showPassword,
    setShowPassword,
  ] = useState(false)

  const [
    emailError,
    setEmailError,
  ] = useState('')

  const [
    passwordError,
    setPasswordError,
  ] = useState('')

  const [
    serverError,
    setServerError,
  ] = useState('')

  const [loading, setLoading] =
    useState(false)

  const changeLanguage = (
    nextLanguage:
      OperatorLanguage,
  ) => {
    setLanguage(nextLanguage)

    localStorage.setItem(
      'resq-operator-language',
      nextLanguage,
    )
  }

  useEffect(() => {
    document.documentElement.lang =
      language
  }, [language])

  const handleLogin =
    async () => {
      setEmailError('')
      setPasswordError('')
      setServerError('')

      const cleanEmail =
        email.trim()

      let hasError = false

      if (!cleanEmail) {
        setEmailError(
          t.emailRequired,
        )

        hasError = true
      }

      if (!password) {
        setPasswordError(
          t.passwordRequired,
        )

        hasError = true
      }

      if (hasError) {
        return
      }

      try {
        setLoading(true)

        const response =
          await fetch(
            `${API_URL}/auth/login`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify({
                  email:
                    cleanEmail,

                  password,
                }),
            },
          )

        const data =
          await response.json()

        if (!response.ok) {
          setServerError(
            data.message ||
              t.signInFailed,
          )

          return
        }

        const authData =
          data as AuthResponse

        if (
          authData.user.role !==
            'OPERATOR' &&
          authData.user.role !==
            'ADMIN'
        ) {
          setServerError(
            t.restricted,
          )

          return
        }

        localStorage.setItem(
          'token',
          authData.token,
        )

        localStorage.setItem(
          'user',
          JSON.stringify(
            authData.user,
          ),
        )

        navigate('/operator')
      } catch (error) {
        console.error(error)

        setServerError(
          t.connectionError,
        )
      } finally {
        setLoading(false)
      }
    }

  const handleKeyDown = (
    event:
      React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      event.key === 'Enter'
    ) {
      handleLogin()
    }
  }

  return (
    <div className="operator-login-page">
      {/* LEFT PANEL */}

      <section className="operator-login-visual">
        <div className="operator-login-visual-inner">
          <div className="operator-login-brand">
            <div className="operator-login-logo">
              ResQ
            </div>

            <div>
              <strong>
                ResQ Control Center
              </strong>

              <span>
                {t.operationsPlatform}
              </span>
            </div>
          </div>

          <div className="operator-login-intro">
            <p>
              {t.emergencyOperations}
            </p>

            <h1>
              {t.headlineOne}

              <br />

              {t.headlineTwo}
            </h1>

            <span>
              {t.intro}
            </span>
          </div>

          <div className="operator-login-features">
            <div className="operator-login-feature">
              <div>
                <ActivityIcon />
              </div>

              <section>
                <strong>
                  {t.incidentMonitoring}
                </strong>

                <span>
                  {
                    t.incidentMonitoringDescription
                  }
                </span>
              </section>
            </div>

            <div className="operator-login-feature">
              <div>
                <UsersIcon />
              </div>

              <section>
                <strong>
                  {
                    t.responderCoordination
                  }
                </strong>

                <span>
                  {
                    t.responderCoordinationDescription
                  }
                </span>
              </section>
            </div>

            <div className="operator-login-feature">
              <div>
                <ShieldIcon />
              </div>

              <section>
                <strong>
                  {t.secureOperations}
                </strong>

                <span>
                  {
                    t.secureOperationsDescription
                  }
                </span>
              </section>
            </div>
          </div>

          <div className="operator-login-system">
            <span className="operator-login-system-dot" />

            <div>
              <strong>
                {t.systemOperational}
              </strong>

              <span>
                {t.networkAvailable}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* LOGIN PANEL */}

      <section className="operator-login-form-side">
        <div className="operator-login-form-wrapper">
          {/* LANGUAGE */}

          <div
            style={{
              display: 'flex',
              justifyContent:
                'flex-end',
              marginBottom:
                '24px',
            }}
          >
            <div className="operator-language-switcher">
              <button
                type="button"
                className={
                  language === 'en'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  changeLanguage(
                    'en',
                  )
                }
              >
                EN
              </button>

              <button
                type="button"
                className={
                  language === 'ru'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  changeLanguage(
                    'ru',
                  )
                }
              >
                RU
              </button>

              <button
                type="button"
                className={
                  language === 'kk'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  changeLanguage(
                    'kk',
                  )
                }
              >
                KZ
              </button>
            </div>
          </div>

          <div className="operator-login-mobile-brand">
            <div className="operator-login-logo">
              ResQ
            </div>

            <div>
              <strong>
                ResQ Control
              </strong>

              <span>
                {t.operatorPortal}
              </span>
            </div>
          </div>

          <div className="operator-login-form-heading">
            <p>
              {t.secureAccess}
            </p>

            <h2>
              {t.signInTitle}
            </h2>

            <span>
              {t.signInDescription}
            </span>
          </div>

          <div className="operator-login-form">
            <label className="operator-login-field">
              <span>
                {t.email}
              </span>

              <div
                className={`operator-login-input ${
                  emailError
                    ? 'error'
                    : ''
                }`}
              >
                <MailIcon />

                <input
                  type="email"
                  value={email}
                  placeholder={
                    t.emailPlaceholder
                  }
                  autoComplete="email"
                  disabled={loading}
                  onChange={(event) => {
                    setEmail(
                      event.target
                        .value,
                    )

                    setEmailError('')
                    setServerError('')
                  }}
                  onKeyDown={
                    handleKeyDown
                  }
                />
              </div>

              {emailError && (
                <small className="operator-login-field-error">
                  {emailError}
                </small>
              )}
            </label>

            <label className="operator-login-field">
              <div className="operator-login-label-row">
                <span>
                  {t.password}
                </span>
              </div>

              <div
                className={`operator-login-input ${
                  passwordError
                    ? 'error'
                    : ''
                }`}
              >
                <LockIcon />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  placeholder={
                    t.passwordPlaceholder
                  }
                  autoComplete="current-password"
                  disabled={loading}
                  onChange={(event) => {
                    setPassword(
                      event.target
                        .value,
                    )

                    setPasswordError(
                      '',
                    )

                    setServerError('')
                  }}
                  onKeyDown={
                    handleKeyDown
                  }
                />

                <button
                  type="button"
                  className="operator-login-eye"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current,
                    )
                  }
                  aria-label={
                    showPassword
                      ? t.hidePassword
                      : t.showPassword
                  }
                >
                  <EyeIcon />
                </button>
              </div>

              {passwordError && (
                <small className="operator-login-field-error">
                  {passwordError}
                </small>
              )}
            </label>

            {serverError && (
              <div className="operator-login-error">
                <ShieldIcon
                  size={17}
                />

                <span>
                  {serverError}
                </span>
              </div>
            )}

            <button
              type="button"
              className="operator-login-submit"
              disabled={loading}
              onClick={handleLogin}
            >
              {loading ? (
                <>
                  <span className="operator-login-spinner" />

                  {t.authenticating}
                </>
              ) : (
                <>
                  {t.signIn}

                  <span>
                    →
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="operator-login-security">
            <ShieldIcon
              size={15}
            />

            <span>
              {t.security}
            </span>
          </div>
        </div>

        <footer className="operator-login-footer">
          {t.footer}
        </footer>
      </section>
    </div>
  )
}

export default Login