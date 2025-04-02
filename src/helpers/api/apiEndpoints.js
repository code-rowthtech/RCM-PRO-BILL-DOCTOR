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
export const createAllergy = '/api/v1/doctor/addAllergy';
export const getAllergyDetails = '/api/v1/doctor/getAllergyDetails';
export const getAllergiesOfAPatient = '/api/v1/doctor/getAllergiesOfAPatient';
export const updateAllergy = '/api/v1/doctor/updateAllergy';

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
export const getPractitionerAvailability ='/api/v1/practitioner/appointment/practitionerAvailability';
export const getAppointmentDetails ='/api/v1/practitioner/appointment/details';
export const updateAppointmentDetails='/api/v1/practitioner/appointment/update';

