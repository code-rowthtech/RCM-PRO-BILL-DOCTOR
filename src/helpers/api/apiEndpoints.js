const BaseRoute = 'api/v1/practitioner';

export const addPermissions = '/api/v1/permisssions';
export const getPermissions = '/api/v1/permisssions';
export const deletePermissions = '/api/v1/permisssions/delete';
export const updatePermissions = '/api/v1/permisssions';

// ROLES
export const createRoles = '/api/v1/roles/create';
export const updateRoles = '/api/v1/roles/edit';
export const getRoles = '/api/v1/roles';

// CLINIC
export const createClinic = '/api/v1/admin/users/create';
export const updateClinic = '/api/v1/admin/users/edit';
export const getClinic = '/api/v1/clinics';
export const getClinicById = '/api/v1/clinic/byId';

// DOCTORS
export const getPractitioner = '/api/v1/practitioner/Details';
export const getCityByState = '/api/v1/doctor/cities/';
export const getStatedByCountry = '/api/v1/doctor/states/US';
export const updatePractitioner = '/api/v1/practitioner/update';
export const getAllDoctor = `${BaseRoute}/list`;

// VITALS
export const createVitals = '/api/v1/practitioner/vitals';
export const updateVitals = '/api/v1/practitioner/vitals';
export const getVitals = '/api/v1/practitioner/getAllVitals';
export const getVitalsByPatientId = '/api/v1/practitioner/vitals/patient';
export const getVitalsByAppointmentId = '/api/v1/practitioner/vitalsByAppointmentId';


// PATIENTS
export const getPatients = '/api/v1/doctor/get-patients';
export const getPatientsById = '/api/v1/doctor/patient/by/id';
export const createPatients = '/api/v1/doctor/Patient/add';
export const updatePatients = '/api/v1/doctor/Patient/update';
export const createReferringDoctor = '/api/v1/doctor/add/referringDoc';
export const createResponsibleParty = '/api/v1/doctor/Patient/responsible-party';
export const getPatientConsents = '/api/v1/practitioner/consent-documents';

// CLINIC NOTES
export const getClinicEmployees = '/api/v1/doctor/getClinicEmployees';
export const createTask = '/api/v1/doctor/createTask';
export const getAllTasks = '/api/v1/doctor/getAllTasks';
export const updateTask = '/api/v1/doctor/updateTask';
export const getTaskDetails = '/api/v1/doctor/getTaskDetails';
export const createProblem = '/api/v1/doctor/createProblem';
export const getPatientProblems = '/api/v1/doctor/getPatientProblems';
export const updateProblems = '/api/v1/doctor/updateProblems';
export const getProblemDetails = '/api/v1/doctor/getProblemDetails';
export const getSearchCodes = '/api/v1/doctor/searchCodes';
export const getPatientAppointments = '/api/v1/doctor/getPatientAppointments';

// DASHBOARD
export const getAnalytics = '/api/v1/admin/analytics';

// SUBSCRIPTIONS
export const getSubscriptions = '/api/v1/admin/subscription/all'

// SCHEDULE
export const createHoliday = '/api/v1/practitioner/holiday/create';
export const getHoliday = '/api/v1/practitioner/holidays';
export const deleteHoliday = '/api/v1/practitioner/holiday/delete';
export const createSchedule = '/api/v1/practitioner/schedule/create';
export const updateSchedule = '/api/v1/practitioner/schedule/update';
export const getSchedule = '/api/v1/practitioner/schedule';

// APPOINTMENTS
export const createAppointments = '/api/v1/practitioner/appointment/create';
export const getAppointments = '/api/v1/practitioner/appointment/list';
export const getAllAppointments = '/api/v1/doctor/getPatientsByAppointments';
export const getPractitionerAvailability = '/api/v1/practitioner/appointment/practitionerAvailability';
export const getAppointmentDetails = '/api/v1/practitioner/appointment/details';
export const updateAppointmentDetails = '/api/v1/practitioner/appointment/update';
export const getAppointmentByPateintProvider = '/api/v1/practitioner/appointment/by-patient-provider'
export const getAppointmentByPateintId = '/api/v1/practitioner/appointment/by-patient'

