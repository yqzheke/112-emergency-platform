import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useNavigate } from 'react-router-dom'

import EmergencyMap from '../components/EmergencyMap'
import SafetyAlertsPanel from '../components/SafetyAlertsPanel'

import { API_URL } from '../lib/api'
import { clearAuth } from '../lib/auth'

import type {
  OperatorEmergency,
  ResponderUser,
} from '../types/emergency'

type OperatorLanguage =
  | 'en'
  | 'ru'
  | 'kk'

type IconProps = {
  size?: number
  className?: string
}

/* =========================================================
   TRANSLATIONS
   ========================================================= */

const translations = {
  en: {
    operations: 'OPERATIONS',
    overview: 'Overview',
    emergencies: 'Emergencies',
    responders: 'Responders',
    safetyAlerts: 'Safety Alerts',

    systemOperational:
      'System operational',
    liveSync:
      'Live sync every 5 seconds',
    operator: 'Operator',
    controlCenter: 'Control center',

    emergencyOperations:
      'EMERGENCY OPERATIONS',
    controlCenterTitle:
      'Control Center',
    live: 'Live',
    refresh: 'Refresh',

    operationsOverview:
      'Operations overview',
    overviewDescription:
      'Monitor active incidents, responder availability and emergency operations.',
    autoRefresh:
      'Auto-refresh enabled',

    activeIncidents:
      'Active incidents',
    currentlyOpen:
      'Currently open',

    awaitingAction:
      'Awaiting action',
    pendingReview:
      'Pending operator review',

    availableResponders:
      'Available responders',
    registered:
      'registered',

    closedIncidents:
      'Closed incidents',
    completedCancelled:
      'Completed or cancelled',

    liveQueue:
      'LIVE QUEUE',
    activeEmergencies:
      'Active emergencies',
    incomingRequests:
      'Incoming and ongoing emergency requests.',
    open: 'open',

    noActive:
      'No active emergencies',
    newRequests:
      'New requests will automatically appear here.',

    medical: 'Medical',
    police: 'Police',
    fire: 'Fire & Rescue',
    emergency: 'Emergency',

    received:
      'Received',
    incidentDescription:
      'INCIDENT DESCRIPTION',

    caller: 'Caller',
    coordinates:
      'Coordinates',

    aiAnalysis:
      'AI INTAKE ANALYSIS',
    emergencyIntelligence:
      'Emergency intelligence',
    suggestedService:
      'Suggested service',
    urgency: 'Urgency',
    summary: 'Summary',
    importantDetails:
      'Important details',
    aiNote:
      'AI-generated intake assistance. Operator verification is required.',

    liveIncidentMap:
      'LIVE INCIDENT MAP',
    locationTracking:
      'Location & responder tracking',

    responderGpsLive:
      'Responder GPS live',
    waitingGps:
      'Waiting for responder GPS',
    noResponderAssigned:
      'No responder assigned',
    lastUpdated:
      'Last updated',

    responder:
      'Responder',
    responderAssignment:
      'RESPONDER ASSIGNMENT',
    responderOnScene:
      'Responder on scene',
    responderEnRoute:
      'Responder en route',
    responderAssigned:
      'Responder assigned',

    selectResponder:
      'Select available responder',

    busyOn:
      'Busy on',
    available:
      'Available',

    assigning:
      'Assigning...',
    assignResponder:
      'Assign responder',

    acceptBeforeAssign:
      'Accept this emergency before assigning a responder.',

    noResponderAccounts:
      'No responder accounts are currently available.',

    assigned: 'Assigned',
    assignmentAccepted:
      'Assignment accepted',
    gpsUpdated:
      'GPS updated',
    arrived: 'Arrived',

    emergencyContacts:
      'EMERGENCY CONTACTS',
    attached:
      'attached',

    noContacts:
      'No emergency contacts attached to this request.',

    prepared:
      'Prepared',

    notificationNote:
      'Contact notification delivery is simulated in this MVP.',

    nextAction:
      'NEXT ACTION',

    reviewAccept:
      'Review and accept this incoming request.',

    accepting:
      'Accepting...',
    acceptRequest:
      'Accept request',

    selectAssign:
      'Select and assign an available responder above.',

    waitingResponder:
      'Waiting for the responder to accept the assignment.',

    responderRoute:
      'Responder is en route. Live status is controlled by the responder application.',

    responderScene:
      'Responder is on scene. Waiting for incident completion.',

    recentActivity:
      'RECENT ACTIVITY',
    noClosed:
      'No closed incidents yet.',

    incident:
      'Incident',

    operationsStatus:
      'Operations status',
    apiConnection:
      'API connection',
    healthy:
      'Healthy',
    incidentSync:
      'Incident sync',
    seconds:
      '5 seconds',
    responderNetwork:
      'Responder network',
    units:
      'units',

    loadingOperations:
      'Loading Emergency Operations',
    connecting:
      'Connecting to control center...',

    onScene:
      'ON SCENE',
    pending:
      'PENDING',
    accepted:
      'ACCEPTED',
    dispatched:
      'DISPATCHED',
    responding:
      'RESPONDING',
    completed:
      'COMPLETED',
    cancelled:
      'CANCELLED',

    couldNotLoadEmergencies:
      'Could not load emergencies',
    couldNotLoadResponders:
      'Could not load responders',
    couldNotConnect:
      'Could not connect to the server',
    couldNotAccept:
      'Could not accept emergency',
    couldNotAssign:
      'Could not assign responder',
    selectResponderFirst:
      'Select a responder first.',
  },

  ru: {
    operations: 'ОПЕРАЦИИ',
    overview: 'Обзор',
    emergencies: 'Вызовы',
    responders: 'Спасатели',
    safetyAlerts: 'Оповещения',

    systemOperational:
      'Система работает',
    liveSync:
      'Синхронизация каждые 5 секунд',
    operator: 'Оператор',
    controlCenter:
      'Центр управления',

    emergencyOperations:
      'ЭКСТРЕННЫЕ ОПЕРАЦИИ',
    controlCenterTitle:
      'Центр управления',
    live: 'Онлайн',
    refresh: 'Обновить',

    operationsOverview:
      'Обзор операций',
    overviewDescription:
      'Мониторинг активных вызовов, доступности спасателей и экстренных операций.',
    autoRefresh:
      'Автообновление включено',

    activeIncidents:
      'Активные вызовы',
    currentlyOpen:
      'Сейчас открыто',

    awaitingAction:
      'Ожидают действий',
    pendingReview:
      'Ожидают проверки оператора',

    availableResponders:
      'Доступные спасатели',
    registered:
      'зарегистрировано',

    closedIncidents:
      'Закрытые вызовы',
    completedCancelled:
      'Завершены или отменены',

    liveQueue:
      'АКТИВНАЯ ОЧЕРЕДЬ',
    activeEmergencies:
      'Активные вызовы',
    incomingRequests:
      'Входящие и текущие экстренные вызовы.',
    open: 'открыто',

    noActive:
      'Нет активных вызовов',
    newRequests:
      'Новые вызовы появятся здесь автоматически.',

    medical:
      'Медицинская помощь',
    police: 'Полиция',
    fire:
      'Пожарная служба',
    emergency:
      'вызов',

    received:
      'Получено',
    incidentDescription:
      'ОПИСАНИЕ ПРОИСШЕСТВИЯ',

    caller:
      'Заявитель',
    coordinates:
      'Координаты',

    aiAnalysis:
      'АНАЛИЗ RESQ AI',
    emergencyIntelligence:
      'Анализ происшествия',
    suggestedService:
      'Рекомендуемая служба',
    urgency:
      'Срочность',
    summary:
      'Сводка',
    importantDetails:
      'Важные детали',
    aiNote:
      'Анализ создан ИИ. Требуется проверка оператором.',

    liveIncidentMap:
      'КАРТА ПРОИСШЕСТВИЯ',
    locationTracking:
      'Отслеживание вызова и спасателя',

    responderGpsLive:
      'GPS спасателя активен',
    waitingGps:
      'Ожидание GPS спасателя',
    noResponderAssigned:
      'Спасатель не назначен',
    lastUpdated:
      'Обновлено',

    responder:
      'Спасатель',
    responderAssignment:
      'НАЗНАЧЕНИЕ СПАСАТЕЛЯ',
    responderOnScene:
      'Спасатель на месте',
    responderEnRoute:
      'Спасатель в пути',
    responderAssigned:
      'Спасатель назначен',

    selectResponder:
      'Выберите доступного спасателя',

    busyOn:
      'Занят на вызове',
    available:
      'Доступен',

    assigning:
      'Назначение...',
    assignResponder:
      'Назначить спасателя',

    acceptBeforeAssign:
      'Сначала примите вызов, затем назначьте спасателя.',

    noResponderAccounts:
      'Нет доступных аккаунтов спасателей.',

    assigned:
      'Назначен',
    assignmentAccepted:
      'Назначение принято',
    gpsUpdated:
      'GPS обновлён',
    arrived:
      'Прибыл',

    emergencyContacts:
      'ЭКСТРЕННЫЕ КОНТАКТЫ',
    attached:
      'добавлено',

    noContacts:
      'К этому вызову не прикреплены экстренные контакты.',

    prepared:
      'Готово',

    notificationNote:
      'Отправка уведомлений контактам симулируется в этом MVP.',

    nextAction:
      'СЛЕДУЮЩЕЕ ДЕЙСТВИЕ',

    reviewAccept:
      'Проверьте и примите входящий вызов.',

    accepting:
      'Принятие...',
    acceptRequest:
      'Принять вызов',

    selectAssign:
      'Выберите и назначьте доступного спасателя выше.',

    waitingResponder:
      'Ожидание подтверждения назначения спасателем.',

    responderRoute:
      'Спасатель в пути. Текущий статус передаётся из приложения спасателя.',

    responderScene:
      'Спасатель на месте. Ожидание завершения происшествия.',

    recentActivity:
      'ПОСЛЕДНЯЯ АКТИВНОСТЬ',
    noClosed:
      'Закрытых вызовов пока нет.',

    incident:
      'Вызов',

    operationsStatus:
      'Статус операций',
    apiConnection:
      'Подключение API',
    healthy:
      'Работает',
    incidentSync:
      'Синхронизация',
    seconds:
      '5 секунд',
    responderNetwork:
      'Сеть спасателей',
    units:
      'ед.',

    loadingOperations:
      'Загрузка экстренных операций',
    connecting:
      'Подключение к центру управления...',

    onScene:
      'НА МЕСТЕ',
    pending:
      'ОЖИДАЕТ',
    accepted:
      'ПРИНЯТ',
    dispatched:
      'НАПРАВЛЕН',
    responding:
      'В ПУТИ',
    completed:
      'ЗАВЕРШЁН',
    cancelled:
      'ОТМЕНЁН',

    couldNotLoadEmergencies:
      'Не удалось загрузить вызовы',
    couldNotLoadResponders:
      'Не удалось загрузить спасателей',
    couldNotConnect:
      'Не удалось подключиться к серверу',
    couldNotAccept:
      'Не удалось принять вызов',
    couldNotAssign:
      'Не удалось назначить спасателя',
    selectResponderFirst:
      'Сначала выберите спасателя.',
  },

  kk: {
    operations:
      'ОПЕРАЦИЯЛАР',
    overview:
      'Шолу',
    emergencies:
      'Шақыртулар',
    responders:
      'Құтқарушылар',
    safetyAlerts:
      'Хабарламалар',

    systemOperational:
      'Жүйе жұмыс істеп тұр',
    liveSync:
      'Әр 5 секунд сайын синхрондау',
    operator:
      'Оператор',
    controlCenter:
      'Басқару орталығы',

    emergencyOperations:
      'ТӨТЕНШЕ ОПЕРАЦИЯЛАР',
    controlCenterTitle:
      'Басқару орталығы',
    live:
      'Онлайн',
    refresh:
      'Жаңарту',

    operationsOverview:
      'Операциялар шолуы',
    overviewDescription:
      'Белсенді шақыртуларды, құтқарушылардың қолжетімділігін және төтенше операцияларды бақылау.',
    autoRefresh:
      'Автожаңарту қосулы',

    activeIncidents:
      'Белсенді шақыртулар',
    currentlyOpen:
      'Қазір ашық',

    awaitingAction:
      'Әрекет күтуде',
    pendingReview:
      'Оператор тексеруін күтуде',

    availableResponders:
      'Қолжетімді құтқарушылар',
    registered:
      'тіркелген',

    closedIncidents:
      'Жабылған шақыртулар',
    completedCancelled:
      'Аяқталған немесе жойылған',

    liveQueue:
      'ТІКЕЛЕЙ КЕЗЕК',
    activeEmergencies:
      'Белсенді шақыртулар',
    incomingRequests:
      'Кіріс және ағымдағы төтенше шақыртулар.',
    open:
      'ашық',

    noActive:
      'Белсенді шақыртулар жоқ',
    newRequests:
      'Жаңа шақыртулар автоматты түрде осында шығады.',

    medical:
      'Медициналық көмек',
    police:
      'Полиция',
    fire:
      'Өрт сөндіру қызметі',
    emergency:
      'шақырту',

    received:
      'Қабылданды',
    incidentDescription:
      'ОҚИҒА СИПАТТАМАСЫ',

    caller:
      'Өтініш беруші',
    coordinates:
      'Координаттар',

    aiAnalysis:
      'RESQ AI ТАЛДАУЫ',
    emergencyIntelligence:
      'Оқиғаны талдау',
    suggestedService:
      'Ұсынылған қызмет',
    urgency:
      'Шұғылдық',
    summary:
      'Қорытынды',
    importantDetails:
      'Маңызды мәліметтер',
    aiNote:
      'ЖИ көмегімен жасалған талдау. Оператор тексеруі қажет.',

    liveIncidentMap:
      'ОҚИҒА КАРТАСЫ',
    locationTracking:
      'Оқиға мен құтқарушыны бақылау',

    responderGpsLive:
      'Құтқарушы GPS белсенді',
    waitingGps:
      'Құтқарушы GPS күтілуде',
    noResponderAssigned:
      'Құтқарушы тағайындалмаған',
    lastUpdated:
      'Жаңартылды',

    responder:
      'Құтқарушы',
    responderAssignment:
      'ҚҰТҚАРУШЫНЫ ТАҒАЙЫНДАУ',
    responderOnScene:
      'Құтқарушы оқиға орнында',
    responderEnRoute:
      'Құтқарушы жолда',
    responderAssigned:
      'Құтқарушы тағайындалды',

    selectResponder:
      'Қолжетімді құтқарушыны таңдаңыз',

    busyOn:
      'Шақыртуда',
    available:
      'Қолжетімді',

    assigning:
      'Тағайындалуда...',
    assignResponder:
      'Құтқарушыны тағайындау',

    acceptBeforeAssign:
      'Құтқарушыны тағайындау алдында шақыртуды қабылдаңыз.',

    noResponderAccounts:
      'Қолжетімді құтқарушы аккаунттары жоқ.',

    assigned:
      'Тағайындалды',
    assignmentAccepted:
      'Тапсырма қабылданды',
    gpsUpdated:
      'GPS жаңартылды',
    arrived:
      'Келді',

    emergencyContacts:
      'ТӨТЕНШЕ БАЙЛАНЫСТАР',
    attached:
      'қосылған',

    noContacts:
      'Бұл шақыртуға төтенше байланыстар қосылмаған.',

    prepared:
      'Дайын',

    notificationNote:
      'Байланыстарға хабарлама жіберу осы MVP-де симуляцияланады.',

    nextAction:
      'КЕЛЕСІ ӘРЕКЕТ',

    reviewAccept:
      'Кіріс шақыртуды тексеріп, қабылдаңыз.',

    accepting:
      'Қабылдануда...',
    acceptRequest:
      'Шақыртуды қабылдау',

    selectAssign:
      'Жоғарыдан қолжетімді құтқарушыны таңдап, тағайындаңыз.',

    waitingResponder:
      'Құтқарушының тапсырманы қабылдауын күту.',

    responderRoute:
      'Құтқарушы жолда. Тікелей мәртебе құтқарушы қолданбасынан басқарылады.',

    responderScene:
      'Құтқарушы оқиға орнында. Оқиғаның аяқталуы күтілуде.',

    recentActivity:
      'СОҢҒЫ БЕЛСЕНДІЛІК',
    noClosed:
      'Жабылған шақыртулар жоқ.',

    incident:
      'Шақырту',

    operationsStatus:
      'Операциялар күйі',
    apiConnection:
      'API байланысы',
    healthy:
      'Қалыпты',
    incidentSync:
      'Синхрондау',
    seconds:
      '5 секунд',
    responderNetwork:
      'Құтқарушылар желісі',
    units:
      'бірлік',

    loadingOperations:
      'Төтенше операциялар жүктелуде',
    connecting:
      'Басқару орталығына қосылуда...',

    onScene:
      'ОҚИҒА ОРНЫНДА',
    pending:
      'КҮТУДЕ',
    accepted:
      'ҚАБЫЛДАНДЫ',
    dispatched:
      'ЖІБЕРІЛДІ',
    responding:
      'ЖОЛДА',
    completed:
      'АЯҚТАЛДЫ',
    cancelled:
      'ЖОЙЫЛДЫ',

    couldNotLoadEmergencies:
      'Шақыртуларды жүктеу мүмкін болмады',
    couldNotLoadResponders:
      'Құтқарушыларды жүктеу мүмкін болмады',
    couldNotConnect:
      'Серверге қосылу мүмкін болмады',
    couldNotAccept:
      'Шақыртуды қабылдау мүмкін болмады',
    couldNotAssign:
      'Құтқарушыны тағайындау мүмкін болмады',
    selectResponderFirst:
      'Алдымен құтқарушыны таңдаңыз.',
  },
} as const

