
export const translations = {
  en: {
    // Login page
    email: 'Email Address',
    password: 'Password',
    signIn: 'Sign In',
    signingIn: 'Signing in...',
    adminPanel: 'Admin Panel — Sign in to continue',
    
    // nav
    dashboard: 'Dashboard', doctors: 'Doctors', addDoctor: 'Add Doctor',
    appointments: 'Appointments', logout: 'Logout', adminPanel: 'Admin Panel',

    // dashboard
    welcome: 'Welcome back', goodMorning: 'Good morning',
    totalDoctors: 'Total Doctors', totalPatients: 'Total Patients',
    totalAppointments: 'Total Appointments', totalRevenue: 'Total Revenue',
    available: 'available', today: 'today', paid: 'paid',
    recentAppointments: 'Recent Appointments', upcomingToday: 'Upcoming today',
    monthlyRevenue: 'Monthly Revenue', appointmentStats: 'Appointment Statistics',
    viewAll: 'View all', noData: 'No data available',

    // doctors
    allDoctors: 'All Doctors', registered: 'registered',
    searchDoctors: 'Search doctors...', filterSpeciality: 'All Specialities',
    enable: 'Enable', disable: 'Disable', edit: 'Edit', delete: 'Delete',
    experience: 'exp.', fees: 'Fees', noDoctors: 'No doctors found',
    doctorAdded: 'Doctor added successfully',

    // add doctor
    addNewDoctor: 'Add New Doctor', addDoctorSub: 'Register a new doctor to the system',
    doctorPhoto: 'Doctor Photo', uploadPhoto: 'Click to upload', uploadHint: 'JPG or PNG, max 5MB',
    personalInfo: 'Personal Information', professionalInfo: 'Professional Details',
    fullName: 'Full Name', email: 'Email Address', password: 'Password',
    speciality: 'Speciality', degree: 'Degree / Qualification',
    experienceYrs: 'Years of Experience', feesLabel: 'Consultation Fees ($)',
    about: 'About Doctor', address: 'Clinic Address',
    addressLine1: 'Address Line 1', addressLine2: 'Address Line 2',
    cancel: 'Cancel', adding: 'Adding...', addDoctorBtn: 'Add Doctor',
    required: 'This field is required', invalidEmail: 'Invalid email',
    minPassword: 'Minimum 8 characters', minFees: 'Must be greater than 0',

    // appointments
    allAppointments: 'All Appointments', total: 'total',
    all: 'All', pending: 'Pending', completed: 'Completed', cancelled: 'Cancelled',
    patient: 'Patient', doctor: 'Doctor', date: 'Date', time: 'Time',
    amount: 'Amount', paymentStatus: 'Payment', status: 'Status', actions: 'Actions',
    noAppointments: 'No appointments found', completeBtn: 'Complete', cancelBtn: 'Cancel',
    filterDate: 'Filter by date', filterDoctor: 'Filter by doctor',

    // modal
    cancelAppt: 'Cancel Appointment',
    cancelApptMsg: 'This will release the slot back to the doctor. This action cannot be undone.',
    yesCancel: 'Yes, Cancel',

    // badges
    statusCompleted: 'Completed', statusCancelled: 'Cancelled',
    statusPending: 'Pending', statusPaid: 'Paid', statusUnpaid: 'Unpaid',
    statusActive: 'Active', statusInactive: 'Inactive',

    // toast
    error: 'Something went wrong', success: 'Done!',
    uploadImage: 'Please upload a doctor photo',
  },

  fr: {
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    signIn: 'Se connecter',
    signingIn: 'Connexion...',
    adminPanel: "Panneau d'administration — Connectez-vous pour continuer",
    dashboard: 'Tableau de bord', doctors: 'Médecins', addDoctor: 'Ajouter',
    appointments: 'Rendez-vous', logout: 'Déconnexion', adminPanel: 'Panneau Admin',

    welcome: 'Bon retour', goodMorning: 'Bonjour',
    totalDoctors: 'Médecins', totalPatients: 'Patients',
    totalAppointments: 'Rendez-vous', totalRevenue: 'Revenu total',
    available: 'disponibles', today: "aujourd'hui", paid: 'payés',
    recentAppointments: 'Rendez-vous récents', upcomingToday: "Aujourd'hui",
    monthlyRevenue: 'Revenu mensuel', appointmentStats: 'Statistiques',
    viewAll: 'Voir tout', noData: 'Aucune donnée',

    allDoctors: 'Tous les médecins', registered: 'enregistrés',
    searchDoctors: 'Rechercher...', filterSpeciality: 'Toutes spécialités',
    enable: 'Activer', disable: 'Désactiver', edit: 'Modifier', delete: 'Supprimer',
    experience: 'exp.', fees: 'Honoraires', noDoctors: 'Aucun médecin trouvé',
    doctorAdded: 'Médecin ajouté avec succès',

    addNewDoctor: 'Ajouter un médecin', addDoctorSub: 'Enregistrer un nouveau médecin',
    doctorPhoto: 'Photo du médecin', uploadPhoto: 'Cliquez pour télécharger', uploadHint: 'JPG ou PNG, max 5Mo',
    personalInfo: 'Informations personnelles', professionalInfo: 'Détails professionnels',
    fullName: 'Nom complet', email: 'Adresse email', password: 'Mot de passe',
    speciality: 'Spécialité', degree: 'Diplôme', experienceYrs: 'Années d\'expérience',
    feesLabel: 'Honoraires ($)', about: 'À propos', address: 'Adresse du cabinet',
    addressLine1: 'Adresse ligne 1', addressLine2: 'Adresse ligne 2',
    cancel: 'Annuler', adding: 'Ajout...', addDoctorBtn: 'Ajouter',
    required: 'Champ requis', invalidEmail: 'Email invalide',
    minPassword: 'Minimum 8 caractères', minFees: 'Doit être supérieur à 0',

    allAppointments: 'Tous les rendez-vous', total: 'total',
    all: 'Tous', pending: 'En attente', completed: 'Terminés', cancelled: 'Annulés',
    patient: 'Patient', doctor: 'Médecin', date: 'Date', time: 'Heure',
    amount: 'Montant', paymentStatus: 'Paiement', status: 'Statut', actions: 'Actions',
    noAppointments: 'Aucun rendez-vous', completeBtn: 'Terminer', cancelBtn: 'Annuler',
    filterDate: 'Filtrer par date', filterDoctor: 'Filtrer par médecin',

    cancelAppt: 'Annuler le rendez-vous',
    cancelApptMsg: 'Le créneau sera libéré. Cette action est irréversible.',
    yesCancel: 'Oui, annuler',

    statusCompleted: 'Terminé', statusCancelled: 'Annulé',
    statusPending: 'En attente', statusPaid: 'Payé', statusUnpaid: 'Non payé',
    statusActive: 'Actif', statusInactive: 'Inactif',

    error: 'Une erreur est survenue', success: 'Succès !',
    uploadImage: 'Veuillez télécharger une photo',
  },
}