// Encounter
export const encounter = `${BaseRoute}/encounter`;
export const encounterSettings = `${BaseRoute}/encounter-menu-settings`;
export const encounterNotesType = `${BaseRoute}/notes-type/encounter-based`;
export const encounterNoteFields = `${BaseRoute}/notes-type-settings`;

// Suggestions
export const createSuggestions = `${BaseRoute}/suggestions`;

// Allergies
export const allergy = `${BaseRoute}/allergy`;
export const foodAllergy = `${BaseRoute}/codes/food-allergies/search`;

// Problem List
export const problem = `${BaseRoute}/problem`;
export const allCodes = `${BaseRoute}/codes/search`;
export const getPatientAppointmentAll = `${BaseRoute}/appointment/by-patient`;

// NoteCategories
export const createNoteCategories = `${BaseRoute}/notes-type/`;
export const updateNoteCategories = `${BaseRoute}/notes-type/`;
export const getNoteCategories = `${BaseRoute}/notes-type/`;

// SETTING
export const addMastersData = `${BaseRoute}/masterdata`;
export const getMastersData = `${BaseRoute}/masterdata`;
export const getDepartmentData = `${BaseRoute}/masterdata`;
export const updateMastersData = `${BaseRoute}/masterdata`;
export const addRoleData = `${BaseRoute}/roles/create`;
export const getRoleData = `${BaseRoute}/getAllRoles`;
export const updateRoleData = `${BaseRoute}/roles/edit`;

// SettingsNotes
export const createnoteTypeSettings = `${BaseRoute}/notes-type-settings/`;

// Template
export const templates = `${BaseRoute}/notes-templates`;

// TASKS
export const tasks = `${BaseRoute}/users/tasks`;

// icde code 
export const icdProcedures = `${BaseRoute}/codes/pcs`;

// Social History
export const tobaccoHistory = `${BaseRoute}/patient/tobacco`;

// Tobaccoo
export const createTobaccoo = `${BaseRoute}/patient/tobacco`;
export const deleteTobaccoo = `${BaseRoute}/patient/tobacco`;
export const updateTobacco = `${BaseRoute}/patient/tobacco`;
export const getTobaccoo = `${BaseRoute}/patient/tobacco`;

// Medication
export const medication = `${BaseRoute}/medication-request`;
export const getMedicationDrugs = `${BaseRoute}/codes/search-ndc-products`;

// Family/Genetic
export const createFamily = `${BaseRoute}/familyMedicalHistory`;
export const updateFamily = `${BaseRoute}/familyMedicalHistory`;
export const getFamily = `${BaseRoute}/familyMedicalHistory`;
export const deleteFamily = `${BaseRoute}/familyMedicalHistory`;

// Surgical 
export const createSurgicalHistory = `${BaseRoute}/surgicalHistory`;
export const updateSurgicalHistory = `${BaseRoute}/surgicalHistory`;
export const getSurgicalHistory = `${BaseRoute}/surgicalHistory`;
export const deleteSurgicalHistory = `${BaseRoute}/surgicalHistory`;

// ALCOHOL HISTORY
export const alcoholHistory = `${BaseRoute}/alcoholHistory`;

// Surgical 
export const createMedicalHistory = `${BaseRoute}/patient/medicalHistory`;
export const updateMedicalHistory = `${BaseRoute}/patient/medicalHistory`;
export const getMedicalHistory = `${BaseRoute}/patient/medicalHistory`;
export const deleteMedicalHistory = `${BaseRoute}/patient/medicalHistory`;

// Documents
export const patientDocuments = `${BaseRoute}/documents`;