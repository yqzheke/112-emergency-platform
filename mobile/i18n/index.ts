import AsyncStorage from '@react-native-async-storage/async-storage'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export type AppLanguage =
  | 'en'
  | 'ru'
  | 'kk'

export const LANGUAGE_STORAGE_KEY =
  'ResQ-language'

const resources = {
  /* =========================================================
     ENGLISH
     ========================================================= */

  en: {
    translation: {
      howCanWeHelp: 'How can we help?',

helpSupportIntro:
  'Find answers about the ResQ app, emergency requests, your account, and responder tracking.',

helpAiCardText:
  'Get help using the platform, understanding emergency services, or asking general safety questions.',
      accountRecovery: 'ACCOUNT RECOVERY',

forgotPasswordEmailDescription:
  'Enter the email connected to your ResQ account.',

enterEmailAddress:
  'Enter your email address.',

passwordRecoveryUnavailable:
  'Password recovery is not available yet. This feature will be added in a future version.',

rememberPassword:
  'Remember your password?',

passwordRecoveryPlaceholderNotice:
  'Password recovery is currently a placeholder and does not send recovery emails yet.',
      safetyAssistant: 'Safety assistant',

aiChatWelcome:
  'Hi. I’m ResQ AI. I can help you understand emergency services, prepare a request, and use the ResQ platform.',

aiChatSafetyBanner:
  'ResQ AI can guide you, but it cannot dispatch emergency services by itself.',

emergencyAction:
  'EMERGENCY ACTION',

aiUnavailable:
  'ResQ AI is unavailable',

aiThinking:
  'ResQ AI is thinking...',

ask112Placeholder:
  'Ask ResQ AI...',

aiUrgentHint:
  'For urgent situations, use the emergency request flow instead of relying only on AI chat.',
      loadingSafetyAlerts: 'Loading safety alerts...',
couldNotLoadAlerts: 'Could not load alerts',

publicSafety: 'PUBLIC SAFETY',

alertsPageSubtitle:
  'Official safety information and important notices for your area.',

noActiveAlerts:
  'No active alerts',

activeAlert_one:
  '{{count}} active alert',

activeAlert_other:
  '{{count}} active alerts',

alertsPublishedThrough112:
  'Safety notices are published through the ResQ operator system.',

allClear:
  'ALL CLEAR',

activeNotices:
  'ACTIVE NOTICES',

informationSeverity:
  'INFORMATION',

warningSeverity:
  'WARNING',

criticalSeverity:
  'CRITICAL',

published:
  'PUBLISHED',

pullToRefreshAlerts:
  'Pull down to refresh for the latest public safety information.',
      safetyNetwork: 'SAFETY NETWORK',
contactsPageSubtitle:
  'Add trusted people who may need to be contacted during an emergency.',

savedContact_one: '{{count}} saved contact',
savedContact_other: '{{count}} saved contacts',

savedContactsDescription:
  'These contacts can be associated with your emergency requests.',

addContactSection: 'ADD CONTACT',
savedContactsSection: 'SAVED CONTACTS',

name: 'Name',
nameExample: 'Example: Mom',
phoneNumber: 'Phone number',

contactNameRequired:
  'Contact name is required',

phoneNumberRequired:
  'Phone number is required',

couldNotLoadContacts:
  'Could not load contacts',

couldNotAddContact:
  'Could not add contact',

couldNotDeleteContact:
  'Could not delete contact',

actionFailed: 'Action failed',

addingContact:
  'Adding contact...',

addEmergencyContact:
  'Add emergency contact',

loadingContacts:
  'Loading contacts...',

noContactsYet:
  'No contacts yet',

noContactsYetDescription:
  'Add someone you trust using the form above.',

deleteContactPrompt:
  'Delete contact?',

deleteContactNamedDescription:
  'Remove {{name}} from your emergency contacts?',

trustedContactsNotice:
  'Only add people you trust and keep their phone numbers up to date.',
      loadingHistory: 'Loading history...',
couldNotLoadHistory: 'Could not load emergency history',

yourRequests: 'YOUR REQUESTS',
historyPageSubtitle:
  'Review your active and previous emergency requests.',

totalRequests: 'Total requests',

couldNotRefreshHistory:
  'Could not refresh history',

noEmergenciesYet:
  'No emergencies yet',

noEmergenciesYetDescription:
  'Your emergency requests will appear here after you submit them.',

allRequests:
  'ALL REQUESTS',

pullToRefreshHistory:
  'Pull down to refresh your emergency history.',
      loadingEmergency: 'Loading emergency...',
invalidEmergencyId: 'Invalid emergency ID',
couldNotLoadEmergency: 'Could not load emergency',
emergencyRequestNotFound: 'Emergency request not found',

waitingForOperator: 'Waiting for operator',

requestNumber: 'REQUEST #{{id}}',
live: 'LIVE',

activeEmergencySubtitle:
  'Status updates automatically while the request is active.',

closedEmergencySubtitle:
  'This emergency request is no longer active.',

currentStatus: 'CURRENT STATUS',
responderHasArrived: 'Responder has arrived',
onSceneStatus: 'ON SCENE',

responderTracking: 'RESPONDER TRACKING',
assignedResponseUnit: 'ASSIGNED RESPONSE UNIT',
emergencyResponder: 'Emergency responder',

liveLocationActive: 'Live location active',
updatedAtTime: 'Updated {{time}}',

fromYourLocation: 'from your location',
estimatedArrivalShort: 'EST. ARRIVAL',
minutesShort: '~{{minutes}} min',
approximate: 'approximate',

etaPrototypeNotice:
  'ETA is estimated from live GPS distance and is not yet based on road routing.',

responderArrivedDescription:
  'Emergency services are now at your location and handling the incident.',

responderAssigned: 'Responder assigned',

waitingForResponderLocation:
  'Waiting for the responder to accept dispatch and begin sharing live location.',

responseComplete: 'RESPONSE COMPLETE',

completedSavedHistory:
  'This response has been marked complete and is saved in your emergency history.',

responseProgress: 'RESPONSE PROGRESS',

requestSent: 'Request sent',
requestSentDescription:
  'Your emergency request was submitted.',

requestAcceptedDescription:
  'An operator accepted your request.',

responderDispatchedDescription:
  'A responder was assigned to your emergency.',

responderReachedLocation:
  'Emergency services reached your location.',

emergencyServicesResponding:
  'Emergency services are responding.',

responseCompletedDescription:
  'Emergency response completed.',

liveResponseMap: 'LIVE RESPONSE MAP',
yourEmergencyLocation: 'Your emergency location',
you: 'You',

emergencyDetails: 'EMERGENCY DETAILS',
responderAssignedLabel: 'RESPONDER ASSIGNED',

noContactsAttached: 'No contacts attached',

noContactsAttachedDescription:
  'No emergency contacts were attached to this request.',

dashboard: 'Dashboard',
      finalStep: 'FINAL STEP',
confirmEmergencySubtitle:
  'Review your emergency details and current location before sending the request.',

requestSummary: 'REQUEST SUMMARY',
service: 'SERVICE',
aiAssist: 'AI ASSIST',

detectingLocation: 'Detecting location',
gettingGpsCoordinates:
  'Getting your current GPS coordinates.',

locationAttached:
  'Your location will be attached to the emergency request.',

gpsCoordinates: 'GPS COORDINATES',

locationUnavailable:
  'Location unavailable',

tryLocationAgain:
  'Try location again',

locationRequiredBeforeSend:
  'Your location is required before the emergency can be sent.',

couldNotDetermineLocation:
  'We could not determine your location. Please try again.',

requestNotSent:
  'Request not sent',

couldNotSendEmergency:
  'Could not send emergency request',

safetySendNote:
  'Your emergency details and current location will be sent to the ResQ response platform.',

invalidEmergency:
  'Invalid emergency',

invalidEmergencyDescription:
  'Return to the dashboard and choose an emergency service.',
      medicalEmergency: 'Medical Emergency',
policeEmergency: 'Police Emergency',
fireEmergency: 'Fire Emergency',

medicalLabel: 'MEDICAL',
policeLabel: 'POLICE',
fireLabel: 'FIRE & RESCUE',

invalidEmergencyType: 'Invalid emergency type',
invalidEmergencyTypeDescription:
  'Return to the dashboard and select an emergency service.',
backToDashboard: 'Back to dashboard',

emergencyDescriptionIntro:
  'Tell us what happened. Keep the description short and clear so the operator can understand the situation quickly.',

whatHappened: 'What happened?',
fieldRequired: 'Required',

emergencyExample:
  'Example: A person has collapsed and is not responding.',

importantDetailsFirst:
  'Include the most important details first.',

describeBeforeAI:
  'Describe the emergency before using AI Assist.',

aiAssistUnavailable:
  'AI Assist is unavailable',

brieflyDescribeEmergency:
  'Please briefly describe the emergency.',

aiEmergencyAssist:
  'AI EMERGENCY ASSIST',

organizeReport:
  'Organize your report',

aiEmergencyDescription:
  'AI can summarize your report, suggest the likely service, and highlight useful details for the operator.',

aiOptional:
  'Optional — AI is not required to send an emergency request.',

analyzing: 'Analyzing...',
analyzeWithAI: 'Analyze with AI',

aiAnalysis: 'AI ANALYSIS',
intakeSummary: 'Intake summary',

likelyService: 'LIKELY SERVICE',
operatorSummary: 'OPERATOR SUMMARY',
urgency: 'URGENCY',
importantDetails: 'IMPORTANT DETAILS',
optionalFollowUp: 'OPTIONAL FOLLOW-UP',

aiIntakeDisclaimer:
  'AI assists emergency intake and may be inaccurate. Your original description is still sent with the request.',

continueEmergencyNote:
  'Next you will confirm your current location and review the request before sending it.',
      /* GENERAL */
      emergencyProfile: 'Emergency profile',
      appName: 'ResQ Emergency',
      emergencyResponse: 'Emergency Response',
      secureAccess:
        'Secure access to ResQ services',

      language: 'Language',
      english: 'English',
      russian: 'Russian',
      kazakh: 'Kazakh',

      loading: 'Loading...',
      available: 'AVAILABLE',
      active: 'ACTIVE',
      enabled: 'Enabled',
      disabled: 'Disabled',
      online: 'ONLINE',
      offline: 'OFFLINE',
      ready: 'READY',
      busy: 'BUSY',

      back: 'Back',
      continue: 'Continue',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      close: 'Close',
      done: 'Done',
      refresh: 'Refresh',
      retry: 'Try again',

      home: 'Home',
      profile: 'Profile',
      history: 'History',
      map: 'Map',
      assignments: 'Assignments',
      contacts: 'Contacts',
      alerts: 'Alerts',

      /* LOGIN */

      welcomeBack: 'WELCOME BACK',

      signInTitle:
        'Sign in to your account',

      signInSubtitle:
        'Access emergency assistance, safety alerts, request history, and responder tracking.',

      email: 'Email',
      emailRequired:
        'Email is required',

      password: 'Password',
      passwordRequired:
        'Password is required',

      forgotPassword:
        'Forgot password?',

      enterPassword:
        'Enter password',

      signIn: 'Sign in',
      signingIn: 'Signing in...',

      newTo112: 'New to ResQ?',
      createAccount:
        'Create account',

      footer:
        'Your account is used to securely access emergency services and request information.',

      operatorWebOnly:
        'Operator accounts use the web control center.',

      couldNotSignIn:
        'Could not sign in',

      /* REGISTER */

      createAccountEyebrow:
        'CREATE ACCOUNT',

      join112: 'Join ResQ',

      registerSubtitle:
        'Create your account to request emergency assistance, receive safety alerts, and track active responses.',

      fullName: 'Full name',

      fullNameRequired:
        'Full name is required',

      fullNamePlaceholder:
        'Enter your full name',

      invalidEmail:
        'Enter a valid email',

      minimumPassword:
        'Minimum 8 characters',

      passwordHint:
        'Use at least 8 characters.',

      passwordTooShort:
        'Password must contain at least 8 characters',

      creatingAccount:
        'Creating account...',

      alreadyHaveAccount:
        'Already have an account?',

      registerFooter:
        'Your account information is used to securely provide emergency response services.',

      couldNotRegister:
        'Could not register',

      /* DASHBOARD */

      heyUser: 'Hey {{name}},',

      dashboardQuestion:
        'How can ResQ help you today?',

      emergencyAssistance:
        'EMERGENCY ASSISTANCE',

      ready112:
        'ResQ READY',

      needEmergencyHelp:
        'Need emergency help?',

      emergencyHelpDescription:
        'Choose the emergency service you need and share your location with the response system.',

      startEmergencyRequest:
        'Start emergency request',

      aiAssistantSection:
        'ResQ AI ASSISTANT',

      aiAssistantDescription:
        'Get help understanding emergency services and using the platform.',

      ask112AI:
        'Ask ResQ AI',

      aiCardDescription:
        'Ask questions about emergency services, prepare a request, or get help navigating the ResQ platform.',

      openAssistant:
        'Open assistant',

      oneTapServices:
        'ONE-TAP SERVICES',

      selectEmergencyService:
        'Select the emergency service you need.',

      medical: 'Medical',

      medicalDescription:
        'Ambulance and medical assistance',

      police: 'Police',

      policeDescription:
        'Police and security assistance',

      fireRescue:
        'Fire & Rescue',

      fireDescription:
        'Fire and rescue assistance',

      more: 'MORE',

      manageEmergencySetup:
        'Manage your emergency setup.',

      emergencyContacts:
        'Emergency Contacts',

      emergencyContactsDescription:
        'Manage people linked to your emergency profile.',

      locationSharingFooter:
        'Your location is shared when you submit an emergency request so responders can locate you.',

      /* PROFILE */

      yourAccount:
        'YOUR ACCOUNT',

      accountAndSafety:
        'Account & safety',

      profileSubtitle:
        'Manage your emergency profile, contacts, support options, and account access.',

      accountReady:
        'Account ready for emergency use',

      safetySettings:
        'SAFETY SETTINGS',

      automaticGpsSharing:
        'Automatic GPS Sharing',

      gpsSharingDescription:
        'Your location is shared when you submit an emergency request.',

      support:
        'SUPPORT',

      helpSupport:
        'Help & Support',

      helpSupportDescription:
        'Get answers, contact support, or ask ResQ AI for help.',

      askAiDescription:
        'Ask questions about safety, emergency services, and using the platform.',

      account:
        'ACCOUNT',

      logout:
        'Log out',

      logoutDescription:
        'Sign out from this device.',

      logoutQuestion:
        'Log out?',

      logoutConfirm:
        'You will need to sign in again to access your account.',

      keepAccountUpdated:
        'Keep your account information and emergency contacts up to date.',

      /* FORGOT PASSWORD */

      passwordRecovery:
        'Password recovery',

      forgotPasswordTitle:
        'Reset your password',

      forgotPasswordDescription:
        'Password recovery will be available in a future version of ResQ.',

      returnToLogin:
        'Return to login',

      /* EMERGENCY REQUEST */

      emergencyRequest:
        'Emergency request',

      requestMedicalHelp:
        'Request medical help',

      requestPoliceHelp:
        'Request police help',

      requestFireHelp:
        'Request fire & rescue',

      describeEmergency:
        'Describe the emergency',

      emergencyDescriptionPlaceholder:
        'Tell us briefly what is happening...',

      descriptionRequired:
        'Please describe the emergency.',

      yourLocation:
        'Your location',

      currentLocation:
        'Current location',

      gettingLocation:
        'Getting your location...',

      locationReady:
        'Location ready',

      locationPermissionRequired:
        'Location permission is required to send an emergency request.',

      couldNotGetLocation:
        'Could not get your location.',

      submitEmergency:
        'Submit emergency request',

      submittingEmergency:
        'Sending emergency request...',

      emergencyDisclaimer:
        'Your location and emergency details will be shared with the response system.',

      /* EMERGENCY CONFIRM */

      confirmEmergency:
        'Confirm emergency',

      reviewRequest:
        'Review your request',

      confirmEmergencyDescription:
        'Check the details before sending your emergency request.',

      emergencyType:
        'Emergency type',

      description:
        'Description',

      location:
        'Location',

      sendRequest:
        'Send emergency request',

      sendingRequest:
        'Sending request...',

      /* EMERGENCY STATUS */

      emergencyStatus:
        'Emergency status',

      requestReceived:
        'Request received',

      requestAccepted:
        'Request accepted',

      responderDispatched:
        'Responder dispatched',

      responderOnWay:
        'Responder on the way',

      responderArrived:
        'Responder arrived',

      emergencyCompleted:
        'Emergency completed',

      requestCancelled:
        'Request cancelled',

      pending:
        'Pending',

      accepted:
        'Accepted',

      dispatched:
        'Dispatched',

      responding:
        'Responding',

      completed:
        'Completed',

      cancelled:
        'Cancelled',

      liveResponderTracking:
        'Live responder tracking',

      waitingForResponder:
        'Waiting for responder',

      responderLocation:
        'Responder location',

      responderGpsActive:
        'Responder GPS active',

      gpsWaiting:
        'Waiting for GPS',

      estimatedArrival:
        'Estimated arrival',

      distance:
        'Distance',

      responder:
        'Responder',

      /* HISTORY */

      emergencyHistory:
        'Emergency history',

      historySubtitle:
        'Review your previous emergency requests.',

      noEmergencyHistory:
        'No emergency history',

      noEmergencyHistoryDescription:
        'Your previous emergency requests will appear here.',

      created:
        'Created',

      updated:
        'Updated',

      /* CONTACTS */

      trustedContacts:
        'Trusted contacts',

      contactsSubtitle:
        'Manage people connected to your emergency profile.',

      addContact:
        'Add contact',

      editContact:
        'Edit contact',

      deleteContact:
        'Delete contact',

      contactName:
        'Contact name',

      contactPhone:
        'Phone number',

      enterContactName:
        'Enter contact name',

      enterPhone:
        'Enter phone number',

      saveContact:
        'Save contact',

      noContacts:
        'No emergency contacts',

      noContactsDescription:
        'Add trusted people who may be linked to your emergency requests.',

      deleteContactQuestion:
        'Delete this contact?',

      deleteContactDescription:
        'This contact will be removed from your emergency profile.',

      /* SAFETY ALERTS */

      safetyAlerts:
        'Safety alerts',

      safetyAlertsSubtitle:
        'Official alerts and emergency information from ResQ.',

      noSafetyAlerts:
        'No active alerts',

      noSafetyAlertsDescription:
        'Safety alerts from ResQ will appear here.',

      /* HELP SUPPORT */

      helpSupportTitle:
        'How can we help?',

      helpSupportSubtitle:
        'Find answers about the ResQ app, emergency requests, your account, and responder tracking.',

      frequentlyAskedQuestions:
        'FREQUENTLY ASKED QUESTIONS',

      whenLocationShared:
        'When is my location shared?',

      whenLocationSharedAnswer:
        'Your location is shared when you submit an emergency request so emergency services can locate you.',

      canTrackResponder:
        'Can I track the responder?',

      canTrackResponderAnswer:
        'Yes. Once a responder shares live GPS, the emergency status screen can show their location and approximate arrival time.',

      whatAreContacts:
        'What are emergency contacts?',

      whatAreContactsAnswer:
        'They are trusted people linked to your profile who can be attached to emergency requests.',

      doesAiDispatch:
        'Does ResQ AI dispatch help?',

      doesAiDispatchAnswer:
        'No. ResQ AI can guide you, but emergency services are contacted through the emergency request flow.',

      contactSupport:
        'Contact Support',

      contactSupportFuture:
        'Direct support messaging will be added in a future version.',

      activeEmergencySupportNotice:
        'For active emergencies, use the emergency request feature instead of Help & Support.',

      /* AI CHAT */

      aiWelcome:
        'Hello. I am ResQ AI. How can I help you today?',

      aiSafetyNotice:
        'ResQ AI can provide guidance but cannot dispatch emergency services.',

      askAnything:
        'Ask ResQ AI...',

      send:
        'Send',

      aiError:
        'Could not get a response from ResQ AI.',

      requestEmergencyHelp:
        'Request emergency help',

      /* RESPONDER GENERAL */

      responderSystem:
        'RESPONDER SYSTEM',

      fieldOperations:
        'Field operations',

      activeDuty:
        'ACTIVE DUTY',

      responderDashboard:
        'Responder dashboard',

      fieldDashboard:
        'Field dashboard',

      responderDashboardDescription:
        'Monitor your dispatch status and manage active emergency assignments.',

      activeAssignments:
        'Active assignments',

      dutyStatus:
        'Duty status',

      readyForDispatch:
        'Ready for dispatch',

      activeResponse:
        'Active response in progress',

      currentResponse:
        'CURRENT RESPONSE',

      activeAssignment:
        'Active assignment',

      viewAll:
        'View all',

      openAssignment:
        'Open assignment',

      operations:
        'OPERATIONS',

      assignmentHistory:
        'Assignment history',

      previousIncidents:
        'Previous incidents',

      responderSystemOnline:
        'Responder system online',

      dispatchSyncActive:
        'Dispatch synchronization is active.',

      /* RESPONDER ASSIGNMENTS */

      dispatchQueue:
        'DISPATCH QUEUE',

      assignedEmergencies:
        'Assigned emergencies',

      assignedEmergenciesDescription:
        'Pull down to refresh. New assignments also appear automatically.',

      noActiveAssignments:
        'No active assignments',

      noActiveAssignmentsDescription:
        'You are ready for dispatch. New emergencies assigned by the control center will appear here automatically.',

      incident:
        'INCIDENT',

      caller:
        'CALLER',

      responseState:
        'RESPONSE STATE',

      emergencyLocation:
        'EMERGENCY LOCATION',

      exactCoordinates:
        'Exact coordinates provided by the emergency request.',

      acceptDispatch:
        'Accept dispatch',

      acceptDispatchDescription:
        'Accepting starts the response and automatically attempts to enable live GPS sharing.',

      acceptAssignment:
        'Accept assignment',

      enRoute:
        'EN ROUTE',

      onScene:
        'ON SCENE',

      liveGpsActive:
        'LIVE GPS ACTIVE',

      gpsNotSharing:
        'GPS NOT SHARING',

      locationSharingActive:
        'Location sharing active',

      startLocationSharing:
        'Start location sharing',

      trackingActiveDescription:
        'Your position is being shared with the ResQ operator and citizen in real time.',

      trackingInactiveDescription:
        'Live GPS must be active while responding so the operator and citizen can track your position.',

      currentResponderPosition:
        'CURRENT RESPONDER POSITION',

      startGpsSharing:
        'Start GPS sharing',

      markAsArrived:
        'Mark as arrived',

      startGpsBeforeArrival:
        'Start GPS before arrival',

      arrivalGpsRequirement:
        'Arrival becomes available after live GPS sharing starts.',

      confirmArrival:
        'Confirm arrival',

      confirmArrivalDescription:
        'Confirm that you have reached the emergency location.',

      iHaveArrived:
        'I have arrived',

      youAreOnScene:
        'You are on scene',

      onSceneDescription:
        'Live GPS sharing has stopped. Handle the incident and complete the emergency when response is finished.',

      completeEmergency:
        'Complete emergency',

      completeEmergencyQuestion:
        'Complete emergency?',

      completeEmergencyDescription:
        'Only complete the emergency when response at the scene is finished.',

      /* RESPONDER MAP */

      responseMap:
        'Response map',

      liveMap:
        'LIVE MAP',

      deviceGpsAvailable:
        'Device GPS available',

      gpsUnavailable:
        'GPS unavailable',

      deviceGpsDescription:
        'Your local position is shown on the field map.',

      gpsPermissionDescription:
        'Allow location access to show your position.',

      assignedIncidents:
        'ASSIGNED INCIDENTS',

      incidentDetails:
        'INCIDENT DETAILS',

      startNavigation:
        'Start navigation',

      openAssignmentControls:
        'Open assignment controls',

      noAssignedIncidents:
        'No assigned incidents',

      noAssignedIncidentsDescription:
        'The map will automatically display incidents assigned by the control center.',

      mapTrackingNotice:
        'This map displays your device position locally. Official live responder tracking is controlled from the assignment response screen.',

      /* RESPONDER HISTORY */

      responseHistory:
        'Response history',

      responseRecord:
        'RESPONSE RECORD',

      completedIncidents:
        'Completed incidents',

      completedIncidentsDescription:
        'Review emergencies you have completed while assigned as a responder.',

      totalCompleted:
        'Total completed',

      completedToday:
        'Completed today',

      completedAssignments:
        'COMPLETED ASSIGNMENTS',

      noCompletedIncidents:
        'No completed incidents yet',

      noCompletedIncidentsDescription:
        'Completed emergency responses assigned to your responder account will appear here.',

      responderHistoryNotice:
        'Response history is linked to your responder account and only includes incidents completed by you.',

      /* RESPONDER PROFILE */

      fieldStatus:
        'FIELD STATUS',

      gpsPermission:
        'GPS permission',

      system:
        'SYSTEM',

      dispatchConnection:
        'Dispatch connection',

      dispatchConnectionDescription:
        'Connected to the ResQ emergency dispatch system.',

      locationServices:
        'Location services',

      locationServicesDescription:
        'Required for live responder tracking during active emergencies.',

      required:
        'REQUIRED',

      quickAccess:
        'QUICK ACCESS',

      assignmentsDescription:
        'Open active incident controls and response actions.',

      responseHistoryDescription:
        'Review completed incidents assigned to your account.',

      responderLogoutDescription:
        'Sign out of the responder system on this device.',

      responderLogoutConfirm:
        'You will need to sign in again to access the responder system.',

      responderSecurityNotice:
        'This responder account is authorized for emergency field operations. Keep account access secure.',

      /* BOTTOM NAV */

      navHome: 'Home',
      navHistory: 'History',
      navAlerts: 'Alerts',
      navProfile: 'Profile',
      navAssignments: 'Assignments',
      navMap: 'Map',
    },
  },

  /* =========================================================
     RUSSIAN
     ========================================================= */

  ru: {
    translation: {
      howCanWeHelp:
  'Чем мы можем помочь?',

helpSupportIntro:
  'Найдите ответы о приложении ResQ, экстренных запросах, аккаунте и отслеживании спасателя.',

helpAiCardText:
  'Получите помощь по использованию платформы, работе экстренных служб и общим вопросам безопасности.',
      accountRecovery:
  'ВОССТАНОВЛЕНИЕ АККАУНТА',

forgotPasswordEmailDescription:
  'Введите email, связанный с вашим аккаунтом ResQ.',

enterEmailAddress:
  'Введите адрес электронной почты.',

passwordRecoveryUnavailable:
  'Восстановление пароля пока недоступно. Эта функция будет добавлена в будущей версии.',

rememberPassword:
  'Помните свой пароль?',

passwordRecoveryPlaceholderNotice:
  'Восстановление пароля пока является временной функцией и ещё не отправляет письма для восстановления.',
      safetyAssistant:
  'Помощник по безопасности',

aiChatWelcome:
  'Здравствуйте. Я ResQ AI. Я могу помочь разобраться в экстренных службах, подготовить обращение и использовать платформу ResQ.',

aiChatSafetyBanner:
  'ResQ AI может подсказать, но не может самостоятельно направить экстренные службы.',

emergencyAction:
  'ЭКСТРЕННОЕ ДЕЙСТВИЕ',

aiUnavailable:
  'ResQ AI сейчас недоступен',

aiThinking:
  'ResQ AI думает...',

ask112Placeholder:
  'Спросить ResQ AI...',

aiUrgentHint:
  'В срочной ситуации используйте экстренный запрос, а не полагайтесь только на AI-чат.',
      loadingSafetyAlerts:
  'Загрузка предупреждений...',

couldNotLoadAlerts:
  'Не удалось загрузить предупреждения',

publicSafety:
  'ОБЩЕСТВЕННАЯ БЕЗОПАСНОСТЬ',

alertsPageSubtitle:
  'Официальная информация о безопасности и важные уведомления для вашего района.',

noActiveAlerts:
  'Активных предупреждений нет',

activeAlert_one:
  '{{count}} активное предупреждение',

activeAlert_other:
  '{{count}} активных предупреждений',

alertsPublishedThrough112:
  'Предупреждения публикуются через операторскую систему ResQ.',

allClear:
  'ВСЁ СПОКОЙНО',

activeNotices:
  'АКТИВНЫЕ УВЕДОМЛЕНИЯ',

informationSeverity:
  'ИНФОРМАЦИЯ',

warningSeverity:
  'ПРЕДУПРЕЖДЕНИЕ',

criticalSeverity:
  'КРИТИЧЕСКОЕ',

published:
  'ОПУБЛИКОВАНО',

pullToRefreshAlerts:
  'Потяните вниз, чтобы обновить информацию о безопасности.',
      safetyNetwork: 'СЕТЬ БЕЗОПАСНОСТИ',

contactsPageSubtitle:
  'Добавьте доверенных людей, с которыми может потребоваться связаться во время экстренной ситуации.',

savedContact_one:
  '{{count}} сохранённый контакт',

savedContact_other:
  '{{count}} сохранённых контактов',

savedContactsDescription:
  'Эти контакты могут быть связаны с вашими экстренными запросами.',

addContactSection:
  'ДОБАВИТЬ КОНТАКТ',

savedContactsSection:
  'СОХРАНЁННЫЕ КОНТАКТЫ',

name: 'Имя',

nameExample:
  'Пример: Мама',

phoneNumber:
  'Номер телефона',

contactNameRequired:
  'Введите имя контакта',

phoneNumberRequired:
  'Введите номер телефона',

couldNotLoadContacts:
  'Не удалось загрузить контакты',

couldNotAddContact:
  'Не удалось добавить контакт',

couldNotDeleteContact:
  'Не удалось удалить контакт',

actionFailed:
  'Не удалось выполнить действие',

addingContact:
  'Добавление контакта...',

addEmergencyContact:
  'Добавить экстренный контакт',

loadingContacts:
  'Загрузка контактов...',

noContactsYet:
  'Контактов пока нет',

noContactsYetDescription:
  'Добавьте доверенного человека с помощью формы выше.',

deleteContactPrompt:
  'Удалить контакт?',

deleteContactNamedDescription:
  'Удалить {{name}} из ваших экстренных контактов?',

trustedContactsNotice:
  'Добавляйте только тех людей, которым доверяете, и поддерживайте их номера телефонов в актуальном состоянии.',
      loadingHistory: 'Загрузка истории...',
couldNotLoadHistory:
  'Не удалось загрузить историю запросов',

yourRequests:
  'ВАШИ ЗАПРОСЫ',

historyPageSubtitle:
  'Просматривайте активные и предыдущие экстренные запросы.',

totalRequests:
  'Всего запросов',

couldNotRefreshHistory:
  'Не удалось обновить историю',

noEmergenciesYet:
  'Запросов пока нет',

noEmergenciesYetDescription:
  'После отправки экстренные запросы появятся здесь.',

allRequests:
  'ВСЕ ЗАПРОСЫ',

pullToRefreshHistory:
  'Потяните вниз, чтобы обновить историю запросов.',
      loadingEmergency: 'Загрузка экстренного запроса...',
invalidEmergencyId: 'Некорректный ID запроса',
couldNotLoadEmergency: 'Не удалось загрузить запрос',
emergencyRequestNotFound: 'Экстренный запрос не найден',

waitingForOperator: 'Ожидание оператора',

requestNumber: 'ЗАПРОС #{{id}}',
live: 'ОНЛАЙН',

activeEmergencySubtitle:
  'Статус обновляется автоматически, пока запрос активен.',

closedEmergencySubtitle:
  'Этот экстренный запрос больше не активен.',

currentStatus: 'ТЕКУЩИЙ СТАТУС',
responderHasArrived: 'Спасатель прибыл',
onSceneStatus: 'НА МЕСТЕ',

responderTracking: 'ОТСЛЕЖИВАНИЕ СПАСАТЕЛЯ',
assignedResponseUnit: 'НАЗНАЧЕННАЯ ГРУППА',
emergencyResponder: 'Спасатель',

liveLocationActive: 'Геолокация активна',
updatedAtTime: 'Обновлено {{time}}',

fromYourLocation: 'от вашего местоположения',
estimatedArrivalShort: 'ПРИБЫТИЕ',
minutesShort: '~{{minutes}} мин',
approximate: 'примерно',

etaPrototypeNotice:
  'Время прибытия рассчитывается по GPS-расстоянию и пока не учитывает дорожный маршрут.',

responderArrivedDescription:
  'Экстренные службы прибыли к вам и занимаются происшествием.',

responderAssigned: 'Спасатель назначен',

waitingForResponderLocation:
  'Ожидаем принятия вызова спасателем и начала передачи его местоположения.',

responseComplete: 'РЕАГИРОВАНИЕ ЗАВЕРШЕНО',

completedSavedHistory:
  'Реагирование завершено и сохранено в истории экстренных запросов.',

responseProgress: 'ХОД РЕАГИРОВАНИЯ',

requestSent: 'Запрос отправлен',
requestSentDescription:
  'Ваш экстренный запрос был отправлен.',

requestAcceptedDescription:
  'Оператор принял ваш запрос.',

responderDispatchedDescription:
  'Спасатель был назначен на ваш вызов.',

responderReachedLocation:
  'Экстренные службы прибыли к вашему местоположению.',

emergencyServicesResponding:
  'Экстренные службы направляются к вам.',

responseCompletedDescription:
  'Экстренное реагирование завершено.',

liveResponseMap: 'КАРТА РЕАГИРОВАНИЯ',
yourEmergencyLocation: 'Ваше место происшествия',
you: 'Вы',

emergencyDetails: 'ДЕТАЛИ ЗАПРОСА',
responderAssignedLabel: 'СПАСАТЕЛЬ НАЗНАЧЕН',

noContactsAttached: 'Контакты не прикреплены',

noContactsAttachedDescription:
  'К этому запросу не были прикреплены экстренные контакты.',

dashboard: 'Главная',
      finalStep: 'ФИНАЛЬНЫЙ ШАГ',

confirmEmergencySubtitle:
  'Проверьте данные экстренного запроса и текущее местоположение перед отправкой.',

requestSummary:
  'СВОДКА ЗАПРОСА',

service:
  'СЛУЖБА',

aiAssist:
  'AI ПОМОЩНИК',

detectingLocation:
  'Определяем местоположение',

gettingGpsCoordinates:
  'Получаем ваши текущие GPS-координаты.',

locationAttached:
  'Ваше местоположение будет прикреплено к экстренному запросу.',

gpsCoordinates:
  'GPS-КООРДИНАТЫ',

locationUnavailable:
  'Местоположение недоступно',

tryLocationAgain:
  'Попробовать снова',

locationRequiredBeforeSend:
  'Перед отправкой экстренного запроса необходимо определить ваше местоположение.',

couldNotDetermineLocation:
  'Не удалось определить ваше местоположение. Попробуйте снова.',

requestNotSent:
  'Запрос не отправлен',

couldNotSendEmergency:
  'Не удалось отправить экстренный запрос',

safetySendNote:
  'Данные экстренного запроса и ваше текущее местоположение будут отправлены в систему ResQ.',

invalidEmergency:
  'Некорректный экстренный запрос',

invalidEmergencyDescription:
  'Вернитесь на главную страницу и выберите экстренную службу.',
      medicalEmergency: 'Медицинская помощь',
policeEmergency: 'Вызов полиции',
fireEmergency: 'Пожар и спасение',

medicalLabel: 'МЕДИЦИНА',
policeLabel: 'ПОЛИЦИЯ',
fireLabel: 'ПОЖАР И СПАСЕНИЕ',

invalidEmergencyType:
  'Неверный тип экстренной ситуации',

invalidEmergencyTypeDescription:
  'Вернитесь на главную страницу и выберите экстренную службу.',

backToDashboard:
  'Вернуться на главную',

emergencyDescriptionIntro:
  'Опишите, что произошло. Пишите кратко и понятно, чтобы оператор мог быстро оценить ситуацию.',

whatHappened:
  'Что произошло?',

fieldRequired:
  'Обязательно',

emergencyExample:
  'Пример: Человек потерял сознание и не реагирует.',

importantDetailsFirst:
  'Сначала укажите самые важные детали.',

describeBeforeAI:
  'Опишите ситуацию перед использованием AI Assist.',

aiAssistUnavailable:
  'AI Assist сейчас недоступен',

brieflyDescribeEmergency:
  'Кратко опишите экстренную ситуацию.',

aiEmergencyAssist:
  'AI ПОМОЩНИК',

organizeReport:
  'Структурировать обращение',

aiEmergencyDescription:
  'AI может кратко изложить ситуацию, предложить подходящую службу и выделить важные детали для оператора.',

aiOptional:
  'Необязательно — AI не требуется для отправки экстренного запроса.',

analyzing:
  'Анализ...',

analyzeWithAI:
  'Проанализировать с AI',

aiAnalysis:
  'AI АНАЛИЗ',

intakeSummary:
  'Краткое резюме',

likelyService:
  'ПРЕДПОЛАГАЕМАЯ СЛУЖБА',

operatorSummary:
  'СВОДКА ДЛЯ ОПЕРАТОРА',

urgency:
  'СРОЧНОСТЬ',

importantDetails:
  'ВАЖНЫЕ ДЕТАЛИ',

optionalFollowUp:
  'ДОПОЛНИТЕЛЬНЫЙ ВОПРОС',

aiIntakeDisclaimer:
  'AI помогает обработать обращение, но может ошибаться. Ваше исходное описание также будет отправлено оператору.',

continueEmergencyNote:
  'Далее вы подтвердите своё местоположение и проверите запрос перед отправкой.',
      emergencyProfile: 'Экстренный профиль',
      appName: 'ResQ Экстренная помощь',
      emergencyResponse: 'Экстренная помощь',
      secureAccess:
        'Безопасный доступ к сервисам ResQ',

      language: 'Язык',
      english: 'Английский',
      russian: 'Русский',
      kazakh: 'Казахский',

      loading: 'Загрузка...',
      available: 'ДОСТУПЕН',
      active: 'АКТИВЕН',
      enabled: 'Включено',
      disabled: 'Выключено',
      online: 'ОНЛАЙН',
      offline: 'ОФЛАЙН',
      ready: 'ГОТОВ',
      busy: 'ЗАНЯТ',

      back: 'Назад',
      continue: 'Продолжить',
      cancel: 'Отмена',
      confirm: 'Подтвердить',
      save: 'Сохранить',
      edit: 'Изменить',
      delete: 'Удалить',
      close: 'Закрыть',
      done: 'Готово',
      refresh: 'Обновить',
      retry: 'Повторить',

      home: 'Главная',
      profile: 'Профиль',
      history: 'История',
      map: 'Карта',
      assignments: 'Вызовы',
      contacts: 'Контакты',
      alerts: 'Оповещения',

      welcomeBack: 'С ВОЗВРАЩЕНИЕМ',

      signInTitle:
        'Войдите в аккаунт',

      signInSubtitle:
        'Получите доступ к экстренной помощи, предупреждениям, истории обращений и отслеживанию спасателей.',

      email: 'Электронная почта',
      emailRequired:
        'Введите электронную почту',

      password: 'Пароль',
      passwordRequired:
        'Введите пароль',

      forgotPassword:
        'Забыли пароль?',

      enterPassword:
        'Введите пароль',

      signIn: 'Войти',
      signingIn: 'Вход...',

      newTo112:
        'Впервые в ResQ?',

      createAccount:
        'Создать аккаунт',

      footer:
        'Ваш аккаунт используется для безопасного доступа к экстренным службам и информации об обращениях.',

      operatorWebOnly:
        'Аккаунты операторов используют веб-центр управления.',

      couldNotSignIn:
        'Не удалось войти',

      createAccountEyebrow:
        'СОЗДАНИЕ АККАУНТА',

      join112:
        'Присоединиться к ResQ',

      registerSubtitle:
        'Создайте аккаунт, чтобы отправлять экстренные запросы, получать предупреждения и отслеживать активные вызовы.',

      fullName:
        'Полное имя',

      fullNameRequired:
        'Введите полное имя',

      fullNamePlaceholder:
        'Введите ваше полное имя',

      invalidEmail:
        'Введите корректный email',

      minimumPassword:
        'Минимум 8 символов',

      passwordHint:
        'Используйте не менее 8 символов.',

      passwordTooShort:
        'Пароль должен содержать не менее 8 символов',

      creatingAccount:
        'Создание аккаунта...',

      alreadyHaveAccount:
        'Уже есть аккаунт?',

      registerFooter:
        'Информация вашего аккаунта используется для безопасного предоставления экстренной помощи.',

      couldNotRegister:
        'Не удалось зарегистрироваться',

      heyUser:
        'Здравствуйте, {{name}},',

      dashboardQuestion:
        'Чем ResQ может помочь вам сегодня?',

      emergencyAssistance:
        'ЭКСТРЕННАЯ ПОМОЩЬ',

      ready112:
        'ResQ ГОТОВ',

      needEmergencyHelp:
        'Нужна экстренная помощь?',

      emergencyHelpDescription:
        'Выберите необходимую экстренную службу и передайте своё местоположение системе реагирования.',

      startEmergencyRequest:
        'Создать экстренный запрос',

      aiAssistantSection:
        'ResQ AI АССИСТЕНТ',

      aiAssistantDescription:
        'Получите помощь в выборе экстренной службы и использовании платформы.',

      ask112AI:
        'Спросить ResQ AI',

      aiCardDescription:
        'Задавайте вопросы об экстренных службах, подготовьте запрос или получите помощь по использованию платформы ResQ.',

      openAssistant:
        'Открыть ассистента',

      oneTapServices:
        'ЭКСТРЕННЫЕ СЛУЖБЫ',

      selectEmergencyService:
        'Выберите необходимую службу.',

      medical:
        'Медицина',

      medicalDescription:
        'Скорая и медицинская помощь',

      police:
        'Полиция',

      policeDescription:
        'Полиция и помощь в обеспечении безопасности',

      fireRescue:
        'Пожарные и спасатели',

      fireDescription:
        'Пожарная и спасательная помощь',

      more:
        'ДОПОЛНИТЕЛЬНО',

      manageEmergencySetup:
        'Управляйте настройками экстренной помощи.',

      emergencyContacts:
        'Экстренные контакты',

      emergencyContactsDescription:
        'Управляйте людьми, связанными с вашим экстренным профилем.',

      locationSharingFooter:
        'Ваше местоположение передаётся при отправке экстренного запроса, чтобы службы могли вас найти.',

      yourAccount:
        'ВАШ АККАУНТ',

      accountAndSafety:
        'Аккаунт и безопасность',

      profileSubtitle:
        'Управляйте экстренным профилем, контактами, поддержкой и доступом к аккаунту.',

      accountReady:
        'Аккаунт готов к использованию в экстренной ситуации',

      safetySettings:
        'НАСТРОЙКИ БЕЗОПАСНОСТИ',

      automaticGpsSharing:
        'Автоматическая передача GPS',

      gpsSharingDescription:
        'Ваше местоположение передаётся при отправке экстренного запроса.',

      support:
        'ПОДДЕРЖКА',

      helpSupport:
        'Помощь и поддержка',

      helpSupportDescription:
        'Получите ответы, свяжитесь с поддержкой или спросите ResQ AI.',

      askAiDescription:
        'Задавайте вопросы о безопасности, экстренных службах и платформе.',

      account:
        'АККАУНТ',

      logout:
        'Выйти',

      logoutDescription:
        'Выйти из аккаунта на этом устройстве.',

      logoutQuestion:
        'Выйти из аккаунта?',

      logoutConfirm:
        'Для повторного доступа вам потребуется снова войти.',

      keepAccountUpdated:
        'Поддерживайте данные аккаунта и экстренные контакты в актуальном состоянии.',

      passwordRecovery:
        'Восстановление пароля',

      forgotPasswordTitle:
        'Сброс пароля',

      forgotPasswordDescription:
        'Восстановление пароля будет доступно в будущей версии ResQ.',

      returnToLogin:
        'Вернуться ко входу',

      emergencyRequest:
        'Экстренный запрос',

      requestMedicalHelp:
        'Вызвать медицинскую помощь',

      requestPoliceHelp:
        'Вызвать полицию',

      requestFireHelp:
        'Вызвать пожарных и спасателей',

      describeEmergency:
        'Опишите ситуацию',

      emergencyDescriptionPlaceholder:
        'Кратко опишите, что происходит...',

      descriptionRequired:
        'Опишите экстренную ситуацию.',

      yourLocation:
        'Ваше местоположение',

      currentLocation:
        'Текущее местоположение',

      gettingLocation:
        'Определяем местоположение...',

      locationReady:
        'Местоположение определено',

      locationPermissionRequired:
        'Для отправки экстренного запроса необходим доступ к местоположению.',

      couldNotGetLocation:
        'Не удалось определить местоположение.',

      submitEmergency:
        'Отправить экстренный запрос',

      submittingEmergency:
        'Отправка запроса...',

      emergencyDisclaimer:
        'Ваше местоположение и данные запроса будут переданы системе реагирования.',

      confirmEmergency:
        'Подтверждение запроса',

      reviewRequest:
        'Проверьте запрос',

      confirmEmergencyDescription:
        'Проверьте данные перед отправкой экстренного запроса.',

      emergencyType:
        'Тип экстренной ситуации',

      description:
        'Описание',

      location:
        'Местоположение',

      sendRequest:
        'Отправить запрос',

      sendingRequest:
        'Отправка...',

      emergencyStatus:
        'Статус запроса',

      requestReceived:
        'Запрос получен',

      requestAccepted:
        'Запрос принят',

      responderDispatched:
        'Спасатель направлен',

      responderOnWay:
        'Спасатель в пути',

      responderArrived:
        'Спасатель прибыл',

      emergencyCompleted:
        'Запрос завершён',

      requestCancelled:
        'Запрос отменён',

      pending:
        'Ожидает',

      accepted:
        'Принят',

      dispatched:
        'Направлен',

      responding:
        'В пути',

      completed:
        'Завершён',

      cancelled:
        'Отменён',

      liveResponderTracking:
        'Отслеживание спасателя',

      waitingForResponder:
        'Ожидание спасателя',

      responderLocation:
        'Местоположение спасателя',

      responderGpsActive:
        'GPS спасателя активен',

      gpsWaiting:
        'Ожидание GPS',

      estimatedArrival:
        'Ожидаемое прибытие',

      distance:
        'Расстояние',

      responder:
        'Спасатель',

      emergencyHistory:
        'История запросов',

      historySubtitle:
        'Просмотрите предыдущие экстренные запросы.',

      noEmergencyHistory:
        'История пуста',

      noEmergencyHistoryDescription:
        'Ваши предыдущие запросы появятся здесь.',

      created:
        'Создан',

      updated:
        'Обновлён',

      trustedContacts:
        'Доверенные контакты',

      contactsSubtitle:
        'Управляйте людьми, связанными с вашим экстренным профилем.',

      addContact:
        'Добавить контакт',

      editContact:
        'Изменить контакт',

      deleteContact:
        'Удалить контакт',

      contactName:
        'Имя контакта',

      contactPhone:
        'Номер телефона',

      enterContactName:
        'Введите имя',

      enterPhone:
        'Введите номер телефона',

      saveContact:
        'Сохранить контакт',

      noContacts:
        'Нет экстренных контактов',

      noContactsDescription:
        'Добавьте доверенных людей, которые могут быть связаны с вашими экстренными запросами.',

      deleteContactQuestion:
        'Удалить контакт?',

      deleteContactDescription:
        'Контакт будет удалён из вашего экстренного профиля.',

      safetyAlerts:
        'Предупреждения',

      safetyAlertsSubtitle:
        'Официальные предупреждения и экстренная информация от ResQ.',

      noSafetyAlerts:
        'Нет активных предупреждений',

      noSafetyAlertsDescription:
        'Предупреждения ResQ будут отображаться здесь.',

      helpSupportTitle:
        'Как мы можем помочь?',

      helpSupportSubtitle:
        'Найдите ответы по приложению ResQ, экстренным запросам, аккаунту и отслеживанию спасателя.',

      frequentlyAskedQuestions:
        'ЧАСТЫЕ ВОПРОСЫ',

      whenLocationShared:
        'Когда передаётся моё местоположение?',

      whenLocationSharedAnswer:
        'Местоположение передаётся при отправке экстренного запроса, чтобы службы могли вас найти.',

      canTrackResponder:
        'Можно ли отслеживать спасателя?',

      canTrackResponderAnswer:
        'Да. Когда спасатель передаёт GPS, экран статуса показывает его местоположение и примерное время прибытия.',

      whatAreContacts:
        'Что такое экстренные контакты?',

      whatAreContactsAnswer:
        'Это доверенные люди, связанные с вашим профилем и экстренными запросами.',

      doesAiDispatch:
        'Может ли ResQ AI направить помощь?',

      doesAiDispatchAnswer:
        'Нет. ResQ AI может дать рекомендации, но вызов служб выполняется через экстренный запрос.',

      contactSupport:
        'Связаться с поддержкой',

      contactSupportFuture:
        'Прямая связь с поддержкой будет добавлена в будущей версии.',

      activeEmergencySupportNotice:
        'При активной экстренной ситуации используйте функцию экстренного запроса.',

      aiWelcome:
        'Здравствуйте. Я ResQ AI. Чем могу помочь?',

      aiSafetyNotice:
        'ResQ AI может дать рекомендации, но не может самостоятельно направлять экстренные службы.',

      askAnything:
        'Спросите ResQ AI...',

      send:
        'Отправить',

      aiError:
        'Не удалось получить ответ от ResQ AI.',

      requestEmergencyHelp:
        'Запросить экстренную помощь',

      responderSystem:
        'СИСТЕМА СПАСАТЕЛЯ',

      fieldOperations:
        'Полевые операции',

      activeDuty:
        'АКТИВНАЯ СМЕНА',

      responderDashboard:
        'Панель спасателя',

      fieldDashboard:
        'Полевая панель',

      responderDashboardDescription:
        'Следите за статусом вызовов и управляйте активными назначениями.',

      activeAssignments:
        'Активные вызовы',

      dutyStatus:
        'Статус смены',

      readyForDispatch:
        'Готов к вызову',

      activeResponse:
        'Выполняется активный вызов',

      currentResponse:
        'ТЕКУЩИЙ ВЫЗОВ',

      activeAssignment:
        'Активное назначение',

      viewAll:
        'Показать все',

      openAssignment:
        'Открыть вызов',

      operations:
        'ОПЕРАЦИИ',

      assignmentHistory:
        'История вызовов',

      previousIncidents:
        'Предыдущие происшествия',

      responderSystemOnline:
        'Система спасателя онлайн',

      dispatchSyncActive:
        'Синхронизация с диспетчерской активна.',

      dispatchQueue:
        'ОЧЕРЕДЬ ВЫЗОВОВ',

      assignedEmergencies:
        'Назначенные вызовы',

      assignedEmergenciesDescription:
        'Потяните вниз для обновления. Новые вызовы появятся автоматически.',

      noActiveAssignments:
        'Нет активных вызовов',

      noActiveAssignmentsDescription:
        'Вы готовы к вызову. Новые происшествия появятся здесь автоматически.',

      incident:
        'ПРОИСШЕСТВИЕ',

      caller:
        'ЗАЯВИТЕЛЬ',

      responseState:
        'СТАТУС РЕАГИРОВАНИЯ',

      emergencyLocation:
        'МЕСТО ПРОИСШЕСТВИЯ',

      exactCoordinates:
        'Точные координаты, полученные из экстренного запроса.',

      acceptDispatch:
        'Принять вызов',

      acceptDispatchDescription:
        'После принятия начинается реагирование и включается передача GPS.',

      acceptAssignment:
        'Принять назначение',

      enRoute:
        'В ПУТИ',

      onScene:
        'НА МЕСТЕ',

      liveGpsActive:
        'GPS АКТИВЕН',

      gpsNotSharing:
        'GPS НЕ ПЕРЕДАЁТСЯ',

      locationSharingActive:
        'Передача местоположения активна',

      startLocationSharing:
        'Начать передачу местоположения',

      trackingActiveDescription:
        'Ваше положение передаётся оператору ResQ и пользователю в реальном времени.',

      trackingInactiveDescription:
        'Во время реагирования GPS должен быть активен.',

      currentResponderPosition:
        'ТЕКУЩЕЕ ПОЛОЖЕНИЕ СПАСАТЕЛЯ',

      startGpsSharing:
        'Включить GPS',

      markAsArrived:
        'Отметить прибытие',

      startGpsBeforeArrival:
        'Сначала включите GPS',

      arrivalGpsRequirement:
        'Отметка прибытия станет доступна после включения GPS.',

      confirmArrival:
        'Подтвердить прибытие',

      confirmArrivalDescription:
        'Подтвердите, что вы прибыли на место происшествия.',

      iHaveArrived:
        'Я прибыл',

      youAreOnScene:
        'Вы на месте',

      onSceneDescription:
        'Передача GPS остановлена. Завершите реагирование и закройте вызов после окончания работ.',

      completeEmergency:
        'Завершить вызов',

      completeEmergencyQuestion:
        'Завершить вызов?',

      completeEmergencyDescription:
        'Завершайте вызов только после окончания реагирования на месте.',

      responseMap:
        'Карта реагирования',

      liveMap:
        'КАРТА В РЕАЛЬНОМ ВРЕМЕНИ',

      deviceGpsAvailable:
        'GPS устройства доступен',

      gpsUnavailable:
        'GPS недоступен',

      deviceGpsDescription:
        'Ваше текущее положение отображается на карте.',

      gpsPermissionDescription:
        'Разрешите доступ к геолокации для отображения вашего положения.',

      assignedIncidents:
        'НАЗНАЧЕННЫЕ ПРОИСШЕСТВИЯ',

      incidentDetails:
        'ДЕТАЛИ ПРОИСШЕСТВИЯ',

      startNavigation:
        'Начать навигацию',

      openAssignmentControls:
        'Открыть управление вызовом',

      noAssignedIncidents:
        'Нет назначенных происшествий',

      noAssignedIncidentsDescription:
        'Назначенные диспетчером происшествия автоматически появятся на карте.',

      mapTrackingNotice:
        'Карта показывает ваше положение локально. Официальная передача GPS управляется на экране вызова.',

      responseHistory:
        'История реагирований',

      responseRecord:
        'ЖУРНАЛ РЕАГИРОВАНИЙ',

      completedIncidents:
        'Завершённые происшествия',

      completedIncidentsDescription:
        'Просмотрите завершённые вызовы, назначенные вашему аккаунту.',

      totalCompleted:
        'Всего завершено',

      completedToday:
        'Завершено сегодня',

      completedAssignments:
        'ЗАВЕРШЁННЫЕ ВЫЗОВЫ',

      noCompletedIncidents:
        'Завершённых вызовов пока нет',

      noCompletedIncidentsDescription:
        'Завершённые вызовы появятся здесь.',

      responderHistoryNotice:
        'История связана с вашим аккаунтом спасателя и содержит только завершённые вами вызовы.',

      fieldStatus:
        'ПОЛЕВОЙ СТАТУС',

      gpsPermission:
        'Доступ к GPS',

      system:
        'СИСТЕМА',

      dispatchConnection:
        'Связь с диспетчерской',

      dispatchConnectionDescription:
        'Подключено к системе экстренной диспетчеризации ResQ.',

      locationServices:
        'Службы геолокации',

      locationServicesDescription:
        'Необходимы для отслеживания спасателя во время активных вызовов.',

      required:
        'ТРЕБУЕТСЯ',

      quickAccess:
        'БЫСТРЫЙ ДОСТУП',

      assignmentsDescription:
        'Откройте активные вызовы и действия реагирования.',

      responseHistoryDescription:
        'Просмотрите завершённые вызовы.',

      responderLogoutDescription:
        'Выйти из системы спасателя на этом устройстве.',

      responderLogoutConfirm:
        'Для повторного доступа потребуется снова войти.',

      responderSecurityNotice:
        'Этот аккаунт авторизован для экстренных полевых операций. Обеспечьте безопасность доступа.',

      navHome: 'Главная',
      navHistory: 'История',
      navAlerts: 'Оповещения',
      navProfile: 'Профиль',
      navAssignments: 'Вызовы',
      navMap: 'Карта',
    },
  },

  /* =========================================================
     KAZAKH
     ========================================================= */

  kk: {
    translation: {
      howCanWeHelp:
  'Қалай көмектесе аламыз?',

helpSupportIntro:
  'ResQ қолданбасы, жедел сұраулар, аккаунт және құтқарушыны бақылау туралы жауаптарды табыңыз.',

helpAiCardText:
  'Платформаны пайдалану, жедел қызметтерді түсіну және жалпы қауіпсіздік сұрақтары бойынша көмек алыңыз.',
      accountRecovery:
  'АККАУНТТЫ ҚАЛПЫНА КЕЛТІРУ',

forgotPasswordEmailDescription:
  'ResQ аккаунтыңызға байланысты email мекенжайын енгізіңіз.',

enterEmailAddress:
  'Email мекенжайын енгізіңіз.',

passwordRecoveryUnavailable:
  'Құпиясөзді қалпына келтіру әзірге қолжетімсіз. Бұл мүмкіндік кейінгі нұсқада қосылады.',

rememberPassword:
  'Құпиясөзіңіз есіңізде ме?',

passwordRecoveryPlaceholderNotice:
  'Құпиясөзді қалпына келтіру әзірге уақытша интерфейс және қалпына келтіру хаттарын жібермейді.',
      safetyAssistant:
  'Қауіпсіздік көмекшісі',

aiChatWelcome:
  'Сәлем. Мен ResQ AI. Жедел қызметтерді түсінуге, сұрау дайындауға және ResQ платформасын пайдалануға көмектесе аламын.',

aiChatSafetyBanner:
  'ResQ AI бағыт бере алады, бірақ жедел қызметтерді өзі жібере алмайды.',

emergencyAction:
  'ЖЕДЕЛ ӘРЕКЕТ',

aiUnavailable:
  'ResQ AI қазір қолжетімсіз',

aiThinking:
  'ResQ AI ойлануда...',

ask112Placeholder:
  'ResQ AI-дан сұраңыз...',

aiUrgentHint:
  'Шұғыл жағдайда тек AI чатқа сенбей, жедел сұрау мүмкіндігін пайдаланыңыз.',
      loadingSafetyAlerts:
  'Қауіпсіздік ескертулері жүктелуде...',

couldNotLoadAlerts:
  'Ескертулерді жүктеу мүмкін болмады',

publicSafety:
  'ҚОҒАМДЫҚ ҚАУІПСІЗДІК',

alertsPageSubtitle:
  'Аймағыңызға арналған ресми қауіпсіздік ақпараты мен маңызды хабарламалар.',

noActiveAlerts:
  'Белсенді ескертулер жоқ',

activeAlert_one:
  '{{count}} белсенді ескерту',

activeAlert_other:
  '{{count}} белсенді ескерту',

alertsPublishedThrough112:
  'Қауіпсіздік хабарламалары ResQ операторлық жүйесі арқылы жарияланады.',

allClear:
  'БӘРІ ҚАЛЫПТЫ',

activeNotices:
  'БЕЛСЕНДІ ХАБАРЛАМАЛАР',

informationSeverity:
  'АҚПАРАТ',

warningSeverity:
  'ЕСКЕРТУ',

criticalSeverity:
  'МАҢЫЗДЫ',

published:
  'ЖАРИЯЛАНДЫ',

pullToRefreshAlerts:
  'Соңғы қауіпсіздік ақпаратын жаңарту үшін төмен тартыңыз.',
      safetyNetwork:
  'ҚАУІПСІЗДІК ЖЕЛІСІ',

contactsPageSubtitle:
  'Жедел жағдайда хабарласу қажет болуы мүмкін сенімді адамдарды қосыңыз.',

savedContact_one:
  '{{count}} сақталған контакт',

savedContact_other:
  '{{count}} сақталған контакт',

savedContactsDescription:
  'Бұл контактілер жедел сұрауларыңызбен байланыстырылуы мүмкін.',

addContactSection:
  'КОНТАКТ ҚОСУ',

savedContactsSection:
  'САҚТАЛҒАН КОНТАКТІЛЕР',

name:
  'Аты',

nameExample:
  'Мысал: Анам',

phoneNumber:
  'Телефон нөмірі',

contactNameRequired:
  'Контакт атын енгізіңіз',

phoneNumberRequired:
  'Телефон нөмірін енгізіңіз',

couldNotLoadContacts:
  'Контактілерді жүктеу мүмкін болмады',

couldNotAddContact:
  'Контакт қосу мүмкін болмады',

couldNotDeleteContact:
  'Контактіні жою мүмкін болмады',

actionFailed:
  'Әрекет орындалмады',

addingContact:
  'Контакт қосылуда...',

addEmergencyContact:
  'Жедел контакт қосу',

loadingContacts:
  'Контактілер жүктелуде...',

noContactsYet:
  'Контактілер әлі жоқ',

noContactsYetDescription:
  'Жоғарыдағы форма арқылы сенімді адамды қосыңыз.',

deleteContactPrompt:
  'Контактіні жою керек пе?',

deleteContactNamedDescription:
  '{{name}} контактісін жедел контактілерден алып тастау керек пе?',

trustedContactsNotice:
  'Тек сенімді адамдарды қосыңыз және олардың телефон нөмірлерін жаңартып отырыңыз.',
      loadingHistory:
  'Тарих жүктелуде...',

couldNotLoadHistory:
  'Жедел сұраулар тарихын жүктеу мүмкін болмады',

yourRequests:
  'СІЗДІҢ СҰРАУЛАРЫҢЫЗ',

historyPageSubtitle:
  'Белсенді және алдыңғы жедел сұрауларыңызды қараңыз.',

totalRequests:
  'Барлық сұраулар',

couldNotRefreshHistory:
  'Тарихты жаңарту мүмкін болмады',

noEmergenciesYet:
  'Жедел сұраулар әлі жоқ',

noEmergenciesYetDescription:
  'Жедел сұрау жібергеннен кейін ол осында көрсетіледі.',

allRequests:
  'БАРЛЫҚ СҰРАУЛАР',

pullToRefreshHistory:
  'Жедел сұраулар тарихын жаңарту үшін төмен тартыңыз.',
      loadingEmergency: 'Жедел сұрау жүктелуде...',
invalidEmergencyId: 'Жедел сұрау ID дұрыс емес',
couldNotLoadEmergency: 'Жедел сұрауды жүктеу мүмкін болмады',
emergencyRequestNotFound: 'Жедел сұрау табылмады',

waitingForOperator: 'Оператор күтілуде',

requestNumber: 'СҰРАУ #{{id}}',
live: 'ТІКЕЛЕЙ',

activeEmergencySubtitle:
  'Сұрау белсенді болған кезде күй автоматты түрде жаңартылады.',

closedEmergencySubtitle:
  'Бұл жедел сұрау енді белсенді емес.',

currentStatus: 'АҒЫМДАҒЫ КҮЙ',
responderHasArrived: 'Құтқарушы келді',
onSceneStatus: 'ОҚИҒА ОРНЫНДА',

responderTracking: 'ҚҰТҚАРУШЫНЫ БАҚЫЛАУ',
assignedResponseUnit: 'ТАҒАЙЫНДАЛҒАН ТОП',
emergencyResponder: 'Құтқарушы',

liveLocationActive: 'Орналасқан жер тікелей берілуде',
updatedAtTime: 'Жаңартылды {{time}}',

fromYourLocation: 'сіздің орналасқан жеріңізден',
estimatedArrivalShort: 'КЕЛУ УАҚЫТЫ',
minutesShort: '~{{minutes}} мин',
approximate: 'шамамен',

etaPrototypeNotice:
  'Келу уақыты GPS қашықтығы бойынша есептеледі және әзірге жол маршрутын ескермейді.',

responderArrivedDescription:
  'Жедел қызметтер сіздің орналасқан жеріңізге келіп, жағдайды өңдеуде.',

responderAssigned: 'Құтқарушы тағайындалды',

waitingForResponderLocation:
  'Құтқарушының шақыртуды қабылдап, орналасқан жерін бөлісуін күтіп отырмыз.',

responseComplete: 'ӘРЕКЕТ АЯҚТАЛДЫ',

completedSavedHistory:
  'Бұл әрекет аяқталды және жедел сұраулар тарихында сақталды.',

responseProgress: 'ӘРЕКЕТ БАРЫСЫ',

requestSent: 'Сұрау жіберілді',
requestSentDescription:
  'Жедел сұрауыңыз жіберілді.',

requestAcceptedDescription:
  'Оператор сұрауыңызды қабылдады.',

responderDispatchedDescription:
  'Жедел жағдайыңызға құтқарушы тағайындалды.',

responderReachedLocation:
  'Жедел қызметтер орналасқан жеріңізге жетті.',

emergencyServicesResponding:
  'Жедел қызметтер сізге қарай келе жатыр.',

responseCompletedDescription:
  'Жедел әрекет аяқталды.',

liveResponseMap: 'ТІКЕЛЕЙ ӘРЕКЕТ КАРТАСЫ',
yourEmergencyLocation: 'Сіздің жедел жағдай орныңыз',
you: 'Сіз',

emergencyDetails: 'ЖЕДЕЛ СҰРАУ АҚПАРАТЫ',
responderAssignedLabel: 'ҚҰТҚАРУШЫ ТАҒАЙЫНДАЛДЫ',

noContactsAttached: 'Контактілер тіркелмеген',

noContactsAttachedDescription:
  'Бұл жедел сұрауға ешқандай контакт тіркелмеген.',

dashboard: 'Басты бет',
      finalStep:
  'СОҢҒЫ ҚАДАМ',

confirmEmergencySubtitle:
  'Жібермес бұрын жедел сұрау ақпараты мен ағымдағы орналасқан жеріңізді тексеріңіз.',

requestSummary:
  'СҰРАУ ҚОРЫТЫНДЫСЫ',

service:
  'ҚЫЗМЕТ',

aiAssist:
  'AI КӨМЕКШІСІ',

detectingLocation:
  'Орналасқан жер анықталуда',

gettingGpsCoordinates:
  'Ағымдағы GPS координаттарыңыз алынуда.',

locationAttached:
  'Орналасқан жеріңіз жедел сұрауға тіркеледі.',

gpsCoordinates:
  'GPS КООРДИНАТТАРЫ',

locationUnavailable:
  'Орналасқан жер қолжетімсіз',

tryLocationAgain:
  'Қайта анықтау',

locationRequiredBeforeSend:
  'Жедел сұрауды жібермес бұрын орналасқан жеріңіз қажет.',

couldNotDetermineLocation:
  'Орналасқан жеріңізді анықтау мүмкін болмады. Қайталап көріңіз.',

requestNotSent:
  'Сұрау жіберілмеді',

couldNotSendEmergency:
  'Жедел сұрауды жіберу мүмкін болмады',

safetySendNote:
  'Жедел сұрау ақпараты мен ағымдағы орналасқан жеріңіз ResQ әрекет ету платформасына жіберіледі.',

invalidEmergency:
  'Жедел сұрау дұрыс емес',

invalidEmergencyDescription:
  'Басты бетке оралып, қажетті жедел қызметті таңдаңыз.',
      medicalEmergency:
  'Медициналық жедел жағдай',

policeEmergency:
  'Полиция шақыртуы',

fireEmergency:
  'Өрт және құтқару',

medicalLabel:
  'МЕДИЦИНА',

policeLabel:
  'ПОЛИЦИЯ',

fireLabel:
  'ӨРТ ЖӘНЕ ҚҰТҚАРУ',

invalidEmergencyType:
  'Жедел жағдай түрі дұрыс емес',

invalidEmergencyTypeDescription:
  'Басты бетке оралып, қажетті жедел қызметті таңдаңыз.',

backToDashboard:
  'Басты бетке оралу',

emergencyDescriptionIntro:
  'Не болғанын сипаттаңыз. Оператор жағдайды жылдам түсінуі үшін қысқа әрі нақты жазыңыз.',

whatHappened:
  'Не болды?',

fieldRequired:
  'Міндетті',

emergencyExample:
  'Мысал: Адам есінен танып қалды және жауап бермейді.',

importantDetailsFirst:
  'Ең маңызды ақпаратты алдымен жазыңыз.',

describeBeforeAI:
  'AI Assist қолданбас бұрын жағдайды сипаттаңыз.',

aiAssistUnavailable:
  'AI Assist қолжетімсіз',

brieflyDescribeEmergency:
  'Жедел жағдайды қысқаша сипаттаңыз.',

aiEmergencyAssist:
  'AI ЖЕДЕЛ КӨМЕКШІСІ',

organizeReport:
  'Сұрауды реттеу',

aiEmergencyDescription:
  'AI сұрауыңызды қорытындылап, ықтимал қызметті ұсынып, оператор үшін маңызды мәліметтерді белгілей алады.',

aiOptional:
  'Міндетті емес — жедел сұрау жіберу үшін AI қажет емес.',

analyzing:
  'Талдау жүргізілуде...',

analyzeWithAI:
  'AI арқылы талдау',

aiAnalysis:
  'AI ТАЛДАУЫ',

intakeSummary:
  'Қысқаша қорытынды',

likelyService:
  'ЫҚТИМАЛ ҚЫЗМЕТ',

operatorSummary:
  'ОПЕРАТОРҒА АРНАЛҒАН ҚОРЫТЫНДЫ',

urgency:
  'ШҰҒЫЛДЫҚ',

importantDetails:
  'МАҢЫЗДЫ МӘЛІМЕТТЕР',

optionalFollowUp:
  'ҚОСЫМША СҰРАҚ',

aiIntakeDisclaimer:
  'AI жедел сұрауды өңдеуге көмектеседі, бірақ қателесуі мүмкін. Бастапқы сипаттамаңыз да операторға жіберіледі.',

continueEmergencyNote:
  'Келесі қадамда орналасқан жеріңізді растап, сұрауды жібермес бұрын тексересіз.',
      emergencyProfile: 'Жедел профиль',
      appName: 'ResQ Жедел көмек',
      emergencyResponse:
        'Жедел көмек',

      secureAccess:
        'ResQ қызметтеріне қауіпсіз қолжетімділік',

      language: 'Тіл',
      english: 'Ағылшын',
      russian: 'Орыс',
      kazakh: 'Қазақ',

      loading: 'Жүктелуде...',
      available: 'ҚОЛЖЕТІМДІ',
      active: 'БЕЛСЕНДІ',
      enabled: 'Қосулы',
      disabled: 'Өшірулі',
      online: 'ОНЛАЙН',
      offline: 'ОФЛАЙН',
      ready: 'ДАЙЫН',
      busy: 'БОС ЕМЕС',

      back: 'Артқа',
      continue: 'Жалғастыру',
      cancel: 'Бас тарту',
      confirm: 'Растау',
      save: 'Сақтау',
      edit: 'Өзгерту',
      delete: 'Жою',
      close: 'Жабу',
      done: 'Дайын',
      refresh: 'Жаңарту',
      retry: 'Қайталау',

      home: 'Басты бет',
      profile: 'Профиль',
      history: 'Тарих',
      map: 'Карта',
      assignments: 'Шақыртулар',
      contacts: 'Контактілер',
      alerts: 'Ескертулер',

      welcomeBack:
        'ҚОШ КЕЛДІҢІЗ',

      signInTitle:
        'Аккаунтқа кіріңіз',

      signInSubtitle:
        'Жедел көмекке, қауіпсіздік ескертулеріне, өтініштер тарихына және құтқарушыны бақылауға қол жеткізіңіз.',

      email:
        'Электрондық пошта',

      emailRequired:
        'Электрондық поштаны енгізіңіз',

      password: 'Құпиясөз',

      passwordRequired:
        'Құпиясөзді енгізіңіз',

      forgotPassword:
        'Құпиясөзді ұмыттыңыз ба?',

      enterPassword:
        'Құпиясөзді енгізіңіз',

      signIn: 'Кіру',
      signingIn: 'Кіру...',

      newTo112:
        'ResQ-де жаңасыз ба?',

      createAccount:
        'Аккаунт ашу',

      footer:
        'Аккаунтыңыз жедел қызметтерге және өтініш ақпаратына қауіпсіз қол жеткізу үшін пайдаланылады.',

      operatorWebOnly:
        'Оператор аккаунттары веб-басқару орталығын пайдаланады.',

      couldNotSignIn:
        'Кіру мүмкін болмады',

      createAccountEyebrow:
        'АККАУНТ АШУ',

      join112:
        'ResQ-ге қосылу',

      registerSubtitle:
        'Жедел көмек сұрау, қауіпсіздік ескертулерін алу және белсенді әрекеттерді бақылау үшін аккаунт ашыңыз.',

      fullName:
        'Толық аты-жөні',

      fullNameRequired:
        'Толық аты-жөніңізді енгізіңіз',

      fullNamePlaceholder:
        'Толық аты-жөніңізді енгізіңіз',

      invalidEmail:
        'Дұрыс электрондық поштаны енгізіңіз',

      minimumPassword:
        'Кемінде 8 таңба',

      passwordHint:
        'Кемінде 8 таңба пайдаланыңыз.',

      passwordTooShort:
        'Құпиясөз кемінде 8 таңбадан тұруы керек',

      creatingAccount:
        'Аккаунт ашылуда...',

      alreadyHaveAccount:
        'Аккаунтыңыз бар ма?',

      registerFooter:
        'Аккаунт ақпаратыңыз жедел көмек қызметтерін қауіпсіз ұсыну үшін пайдаланылады.',

      couldNotRegister:
        'Тіркелу мүмкін болмады',

      heyUser:
        'Сәлем, {{name}},',

      dashboardQuestion:
        'ResQ сізге бүгін қалай көмектесе алады?',

      emergencyAssistance:
        'ЖЕДЕЛ КӨМЕК',

      ready112:
        'ResQ ДАЙЫН',

      needEmergencyHelp:
        'Жедел көмек қажет пе?',

      emergencyHelpDescription:
        'Қажетті жедел қызметті таңдаңыз және орналасқан жеріңізді әрекет ету жүйесімен бөлісіңіз.',

      startEmergencyRequest:
        'Жедел сұрау жіберу',

      aiAssistantSection:
        'ResQ AI КӨМЕКШІСІ',

      aiAssistantDescription:
        'Жедел қызметтерді түсіну және платформаны пайдалану бойынша көмек алыңыз.',

      ask112AI:
        'ResQ AI-дан сұрау',

      aiCardDescription:
        'Жедел қызметтер туралы сұрақ қойыңыз, сұрауды дайындаңыз немесе ResQ платформасын пайдалану бойынша көмек алыңыз.',

      openAssistant:
        'Көмекшіні ашу',

      oneTapServices:
        'ЖЕДЕЛ ҚЫЗМЕТТЕР',

      selectEmergencyService:
        'Қажетті жедел қызметті таңдаңыз.',

      medical:
        'Медицина',

      medicalDescription:
        'Жедел жәрдем және медициналық көмек',

      police:
        'Полиция',

      policeDescription:
        'Полиция және қауіпсіздік көмегі',

      fireRescue:
        'Өрт және құтқару',

      fireDescription:
        'Өрт сөндіру және құтқару көмегі',

      more:
        'ҚОСЫМША',

      manageEmergencySetup:
        'Жедел көмек параметрлерін басқарыңыз.',

      emergencyContacts:
        'Төтенше жағдай контактілері',

      emergencyContactsDescription:
        'Жедел көмек профиліңізге байланыстырылған адамдарды басқарыңыз.',

      locationSharingFooter:
        'Жедел сұрау жіберген кезде орналасқан жеріңіз құтқарушылар сізді табуы үшін бөлісіледі.',

      yourAccount:
        'СІЗДІҢ АККАУНТЫҢЫЗ',

      accountAndSafety:
        'Аккаунт және қауіпсіздік',

      profileSubtitle:
        'Жедел профильді, контактілерді, қолдауды және аккаунтқа қолжетімділікті басқарыңыз.',

      accountReady:
        'Аккаунт жедел жағдайда пайдалануға дайын',

      safetySettings:
        'ҚАУІПСІЗДІК ПАРАМЕТРЛЕРІ',

      automaticGpsSharing:
        'GPS автоматты түрде бөлісу',

      gpsSharingDescription:
        'Жедел сұрау жібергенде орналасқан жеріңіз бөлісіледі.',

      support:
        'ҚОЛДАУ',

      helpSupport:
        'Көмек және қолдау',

      helpSupportDescription:
        'Жауап алыңыз, қолдауға хабарласыңыз немесе ResQ AI-дан сұраңыз.',

      askAiDescription:
        'Қауіпсіздік, жедел қызметтер және платформаны пайдалану туралы сұрақ қойыңыз.',

      account:
        'АККАУНТ',

      logout:
        'Шығу',

      logoutDescription:
        'Осы құрылғыдағы аккаунттан шығыңыз.',

      logoutQuestion:
        'Аккаунттан шығу керек пе?',

      logoutConfirm:
        'Қайта кіру үшін аккаунтқа қайта кіру қажет болады.',

      keepAccountUpdated:
        'Аккаунт ақпараты мен жедел контактілерді жаңартып отырыңыз.',

      passwordRecovery:
        'Құпиясөзді қалпына келтіру',

      forgotPasswordTitle:
        'Құпиясөзді өзгерту',

      forgotPasswordDescription:
        'Құпиясөзді қалпына келтіру ResQ-нің болашақ нұсқасында қолжетімді болады.',

      returnToLogin:
        'Кіруге оралу',

      emergencyRequest:
        'Жедел сұрау',

      requestMedicalHelp:
        'Медициналық көмек шақыру',

      requestPoliceHelp:
        'Полиция шақыру',

      requestFireHelp:
        'Өрт сөндіру және құтқару қызметін шақыру',

      describeEmergency:
        'Жағдайды сипаттаңыз',

      emergencyDescriptionPlaceholder:
        'Не болып жатқанын қысқаша жазыңыз...',

      descriptionRequired:
        'Жедел жағдайды сипаттаңыз.',

      yourLocation:
        'Орналасқан жеріңіз',

      currentLocation:
        'Ағымдағы орналасқан жер',

      gettingLocation:
        'Орналасқан жер анықталуда...',

      locationReady:
        'Орналасқан жер дайын',

      locationPermissionRequired:
        'Жедел сұрау жіберу үшін орналасқан жерге рұқсат қажет.',

      couldNotGetLocation:
        'Орналасқан жерді анықтау мүмкін болмады.',

      submitEmergency:
        'Жедел сұрау жіберу',

      submittingEmergency:
        'Жедел сұрау жіберілуде...',

      emergencyDisclaimer:
        'Орналасқан жеріңіз бен жедел жағдай ақпараты әрекет ету жүйесіне беріледі.',

      confirmEmergency:
        'Жедел сұрауды растау',

      reviewRequest:
        'Сұрауды тексеріңіз',

      confirmEmergencyDescription:
        'Жедел сұрауды жібермес бұрын ақпаратты тексеріңіз.',

      emergencyType:
        'Жедел жағдай түрі',

      description:
        'Сипаттама',

      location:
        'Орналасқан жер',

      sendRequest:
        'Сұрау жіберу',

      sendingRequest:
        'Жіберілуде...',

      emergencyStatus:
        'Жедел сұрау күйі',

      requestReceived:
        'Сұрау қабылданды',

      requestAccepted:
        'Сұрау мақұлданды',

      responderDispatched:
        'Құтқарушы жіберілді',

      responderOnWay:
        'Құтқарушы жолда',

      responderArrived:
        'Құтқарушы келді',

      emergencyCompleted:
        'Жедел жағдай аяқталды',

      requestCancelled:
        'Сұрау жойылды',

      pending:
        'Күтуде',

      accepted:
        'Қабылданды',

      dispatched:
        'Жіберілді',

      responding:
        'Жолда',

      completed:
        'Аяқталды',

      cancelled:
        'Жойылды',

      liveResponderTracking:
        'Құтқарушыны тікелей бақылау',

      waitingForResponder:
        'Құтқарушы күтілуде',

      responderLocation:
        'Құтқарушының орны',

      responderGpsActive:
        'Құтқарушы GPS белсенді',

      gpsWaiting:
        'GPS күтілуде',

      estimatedArrival:
        'Болжалды келу уақыты',

      distance:
        'Қашықтық',

      responder:
        'Құтқарушы',

      emergencyHistory:
        'Жедел сұраулар тарихы',

      historySubtitle:
        'Алдыңғы жедел сұрауларыңызды қараңыз.',

      noEmergencyHistory:
        'Жедел сұраулар тарихы жоқ',

      noEmergencyHistoryDescription:
        'Алдыңғы жедел сұрауларыңыз осында көрсетіледі.',

      created:
        'Құрылды',

      updated:
        'Жаңартылды',

      trustedContacts:
        'Сенімді контактілер',

      contactsSubtitle:
        'Жедел профиліңізге байланыстырылған адамдарды басқарыңыз.',

      addContact:
        'Контакт қосу',

      editContact:
        'Контактіні өзгерту',

      deleteContact:
        'Контактіні жою',

      contactName:
        'Контакт аты',

      contactPhone:
        'Телефон нөмірі',

      enterContactName:
        'Контакт атын енгізіңіз',

      enterPhone:
        'Телефон нөмірін енгізіңіз',

      saveContact:
        'Контактіні сақтау',

      noContacts:
        'Жедел контактілер жоқ',

      noContactsDescription:
        'Жедел сұрауларға байланыстырылуы мүмкін сенімді адамдарды қосыңыз.',

      deleteContactQuestion:
        'Контактіні жою керек пе?',

      deleteContactDescription:
        'Бұл контакт жедел профиліңізден жойылады.',

      safetyAlerts:
        'Қауіпсіздік ескертулері',

      safetyAlertsSubtitle:
        'ResQ-ден ресми ескертулер мен жедел ақпарат.',

      noSafetyAlerts:
        'Белсенді ескертулер жоқ',

      noSafetyAlertsDescription:
        'ResQ қауіпсіздік ескертулері осында көрсетіледі.',

      helpSupportTitle:
        'Сізге қалай көмектесе аламыз?',

      helpSupportSubtitle:
        'ResQ қосымшасы, жедел сұраулар, аккаунт және құтқарушыны бақылау туралы жауаптарды табыңыз.',

      frequentlyAskedQuestions:
        'ЖИІ ҚОЙЫЛАТЫН СҰРАҚТАР',

      whenLocationShared:
        'Орналасқан жерім қашан бөлісіледі?',

      whenLocationSharedAnswer:
        'Орналасқан жер жедел сұрау жіберген кезде қызметтер сізді табуы үшін бөлісіледі.',

      canTrackResponder:
        'Құтқарушыны бақылауға бола ма?',

      canTrackResponderAnswer:
        'Иә. Құтқарушы GPS бөліскеннен кейін оның орналасқан жерін және болжалды келу уақытын көре аласыз.',

      whatAreContacts:
        'Жедел контактілер деген не?',

      whatAreContactsAnswer:
        'Олар профиліңізге байланыстырылған және жедел сұрауларға қосылуы мүмкін сенімді адамдар.',

      doesAiDispatch:
        'ResQ AI көмек жібере ала ма?',

      doesAiDispatchAnswer:
        'Жоқ. ResQ AI кеңес бере алады, бірақ жедел қызметтер жедел сұрау арқылы шақырылады.',

      contactSupport:
        'Қолдауға хабарласу',

      contactSupportFuture:
        'Қолдаумен тікелей байланыс болашақ нұсқада қосылады.',

      activeEmergencySupportNotice:
        'Белсенді жедел жағдай кезінде Help & Support орнына жедел сұрау функциясын пайдаланыңыз.',

      aiWelcome:
        'Сәлем. Мен ResQ AI көмекшісімін. Сізге қалай көмектесе аламын?',

      aiSafetyNotice:
        'ResQ AI кеңес бере алады, бірақ жедел қызметтерді өзі жібере алмайды.',

      askAnything:
        'ResQ AI-дан сұраңыз...',

      send:
        'Жіберу',

      aiError:
        'ResQ AI жауабын алу мүмкін болмады.',

      requestEmergencyHelp:
        'Жедел көмек сұрау',

      responderSystem:
        'ҚҰТҚАРУШЫ ЖҮЙЕСІ',

      fieldOperations:
        'Далалық операциялар',

      activeDuty:
        'БЕЛСЕНДІ КЕЗЕКШІЛІК',

      responderDashboard:
        'Құтқарушы панелі',

      fieldDashboard:
        'Далалық панель',

      responderDashboardDescription:
        'Шақыртулар күйін бақылаңыз және белсенді тапсырмаларды басқарыңыз.',

      activeAssignments:
        'Белсенді тапсырмалар',

      dutyStatus:
        'Кезекшілік күйі',

      readyForDispatch:
        'Шақыртуға дайын',

      activeResponse:
        'Белсенді әрекет жүріп жатыр',

      currentResponse:
        'АҒЫМДАҒЫ ШАҚЫРТУ',

      activeAssignment:
        'Белсенді тапсырма',

      viewAll:
        'Барлығын көру',

      openAssignment:
        'Тапсырманы ашу',

      operations:
        'ОПЕРАЦИЯЛАР',

      assignmentHistory:
        'Тапсырмалар тарихы',

      previousIncidents:
        'Алдыңғы оқиғалар',

      responderSystemOnline:
        'Құтқарушы жүйесі онлайн',

      dispatchSyncActive:
        'Диспетчерлік жүйемен синхрондау белсенді.',

      dispatchQueue:
        'ШАҚЫРТУЛАР КЕЗЕГІ',

      assignedEmergencies:
        'Тағайындалған жедел жағдайлар',

      assignedEmergenciesDescription:
        'Жаңарту үшін төмен тартыңыз. Жаңа тапсырмалар автоматты түрде пайда болады.',

      noActiveAssignments:
        'Белсенді тапсырмалар жоқ',

      noActiveAssignmentsDescription:
        'Сіз шақыртуға дайынсыз. Диспетчер тағайындаған жаңа жағдайлар осында пайда болады.',

      incident:
        'ОҚИҒА',

      caller:
        'ӨТІНІШ БЕРУШІ',

      responseState:
        'ӘРЕКЕТ КҮЙІ',

      emergencyLocation:
        'ОҚИҒА ОРНЫ',

      exactCoordinates:
        'Жедел сұраудан алынған нақты координаттар.',

      acceptDispatch:
        'Шақыртуды қабылдау',

      acceptDispatchDescription:
        'Қабылдағаннан кейін әрекет басталып, GPS бөлісу автоматты түрде іске қосылады.',

      acceptAssignment:
        'Тапсырманы қабылдау',

      enRoute:
        'ЖОЛДА',

      onScene:
        'ОҚИҒА ОРНЫНДА',

      liveGpsActive:
        'GPS БЕЛСЕНДІ',

      gpsNotSharing:
        'GPS БӨЛІСІЛМЕЙДІ',

      locationSharingActive:
        'Орналасқан жерді бөлісу белсенді',

      startLocationSharing:
        'Орналасқан жерді бөлісуді бастау',

      trackingActiveDescription:
        'Сіздің орналасқан жеріңіз ResQ операторына және азаматқа нақты уақытта беріледі.',

      trackingInactiveDescription:
        'Әрекет кезінде GPS белсенді болуы керек.',

      currentResponderPosition:
        'ҚҰТҚАРУШЫНЫҢ АҒЫМДАҒЫ ОРНЫ',

      startGpsSharing:
        'GPS бөлісуді бастау',

      markAsArrived:
        'Келгенін белгілеу',

      startGpsBeforeArrival:
        'Алдымен GPS іске қосыңыз',

      arrivalGpsRequirement:
        'Келуді белгілеу GPS іске қосылғаннан кейін қолжетімді болады.',

      confirmArrival:
        'Келуді растау',

      confirmArrivalDescription:
        'Оқиға орнына келгеніңізді растаңыз.',

      iHaveArrived:
        'Мен келдім',

      youAreOnScene:
        'Сіз оқиға орнындасыз',

      onSceneDescription:
        'GPS бөлісу тоқтатылды. Жағдайды өңдеп, әрекет аяқталғаннан кейін жедел жағдайды аяқтаңыз.',

      completeEmergency:
        'Жедел жағдайды аяқтау',

      completeEmergencyQuestion:
        'Жедел жағдайды аяқтау керек пе?',

      completeEmergencyDescription:
        'Оқиға орнындағы әрекет толық аяқталғаннан кейін ғана жедел жағдайды аяқтаңыз.',

      responseMap:
        'Әрекет картасы',

      liveMap:
        'ТІКЕЛЕЙ КАРТА',

      deviceGpsAvailable:
        'Құрылғы GPS қолжетімді',

      gpsUnavailable:
        'GPS қолжетімсіз',

      deviceGpsDescription:
        'Сіздің жергілікті орныңыз картада көрсетіледі.',

      gpsPermissionDescription:
        'Орныңызды көрсету үшін геолокацияға рұқсат беріңіз.',

      assignedIncidents:
        'ТАҒАЙЫНДАЛҒАН ОҚИҒАЛАР',

      incidentDetails:
        'ОҚИҒА АҚПАРАТЫ',

      startNavigation:
        'Навигацияны бастау',

      openAssignmentControls:
        'Тапсырма басқаруын ашу',

      noAssignedIncidents:
        'Тағайындалған оқиғалар жоқ',

      noAssignedIncidentsDescription:
        'Диспетчер тағайындаған оқиғалар картада автоматты түрде көрсетіледі.',

      mapTrackingNotice:
        'Бұл карта құрылғыдағы орныңызды көрсетеді. Ресми GPS бақылауы тапсырма экранынан басқарылады.',

      responseHistory:
        'Әрекеттер тарихы',

      responseRecord:
        'ӘРЕКЕТ ЖУРНАЛЫ',

      completedIncidents:
        'Аяқталған оқиғалар',

      completedIncidentsDescription:
        'Құтқарушы ретінде аяқтаған жедел жағдайларды қараңыз.',

      totalCompleted:
        'Барлығы аяқталды',

      completedToday:
        'Бүгін аяқталды',

      completedAssignments:
        'АЯҚТАЛҒАН ТАПСЫРМАЛАР',

      noCompletedIncidents:
        'Аяқталған оқиғалар әлі жоқ',

      noCompletedIncidentsDescription:
        'Сіз аяқтаған жедел жағдайлар осында көрсетіледі.',

      responderHistoryNotice:
        'Тарих құтқарушы аккаунтыңызға байланысты және сіз аяқтаған оқиғаларды ғана қамтиды.',

      fieldStatus:
        'ДАЛАЛЫҚ КҮЙ',

      gpsPermission:
        'GPS рұқсаты',

      system:
        'ЖҮЙЕ',

      dispatchConnection:
        'Диспетчерлік байланыс',

      dispatchConnectionDescription:
        'ResQ жедел диспетчерлік жүйесіне қосылған.',

      locationServices:
        'Орналасу қызметтері',

      locationServicesDescription:
        'Белсенді жедел жағдай кезінде құтқарушыны бақылау үшін қажет.',

      required:
        'ҚАЖЕТ',

      quickAccess:
        'ЖЫЛДАМ ҚОЛЖЕТІМ',

      assignmentsDescription:
        'Белсенді оқиғаларды және әрекет басқаруын ашыңыз.',

      responseHistoryDescription:
        'Аккаунтыңызға тағайындалған аяқталған оқиғаларды қараңыз.',

      responderLogoutDescription:
        'Осы құрылғыдағы құтқарушы жүйесінен шығыңыз.',

      responderLogoutConfirm:
        'Қайта кіру үшін құтқарушы жүйесіне қайта кіру қажет.',

      responderSecurityNotice:
        'Бұл құтқарушы аккаунты жедел далалық операцияларға арналған. Аккаунт қауіпсіздігін сақтаңыз.',

      navHome: 'Басты бет',
      navHistory: 'Тарих',
      navAlerts: 'Ескертулер',
      navProfile: 'Профиль',
      navAssignments: 'Шақыртулар',
      navMap: 'Карта',
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,

    lng: 'en',

    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },

    compatibilityJSON: 'v4',
  })

export async function loadStoredLanguage() {
  try {
    const stored =
      await AsyncStorage.getItem(
        LANGUAGE_STORAGE_KEY,
      )

    if (
      stored === 'en' ||
      stored === 'ru' ||
      stored === 'kk'
    ) {
      await i18n.changeLanguage(
        stored,
      )

      return stored
    }
  } catch (error) {
    console.error(
      'Could not load language:',
      error,
    )
  }

  return 'en'
}

export async function changeAppLanguage(
  language: AppLanguage,
) {
  await i18n.changeLanguage(
    language,
  )

  await AsyncStorage.setItem(
    LANGUAGE_STORAGE_KEY,
    language,
  )
}

export default i18n