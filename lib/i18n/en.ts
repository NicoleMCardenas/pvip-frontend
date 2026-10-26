const en = {
  common: {
    appName: "KAIRO",
    loading: "Loading...",
    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    close: "Close",
    confirm: "Confirm",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    search: "Search",
    retry: "Retry",
    back: "Back",
    continue: "Continue",
    optional: "Optional",
    actions: "Actions",
    status: "Status",
    date: "Date",
    noResults: "No results found.",
    unexpectedError: "An unexpected error occurred.",
  },

  navigation: {
    overview: "Overview",
    intelligence: "Intelligence",
    customers: "Customers",
    staff: "Staff",
    services: "Services",
    visits: "Visits",
    feedback: "Feedback",
    retention: "Retention",
    revenueRecovery: "Revenue Recovery",
    settings: "Settings",
    mainNavigation: "Main navigation",
    openNavigation: "Open navigation",
    closeNavigation: "Close navigation",
    closeMenu: "Close menu",
    brandSubtitle: "CUSTOMER INTELLIGENCE",
    platformLabel: "KAIRO Platform",
    platformDescription: "Customer experience & retention",
  },

  auth: {
    signIn: "Sign in",
    signingIn: "Signing in...",
    email: "Email address",
    password: "Password",
    emailPlaceholder: "email@example.com",
    passwordPlaceholder: "Enter your password",
    noAccount: "Don't have a business account yet?",
    createBusinessAccount: "Create a business account",
    alreadyHaveAccount: "Already have an account?",
    registrationSuccess:
      "Your account was created successfully. You can now sign in with your email and password.",
    loginError: "Unable to sign in.",
    invalidCredentials: "Incorrect email or password.",
    logout: "Sign out",
    loggingOut: "Signing out...",
    logoutError: "Unable to sign out. Please try again.",

    register: {
      eyebrow: "Get started with KAIRO",
      title: "Create your account",
      description:
        "Register your business and set up access to your customer intelligence platform.",
      businessSection: "01. Business information",
      businessDescription:
        "Tell us about the business you'll manage with KAIRO.",
      businessName: "Business name",
      industry: "Industry",
      businessEmail: "Business email",
      businessPhone: "Phone number (optional)",
      ownerSection: "02. Your administrator account",
      ownerDescription:
        "You'll use these details to sign in.",
      fullName: "Full name",
      loginEmail: "Sign-in email",
      password: "Password",
      confirmPassword: "Confirm password",
      createAccount: "Create my account",
      creatingAccount: "Creating account...",
      passwordTooShort:
        "Your password must be at least 8 characters long.",
      passwordsDoNotMatch: "Passwords do not match.",
      registrationError:
        "Unable to create your account. Please try again.",
      businessNamePlaceholder: "e.g. Studio Wellness",
      industryPlaceholder: "e.g. Beauty and wellness",
      businessEmailPlaceholder: "contact@business.com",
      businessPhonePlaceholder: "e.g. 222 123 4567",
      fullNamePlaceholder: "Your full name",
      loginEmailPlaceholder: "you@example.com",
      passwordPlaceholder: "At least 8 characters",
      confirmPasswordPlaceholder: "Repeat your password",
    },
  },

  dashboard: {
    title: "Business Overview",
    subtitle: "Monitor your customers and their experience.",
    totalCustomers: "Total customers",
    atRiskCustomers: "At-risk customers",
    averageNps: "Average NPS",
    averageSatisfaction: "Average satisfaction",
    recentActivity: "Recent activity",
    noActivity: "No activity has been recorded yet.",
    gettingStarted: "Getting started",
    welcome: "Welcome to KAIRO",
    welcomeDescription:
      "Set up your business and start understanding your customers.",
    setupServices: "Set up services",
    setupStaff: "Add staff",
    addFirstCustomer: "Add your first customer",
    dashboardHeading: "KAIRO Dashboard",
    dashboardTagline: "Client Retention Intelligence Platform",
    nps: "NPS",
    customersSection: "Customers",
    recoveryQueue: "Customers requiring attention",
    viewAllCustomers: "View all customers",
    viewRetention: "View retention cases",
    metricsSection: "Customer intelligence metrics",
    npsScore: "NPS Score",
    totalCustomersDescription:
    "Customers in your portfolio, excluding archived records.",
    atRiskCustomersDescription:
    "Customers currently classified as at risk.",
    averageSatisfactionDescription:
    "Average rating across completed surveys with valid satisfaction scores.",
    npsDescription:
    "Net Promoter Score across completed surveys with valid NPS responses.",
  },


  recoveryQueue: {
    title: "Recovery Queue",
    description:
      "Review customers currently classified as at risk and prioritize retention actions.",
    emptyTitle: "No customers currently flagged",
    emptyDescription:
      "No customers are currently classified as at risk. Continue monitoring customer feedback and satisfaction to identify potential issues early.",
    latestNps: "Latest NPS",
    latestSatisfaction: "Latest Satisfaction",
    scoreNote:
      "These scores reflect the latest completed survey when available. A positive score does not automatically change a customer's risk status.",
    recommendedAction: "Recommended action",
    manageRetention: "Manage retention",
  },


  customers: {
    title: "Customers",
    addCustomer: "Add customer",
    editCustomer: "Edit customer",
    archivedCustomers: "Archived customers",
    restoreCustomer: "Restore customer",
    archiveCustomer: "Archive customer",
    noCustomers: "You haven't added any customers yet.",
    noCustomersDescription:
      "Add your first customer to start managing their experience.",
    customerName: "Customer name",
    customerEmail: "Email address",
    customerPhone: "Phone number",
    customerStatus: "Customer status",
    active: "Active",
    atRisk: "At risk",
    archived: "Archived",
    new: "New",
    unknown: "Unknown",
    portfolioSubtitle: "An overview of your customer portfolio",
    customerSingular: "customer",
    customerPlural: "customers",
    nameColumn: "Name",
    totalVisits: "Total visits",
    visitsColumn: "Visits",
    lifetimeValue: "Lifetime value",

    managementLabel: 'Customer management',
    pageDescription: 'Understand your customer portfolio, monitor relationships, and manage customer information from one place.',
    viewArchived: 'View archived customers',
    noMatchingCustomers: 'No customers found',
    noMatchingCustomersDescription: 'No customers match your current search or filters. Try another name or status.',
    newCustomer: 'New customer',
    closeCustomerForm: 'Close customer form',
    searchPlaceholder: 'Search customers by name...',
    searchCustomers: 'Search customers',
    filterByStatus: 'Filter customers by status',
    allStatuses: 'All statuses',
    clearFilters: 'Clear filters',
    formCreateDescription: 'Create a customer profile to start tracking visits, feedback, and retention.',
    formEditDescription: 'Update customer information and relationship status.',
    fullName: 'Full name',
    namePlaceholder: 'e.g. Mariana López',
    emailPlaceholder: 'customer@example.com',
    phonePlaceholder: 'e.g. +52 222 123 4567',
    nameRequired: 'Customer name is required.',
    createError: 'Unable to create customer.',
    updateError: 'Unable to update customer.',
    creatingCustomer: 'Creating customer...',
    savingChanges: 'Saving changes...',
    saveChanges: 'Save changes',
    createCustomer: 'Create customer',
    editCustomerAria: 'Edit customer',
    archiveCustomerAria: 'Archive customer',
    archiveQuestion: 'Archive customer?',
    archiveDescriptionStart: 'You are about to archive',
    archiveDescriptionEnd: 'This customer will no longer appear in your active list. Their information and history will remain stored.',
    archiving: 'Archiving...',
    archiveError: 'Unable to archive customer.',
    closeConfirmation: 'Close confirmation',
    archivedDescription: 'Review archived customer records and restore relationships when needed. Customer history remains preserved.',
    backToCustomers: 'Back to Customers',
    searchArchived: 'Search archived customers',
    searchArchivedPlaceholder: 'Search archived customers...',
    clearSearch: 'Clear',
    archivedRecords: 'Archived records',
    noEmail: 'No email provided',
    previousStatus: 'Previous status:',
    noArchivedFound: 'No archived customers found',
    noArchivedYet: 'No archived customers yet',
    noArchivedSearchDescription: 'No archived customers match your search. Try another name.',
    noArchivedDescription: 'Archived customer records will appear here when you archive a customer.',
    restoreCustomerAria: 'Restore customer',
    restoreQuestion: 'Restore customer?',
    restoreDescriptionStart: 'You are about to restore',
    restoreDescriptionEnd: 'This customer will return to your customer list, and their information and history will remain preserved.',
    restoredStatus: 'Customer status after restoration',
    selectStatus: 'Select customer status',
    chooseStatus: 'Choose a status',
    missingPreviousStatus: 'This customer was archived before their previous status was recorded. Choose the appropriate status to restore them.',
    statusRequired: 'Please select a customer status.',
    restoring: 'Restoring...',
    restoreError: 'Unable to restore customer.',
    checkStatus: 'Check customer status',
    checking: 'Checking...',
    verifyError: 'Unable to verify customer status.',
    unexpectedCustomer: 'The server returned an unexpected customer.',
    invalidStatus: 'The server returned an invalid customer status.',
    previousRestoreUnknown: 'A previous restoration could not be confirmed. Check the customer status before trying again.',
    checkBeforeRetry: 'Check the customer status before attempting another restoration.',
    unknownRestoreResult: 'The restoration result is unknown. Check the customer status before trying again.',
    unconfirmedResponse: 'The server response could not confirm restoration. Check the customer status before trying again.',
    unconfirmedRestore: 'The restoration could not be confirmed. Check the customer status before trying again.',
    stillArchived: 'The customer is still archived. You can try restoring them again.',
    alreadyRestored: 'This customer is no longer archived. Refresh the customer list to see the latest information.',
  },

  staff: {
    title: "Staff",
    addStaff: "Add team member",
    editStaff: "Edit team member",
    noStaff: "No team members have been added yet.",
    noStaffDescription:
      "Add the people who provide services at your business.",

    eyebrow: "Team management",
    subtitle:
      "Manage your team, keep employee information organized, and maintain visibility over the people delivering your customer experience.",

    totalMembers: "Total team members",
    activeMembers: "Active members",
    inactiveMembers: "Inactive members",

    directoryTitle: "Team directory",
    directoryDescription:
      "View your registered team members and their current status.",
    emptyTitle: "No team members yet",
    emptyDescription:
      "Your team directory is empty. Add your first team member to get started.",

    memberColumn: "Team member",
    roleColumn: "Role",
    contactColumn: "Contact",
    statusColumn: "Status",
    actionsColumn: "Actions",
    notProvided: "Not provided",
    active: "Active",
    inactive: "Inactive",

    newMember: "New team member",
    closeForm: "Close team member form",
    editAction: "Edit",
    editMemberAria: "Edit team member",

    createFormDescription:
      "Create a team profile to organize employee information and associate staff members with customer visits.",
    editFormDescription:
      "Update employee information while keeping the team directory accurate.",

    fullName: "Full name",
    namePlaceholder: "e.g. Sofia Martinez",
    role: "Role",
    rolePlaceholder: "e.g. Esthetician",
    email: "Email address",
    emailPlaceholder: "team@example.com",
    phone: "Phone number",
    phonePlaceholder: "e.g. +52 222 123 4567",

    nameRequired: "Team member name is required.",
    roleRequired: "Role is required.",
    saveError: "Unable to save team member.",
    unexpectedError: "An unexpected error occurred.",

    cancel: "Cancel",
    savingChanges: "Saving changes...",
    creatingMember: "Creating team member...",
    saveChanges: "Save changes",
    createMember: "Create team member",

    discardTitle: "Discard changes?",
    discardCreateDescription:
      "You have unsaved information. Closing this panel will discard your changes.",
    discardEditDescription:
      "You have unsaved changes to this team member. Closing this panel will discard them.",
    keepEditing: "Keep editing",
    discardChanges: "Discard changes",

    deactivate: "Deactivate",
    reactivate: "Reactivate",
    deactivateTitle: "Deactivate team member?",
    reactivateTitle: "Reactivate team member?",
    deactivateDescription:
      "will no longer be available for new customer visits. Their profile and visit history will be preserved.",
    reactivateDescription:
      "will become active again and can be assigned to new customer visits.",
    closeConfirmation: "Close confirmation",
    deactivateMember: "Deactivate member",
    reactivateMember: "Reactivate member",
    deactivating: "Deactivating...",
    reactivating: "Reactivating...",
    deactivateError: "Unable to deactivate team member.",
    reactivateError: "Unable to reactivate team member.",
  },

  services: {
    title: "Services",
    addService: "Add service",
    editService: "Edit service",
    noServices: "No services have been added yet.",
    noServicesDescription:
      "Set up the services your business offers.",

    eyebrow: "Business operations",
    subtitle:
      "Manage your service catalog, monitor availability, and keep pricing and service information organized.",
    activeServices: "Active services",
    activeServicesDescription: "Available for new visits",
    inactiveServices: "Inactive services",
    inactiveServicesDescription: "Preserved in historical records",
    averagePrice: "Average listed price",
    averagePriceDescription: "Across all catalog services",
    catalogTitle: "Service catalog",
    catalogDescription:
      "Review the services your business offers and their current availability.",
    catalogLabel: "Service overview",
    service: "Service",
    category: "Category",
    duration: "Duration",
    price: "Price",
    status: "Status",
    actions: "Actions",
    uncategorized: "Uncategorized",
    minutes: "min",
    active: "Active",
    inactive: "Inactive",

    newService: "New service",
    edit: "Edit",
    editAriaLabel: "Edit",
    closeForm: "Close service form",
    closeEditForm: "Close edit service form",
    addFormTitle: "Add a service",
    editFormTitle: "Edit service details",
    addFormDescription:
      "Add a service to your catalog so it can be selected when recording customer visits.",
    editFormDescription:
      "Update service information. Historical visit amounts will remain unchanged.",
    serviceName: "Service name",
    serviceNamePlaceholder: "e.g. Deep cleansing facial",
    categoryPlaceholder: "e.g. Facial treatments",
    durationMinutes: "Duration (minutes)",
    durationPlaceholder: "e.g. 60",
    priceMXN: "Price (MXN)",
    pricePlaceholder: "e.g. 850.00",
    description: "Description",
    descriptionPlaceholder: "Describe what this service includes...",
    required: "Required",
    cancel: "Cancel",
    saveChanges: "Save changes",
    savingChanges: "Saving changes...",
    addingService: "Adding service...",

    nameRequired: "Enter a service name.",
    nameTooLong: "Service name must be 150 characters or fewer.",
    descriptionOrCategoryTooLong:
      "Description or category exceeds the allowed length.",
    invalidDuration:
      "Duration must be a whole number greater than zero.",
    invalidPrice:
      "Enter a valid price with up to two decimal places.",
    createError: "Unable to create service.",
    updateError: "Unable to update service.",
    unexpectedError: "An unexpected error occurred.",

    discardTitle: "Discard changes?",
    discardCreateDescription:
      "You have unsaved service information. Closing this form will discard your changes.",
    discardEditDescription:
      "You have unsaved changes to this service. Closing the form will discard them.",
    keepEditing: "Keep editing",
    discardChanges: "Discard changes",

    deactivate: "Deactivate",
    reactivate: "Reactivate",
    deactivateTitle: "Deactivate service?",
    reactivateTitle: "Reactivate service?",
    deactivateDescription:
      "will no longer be available for new visits. Existing visit records will be preserved.",
    reactivateDescription:
      "will become available for new visits again.",
    deactivateService: "Deactivate service",
    reactivateService: "Reactivate service",
    closeConfirmation: "Close confirmation",
    processing: "Processing...",
    deactivateError: "Unable to deactivate service.",
    reactivateError: "Unable to reactivate service.",
  },

  visits: {
    title: "Visits",
    addVisit: "Record visit",
    editVisit: "Edit visit",
    noVisits: "No visits have been recorded yet.",
    noVisitsDescription:
      "Record a visit to start building your customers' history.",

    eyebrow: "Customer activity",
    description:
      "Track customer visits, connect services with team members, and build a clearer picture of your business activity.",
    historyTitle: "Visit history",
    historyDescription:
      "Review recorded customer visits and their associated services and team members.",

    date: "Date",
    customer: "Customer",
    service: "Service",
    teamMember: "Team member",
    amount: "Amount",
    actions: "Actions",

    customerUnavailable: "Customer unavailable",
    serviceUnavailable: "Service unavailable",
    teamMemberUnavailable: "Team member unavailable",

    newVisit: "New visit",
    closeVisitForm: "Close visit form",
    closeVisitEditor: "Close visit editor",

    edit: "Edit",
    delete: "Delete",
    editVisitDetails: "Edit visit details",
    recordVisit: "Record visit",

    createDescription:
      "Connect a customer with the service they received and the team member who attended them.",
    editDescription:
      "Update the visit information. Changes to the amount or date will be reflected in customer metrics.",

    requiredOptions:
      "A customer, service, and team member must be available to complete this form.",
    requiredOptionsError:
      "A customer, service, and team member are required.",
    requiredFieldsError: "Complete all required fields.",
    invalidDateError:
      "Visit date must be valid and cannot be in the future.",
    invalidAmountError:
      "Enter a valid amount of zero or greater.",

    selectCustomer: "Select a customer",
    selectService: "Select a service",
    selectTeamMember: "Select a team member",
    archived: "Archived",
    inactive: "Inactive",

    visitDateTime: "Visit date and time",
    visitDateHelp:
      "Enter the local date and time of the completed visit.",
    amountMXN: "Amount (MXN)",
    amountHelp:
      "The service price is suggested automatically. You can adjust the final amount.",
    notes: "Notes",
    notesPlaceholder:
      "Add optional details about this visit...",

    cancel: "Cancel",
    saveChanges: "Save changes",
    savingChanges: "Saving changes...",
    recordingVisit: "Recording visit...",

    discardTitle: "Discard changes?",
    createDiscardDescription:
      "You have unsaved visit information. Closing this panel will discard your changes.",
    editDiscardDescription:
      "You have unsaved changes to this visit. Closing the editor will discard them.",
    keepEditing: "Keep editing",
    discardChanges: "Discard changes",

    deleteVisit: "Delete visit",
    deleteTitle: "Delete this visit?",
    deleteDescription:
      "This action will permanently remove the visit and update the customer's visit history and metrics.",
    closeConfirmation: "Close confirmation",
    deletingVisit: "Deleting visit...",
    deleteVisitFor: "Delete visit for",

    createError: "Unable to create visit.",
    updateError: "Unable to update visit.",
    deleteError: "Unable to delete visit.",
    unexpectedError: "An unexpected error occurred.",
  },

  feedback: {
   title: "Customer Feedback",
    noFeedback: "No customer feedback has been recorded yet.",
    noFeedbackDescription:
      "Surveys linked to customer visits will appear here, along with satisfaction and loyalty insights.",
    nps: "NPS",
    csat: "Satisfaction",

    eyebrow: "Customer intelligence",
    description:
      "Understand customer satisfaction, monitor loyalty, and identify opportunities to improve the post-service experience.",

    overview: "Feedback overview",
    averageSatisfaction: "Average satisfaction",
    basedOnRatings: "Based on {count} ratings",
    netPromoterScore: "Net Promoter Score",
    basedOnResponses: "Based on {count} responses",
    responseRate: "Response rate",
    responseRateDescription:
      "Completed surveys / total surveys",
    pendingFeedback: "Pending feedback",
    pendingFeedbackDescription:
      "Surveys awaiting a response",

    historyTitle: "Survey history",
    historyDescription:
      "Review feedback associated with customer visits.",

    customer: "Customer",
    visit: "Visit",
    satisfaction: "Satisfaction",
    rebookIntent: "Rebook intent",
    status: "Status",
    actions: "Actions",

    customerUnavailable: "Customer unavailable",
    archived: "Archived",
    completed: "Completed",
    pending: "Pending",

    promoter: "Promoter",
    passive: "Passive",
    detractor: "Detractor",

    yes: "Yes",
    no: "No",
    unsure: "Unsure",

    invalidLegacyValue: "Invalid legacy value",
    invalidLegacyValueDescription:
      "Historical value outside the currently accepted range",

    addSurvey: "Add survey",
    newSurvey: "New survey",
    closeSurveyForm: "Close survey form",
    createSurveyDescription:
      "Create a feedback request for an existing customer visit. Each visit can have one survey.",
    noEligibleVisits: "No eligible visits",
    noEligibleVisitsDescription:
      "All existing visits already have surveys, or no visits have been recorded yet.",
    customerVisit: "Customer visit",
    selectVisit: "Select a visit",
    selectedCustomer: "Selected customer",
    visitLabel: "Visit:",
    cancel: "Cancel",
    creating: "Creating...",
    createSurvey: "Create survey",
    selectAvailableVisit: "Select an available visit.",
    unableToCreateSurvey: "Unable to create survey.",
    discardChangesTitle: "Discard changes?",
    discardSurveyDescription:
      "Your selected visit has not been saved. Closing this form will discard your selection.",
    keepEditing: "Keep editing",
    discardChanges: "Discard changes",

    recordCustomerFeedback: "Record customer feedback",
    recordFeedbackDescription:
      "Capture the customer's experience following their visit. You can record a partial response when some answers are unavailable.",
    customerSatisfaction: "Customer satisfaction (CSAT)",
    satisfactionQuestion:
      "How satisfied was the customer with the service?",
    satisfactionScoreLabel: "Customer satisfaction score",
    veryDissatisfied: "Very dissatisfied",
    verySatisfied: "Very satisfied",
    npsQuestion:
      "How likely is the customer to recommend the business?",
    notLikely: "Not likely",
    extremelyLikely: "Extremely likely",
    rebookingIntention: "Rebooking intention",
    notAnswered: "Not answered",
    likelyToReturn: "Yes, likely to return",
    unlikelyToReturn: "No, unlikely to return",
    notSureYet: "Not sure yet",
    customerComment: "Customer comment",
    commentPlaceholder:
      "Add any comments shared by the customer...",
    savingResponse: "Saving response...",
    saveResponse: "Save response",

    onlyPendingSurveys:
      "Only pending surveys can receive a new response.",
    enterAtLeastOneResponse:
      "Enter at least one survey response.",
    invalidSatisfaction:
      "Satisfaction must be a whole number from 1 to 5.",
    invalidNps:
      "NPS must be a whole number from 0 to 10.",
    invalidRebooking:
      "Select a valid rebooking intention.",
    commentTooLong:
      "Comment must be 2000 characters or fewer.",
    unableToSaveResponse:
      "Unable to save survey response.",
    unexpectedError: "An unexpected error occurred.",

    recordResponse: "Record response",
    surveyResponse: "Survey response",
    closeSurveyResponse: "Close survey response",
    discardResponseDescription:
      "You have unsaved survey responses. Closing this form will discard your changes.",



  },

  retention: {
    title: "Customer Retention",
    createCase: "Create case",
    noCases: "No retention cases have been created yet.",
    noCasesDescription:
      "Identify at-risk customers and track actions to win them back.",
    pending: "Pending",
    inProgress: "In progress",
    resolved: "Resolved",

    eyebrow: "Customer intelligence",
    description:
      "Identify customers who need attention, manage recovery cases, and track retention efforts over time.",
    selectedFromDashboard: "Selected from Dashboard",
    customerUnavailable: "Customer unavailable",
    customerNotFound:
      "This customer could not be found. They may have been deleted.",
    customerHasActiveCase:
      "This customer already has an active retention case.",
    customerEligible:
      "You can create a retention case for this customer.",
    customerNotEligible:
      "This customer is not available for creating a retention case.",
    viewAllRetention: "View all retention",
    noActionAvailable:
      "No retention action is available for this customer.",

    customersNeedingAttention: "Customers needing attention",
    recoveryQueueDescription: "Customers in the recovery queue",
    detractorFeedback: "Detractor feedback",
    detractorFeedbackDescription: "Latest NPS between 0 and 6",
    activeCases: "Active cases",
    activeCasesDescription: "Pending or in progress",
    resolvedCases: "Resolved cases",
    resolvedCasesDescription: "Completed recovery follow-ups",
    recoveryOpportunities: "Recovery opportunities",
    reviewFeedback: "Review feedback",
    viewCustomers: "View customers",
    needsAttention: "Needs attention",
    latestNps: "Latest NPS",
    satisfaction: "Satisfaction",
    recommendedAction: "Recommended action",
    caseAlreadyOpen: "Case already open",

    reason: "Reason",
    priority: "Priority",
    low: "Low",
    medium: "Medium",
    high: "High",
    created: "Created",
    resolvedOn: "Resolved",
    noActiveCases: "No active cases.",
    noRecoveryOpportunities:
      "No recovery opportunities are available.",
    noResolvedCases: "No resolved cases.",

    newRetentionCase: "New retention case",
    closeRetentionForm: "Close retention case form",
    createCaseDescription:
      "Create a follow-up case to track customer recovery. Each customer can have only one open case at a time.",
    noAvailableCustomers: "No available customers",
    noAvailableCustomersDescription:
      "All active customers already have open cases, or no customers are available.",
    customer: "Customer",
    selectCustomer: "Select a customer",
    selectAvailableCustomer: "Select an available customer.",
    enterReason: "Enter a reason for this retention case.",
    reasonTooLong: "The reason cannot exceed 2000 characters.",
    reasonPlaceholder:
      "Describe why this customer needs follow-up...",
    cancel: "Cancel",
    creating: "Creating...",
    unableToCreateCase: "Unable to create retention case.",

    discardChangesQuestion: "Discard changes?",
    createDiscardDescription:
      "Your retention case has not been saved. Closing this form will discard your changes.",
    keepEditing: "Keep editing",
    discardChanges: "Discard changes",

    phoneCall: "Phone call",
    email: "Email",
    message: "Message",
    other: "Other",
    contacted: "Contacted",
    noResponse: "No response",
    followUpNeeded: "Follow-up needed",

    unableToLoadActivities:
      "Unable to load activity history.",
    unexpectedActivityResponse:
      "Unexpected activity response.",
    unableToUpdateCase:
      "Unable to update retention case.",
    caseUpdated: "Case updated successfully.",
    unableToRecordActivity:
      "Unable to record activity.",
    activityRecorded: "Activity recorded successfully.",
    saveBeforeResolving:
      "Save or discard your pending changes before resolving this case.",

    viewHistory: "View history",
    manageCase: "Manage case",
    resolvedCaseHistory: "Resolved case history",
    manageRecoveryFollowUp: "Manage recovery follow-up",
    closeCaseManagement: "Close case management",
    caseDetails: "Case details",
    caseManagement: "Case management",
    status: "Status",
    saving: "Saving...",
    saveChanges: "Save changes",
    resolveCase: "Resolve case",
    activityHistory: "Activity history",
    loadingActivities: "Loading activities...",
    tryAgain: "Try again",
    noActivitiesRecorded: "No activities recorded",
    noActivitiesDescription:
      "Customer contact attempts and outcomes will appear here.",
    addActivity: "Add activity",
    contactType: "Contact type",
    outcome: "Outcome",
    notSpecified: "Not specified",
    notes: "Notes",
    notesPlaceholder:
      "Describe the customer interaction...",
    recording: "Recording...",
    recordActivity: "Record activity",
    close: "Close",

    resolveCaseQuestion: "Resolve this case?",
    resolveCaseDescription:
      "This case will be marked as resolved and become read-only. Its activity history will remain available.",
    manageDiscardDescription:
      "Your unsaved changes will be lost if you close this panel.",
  },

  revenueRecovery: {
    title: "Revenue Recovery",
  noRecoveries: "No recovered revenue has been recorded yet.",
  noRecoveriesDescription:
    "Revenue attributed to retention efforts will appear here.",

  eyebrow: "Business Intelligence",
  description:
    "Understand the financial impact of customer retention, identify revenue at risk, and track revenue associated with recovery efforts.",
  manageRetention: "Manage retention",
  revenueOverview: "Revenue Overview",
  revenueOverviewDescription:
    "Financial indicators based on recorded business activity.",
  asOf: "As of",

  revenueAtRisk: "Revenue at Risk",
  revenueAtRiskDescription:
    "Estimated value of one potential visit per open case.",
  recoveredRevenue: "Recovered Revenue",
  recoveredRevenueDescription:
    "Revenue from visits explicitly attributed to retention cases.",
  openOpportunities: "Open Opportunities",
  openOpportunitiesDescription:
    "Retention cases currently requiring follow-up.",
  resolvedCases: "Resolved Cases",
  resolvedCasesDescription:
    "Resolved retention cases, regardless of revenue attribution.",

  recoveryOpportunities: "Recovery Opportunities",
  recoveryOpportunitiesDescription:
    "Open retention cases with their estimated revenue exposure.",
  open: "open",
  noOpenOpportunities: "No open recovery opportunities",
  noOpenOpportunitiesDescription:
    "There are no active retention cases to evaluate. New opportunities will appear here when cases are opened.",
  viewRetentionCases: "View retention cases",
  retentionCase: "Retention case",
  priority: "priority",
  low: "Low",
  medium: "Medium",
  high: "High",
  pending: "Pending",
  inProgress: "In progress",
  resolved: "Resolved",
  estimatedRevenueAtRisk: "Estimated revenue at risk",
  insufficientData: "Insufficient data",
  noHistoricalVisits:
    "No historical visits available for estimation.",
  estimatedFutureVisit:
    "Estimated value of one potential future visit.",
  manageCase: "Manage case",

  recoveryPerformance: "Recovery Performance",
  recoveryPerformanceDescription:
    "Attribution coverage and confidence in revenue estimates.",
  attributedVisits: "Attributed Visits",
  attributedVisitsDescription:
    "Visits linked to retention cases.",
  casesWithEstimates: "Cases with Estimates",
  casesWithEstimatesDescription:
    "Open cases with sufficient visit history.",
  insufficientDataCases: "Insufficient Data",
  insufficientDataCasesDescription:
    "Open cases without historical visits.",
  financialDisclaimer:
    "Revenue at Risk is an estimate, not a forecast or a guaranteed loss. Recovered Revenue represents recorded visits attributed to retention cases; attribution does not establish that the retention action caused the purchase.",

  revenueAttribution: "Revenue Attribution",
  trackRecoveredRevenue: "Track recovered revenue",
  attributionDescription:
    "Link a qualifying customer visit to a retention case. Each visit can be attributed only once.",
  newAttribution: "New attribution",
  newAttributionDescription:
    "Select a retention case to find eligible visits.",
  selectRetentionCase: "Select a retention case",
  customerUnavailable: "Customer unavailable",
  eligibleVisit: "Eligible visit",
  selectVisit: "Select a visit",
  noEligibleVisits:
    "No eligible visits for this case. A visit must occur during the case period, have a positive amount, and not be attributed elsewhere.",
  attributionPreview: "Attribution preview",
  attributeRevenue: "Attribute revenue",
  recordedAttributions: "Recorded attributions",
  noAttributedRevenue: "No revenue attributed yet",
  noAttributedRevenueDescription:
    "Recorded attributions will appear here once you link eligible visits to retention cases.",
  retentionCaseUnavailable: "Retention case unavailable",
  visitUnavailable: "Visit unavailable",
  amountUnavailable: "Amount unavailable",
  removeRevenueAttribution: "Remove revenue attribution",

  unableToAttribute: "Unable to attribute revenue.",
  unableToRemove: "Unable to remove attribution.",
  attributionRecorded:
    "Revenue attribution recorded successfully.",
  attributionRemoved:
    "Revenue attribution removed successfully.",
  unexpectedError: "An unexpected error occurred.",

  confirmRevenueAttribution: "Confirm revenue attribution",
  removeRevenueAttributionQuestion:
    "Remove revenue attribution?",
  closeConfirmation: "Close confirmation",
  thisVisit: "this visit",
  confirmAttributionDescription:
    "Attribute {amount} to the selected retention case? This records an association, not proof that the retention action caused the purchase.",
  removeAttributionDescription:
    "Remove the attribution{amount}? The original visit and retention case will remain unchanged.",
  cancel: "Cancel",
  processing: "Processing...",
  confirmAttribution: "Confirm attribution",
  removeAttribution: "Remove attribution",
  },

  intelligence: {
    title: "Customer Intelligence",
    noData: "There isn't enough data yet.",
    noDataDescription:
      "Add customers, visits, and feedback to generate insights.",

    eyebrow: "Customer Analytics",
    description:
      "Understand customer behavior, track experience trends, and identify opportunities to improve retention.",
    viewCustomers: "View customers",

    segmentationTitle: "Customer Segmentation",
    segmentationDescription:
      "Based on completed visits and customer activity.",
    customer: "customer",
    customers: "customers",
    analyzed: "analyzed",
    customerShare: "Customer share",

    segmentNew: "New",
    segmentNewDescription:
      "Customers with no completed visits.",
    segmentOneTime: "One-time",
    segmentOneTimeDescription:
      "Customers with one visit in the activity window.",
    segmentReturning: "Returning",
    segmentReturningDescription:
      "Customers with multiple visits and recent activity.",
    segmentInactive: "Inactive",
    segmentInactiveDescription:
      "Customers whose last completed visit was at least 90 days ago.",

    noCustomersTitle: "No customers to analyze yet",
    noCustomersDescription:
      "Customer segments will appear here once you start registering customers and their visits.",
    goToCustomers: "Go to Customers",

    howSegmentationWorks: "How segmentation works",
    segmentationExplanationStart:
      "Segments are calculated from visit history, not manually assigned customer statuses. Customers with no completed visits are classified as New. Customers with recent visits are classified as One-time or Returning based on visit frequency. Customers whose last visit was at least",
    segmentationExplanationEnd:
      "are classified as Inactive.",
    daysAgo: "days ago",
    segmentationNote:
      "Archived customers and future visits are excluded from the analysis. Risk classification is managed separately from these behavioral segments.",

    trendsTitle: "Experience Trends",
    trendsDescriptionStart:
      "Monthly satisfaction and recommendation trends across the last",
    calendarMonths: "calendar months",
    satisfactionTitle: "Customer Satisfaction",
    satisfactionMetricDescription:
      "Average satisfaction score · Scale 1–5",
    npsTitle: "Net Promoter Score",
    npsMetricDescription:
      "Customer recommendation score · Scale −100 to +100",
    validResponses: "Valid responses",
    noTrendData: "No trend data available yet",
    noTrendDataDescription:
      "Complete customer surveys to start tracking this metric over time.",
    monthlyTrend: "Monthly trend",
    monthlyBreakdown: "Monthly breakdown",
    response: "response",
    responses: "responses",
    reportingTimezone: "Reporting timezone:",
    trendsMethodology:
      "Only completed surveys with valid scores are included. Months without valid responses are shown as unavailable rather than zero. Lines are not connected across missing months.",

    insightsTitle: "Experience Insights",
    insightsDescription:
      "Understand changes in customer experience using historical survey responses.",
    satisfactionMovement: "Satisfaction Movement",
    satisfactionMovementDescription:
      "Change in average customer satisfaction",
    npsMovement: "NPS Movement",
    npsMovementDescription:
      "Change in customer recommendation score",
    insufficientMonths:
      "At least two months with valid responses are needed to compare this metric.",
    higher: "Higher",
    lower: "Lower",
    unchanged: "Unchanged",
    by: "by",
    points: "points",
    scorePoints: "score points",
    validResponse: "valid response",
    limitedSample:
      "Limited sample: at least one compared month has fewer than five valid responses. Treat this change as an early signal, not a confirmed trend.",
    comparisonNote:
      "Comparison between the two most recent months with valid responses. These months may not be consecutive.",
  },

  publicSurvey: {
    eyebrow: "Your experience matters",
    title: "How was your experience?",
    description:
      "We'd love to hear about your visit. Your feedback helps us improve.",
    privacyNote:
      "Your responses will be shared with the business that provided your service.",
    requiredNote: "Marked questions are required.",
    required: "Required",
    optional: "Optional",

    satisfactionQuestion:
      "How satisfied were you with the service you received?",
    satisfactionHelp: "Choose a rating from 1 to 5.",
    veryDissatisfied: "Very dissatisfied",
    verySatisfied: "Very satisfied",

    npsQuestion:
      "How likely are you to recommend this business to someone else?",
    npsHelp: "Choose a score from 0 to 10.",
    notLikely: "Not at all likely",
    extremelyLikely: "Extremely likely",

    rebookQuestion: "Would you visit us again?",
    rebookYes: "Yes, I'd like to return",
    rebookNo: "No, not at this time",
    rebookUnsure: "I'm not sure yet",

    commentQuestion: "Is there anything else you'd like to share?",
    commentPlaceholder:
      "Tell us what you enjoyed or what we could improve...",
    commentHelp: "Maximum 2000 characters.",
    charactersRemaining: "Characters remaining",

    submit: "Submit my feedback",
    submitting: "Submitting your feedback...",
    loading: "We're preparing your survey...",
    retry: "Try again",

    requiredAnswers:
      "Please answer all three required questions before continuing.",
    invalidSatisfaction:
      "Select a valid rating from 1 to 5.",
    invalidNps:
      "Select a valid score from 0 to 10.",
    invalidRebook:
      "Select whether you would visit again.",
    commentTooLong:
      "Your comment cannot exceed 2000 characters.",

    successTitle: "Thank you for sharing your experience!",
    successDescription:
      "Your feedback was successfully recorded and will help us continue improving.",

    completedTitle: "We've already received your feedback",
    completedDescription:
      "This survey has already been completed. Thank you for taking the time to share your experience.",

    invalidLinkTitle: "This survey is unavailable",
    invalidLinkDescription:
      "This link is invalid or the survey is no longer available.",

    loadErrorTitle: "We couldn't open your survey",
    loadErrorDescription:
      "Something went wrong while loading your survey. Check your connection and try again.",

    submitError:
      "We couldn't submit your feedback. Please try again.",
    submissionUncertain:
      "We couldn't confirm whether your response was saved. Check the survey status before submitting again.",
    checkingStatus: "Checking your survey status...",
    checkStatus: "Check status",

    footer: "Customer experience powered by KAIRO",
  },


  language: {
    label: "Language",
    spanish: "Spanish",
    english: "English",
  },
} as const;

export default en;
