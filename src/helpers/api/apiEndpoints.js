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
export const getDoctor = '/api/v1/doctor/getDoctorDetails';
export const getCityByState = '/api/v1/doctor/cities/';
export const getStatedByCountry = '/api/v1/doctor/states/US';
export const updateDoctor = '/api/v1/doctor/updateDoctor';

// VITALS
export const createVitals = '/api/v1/doctor/addVitals';
export const updateVitals = '/api/v1/doctor/updateVitals';
export const getVitals = '/api/v1/doctor/getAllVitals';
export const getVitalsByPatientId = '/api/v1/doctor/vitalsByPatientId';
export const getVitalsByAppointmentId = '/api/v1/doctor/vitalsByAppointmentId';


// PATIENTS
export const getPatients = '/api/v1/doctor/get-patients';
export const getPatientsById = '/api/v1/doctor/patient/by/id';
export const createPatients = '/api/v1/doctor/Patient/add';
export const updatePatients = '/api/v1/doctor/Patient/update';
export const createReferringDoctor = '/api/v1/doctor/add/referringDoc';
export const createResponsibleParty = '/api/v1/doctor/Patient/responsible-party';

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

// Encounter
export const encounter = `${BaseRoute}/encounter`;
export const encounterSettings = `${BaseRoute}/encounter-menu-settings`;
export const encounterNotesType = `${BaseRoute}/notes-type/encounter-based`;
export const encounterNoteFields = `${BaseRoute}/notes-type-settings`;

// Allergies
// export const createAllergy = `${BaseRoute}/addAllergy`;
// export const updateAllergy = `${BaseRoute}/updateAllergy`;
// export const deleteAllergyList = `${BaseRoute}/deleteAllergy`;
// export const getAllergiesOfAPatient = `${BaseRoute}/allergy`;
// export const getAllergyDetails = `${BaseRoute}/getAllergyDetails`;
export const allergy = `${BaseRoute}/allergy`;
export const foodAllergy = `${BaseRoute}/codes/food-allergies/search`;
export const tobaccoHistory = `${BaseRoute}/patient/tobacco`;