/* =========================================================
   ICONS
   ========================================================= */

function DashboardIcon({
  size = 18,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function EmergencyIcon({
  size = 18,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 3L3.5 20h17L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M12 9v4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="17"
        r="1"
        fill="currentColor"
      />
    </svg>
  )
}

function ResponderIcon({
  size = 18,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M4.5 21c.7-4.1 3.2-6.2 7.5-6.2s6.8 2.1 7.5 6.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function AlertIcon({
  size = 18,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M10 21h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function RefreshIcon({
  size = 17,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 6v5h-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M19 11a7 7 0 1 0-2 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LogoutIcon({
  size = 17,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 5H5v14h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M13 8l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M17 12H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ActivityIcon({
  size = 18,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
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

function CheckIcon({
  size = 18,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClockIcon({
  size = 18,
  className,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function scrollToSection(
  id: string,
) {
  document
    .getElementById(id)
    ?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
}

/* =========================================================
   DASHBOARD
   ========================================================= */

function OperatorDashboard() {
  const navigate = useNavigate()

  const [
    language,
    setLanguage,
  ] =
    useState<OperatorLanguage>(() => {
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

  const [
    emergencies,
    setEmergencies,
  ] =
    useState<
      OperatorEmergency[]
    >([])

  const [
    responders,
    setResponders,
  ] =
    useState<
      ResponderUser[]
    >([])

  const [
    selectedResponders,
    setSelectedResponders,
  ] = useState<
    Record<number, number | null>
  >({})

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [
    updatingId,
    setUpdatingId,
  ] =
    useState<number | null>(null)

  const [
    assigningId,
    setAssigningId,
  ] =
    useState<number | null>(null)

  const changeLanguage = (
    nextLanguage:
      OperatorLanguage,
  ) => {
    setLanguage(nextLanguage)

    localStorage.setItem(
      'resq-operator-language',
      nextLanguage,
    )

    document.documentElement.lang =
      nextLanguage
  }

  useEffect(() => {
    document.documentElement.lang =
      language
  }, [language])

  const getToken = () =>
    localStorage.getItem('token')

  const handleUnauthorized =
    useCallback(() => {
      clearAuth()
      navigate('/login')
    }, [navigate])

  const loadEmergencies =
    useCallback(async () => {
      const token = getToken()

      if (!token) {
        handleUnauthorized()
        return
      }

      try {
        const response =
          await fetch(
            `${API_URL}/operator/emergencies`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          )

        const data =
          (await response.json()) as {
            emergencies?:
              OperatorEmergency[]
            message?: string
          }

        if (
          response.status === 401
        ) {
          handleUnauthorized()
          return
        }

        if (!response.ok) {
          setError(
            data.message ||
              t.couldNotLoadEmergencies,
          )

          return
        }

        const nextEmergencies =
          data.emergencies ?? []

        setEmergencies(
          nextEmergencies,
        )

        setSelectedResponders(
          (current) => {
            const next = {
              ...current,
            }

            for (const emergency of
              nextEmergencies) {
              if (
                emergency.assignedResponderId
              ) {
                next[emergency.id] =
                  emergency.assignedResponderId
              }
            }

            return next
          },
        )

        setError('')
      } catch (error) {
        console.error(error)

        setError(
          t.couldNotConnect,
        )
      } finally {
        setLoading(false)
      }
    }, [
      handleUnauthorized,
      t,
    ])

  const loadResponders =
    useCallback(async () => {
      const token = getToken()

      if (!token) {
        handleUnauthorized()
        return
      }

      try {
        const response =
          await fetch(
            `${API_URL}/operator/responders`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          )

        const data =
          (await response.json()) as {
            responders?:
              ResponderUser[]
            message?: string
          }

        if (
          response.status === 401
        ) {
          handleUnauthorized()
          return
        }

        if (!response.ok) {
          setError(
            data.message ||
              t.couldNotLoadResponders,
          )

          return
        }

        setResponders(
          data.responders ?? [],
        )
      } catch (error) {
        console.error(error)

        setError(
          t.couldNotLoadResponders,
        )
      }
    }, [
      handleUnauthorized,
      t,
    ])

  useEffect(() => {
    loadEmergencies()
    loadResponders()

    const interval =
      window.setInterval(
        () => {
          loadEmergencies()
        },
        5000,
      )

    return () => {
      window.clearInterval(
        interval,
      )
    }
  }, [
    loadEmergencies,
    loadResponders,
  ])

  const acceptEmergency =
    async (
      emergencyId: number,
    ) => {
      const token =
        getToken()

      if (!token) {
        handleUnauthorized()
        return
      }

      try {
        setUpdatingId(
          emergencyId,
        )

        setError('')

        const response =
          await fetch(
            `${API_URL}/operator/emergencies/${emergencyId}/status`,
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
                  status:
                    'ACCEPTED',
                }),
            },
          )

        const data =
          (await response.json()) as {
            message?: string
          }

        if (
          response.status === 401
        ) {
          handleUnauthorized()
          return
        }

        if (!response.ok) {
          setError(
            data.message ||
              t.couldNotAccept,
          )

          return
        }

        await loadEmergencies()
      } catch (error) {
        console.error(error)

        setError(
          t.couldNotConnect,
        )
      } finally {
        setUpdatingId(null)
      }
    }

  const assignResponder =
    async (
      emergencyId: number,
    ) => {
      const responderId =
        selectedResponders[
          emergencyId
        ]

      if (!responderId) {
        setError(
          t.selectResponderFirst,
        )

        return
      }

      const token =
        getToken()

      if (!token) {
        handleUnauthorized()
        return
      }

      try {
        setAssigningId(
          emergencyId,
        )

        setError('')

        const response =
          await fetch(
            `${API_URL}/operator/emergencies/${emergencyId}/assign`,
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
                  responderId,
                }),
            },
          )

        const data =
          (await response.json()) as {
            message?: string
          }

        if (
          response.status === 401
        ) {
          handleUnauthorized()
          return
        }

        if (!response.ok) {
          setError(
            data.message ||
              t.couldNotAssign,
          )

          return
        }

        await loadEmergencies()
      } catch (error) {
        console.error(error)

        setError(
          t.couldNotAssign,
        )
      } finally {
        setAssigningId(null)
      }
    }

  const activeEmergencies =
    useMemo(
      () =>
        emergencies.filter(
          (emergency) =>
            emergency.status !==
              'COMPLETED' &&
            emergency.status !==
              'CANCELLED',
        ),
      [emergencies],
    )

  const completedEmergencies =
    useMemo(
      () =>
        emergencies.filter(
          (emergency) =>
            emergency.status ===
              'COMPLETED' ||
            emergency.status ===
              'CANCELLED',
        ),
      [emergencies],
    )

  const pendingCount =
    activeEmergencies.filter(
      (emergency) =>
        emergency.status ===
        'PENDING',
    ).length

  const availableResponders =
    responders.filter(
      (responder) =>
        !responder.isBusy,
    ).length

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  const getEmergencyName = (
    type:
      OperatorEmergency['type'],
  ) => {
    if (type === 'MEDICAL') {
      return t.medical
    }

    if (type === 'POLICE') {
      return t.police
    }

    return t.fire
  }

  const getStatusText = (
    status: string,
  ) => {
    switch (status) {
      case 'PENDING':
        return t.pending

      case 'ACCEPTED':
        return t.accepted

      case 'DISPATCHED':
        return t.dispatched

      case 'RESPONDING':
        return t.responding

      case 'COMPLETED':
        return t.completed

      case 'CANCELLED':
        return t.cancelled

      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="operator-enterprise-loading">
        <div className="operator-enterprise-loading-logo">
          ResQ
        </div>

        <strong>
          {t.loadingOperations}
        </strong>

        <span>
          {t.connecting}
        </span>
      </div>
    )
  }

  return (
    <div className="operator-shell">
      {/* SIDEBAR */}

      <aside className="operator-sidebar">
        <div className="operator-sidebar-brand">
          <div className="operator-sidebar-logo">
            ResQ
          </div>

          <div>
            <strong>
              ResQ Control
            </strong>

            <span>
              {t.emergencyOperations}
            </span>
          </div>
        </div>

        <div className="operator-sidebar-divider" />

        <nav className="operator-nav">
          <span className="operator-nav-label">
            {t.operations}
          </span>

          <button
            type="button"
            className="operator-nav-item active"
            onClick={() =>
              scrollToSection(
                'operator-overview',
              )
            }
          >
            <DashboardIcon />

            <span>
              {t.overview}
            </span>
          </button>

          <button
            type="button"
            className="operator-nav-item"
            onClick={() =>
              scrollToSection(
                'operator-incidents',
              )
            }
          >
            <EmergencyIcon />

            <span>
              {t.emergencies}
            </span>

            {activeEmergencies.length >
              0 && (
              <span className="operator-nav-count">
                {
                  activeEmergencies.length
                }
              </span>
            )}
          </button>

          <button
            type="button"
            className="operator-nav-item"
            onClick={() =>
              scrollToSection(
                'operator-incidents',
              )
            }
          >
            <ResponderIcon />

            <span>
              {t.responders}
            </span>

            <span className="operator-nav-count neutral">
              {availableResponders}
            </span>
          </button>

          <button
            type="button"
            className="operator-nav-item"
            onClick={() =>
              scrollToSection(
                'operator-alerts',
              )
            }
          >
            <AlertIcon />

            <span>
              {t.safetyAlerts}
            </span>
          </button>
        </nav>

        <div className="operator-sidebar-spacer" />

        <div className="operator-system-card">
          <div className="operator-system-row">
            <span className="operator-online-dot" />

            <div>
              <strong>
                {t.systemOperational}
              </strong>

              <span>
                {t.liveSync}
              </span>
            </div>
          </div>
        </div>

        <div className="operator-sidebar-profile">
          <div className="operator-avatar">
            OP
          </div>

          <div className="operator-profile-copy">
            <strong>
              {t.operator}
            </strong>

            <span>
              {t.controlCenter}
            </span>
          </div>

          <button
            type="button"
            className="operator-sidebar-logout"
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogoutIcon />
          </button>
        </div>
      </aside>

      {/* WORKSPACE */}

      <div className="operator-workspace">
        <header className="operator-topbar">
          <div>
            <p className="operator-topbar-eyebrow">
              {t.emergencyOperations}
            </p>

            <h1>
              {t.controlCenterTitle}
            </h1>
          </div>

          <div className="operator-topbar-actions">
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

            <div className="operator-live-pill">
              <span />

              {t.live}
            </div>

            <button
              type="button"
              className="operator-refresh-button"
              onClick={() => {
                loadEmergencies()
                loadResponders()
              }}
            >
              <RefreshIcon />

              <span>
                {t.refresh}
              </span>
            </button>
          </div>
        </header>

        <main className="operator-content">
          {/* OVERVIEW */}

          <section
            id="operator-overview"
            className="operator-overview"
          >
            <div className="operator-page-heading">
              <div>
                <h2>
                  {t.operationsOverview}
                </h2>

                <p>
                  {t.overviewDescription}
                </p>
              </div>

              <div className="operator-last-sync">
                <ActivityIcon
                  size={16}
                />

                <span>
                  {t.autoRefresh}
                </span>
              </div>
            </div>

            <div className="operator-kpi-grid">
              <div className="operator-kpi-card">
                <div className="operator-kpi-icon blue">
                  <ActivityIcon />
                </div>

                <div className="operator-kpi-content">
                  <span>
                    {t.activeIncidents}
                  </span>

                  <strong>
                    {
                      activeEmergencies.length
                    }
                  </strong>

                  <small>
                    {t.currentlyOpen}
                  </small>
                </div>
              </div>

              <div className="operator-kpi-card">
                <div className="operator-kpi-icon amber">
                  <ClockIcon />
                </div>

                <div className="operator-kpi-content">
                  <span>
                    {t.awaitingAction}
                  </span>

                  <strong>
                    {pendingCount}
                  </strong>

                  <small>
                    {t.pendingReview}
                  </small>
                </div>
              </div>

              <div className="operator-kpi-card">
                <div className="operator-kpi-icon green">
                  <ResponderIcon />
                </div>

                <div className="operator-kpi-content">
                  <span>
                    {
                      t.availableResponders
                    }
                  </span>

                  <strong>
                    {
                      availableResponders
                    }
                  </strong>

                  <small>
                    {responders.length}{' '}
                    {t.registered}
                  </small>
                </div>
              </div>

              <div className="operator-kpi-card">
                <div className="operator-kpi-icon slate">
                  <CheckIcon />
                </div>

                <div className="operator-kpi-content">
                  <span>
                    {t.closedIncidents}
                  </span>

                  <strong>
                    {
                      completedEmergencies.length
                    }
                  </strong>

                  <small>
                    {
                      t.completedCancelled
                    }
                  </small>
                </div>
              </div>
            </div>
          </section>

          {error && (
            <div className="control-error">
              {error}
            </div>
          )}

          <div className="operator-operations-grid">
            {/* ACTIVE INCIDENTS */}

            <section
              id="operator-incidents"
              className="operator-incidents-panel"
            >
              <div className="operator-panel-header">
                <div>
                  <span className="operator-panel-eyebrow">
                    {t.liveQueue}
                  </span>

                  <h2>
                    {t.activeEmergencies}
                  </h2>

                  <p>
                    {
                      t.incomingRequests
                    }
                  </p>
                </div>

                <div className="operator-open-count">
                  <span className="operator-open-count-dot" />

                  {
                    activeEmergencies.length
                  }{' '}
                  {t.open}
                </div>
              </div>

              {activeEmergencies.length ===
              0 ? (
                <div className="control-empty">
                  <CheckIcon
                    size={24}
                  />

                  <strong>
                    {t.noActive}
                  </strong>

                  <span>
                    {t.newRequests}
                  </span>
                </div>
              ) : (
                <div className="request-list">
                  {activeEmergencies.map(
                    (emergency) => {
                      const responderArrived =
                        Boolean(
                          emergency
                            .responderArrivedAt,
                        )

                      const responderEnRoute =
                        emergency.status ===
                          'RESPONDING' &&
                        !responderArrived

                      const emergencyName =
                        getEmergencyName(
                          emergency.type,
                        )

                      return (
                        <article
                          key={
                            emergency.id
                          }
                          className="request-card"
                        >
                          <div className="request-card-header">
                            <div className="request-heading">
                              <div className="operator-incident-id">
                                #
                                {
                                  emergency.id
                                }
                              </div>

                              <div>
                                <div className="operator-incident-title-row">
                                  <strong className="operator-incident-name">
                                    {
                                      emergencyName
                                    }{' '}
                                    {
                                      t.emergency
                                    }
                                  </strong>

                                  <span
                                    className={`request-type type-${emergency.type.toLowerCase()}`}
                                  >
                                    {
                                      emergencyName
                                    }
                                  </span>
                                </div>

                                <span className="operator-incident-time">
                                  {t.received}{' '}
                                  {new Date(
                                    emergency.createdAt,
                                  ).toLocaleString(
                                    language ===
                                      'ru'
                                      ? 'ru-RU'
                                      : language ===
                                          'kk'
                                        ? 'kk-KZ'
                                        : 'en-US',
                                  )}
                                </span>
                              </div>
                            </div>

                            <span
                              className={`request-status status-${emergency.status.toLowerCase()}`}
                            >
                              {responderArrived
                                ? t.onScene
                                : getStatusText(
                                    emergency.status,
                                  )}
                            </span>
                          </div>

                          <div className="operator-incident-section">
                            <span className="operator-field-label">
                              {
                                t.incidentDescription
                              }
                            </span>

                            <p className="request-description">
                              {
                                emergency.description
                              }
                            </p>
                          </div>

                          <div className="request-meta-grid">
                            <div>
                              <span>
                                {t.caller}
                              </span>

                              <strong>
                                {
                                  emergency
                                    .user
                                    .fullName
                                }
                              </strong>
                            </div>

                            <div>
                              <span>
                                {t.received}
                              </span>

                              <strong>
                                {new Date(
                                  emergency.createdAt,
                                ).toLocaleTimeString(
                                  language ===
                                    'ru'
                                    ? 'ru-RU'
                                    : language ===
                                        'kk'
                                      ? 'kk-KZ'
                                      : 'en-US',
                                  {
                                    hour:
                                      '2-digit',
                                    minute:
                                      '2-digit',
                                  },
                                )}
                              </strong>
                            </div>

                            <div>
                              <span>
                                {
                                  t.coordinates
                                }
                              </span>

                              <strong>
                                {emergency.latitude.toFixed(
                                  4,
                                )}
                                ,{' '}
                                {emergency.longitude.toFixed(
                                  4,
                                )}
                              </strong>
                            </div>
                          </div>

                          {/* AI */}

                          {emergency.aiSummary && (
                            <div className="operator-ai-card">
                              <div className="operator-ai-header">
                                <div>
                                  <span className="operator-ai-label">
                                    {
                                      t.aiAnalysis
                                    }
                                  </span>

                                  <strong>
                                    {
                                      t.emergencyIntelligence
                                    }
                                  </strong>
                                </div>

                                <span className="operator-ai-badge">
                                  AI
                                </span>
                              </div>

                              <div className="operator-ai-grid">
                                <div>
                                  <span>
                                    {
                                      t.suggestedService
                                    }
                                  </span>

                                  <strong>
                                    {emergency.aiService ||
                                      'UNCLEAR'}
                                  </strong>
                                </div>

                                <div>
                                  <span>
                                    {
                                      t.urgency
                                    }
                                  </span>

                                  <strong>
                                    {emergency.aiUrgency ||
                                      'UNCLEAR'}
                                  </strong>
                                </div>
                              </div>

                              <div className="operator-ai-summary">
                                <span>
                                  {t.summary}
                                </span>

                                <p>
                                  {
                                    emergency.aiSummary
                                  }
                                </p>
                              </div>

                              {emergency.aiImportantDetails && (
                                <div className="operator-ai-details">
                                  <span>
                                    {
                                      t.importantDetails
                                    }
                                  </span>

                                  {(() => {
                                    try {
                                      const details =
                                        JSON.parse(
                                          emergency.aiImportantDetails,
                                        ) as string[]

                                      return (
                                        <ul>
                                          {details.map(
                                            (
                                              detail,
                                              index,
                                            ) => (
                                              <li
                                                key={`${detail}-${index}`}
                                              >
                                                {
                                                  detail
                                                }
                                              </li>
                                            ),
                                          )}
                                        </ul>
                                      )
                                    } catch {
                                      return null
                                    }
                                  })()}
                                </div>
                              )}

                              <p className="operator-ai-note">
                                {t.aiNote}
                              </p>
                            </div>
                          )}

                          {/* MAP */}

                          <div className="operator-map-section-header">
                            <div>
                              <span className="operator-field-label">
                                {
                                  t.liveIncidentMap
                                }
                              </span>

                              <strong>
                                {
                                  t.locationTracking
                                }
                              </strong>
                            </div>

                            <span className="operator-map-live-badge">
                              <span />

                              {t.live}
                            </span>
                          </div>

                          <div className="operator-map-wrapper">
                            <EmergencyMap
                              latitude={
                                emergency.latitude
                              }
                              longitude={
                                emergency.longitude
                              }
                              responderLatitude={
                                emergency.responderLatitude
                              }
                              responderLongitude={
                                emergency.responderLongitude
                              }
                            />
                          </div>

                          <div className="operator-tracking-status">
                            <div className="operator-tracking-row">
                              <span
                                className={`operator-tracking-dot ${
                                  emergency.responderLatitude !=
                                    null &&
                                  emergency.responderLongitude !=
                                    null
                                    ? 'active'
                                    : 'waiting'
                                }`}
                              />

                              <strong>
                                {emergency.responderLatitude !=
                                  null &&
                                emergency.responderLongitude !=
                                  null
                                  ? t.responderGpsLive
                                  : emergency.assignedResponder
                                    ? t.waitingGps
                                    : t.noResponderAssigned}
                              </strong>
                            </div>

                            {emergency.responderLocationUpdatedAt && (
                              <span className="operator-tracking-time">
                                {
                                  t.lastUpdated
                                }{' '}
                                {new Date(
                                  emergency.responderLocationUpdatedAt,
                                ).toLocaleTimeString()}
                              </span>
                            )}

                            <div className="operator-map-legend">
                              <div>
                                <span className="legend-marker emergency" />

                                <span>
                                  {
                                    t.emergency
                                  }
                                </span>
                              </div>

                              <div>
                                <span className="legend-marker responder" />

                                <span>
                                  {
                                    t.responder
                                  }
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* RESPONDER */}

                          <div className="operator-responder-section">
                            <div className="operator-responder-header">
                              <div>
                                <span>
                                  {
                                    t.responderAssignment
                                  }
                                </span>

                                <strong>
                                  {emergency.assignedResponder
                                    ? responderArrived
                                      ? t.responderOnScene
                                      : responderEnRoute
                                        ? t.responderEnRoute
                                        : t.responderAssigned
                                    : t.noResponderAssigned}
                                </strong>
                              </div>

                              <ResponderIcon
                                size={19}
                              />
                            </div>

                            {emergency.assignedResponder ? (
                              <div className="assigned-responder-card">
                                <div className="operator-responder-identity">
                                  <div className="operator-responder-avatar">
                                    {emergency.assignedResponder.fullName
                                      .charAt(
                                        0,
                                      )
                                      .toUpperCase()}
                                  </div>

                                  <div>
                                    <strong>
                                      {
                                        emergency
                                          .assignedResponder
                                          .fullName
                                      }
                                    </strong>

                                    <span>
                                      {
                                        emergency
                                          .assignedResponder
                                          .email
                                      }
                                    </span>
                                  </div>
                                </div>

                                <span className="responder-assigned-badge">
                                  {responderArrived
                                    ? t.onScene
                                    : responderEnRoute
                                      ? t.responding
                                      : t.assigned}
                                </span>
                              </div>
                            ) : emergency.status ===
                              'ACCEPTED' ? (
                              <div className="responder-assignment-controls">
                                <select
                                  value={
                                    selectedResponders[
                                      emergency
                                        .id
                                    ] ??
                                    ''
                                  }
                                  onChange={(
                                    event,
                                  ) => {
                                    const value =
                                      Number(
                                        event
                                          .target
                                          .value,
                                      )

                                    setSelectedResponders(
                                      (
                                        current,
                                      ) => ({
                                        ...current,

                                        [emergency.id]:
                                          value ||
                                          null,
                                      }),
                                    )
                                  }}
                                >
                                  <option value="">
                                    {
                                      t.selectResponder
                                    }
                                  </option>

                                  {responders.map(
                                    (
                                      responder,
                                    ) => (
                                      <option
                                        key={
                                          responder.id
                                        }
                                        value={
                                          responder.id
                                        }
                                        disabled={
                                          responder.isBusy
                                        }
                                      >
                                        {responder.isBusy
                                          ? `${responder.fullName} — ${t.busyOn} #${responder.activeEmergencyId}`
                                          : `${responder.fullName} — ${t.available}`}
                                      </option>
                                    ),
                                  )}
                                </select>

                                <button
                                  type="button"
                                  disabled={
                                    !selectedResponders[
                                      emergency
                                        .id
                                    ] ||
                                    assigningId ===
                                      emergency.id
                                  }
                                  onClick={() =>
                                    assignResponder(
                                      emergency.id,
                                    )
                                  }
                                >
                                  {assigningId ===
                                  emergency.id
                                    ? t.assigning
                                    : t.assignResponder}
                                </button>
                              </div>
                            ) : (
                              <p className="responder-empty-note">
                                {
                                  t.acceptBeforeAssign
                                }
                              </p>
                            )}

                            {responders.length ===
                              0 && (
                              <p className="responder-empty-note">
                                {
                                  t.noResponderAccounts
                                }
                              </p>
                            )}

                            <div className="operator-responder-timeline">
                              {emergency.responderAssignedAt && (
                                <p className="responder-time">
                                  <span />

                                  {
                                    t.assigned
                                  }{' '}
                                  {new Date(
                                    emergency.responderAssignedAt,
                                  ).toLocaleString()}
                                </p>
                              )}

                              {emergency.responderAcceptedAt && (
                                <p className="responder-time">
                                  <span />

                                  {
                                    t.assignmentAccepted
                                  }{' '}
                                  {new Date(
                                    emergency.responderAcceptedAt,
                                  ).toLocaleString()}
                                </p>
                              )}

                              {emergency.responderLocationUpdatedAt &&
                                !responderArrived && (
                                  <p className="responder-time">
                                    <span />

                                    {
                                      t.gpsUpdated
                                    }{' '}
                                    {new Date(
                                      emergency.responderLocationUpdatedAt,
                                    ).toLocaleTimeString()}
                                  </p>
                                )}

                              {emergency.responderLatitude !=
                                null &&
                                emergency.responderLongitude !=
                                  null && (
                                  <p className="responder-time">
                                    <span />

                                    GPS{' '}
                                    {emergency.responderLatitude.toFixed(
                                      5,
                                    )}
                                    ,{' '}
                                    {emergency.responderLongitude.toFixed(
                                      5,
                                    )}
                                  </p>
                                )}

                              {emergency.responderArrivedAt && (
                                <p className="responder-time">
                                  <span />

                                  {
                                    t.arrived
                                  }{' '}
                                  {new Date(
                                    emergency.responderArrivedAt,
                                  ).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* CONTACTS */}

                          <div className="operator-contact-section">
                            <div className="operator-contact-header">
                              <div>
                                <span>
                                  {
                                    t.emergencyContacts
                                  }
                                </span>

                                <strong>
                                  {
                                    emergency
                                      .notifiedContacts
                                      .length
                                  }{' '}
                                  {
                                    t.attached
                                  }
                                </strong>
                              </div>
                            </div>

                            {emergency
                              .notifiedContacts
                              .length ===
                            0 ? (
                              <p className="operator-no-contacts">
                                {
                                  t.noContacts
                                }
                              </p>
                            ) : (
                              <div className="operator-contact-list">
                                {emergency.notifiedContacts.map(
                                  (
                                    contact,
                                  ) => (
                                    <div
                                      key={
                                        contact.id
                                      }
                                      className="operator-contact-item"
                                    >
                                      <div>
                                        <strong>
                                          {
                                            contact.name
                                          }
                                        </strong>

                                        <span>
                                          {
                                            contact.phone
                                          }
                                        </span>
                                      </div>

                                      <span className="notification-simulation">
                                        {
                                          t.prepared
                                        }
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            )}

                            {emergency
                              .notifiedContacts
                              .length >
                              0 && (
                              <p className="notification-note">
                                {
                                  t.notificationNote
                                }
                              </p>
                            )}
                          </div>

                          {/* ACTION */}

                          {emergency.status ===
                            'PENDING' && (
                            <div className="request-footer">
                              <div>
                                <span className="operator-field-label">
                                  {
                                    t.nextAction
                                  }
                                </span>

                                <div className="request-next">
                                  {
                                    t.reviewAccept
                                  }
                                </div>
                              </div>

                              <button
                                className="request-primary-action"
                                disabled={
                                  updatingId ===
                                  emergency.id
                                }
                                onClick={() =>
                                  acceptEmergency(
                                    emergency.id,
                                  )
                                }
                              >
                                {updatingId ===
                                emergency.id
                                  ? t.accepting
                                  : t.acceptRequest}
                              </button>
                            </div>
                          )}

                          {emergency.status ===
                            'ACCEPTED' &&
                            !emergency.assignedResponder && (
                              <div className="request-footer">
                                <div className="request-next">
                                  {
                                    t.selectAssign
                                  }
                                </div>
                              </div>
                            )}

                          {emergency.status ===
                            'DISPATCHED' && (
                              <div className="request-footer">
                                <div className="request-next">
                                  {
                                    t.waitingResponder
                                  }
                                </div>
                              </div>
                            )}

                          {emergency.status ===
                            'RESPONDING' &&
                            !responderArrived && (
                              <div className="request-footer">
                                <div className="request-next">
                                  {
                                    t.responderRoute
                                  }
                                </div>
                              </div>
                            )}

                          {emergency.status ===
                            'RESPONDING' &&
                            responderArrived && (
                              <div className="request-footer">
                                <div className="request-next">
                                  {
                                    t.responderScene
                                  }
                                </div>
                              </div>
                            )}
                        </article>
                      )
                    },
                  )}
                </div>
              )}
            </section>

            {/* RIGHT COLUMN */}

            <aside className="operator-right-column">
              <div className="control-side-card">
                <div className="operator-side-card-header">
                  <div>
                    <p className="control-side-label">
                      {
                        t.recentActivity
                      }
                    </p>

                    <h3>
                      {
                        t.closedIncidents
                      }
                    </h3>
                  </div>

                  <CheckIcon
                    size={18}
                  />
                </div>

                {completedEmergencies.length ===
                0 ? (
                  <div className="control-side-empty">
                    {t.noClosed}
                  </div>
                ) : (
                  <div className="closed-list">
                    {completedEmergencies
                      .slice(0, 7)
                      .map(
                        (
                          emergency,
                        ) => (
                          <div
                            key={
                              emergency.id
                            }
                            className="closed-item"
                          >
                            <div className="closed-item-left">
                              <div className="closed-incident-icon">
                                <CheckIcon
                                  size={
                                    13
                                  }
                                />
                              </div>

                              <div>
                                <strong>
                                  {
                                    t.incident
                                  }{' '}
                                  #
                                  {
                                    emergency.id
                                  }
                                </strong>

                                <span>
                                  {getEmergencyName(
                                    emergency.type,
                                  )}
                                </span>
                              </div>
                            </div>

                            <span>
                              {getStatusText(
                                emergency.status,
                              )}
                            </span>
                          </div>
                        ),
                      )}
                  </div>
                )}
              </div>

              <div className="operator-status-card">
                <div className="operator-status-card-header">
                  <span className="operator-online-dot" />

                  <strong>
                    {
                      t.operationsStatus
                    }
                  </strong>
                </div>

                <div className="operator-status-metric">
                  <span>
                    {
                      t.apiConnection
                    }
                  </span>

                  <strong className="healthy">
                    {t.healthy}
                  </strong>
                </div>

                <div className="operator-status-metric">
                  <span>
                    {t.incidentSync}
                  </span>

                  <strong>
                    {t.seconds}
                  </strong>
                </div>

                <div className="operator-status-metric">
                  <span>
                    {
                      t.responderNetwork
                    }
                  </span>

                  <strong>
                    {
                      responders.length
                    }{' '}
                    {t.units}
                  </strong>
                </div>
              </div>
            </aside>
          </div>

          {/* SAFETY ALERTS */}

          <section
            id="operator-alerts"
            className="operator-alerts-section"
          >
            <SafetyAlertsPanel />
          </section>
        </main>
      </div>
    </div>
  )
}

export default OperatorDashboard