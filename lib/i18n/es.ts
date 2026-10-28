const es = {
  common: {
    appName: "KAIRO",
    loading: "Cargando...",
    save: "Guardar",
    saving: "Guardando...",
    cancel: "Cancelar",
    close: "Cerrar",
    confirm: "Confirmar",
    delete: "Eliminar",
    edit: "Editar",
    create: "Crear",
    search: "Buscar",
    retry: "Reintentar",
    back: "Volver",
    continue: "Continuar",
    optional: "Opcional",
    actions: "Acciones",
    status: "Estado",
    date: "Fecha",
    noResults: "No se encontraron resultados.",
    unexpectedError: "Ocurrió un error inesperado.",
  },

  navigation: {
    overview: "Resumen",
    intelligence: "Inteligencia",
    customers: "Clientes",
    staff: "Personal",
    services: "Servicios",
    visits: "Visitas",
    feedback: "Opiniones",
    retention: "Retención",
    revenueRecovery: "Ingresos recuperados",
    settings: "Configuración",
    mainNavigation: "Navegación principal",
    openNavigation: "Abrir navegación",
    closeNavigation: "Cerrar navegación",
    closeMenu: "Cerrar menú",
    brandSubtitle: "INTELIGENCIA DE CLIENTES",
    platformLabel: "Plataforma KAIRO",
    platformDescription: "Experiencia y retención de clientes",
  },

  auth: {
    signIn: "Iniciar sesión",
    signingIn: "Iniciando sesión...",
    email: "Correo electrónico",
    password: "Contraseña",
    emailPlaceholder: "correo@ejemplo.com",
    passwordPlaceholder: "Ingresa tu contraseña",
    noAccount: "¿Tu negocio todavía no tiene una cuenta?",
    createBusinessAccount: "Crear cuenta para mi negocio",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    registrationSuccess:
      "Tu cuenta se creó correctamente. Ya puedes iniciar sesión con tu correo y contraseña.",
    loginError: "No fue posible iniciar sesión.",
    invalidCredentials: "Correo o contraseña incorrectos.",
    logout: "Cerrar sesión",
    loggingOut: "Cerrando sesión...",
    logoutError: "No fue posible cerrar sesión. Inténtalo nuevamente.",

    forgotPassword: {
      title: "Recuperar contraseña",
      description:
        "Ingresa el correo asociado a tu cuenta. Si está registrado, recibirás un enlace para establecer una nueva contraseña.",
      success:
        "Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña. Revisa también tu carpeta de correo no deseado.",
      email: "Correo electrónico",
      emailPlaceholder: "correo@ejemplo.com",
      sending: "Enviando...",
      submit: "Enviar instrucciones",
      backToLogin: "Volver a iniciar sesión",
      requestError: "No fue posible procesar la solicitud.",
      unexpectedError: "Ocurrió un error inesperado.",
    },

    resetPassword: {
      title: "Crear nueva contraseña",
      description: "Elige una contraseña de al menos 8 caracteres.",
      newPassword: "Nueva contraseña",
      confirmPassword: "Confirmar nueva contraseña",
      save: "Guardar nueva contraseña",
      saving: "Actualizando...",
      backToLogin: "Volver a iniciar sesión",
      passwordTooShort:
        "La contraseña debe tener al menos 8 caracteres.",
      passwordsDoNotMatch: "Las contraseñas no coinciden.",
      requestError: "No fue posible actualizar la contraseña.",
      unexpectedError: "Ocurrió un error inesperado.",
      invalidOrExpired:
        "El enlace de recuperación no es válido o ha expirado.",
      successTitle: "Contraseña actualizada",
      successDescription:
        "Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión con tu nueva contraseña.",
      signIn: "Iniciar sesión",
      invalidLinkTitle: "Enlace no válido",
      invalidLinkDescription:
        "No encontramos un enlace de recuperación válido. Solicita uno nuevo para continuar.",
      requestNewLink: "Solicitar nuevo enlace",
      loading: "Cargando recuperación de contraseña...",
    },


    register: {
      eyebrow: "Comienza con KAIRO",
      title: "Crea tu cuenta",
      description:
        "Registra tu negocio y configura tu acceso a la plataforma de inteligencia de clientes.",
      businessSection: "01. Información del negocio",
      businessDescription:
        "Identifica el negocio que administrará KAIRO.",
      businessName: "Nombre del negocio",
      industry: "Industria o sector",
      businessEmail: "Correo del negocio",
      businessPhone: "Teléfono (opcional)",
      ownerSection: "02. Tu cuenta de administrador",
      ownerDescription:
        "Utilizarás estos datos para iniciar sesión.",
      fullName: "Nombre completo",
      loginEmail: "Correo para iniciar sesión",
      password: "Contraseña",
      confirmPassword: "Confirmar contraseña",
      createAccount: "Crear mi cuenta",
      creatingAccount: "Creando cuenta...",
      passwordTooShort:
        "La contraseña debe tener al menos 8 caracteres.",
      passwordsDoNotMatch: "Las contraseñas no coinciden.",
      registrationError:
        "No fue posible crear la cuenta. Inténtalo nuevamente.",
      businessNamePlaceholder: "Ej. Studio Wellness",
      industryPlaceholder: "Ej. Belleza y bienestar",
      businessEmailPlaceholder: "contacto@negocio.com",
      businessPhonePlaceholder: "Ej. 222 123 4567",
      fullNamePlaceholder: "Tu nombre completo",
      loginEmailPlaceholder: "tu@correo.com",
      passwordPlaceholder: "Mínimo 8 caracteres",
      confirmPasswordPlaceholder: "Repite tu contraseña",
    },
  },

  dashboard: {
    title: "Resumen del negocio",
    subtitle: "Conoce el estado de tus clientes y su experiencia.",
    totalCustomers: "Clientes totales",
    atRiskCustomers: "Clientes en riesgo",
    averageNps: "NPS promedio",
    averageSatisfaction: "Satisfacción promedio",
    recentActivity: "Actividad reciente",
    noActivity: "Todavía no hay actividad registrada.",
    gettingStarted: "Primeros pasos",
    welcome: "Bienvenido a KAIRO",
    welcomeDescription:
      "Configura tu negocio y comienza a conocer mejor a tus clientes.",
    setupServices: "Configurar servicios",
    setupStaff: "Agregar personal",
    addFirstCustomer: "Registrar primer cliente",
    dashboardHeading: "Panel de control de KAIRO",
    dashboardTagline: "Plataforma de inteligencia para la retención de clientes",
    nps: "NPS",
    customersSection: "Clientes",
    recoveryQueue: "Clientes que requieren atención",
    viewAllCustomers: "Ver todos los clientes",
    viewRetention: "Ver casos de retención",
    metricsSection: "Indicadores de inteligencia de clientes",
    npsScore: "Puntuación NPS",
    totalCustomersDescription:
    "Clientes registrados en tu negocio, excluyendo los archivados.",
    atRiskCustomersDescription:
    "Clientes actualmente identificados como en riesgo.",
    averageSatisfactionDescription:
    "Promedio de satisfacción basado en encuestas completadas con puntuaciones válidas.",
    npsDescription:
    "Net Promoter Score calculado a partir de respuestas NPS válidas.",
  },

  recoveryQueue: {
    title: "Oportunidades de recuperación",
    description:
      "Revisa los clientes identificados como en riesgo y prioriza las acciones de retención.",
    emptyTitle: "No hay clientes identificados en riesgo",
    emptyDescription:
      "Actualmente no hay clientes clasificados como en riesgo. Continúa monitoreando sus opiniones y satisfacción para detectar posibles problemas a tiempo.",
    latestNps: "Último NPS",
    latestSatisfaction: "Última satisfacción",
    scoreNote:
      "Estas puntuaciones corresponden a la última encuesta completada, cuando está disponible. Una puntuación positiva no cambia automáticamente el estado de riesgo del cliente.",
    recommendedAction: "Acción recomendada",
    contactClientFollowUp:
  "Contactar al cliente y ofrecer seguimiento para recuperar su confianza.",
    manageRetention: "Gestionar retención",
  },

  customers: {
    title: "Clientes",
    addCustomer: "Agregar cliente",
    editCustomer: "Editar cliente",
    archivedCustomers: "Clientes archivados",
    restoreCustomer: "Restaurar cliente",
    archiveCustomer: "Archivar cliente",
    noCustomers: "Todavía no tienes clientes registrados.",
    noCustomersDescription:
      "Agrega tu primer cliente para comenzar a gestionar su experiencia.",
    customerName: "Nombre del cliente",
    customerEmail: "Correo electrónico",
    customerPhone: "Teléfono",
    customerStatus: "Estado del cliente",
    active: "Activo",
    atRisk: "En riesgo",
    archived: "Archivado",
    new: "Nuevo",
    unknown: "Desconocido",
    portfolioSubtitle: "Una vista general de tu cartera de clientes",
    customerSingular: "cliente",
    customerPlural: "clientes",
    nameColumn: "Nombre",
    totalVisits: "Visitas totales",
    visitsColumn: "Visitas",
    lifetimeValue: "Valor acumulado",

    managementLabel: 'Gestión de clientes',
    pageDescription: 'Conoce tu cartera de clientes, supervisa las relaciones y administra su información desde un solo lugar.',
    viewArchived: 'Ver clientes archivados',
    noMatchingCustomers: 'No se encontraron clientes',
    noMatchingCustomersDescription: 'Ningún cliente coincide con tu búsqueda o filtros. Prueba con otro nombre o estado.',
    newCustomer: 'Nuevo cliente',
    closeCustomerForm: 'Cerrar formulario de cliente',
    searchPlaceholder: 'Buscar clientes por nombre...',
    searchCustomers: 'Buscar clientes',
    filterByStatus: 'Filtrar clientes por estado',
    allStatuses: 'Todos los estados',
    clearFilters: 'Limpiar filtros',
    formCreateDescription: 'Crea un perfil para comenzar a registrar visitas, opiniones y acciones de retención.',
    formEditDescription: 'Actualiza la información y el estado de la relación con el cliente.',
    fullName: 'Nombre completo',
    namePlaceholder: 'Ej. Mariana López',
    emailPlaceholder: 'cliente@ejemplo.com',
    phonePlaceholder: 'Ej. +52 222 123 4567',
    nameRequired: 'El nombre del cliente es obligatorio.',
    createError: 'No fue posible crear el cliente.',
    updateError: 'No fue posible actualizar el cliente.',
    creatingCustomer: 'Creando cliente...',
    savingChanges: 'Guardando cambios...',
    saveChanges: 'Guardar cambios',
    createCustomer: 'Crear cliente',
    editCustomerAria: 'Editar cliente',
    archiveCustomerAria: 'Archivar cliente',
    archiveQuestion: '¿Archivar cliente?',
    archiveDescriptionStart: 'Estás a punto de archivar a',
    archiveDescriptionEnd: 'Este cliente dejará de aparecer en la lista activa. Su información e historial permanecerán guardados.',
    archiving: 'Archivando...',
    archiveError: 'No fue posible archivar el cliente.',
    closeConfirmation: 'Cerrar confirmación',
    archivedDescription: 'Consulta los clientes archivados y restáuralos cuando sea necesario. Su historial permanece guardado.',
    backToCustomers: 'Volver a Clientes',
    searchArchived: 'Buscar clientes archivados',
    searchArchivedPlaceholder: 'Buscar clientes archivados...',
    clearSearch: 'Limpiar',
    archivedRecords: 'Registros archivados',
    noEmail: 'Sin correo electrónico',
    previousStatus: 'Estado anterior:',
    noArchivedFound: 'No se encontraron clientes archivados',
    noArchivedYet: 'Todavía no hay clientes archivados',
    noArchivedSearchDescription: 'Ningún cliente archivado coincide con tu búsqueda. Prueba con otro nombre.',
    noArchivedDescription: 'Los clientes archivados aparecerán aquí cuando archives alguno.',
    restoreCustomerAria: 'Restaurar cliente',
    restoreQuestion: '¿Restaurar cliente?',
    restoreDescriptionStart: 'Estás a punto de restaurar a',
    restoreDescriptionEnd: 'Este cliente volverá a la lista y conservará su información e historial.',
    restoredStatus: 'Estado del cliente después de restaurarlo',
    selectStatus: 'Selecciona el estado del cliente',
    chooseStatus: 'Elige un estado',
    missingPreviousStatus: 'Este cliente se archivó antes de que se registrara su estado anterior. Selecciona el estado adecuado para restaurarlo.',
    statusRequired: 'Selecciona un estado para el cliente.',
    restoring: 'Restaurando...',
    restoreError: 'No fue posible restaurar el cliente.',
    checkStatus: 'Verificar estado del cliente',
    checking: 'Verificando...',
    verifyError: 'No fue posible verificar el estado del cliente.',
    unexpectedCustomer: 'El servidor devolvió un cliente diferente al solicitado.',
    invalidStatus: 'El servidor devolvió un estado de cliente no válido.',
    previousRestoreUnknown: 'No se pudo confirmar una restauración anterior. Verifica el estado del cliente antes de intentarlo nuevamente.',
    checkBeforeRetry: 'Verifica el estado del cliente antes de intentar otra restauración.',
    unknownRestoreResult: 'No se conoce el resultado de la restauración. Verifica el estado del cliente antes de intentarlo nuevamente.',
    unconfirmedResponse: 'La respuesta del servidor no confirmó la restauración. Verifica el estado del cliente antes de intentarlo nuevamente.',
    unconfirmedRestore: 'No se pudo confirmar la restauración. Verifica el estado del cliente antes de intentarlo nuevamente.',
    stillArchived: 'El cliente sigue archivado. Puedes intentar restaurarlo nuevamente.',
    alreadyRestored: 'Este cliente ya no está archivado. Actualiza la lista para ver la información más reciente.',
  },

  staff: {
    title: "Personal",
    addStaff: "Agregar integrante",
    editStaff: "Editar integrante",
    noStaff: "Todavía no hay integrantes registrados.",
    noStaffDescription:
      "Agrega a las personas que prestan servicios en tu negocio.",

    eyebrow: "Gestión del equipo",
    subtitle:
      "Administra tu equipo, organiza la información del personal y mantén una visión clara de quienes brindan atención a tus clientes.",

    totalMembers: "Total de integrantes",
    activeMembers: "Integrantes activos",
    inactiveMembers: "Integrantes inactivos",

    directoryTitle: "Directorio del equipo",
    directoryDescription:
      "Consulta los integrantes registrados y su estado actual.",
    emptyTitle: "Todavía no hay integrantes",
    emptyDescription:
      "Tu directorio está vacío. Agrega al primer integrante para comenzar.",

    memberColumn: "Integrante",
    roleColumn: "Cargo",
    contactColumn: "Contacto",
    statusColumn: "Estado",
    actionsColumn: "Acciones",
    notProvided: "No proporcionado",
    active: "Activo",
    inactive: "Inactivo",

    newMember: "Nuevo integrante",
    closeForm: "Cerrar formulario de personal",
    editAction: "Editar",
    editMemberAria: "Editar integrante",

    createFormDescription:
      "Crea un perfil para organizar la información del personal y asociar integrantes con las visitas de clientes.",
    editFormDescription:
      "Actualiza la información del integrante para mantener el directorio al día.",

    fullName: "Nombre completo",
    namePlaceholder: "Ej. Sofía Martínez",
    role: "Cargo",
    rolePlaceholder: "Ej. Especialista en tratamientos",
    email: "Correo electrónico",
    emailPlaceholder: "equipo@ejemplo.com",
    phone: "Teléfono",
    phonePlaceholder: "Ej. +52 222 123 4567",

    nameRequired: "El nombre del integrante es obligatorio.",
    roleRequired: "El cargo es obligatorio.",
    saveError: "No fue posible guardar al integrante.",
    unexpectedError: "Ocurrió un error inesperado.",

    cancel: "Cancelar",
    savingChanges: "Guardando cambios...",
    creatingMember: "Creando integrante...",
    saveChanges: "Guardar cambios",
    createMember: "Crear integrante",

    discardTitle: "¿Descartar cambios?",
    discardCreateDescription:
      "Tienes información sin guardar. Si cierras este panel, perderás los cambios.",
    discardEditDescription:
      "Tienes cambios sin guardar en este integrante. Si cierras el panel, los perderás.",
    keepEditing: "Seguir editando",
    discardChanges: "Descartar cambios",

    deactivate: "Desactivar",
    reactivate: "Reactivar",
    deactivateTitle: "¿Desactivar integrante?",
    reactivateTitle: "¿Reactivar integrante?",
    deactivateDescription:
      "dejará de estar disponible para nuevas visitas de clientes. Su perfil y su historial de visitas se conservarán.",
    reactivateDescription:
      "volverá a estar activo y podrá asignarse a nuevas visitas de clientes.",
    closeConfirmation: "Cerrar confirmación",
    deactivateMember: "Desactivar integrante",
    reactivateMember: "Reactivar integrante",
    deactivating: "Desactivando...",
    reactivating: "Reactivando...",
    deactivateError: "No fue posible desactivar al integrante.",
    reactivateError: "No fue posible reactivar al integrante.",
  },

  services: {
        title: "Servicios",
    addService: "Agregar servicio",
    editService: "Editar servicio",
    noServices: "Todavía no hay servicios registrados.",
    noServicesDescription:
      "Configura los servicios que ofrece tu negocio.",

    eyebrow: "Operaciones del negocio",
    subtitle:
      "Administra tu catálogo de servicios, consulta su disponibilidad y mantén organizados los precios y la información.",
    activeServices: "Servicios activos",
    activeServicesDescription: "Disponibles para nuevas visitas",
    inactiveServices: "Servicios inactivos",
    inactiveServicesDescription: "Conservados en el historial",
    averagePrice: "Precio promedio",
    averagePriceDescription: "De todos los servicios del catálogo",
    catalogTitle: "Catálogo de servicios",
    catalogDescription:
      "Consulta los servicios que ofrece tu negocio y su disponibilidad actual.",
    catalogLabel: "Resumen de servicios",
    service: "Servicio",
    category: "Categoría",
    duration: "Duración",
    price: "Precio",
    status: "Estado",
    actions: "Acciones",
    uncategorized: "Sin categoría",
    minutes: "min",
    active: "Activo",
    inactive: "Inactivo",

    newService: "Nuevo servicio",
    edit: "Editar",
    editAriaLabel: "Editar",
    closeForm: "Cerrar formulario de servicio",
    closeEditForm: "Cerrar edición del servicio",
    addFormTitle: "Agregar un servicio",
    editFormTitle: "Editar información del servicio",
    addFormDescription:
      "Agrega un servicio al catálogo para seleccionarlo al registrar visitas de clientes.",
    editFormDescription:
      "Actualiza la información del servicio. Los importes de las visitas anteriores no cambiarán.",
    serviceName: "Nombre del servicio",
    serviceNamePlaceholder: "Ej. Limpieza facial profunda",
    categoryPlaceholder: "Ej. Tratamientos faciales",
    durationMinutes: "Duración (minutos)",
    durationPlaceholder: "Ej. 60",
    priceMXN: "Precio (MXN)",
    pricePlaceholder: "Ej. 850.00",
    description: "Descripción",
    descriptionPlaceholder: "Describe qué incluye este servicio...",
    required: "Obligatorio",
    cancel: "Cancelar",
    saveChanges: "Guardar cambios",
    savingChanges: "Guardando cambios...",
    addingService: "Agregando servicio...",

    nameRequired: "Ingresa el nombre del servicio.",
    nameTooLong: "El nombre no puede superar los 150 caracteres.",
    descriptionOrCategoryTooLong:
      "La descripción o categoría supera la longitud permitida.",
    invalidDuration:
      "La duración debe ser un número entero mayor que cero.",
    invalidPrice:
      "Ingresa un precio válido con un máximo de dos decimales.",
    createError: "No fue posible crear el servicio.",
    updateError: "No fue posible actualizar el servicio.",
    unexpectedError: "Ocurrió un error inesperado.",

    discardTitle: "¿Descartar cambios?",
    discardCreateDescription:
      "Tienes información del servicio sin guardar. Si cierras el formulario, perderás los cambios.",
    discardEditDescription:
      "Tienes cambios sin guardar en este servicio. Si cierras el formulario, los perderás.",
    keepEditing: "Seguir editando",
    discardChanges: "Descartar cambios",

    deactivate: "Desactivar",
    reactivate: "Reactivar",
    deactivateTitle: "¿Desactivar servicio?",
    reactivateTitle: "¿Reactivar servicio?",
    deactivateDescription:
      "dejará de estar disponible para nuevas visitas. Se conservarán los registros de visitas anteriores.",
    reactivateDescription:
      "volverá a estar disponible para nuevas visitas.",
    deactivateService: "Desactivar servicio",
    reactivateService: "Reactivar servicio",
    closeConfirmation: "Cerrar confirmación",
    processing: "Procesando...",
    deactivateError: "No fue posible desactivar el servicio.",
    reactivateError: "No fue posible reactivar el servicio.",
  },

  visits: {
    title: "Visitas",
    addVisit: "Registrar visita",
    editVisit: "Editar visita",
    noVisits: "Todavía no hay visitas registradas.",
    noVisitsDescription:
      "Registra una visita para comenzar a construir el historial de tus clientes.",

    eyebrow: "Actividad de clientes",
    description:
      "Registra las visitas de tus clientes, relaciona los servicios con los miembros del equipo y obtén una visión más clara de la actividad de tu negocio.",
    historyTitle: "Historial de visitas",
    historyDescription:
      "Consulta las visitas registradas, sus servicios y los miembros del equipo que las atendieron.",

    date: "Fecha",
    customer: "Cliente",
    service: "Servicio",
    teamMember: "Miembro del equipo",
    amount: "Importe",
    actions: "Acciones",

    customerUnavailable: "Cliente no disponible",
    serviceUnavailable: "Servicio no disponible",
    teamMemberUnavailable: "Miembro del equipo no disponible",

    newVisit: "Nueva visita",
    closeVisitForm: "Cerrar formulario de visita",
    closeVisitEditor: "Cerrar editor de visita",

    edit: "Editar",
    delete: "Eliminar",
    editVisitDetails: "Editar datos de la visita",
    recordVisit: "Registrar visita",

    createDescription:
      "Relaciona al cliente con el servicio recibido y el miembro del equipo que lo atendió.",
    editDescription:
      "Actualiza los datos de la visita. Los cambios en el importe o la fecha se reflejarán en las métricas del cliente.",

    requiredOptions:
      "Debe haber al menos un cliente, un servicio y un miembro del equipo disponibles para completar este formulario.",
    requiredOptionsError:
      "Se necesita un cliente, un servicio y un miembro del equipo.",
    requiredFieldsError: "Completa todos los campos obligatorios.",
    invalidDateError:
      "Revisa la fecha y el año de la visita. Introduce una fecha válida que no sea futura.",
    invalidAmountError:
      "Introduce un importe válido igual o mayor que cero.",

    selectCustomer: "Selecciona un cliente",
    selectService: "Selecciona un servicio",
    selectTeamMember: "Selecciona un miembro del equipo",
    archived: "Archivado",
    inactive: "Inactivo",

    visitDateTime: "Fecha y hora de la visita",
    visitDateHelp:
      "Introduce la fecha y hora local de la visita realizada.",
    amountMXN: "Importe (MXN)",
    amountHelp:
      "El precio del servicio se propone automáticamente. Puedes ajustar el importe final.",
    notes: "Notas",
    notesPlaceholder:
      "Agrega información adicional sobre esta visita (opcional)...",

    cancel: "Cancelar",
    saveChanges: "Guardar cambios",
    savingChanges: "Guardando cambios...",
    recordingVisit: "Registrando visita...",

    discardTitle: "¿Descartar cambios?",
    createDiscardDescription:
      "Tienes información de la visita sin guardar. Si cierras este panel, perderás los cambios.",
    editDiscardDescription:
      "Tienes cambios sin guardar en esta visita. Si cierras el editor, perderás esos cambios.",
    keepEditing: "Seguir editando",
    discardChanges: "Descartar cambios",

    deleteVisit: "Eliminar visita",
    deleteTitle: "¿Eliminar esta visita?",
    deleteDescription:
      "Esta acción eliminará permanentemente la visita y actualizará el historial y las métricas del cliente.",
    closeConfirmation: "Cerrar confirmación",
    deletingVisit: "Eliminando visita...",
    deleteVisitFor: "Eliminar visita de",

    createError: "No fue posible registrar la visita.",
    updateError: "No fue posible actualizar la visita.",
    deleteError: "No fue posible eliminar la visita.",
    unexpectedError: "Ocurrió un error inesperado.",
  },

  feedback: {
    title: "Opiniones de clientes",
    noFeedback: "Todavía no hay opiniones registradas.",
    noFeedbackDescription:
      "Las encuestas asociadas a las visitas de tus clientes aparecerán aquí, junto con indicadores de satisfacción y lealtad.",
    nps: "NPS",
    csat: "Satisfacción",

    eyebrow: "Inteligencia de clientes",
    description:
      "Conoce la satisfacción de tus clientes, monitorea su lealtad e identifica oportunidades para mejorar la experiencia después del servicio.",

    overview: "Resumen de opiniones",
    averageSatisfaction: "Satisfacción promedio",
    basedOnRatings: "Basado en {count} calificaciones",
    netPromoterScore: "Net Promoter Score",
    basedOnResponses: "Basado en {count} respuestas",
    responseRate: "Tasa de respuesta",
    responseRateDescription:
      "Encuestas completadas / encuestas totales",
    pendingFeedback: "Opiniones pendientes",
    pendingFeedbackDescription:
      "Encuestas en espera de respuesta",

    historyTitle: "Historial de encuestas",
    historyDescription:
      "Consulta las opiniones asociadas a las visitas de tus clientes.",

    customer: "Cliente",
    visit: "Visita",
    satisfaction: "Satisfacción",
    rebookIntent: "Intención de regresar",
    status: "Estado",
    actions: "Acciones",

    customerUnavailable: "Cliente no disponible",
    archived: "Archivado",
    completed: "Completada",
    pending: "Pendiente",

    promoter: "Promotor",
    passive: "Pasivo",
    detractor: "Detractor",

    yes: "Sí",
    no: "No",
    unsure: "No está seguro",

    invalidLegacyValue: "Valor histórico no válido",
    invalidLegacyValueDescription:
      "Valor histórico fuera del rango permitido actualmente",

    addSurvey: "Agregar encuesta",
    newSurvey: "Nueva encuesta",
    closeSurveyForm: "Cerrar formulario de encuesta",
    createSurveyDescription:
      "Crea una solicitud de opinión para una visita existente. Cada visita puede tener una sola encuesta.",
    noEligibleVisits: "No hay visitas disponibles",
    noEligibleVisitsDescription:
      "Todas las visitas existentes ya tienen encuestas o todavía no se han registrado visitas.",
    customerVisit: "Visita del cliente",
    selectVisit: "Selecciona una visita",
    selectedCustomer: "Cliente seleccionado",
    visitLabel: "Visita:",
    cancel: "Cancelar",
    creating: "Creando...",
    createSurvey: "Crear encuesta",
    selectAvailableVisit: "Selecciona una visita disponible.",
    unableToCreateSurvey: "No se pudo crear la encuesta.",
    discardChangesTitle: "¿Descartar cambios?",
    discardSurveyDescription:
      "La visita seleccionada no se ha guardado. Si cierras el formulario, perderás tu selección.",
    keepEditing: "Seguir editando",
    discardChanges: "Descartar cambios",

    recordCustomerFeedback: "Registrar opinión del cliente",
    recordFeedbackDescription:
      "Registra la experiencia del cliente después de su visita. Puedes guardar una respuesta parcial si algunas respuestas no están disponibles.",
    customerSatisfaction: "Satisfacción del cliente (CSAT)",
    satisfactionQuestion:
      "¿Qué tan satisfecho quedó el cliente con el servicio?",
    satisfactionScoreLabel: "Puntuación de satisfacción del cliente",
    veryDissatisfied: "Muy insatisfecho",
    verySatisfied: "Muy satisfecho",
    npsQuestion:
      "¿Qué tan probable es que el cliente recomiende el negocio?",
    notLikely: "Nada probable",
    extremelyLikely: "Extremadamente probable",
    rebookingIntention: "Intención de regresar",
    notAnswered: "Sin responder",
    likelyToReturn: "Sí, probablemente regresará",
    unlikelyToReturn: "No, probablemente no regresará",
    notSureYet: "Todavía no está seguro",
    customerComment: "Comentario del cliente",
    commentPlaceholder:
      "Agrega los comentarios compartidos por el cliente...",
    savingResponse: "Guardando respuesta...",
    saveResponse: "Guardar respuesta",

    onlyPendingSurveys:
      "Solo las encuestas pendientes pueden recibir una nueva respuesta.",
    enterAtLeastOneResponse:
      "Ingresa al menos una respuesta de la encuesta.",
    invalidSatisfaction:
      "La satisfacción debe ser un número entero del 1 al 5.",
    invalidNps:
      "El NPS debe ser un número entero del 0 al 10.",
    invalidRebooking:
      "Selecciona una intención de regresar válida.",
    commentTooLong:
      "El comentario debe tener 2000 caracteres o menos.",
    unableToSaveResponse:
      "No se pudo guardar la respuesta de la encuesta.",
    unexpectedError: "Ocurrió un error inesperado.",

    recordResponse: "Registrar respuesta",
    surveyResponse: "Respuesta de encuesta",
    closeSurveyResponse: "Cerrar respuesta de encuesta",
    discardResponseDescription:
      "Tienes respuestas de encuesta sin guardar. Si cierras este formulario, perderás los cambios.",



  },

  retention: {
    title: "Retención de clientes",
    createCase: "Crear caso",
    noCases: "Todavía no hay casos de retención.",
    noCasesDescription:
      "Identifica clientes en riesgo y registra las acciones para recuperarlos.",
    pending: "Pendiente",
    inProgress: "En progreso",
    resolved: "Resuelto",

    eyebrow: "Inteligencia de clientes",
    description:
      "Identifica a los clientes que necesitan atención, gestiona casos de recuperación y da seguimiento a las acciones de retención.",
    selectedFromDashboard: "Seleccionado desde el panel",
    customerUnavailable: "Cliente no disponible",
    customerNotFound:
      "No se encontró este cliente. Es posible que haya sido eliminado.",
    customerHasActiveCase:
      "Este cliente ya tiene un caso de retención activo.",
    customerEligible:
      "Puedes crear un caso de retención para este cliente.",
    customerNotEligible:
      "Este cliente no está disponible para crear un caso de retención.",
    viewAllRetention: "Ver toda la retención",
    noActionAvailable:
      "No hay ninguna acción de retención disponible para este cliente.",

    customersNeedingAttention: "Clientes que necesitan atención",
    recoveryQueueDescription: "Clientes en la lista de recuperación",
    detractorFeedback: "Opiniones de detractores",
    detractorFeedbackDescription: "Último NPS entre 0 y 6",
    activeCases: "Casos activos",
    activeCasesDescription: "Pendientes o en progreso",
    resolvedCases: "Casos resueltos",
    resolvedCasesDescription: "Seguimientos de recuperación completados",
    recoveryOpportunities: "Oportunidades de recuperación",
    reviewFeedback: "Revisar opiniones",
    viewCustomers: "Ver clientes",
    needsAttention: "Necesita atención",
    latestNps: "Último NPS",
    satisfaction: "Satisfacción",
    recommendedAction: "Acción recomendada",
    caseAlreadyOpen: "Ya tiene un caso abierto",

    reason: "Motivo",
    priority: "Prioridad",
    low: "Baja",
    medium: "Media",
    high: "Alta",
    created: "Creado",
    resolvedOn: "Resuelto",
    noActiveCases: "No hay casos activos.",
    noRecoveryOpportunities:
      "No hay oportunidades de recuperación disponibles.",
    noResolvedCases: "No hay casos resueltos.",

    newRetentionCase: "Nuevo caso de retención",
    closeRetentionForm: "Cerrar formulario de retención",
    createCaseDescription:
      "Crea un caso de seguimiento para registrar la recuperación de un cliente. Cada cliente puede tener solamente un caso abierto a la vez.",
    noAvailableCustomers: "No hay clientes disponibles",
    noAvailableCustomersDescription:
      "Todos los clientes activos ya tienen casos abiertos o no hay clientes disponibles.",
    customer: "Cliente",
    selectCustomer: "Selecciona un cliente",
    selectAvailableCustomer: "Selecciona un cliente disponible.",
    enterReason: "Escribe el motivo de este caso de retención.",
    reasonTooLong: "El motivo no puede superar los 2000 caracteres.",
    reasonPlaceholder:
      "Describe por qué este cliente necesita seguimiento...",
    cancel: "Cancelar",
    creating: "Creando...",
    unableToCreateCase: "No se pudo crear el caso de retención.",

    discardChangesQuestion: "¿Descartar los cambios?",
    createDiscardDescription:
      "Tu caso de retención no se ha guardado. Si cierras este formulario, perderás los cambios.",
    keepEditing: "Seguir editando",
    discardChanges: "Descartar cambios",

    phoneCall: "Llamada telefónica",
    email: "Correo electrónico",
    message: "Mensaje",
    other: "Otro",
    contacted: "Contactado",
    noResponse: "Sin respuesta",
    followUpNeeded: "Necesita seguimiento",

    unableToLoadActivities:
      "No se pudo cargar el historial de actividades.",
    unexpectedActivityResponse:
      "Se recibió una respuesta inesperada al consultar las actividades.",
    unableToUpdateCase:
      "No se pudo actualizar el caso de retención.",
    caseUpdated: "Caso actualizado correctamente.",
    unableToRecordActivity:
      "No se pudo registrar la actividad.",
    activityRecorded: "Actividad registrada correctamente.",
    saveBeforeResolving:
      "Guarda o descarta los cambios pendientes antes de resolver este caso.",

    viewHistory: "Ver historial",
    manageCase: "Gestionar caso",
    resolvedCaseHistory: "Historial del caso resuelto",
    manageRecoveryFollowUp: "Gestionar seguimiento de recuperación",
    closeCaseManagement: "Cerrar gestión del caso",
    caseDetails: "Detalles del caso",
    caseManagement: "Gestión del caso",
    status: "Estado",
    saving: "Guardando...",
    saveChanges: "Guardar cambios",
    resolveCase: "Resolver caso",
    activityHistory: "Historial de actividades",
    loadingActivities: "Cargando actividades...",
    tryAgain: "Intentar de nuevo",
    noActivitiesRecorded: "No hay actividades registradas",
    noActivitiesDescription:
      "Los intentos de contacto con el cliente y sus resultados aparecerán aquí.",
    addActivity: "Agregar actividad",
    contactType: "Tipo de contacto",
    outcome: "Resultado",
    notSpecified: "No especificado",
    notes: "Notas",
    notesPlaceholder: "Describe la interacción con el cliente...",
    recording: "Registrando...",
    recordActivity: "Registrar actividad",
    close: "Cerrar",

    resolveCaseQuestion: "¿Resolver este caso?",
    resolveCaseDescription:
      "Este caso se marcará como resuelto y pasará a ser de solo lectura. Su historial de actividades seguirá disponible.",
    manageDiscardDescription:
      "Si cierras este panel, perderás los cambios que no hayas guardado.",
  },

  revenueRecovery: {
    title: "Ingresos recuperados",
  noRecoveries: "Todavía no hay ingresos recuperados.",
  noRecoveriesDescription:
    "Los ingresos atribuidos a acciones de retención aparecerán aquí.",

  eyebrow: "Inteligencia de negocio",
  description:
    "Comprende el impacto financiero de la retención de clientes, identifica ingresos en riesgo y da seguimiento a los ingresos asociados con las acciones de recuperación.",
  manageRetention: "Gestionar retención",
  revenueOverview: "Resumen de ingresos",
  revenueOverviewDescription:
    "Indicadores financieros basados en la actividad registrada del negocio.",
  asOf: "Al",

  revenueAtRisk: "Ingresos en riesgo",
  revenueAtRiskDescription:
    "Valor estimado de una posible visita por cada caso abierto.",
  recoveredRevenue: "Ingresos recuperados",
  recoveredRevenueDescription:
    "Ingresos de visitas atribuidas explícitamente a casos de retención.",
  openOpportunities: "Oportunidades abiertas",
  openOpportunitiesDescription:
    "Casos de retención que actualmente requieren seguimiento.",
  resolvedCases: "Casos resueltos",
  resolvedCasesDescription:
    "Casos de retención resueltos, independientemente de la atribución de ingresos.",

  recoveryOpportunities: "Oportunidades de recuperación",
  recoveryOpportunitiesDescription:
    "Casos de retención abiertos y su exposición estimada de ingresos.",
  open: "abiertas",
  noOpenOpportunities: "No hay oportunidades de recuperación abiertas",
  noOpenOpportunitiesDescription:
    "No hay casos de retención activos para evaluar. Las nuevas oportunidades aparecerán aquí cuando se abran casos.",
  viewRetentionCases: "Ver casos de retención",
  retentionCase: "Caso de retención",
  priority: "prioridad",
  low: "Baja",
  medium: "Media",
  high: "Alta",
  pending: "Pendiente",
  inProgress: "En progreso",
  resolved: "Resuelto",
  estimatedRevenueAtRisk: "Ingresos estimados en riesgo",
  insufficientData: "Datos insuficientes",
  noHistoricalVisits: "No hay visitas anteriores disponibles para realizar una estimación.",
  estimatedFutureVisit:
    "Valor estimado de una posible visita futura.",
  manageCase: "Gestionar caso",

  recoveryPerformance: "Rendimiento de recuperación",
  recoveryPerformanceDescription:
    "Cobertura de atribución y confianza en las estimaciones de ingresos.",
  attributedVisits: "Visitas atribuidas",
  attributedVisitsDescription:
    "Visitas vinculadas a casos de retención.",
  casesWithEstimates: "Casos con estimaciones",
  casesWithEstimatesDescription:
    "Casos abiertos con suficiente historial de visitas.",
  insufficientDataCases: "Datos insuficientes",
  insufficientDataCasesDescription:
    "Casos abiertos sin historial de visitas.",
  financialDisclaimer:
    "Los ingresos en riesgo son una estimación, no un pronóstico ni una pérdida garantizada. Los ingresos recuperados representan visitas registradas y atribuidas a casos de retención; la atribución no demuestra que la acción de retención haya causado la compra.",

  revenueAttribution: "Atribución de ingresos",
  trackRecoveredRevenue: "Seguimiento de ingresos recuperados",
  attributionDescription:
    "Vincula una visita elegible de un cliente con un caso de retención. Cada visita solo puede atribuirse una vez.",
  newAttribution: "Nueva atribución",
  newAttributionDescription:
    "Selecciona un caso de retención para encontrar visitas elegibles.",
  selectRetentionCase: "Selecciona un caso de retención",
  customerUnavailable: "Cliente no disponible",
  eligibleVisit: "Visita elegible",
  selectVisit: "Selecciona una visita",
  noEligibleVisits:
    "No hay visitas elegibles para este caso. La visita debe ocurrir durante el periodo del caso, tener un importe positivo y no estar atribuida a otro caso.",
  attributionPreview: "Vista previa de atribución",
  attributeRevenue: "Atribuir ingresos",
  recordedAttributions: "Atribuciones registradas",
  noAttributedRevenue: "Todavía no hay ingresos atribuidos",
  noAttributedRevenueDescription:
    "Las atribuciones registradas aparecerán aquí cuando vincules visitas elegibles con casos de retención.",
  retentionCaseUnavailable: "Caso de retención no disponible",
  visitUnavailable: "Visita no disponible",
  amountUnavailable: "Importe no disponible",
  removeRevenueAttribution: "Eliminar atribución de ingresos",

  unableToAttribute: "No se pudieron atribuir los ingresos.",
  unableToRemove: "No se pudo eliminar la atribución.",
  attributionRecorded: "Atribución de ingresos registrada correctamente.",
  attributionRemoved: "Atribución de ingresos eliminada correctamente.",
  unexpectedError: "Ocurrió un error inesperado.",

  confirmRevenueAttribution: "Confirmar atribución de ingresos",
  removeRevenueAttributionQuestion: "¿Eliminar la atribución de ingresos?",
  closeConfirmation: "Cerrar confirmación",
  thisVisit: "esta visita",
  confirmAttributionDescription:
    "¿Atribuir {amount} al caso de retención seleccionado? Esto registra una asociación, pero no demuestra que la acción de retención haya causado la compra.",
  removeAttributionDescription:
    "¿Eliminar la atribución{amount}? La visita original y el caso de retención permanecerán sin cambios.",
  cancel: "Cancelar",
  processing: "Procesando...",
  confirmAttribution: "Confirmar atribución",
  removeAttribution: "Eliminar atribución",
  },

  intelligence: {
    title: "Inteligencia de clientes",
    noData: "Todavía no hay suficientes datos.",
    noDataDescription:
      "Registra clientes, visitas y opiniones para generar indicadores.",

    eyebrow: "Análisis de clientes",
    description:
      "Comprende el comportamiento de tus clientes, analiza las tendencias de su experiencia e identifica oportunidades para mejorar la retención.",
    viewCustomers: "Ver clientes",

    segmentationTitle: "Segmentación de clientes",
    segmentationDescription:
      "Basada en las visitas completadas y la actividad de los clientes.",
    customer: "cliente",
    customers: "clientes",
    analyzed: "analizados",
    customerShare: "Proporción de clientes",

    segmentNew: "Nuevos",
    segmentNewDescription:
      "Clientes sin visitas completadas.",
    segmentOneTime: "Una visita",
    segmentOneTimeDescription:
      "Clientes con una visita dentro del periodo de actividad.",
    segmentReturning: "Recurrentes",
    segmentReturningDescription:
      "Clientes con varias visitas y actividad reciente.",
    segmentInactive: "Inactivos",
    segmentInactiveDescription:
      "Clientes cuya última visita completada fue hace al menos 90 días.",

    noCustomersTitle: "Todavía no hay clientes para analizar",
    noCustomersDescription:
      "Los segmentos aparecerán aquí cuando comiences a registrar clientes y sus visitas.",
    goToCustomers: "Ir a Clientes",

    howSegmentationWorks: "Cómo funciona la segmentación",
    segmentationExplanationStart:
      "Los segmentos se calculan a partir del historial de visitas, no de estados asignados manualmente. Los clientes sin visitas completadas se clasifican como Nuevos. Los clientes con visitas recientes se clasifican como Una visita o Recurrentes según su frecuencia. Los clientes cuya última visita fue hace al menos",
    segmentationExplanationEnd:
      "se clasifican como Inactivos.",
    daysAgo: "días",
    segmentationNote:
      "Los clientes archivados y las visitas futuras se excluyen del análisis. La clasificación de riesgo se gestiona por separado de estos segmentos de comportamiento.",

    trendsTitle: "Tendencias de experiencia",
    trendsDescriptionStart:
      "Tendencias mensuales de satisfacción y recomendación durante los últimos",
    calendarMonths: "meses calendario",
    satisfactionTitle: "Satisfacción del cliente",
    satisfactionMetricDescription:
      "Satisfacción promedio · Escala de 1 a 5",
    npsTitle: "Net Promoter Score",
    npsMetricDescription:
      "Puntuación de recomendación · Escala de −100 a +100",
    validResponses: "Respuestas válidas",
    noTrendData: "Todavía no hay datos de tendencias",
    noTrendDataDescription:
      "Completa encuestas de clientes para comenzar a monitorear este indicador a lo largo del tiempo.",
    monthlyTrend: "Tendencia mensual",
    monthlyBreakdown: "Desglose mensual",
    response: "respuesta",
    responses: "respuestas",
    reportingTimezone: "Zona horaria del informe:",
    trendsMethodology:
      "Solo se incluyen encuestas completadas con puntuaciones válidas. Los meses sin respuestas válidas se muestran como no disponibles, en lugar de cero. Las líneas no se conectan cuando faltan meses.",

    insightsTitle: "Análisis de experiencia",
    insightsDescription:
      "Comprende los cambios en la experiencia de tus clientes a partir de las respuestas históricas de sus encuestas.",
    satisfactionMovement: "Evolución de la satisfacción",
    satisfactionMovementDescription:
      "Cambio en la satisfacción promedio de los clientes",
    npsMovement: "Evolución del NPS",
    npsMovementDescription:
      "Cambio en la puntuación de recomendación",
    insufficientMonths:
      "Se necesitan al menos dos meses con respuestas válidas para comparar este indicador.",
    higher: "Mayor",
    lower: "Menor",
    unchanged: "Sin cambios",
    by: "por",
    points: "puntos",
    scorePoints: "puntos de puntuación",
    validResponse: "respuesta válida",
    limitedSample:
      "Muestra limitada: al menos uno de los meses comparados tiene menos de cinco respuestas válidas. Considera este cambio una señal preliminar, no una tendencia confirmada.",
    comparisonNote:
      "Comparación entre los dos meses más recientes con respuestas válidas. Estos meses pueden no ser consecutivos.",
  },

  publicSurvey: {
    eyebrow: "Tu experiencia importa",
    title: "¿Cómo fue tu experiencia?",
    description:
      "Nos gustaría conocer tu opinión sobre tu visita. Tus respuestas nos ayudan a mejorar.",
    privacyNote:
      "Tus respuestas serán compartidas con el negocio que te atendió.",
    requiredNote: "Las preguntas marcadas son obligatorias.",
    required: "Obligatorio",
    optional: "Opcional",

    satisfactionQuestion:
      "¿Qué tan satisfecho quedaste con el servicio recibido?",
    satisfactionHelp: "Selecciona una calificación del 1 al 5.",
    veryDissatisfied: "Muy insatisfecho",
    verySatisfied: "Muy satisfecho",

    npsQuestion:
      "¿Qué tan probable es que recomiendes este negocio a alguien más?",
    npsHelp: "Selecciona una puntuación del 0 al 10.",
    notLikely: "Nada probable",
    extremelyLikely: "Extremadamente probable",

    rebookQuestion: "¿Volverías a visitarnos?",
    rebookYes: "Sí, me gustaría volver",
    rebookNo: "No, por ahora",
    rebookUnsure: "Aún no lo sé",

    commentQuestion: "¿Te gustaría contarnos algo más?",
    commentPlaceholder:
      "Cuéntanos qué te gustó o qué podríamos mejorar...",
    commentHelp: "Máximo 2000 caracteres.",
    charactersRemaining: "Caracteres disponibles",

    submit: "Enviar mi opinión",
    submitting: "Enviando tu opinión...",
    loading: "Estamos preparando tu encuesta...",
    retry: "Intentar nuevamente",

    requiredAnswers:
      "Responde las tres preguntas obligatorias antes de continuar.",
    invalidSatisfaction:
      "Selecciona una calificación válida del 1 al 5.",
    invalidNps:
      "Selecciona una puntuación válida del 0 al 10.",
    invalidRebook:
      "Selecciona una respuesta sobre tu intención de regresar.",
    commentTooLong:
      "Tu comentario no puede superar los 2000 caracteres.",

    successTitle: "¡Gracias por compartir tu experiencia!",
    successDescription:
      "Tu opinión se registró correctamente y nos ayudará a seguir mejorando.",

    completedTitle: "Ya recibimos tu opinión",
    completedDescription:
      "Esta encuesta ya fue respondida. Gracias por dedicar unos minutos a compartir tu experiencia.",

    invalidLinkTitle: "Esta encuesta no está disponible",
    invalidLinkDescription:
      "El enlace no es válido o la encuesta ya no está disponible.",

    loadErrorTitle: "No pudimos abrir tu encuesta",
    loadErrorDescription:
      "Ocurrió un problema al cargarla. Comprueba tu conexión e inténtalo nuevamente.",

    submitError:
      "No pudimos enviar tu opinión. Inténtalo nuevamente.",
    submissionUncertain:
      "No pudimos confirmar si tu respuesta se guardó. Verifica el estado de la encuesta antes de volver a enviarla.",
    checkingStatus: "Verificando el estado de tu encuesta...",
    checkStatus: "Verificar estado",

    footer: "Experiencia de clientes con KAIRO",
  },

  settings: {
    eyebrow: "ADMINISTRACIÓN",
    title: "Configuración",
    description:
      "Administra la información y las preferencias de tu negocio.",

    businessSection: "Información del negocio",
    businessDescription:
      "Consulta y mantén actualizados los datos de tu negocio.",

    businessName: "Nombre del negocio",
    industry: "Industria",
    email: "Correo electrónico",
    phone: "Teléfono",
    optional: "Opcional",

    edit: "Editar información",
    save: "Guardar cambios",
    saving: "Guardando cambios...",
    cancel: "Cancelar",

    savedTitle: "Cambios guardados",
    savedDescription:
      "La información del negocio se actualizó correctamente.",

    requiredField: "Este campo es obligatorio.",
    invalidEmail: "Introduce un correo electrónico válido.",
    duplicateEmail:
      "Este correo electrónico ya está registrado en otro negocio.",

    loadError:
      "No pudimos cargar la información del negocio.",
    saveError:
      "No pudimos guardar los cambios. Inténtalo nuevamente.",
    permissionError:
      "No tienes permisos para modificar la información del negocio.",
    sessionExpired:
      "Tu sesión ha expirado. Inicia sesión nuevamente.",

    ownerOnly:
      "Solo el propietario del negocio puede modificar esta información.",
    noChanges: "No hay cambios pendientes.",
    unsavedChanges:
      "Tienes cambios sin guardar. ¿Quieres descartarlos?",
  },



  language: {
    label: "Idioma",
    spanish: "Español",
    english: "Inglés",
  },
} as const;

export default es;
