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

// VITALS
export const createVitals = '/api/v1/doctor/addVitals';
export const updateVitals = '/api/v1/doctor/updateVitals';
export const getVitals = '/api/v1/doctor/getAllVitals';
export const getVitalsByPatientId = '/api/v1/doctor/vitalsByPatientId';
export const getVitalsByAppointmentId = '/api/v1/doctor/vitalsByAppointmentId';


// PATIENTS
export const getPatients = '/api/v1/doctor/getPatientByDoctorId';
export const getPatientsById = '/api/v1/doctor/patient-getById';
export const createPatients = '/api/v1/doctor/patient-onboard';
export const updatePatients = '/api/v1/doctor/patient-edit';

// DASHBOARD
export const getAnalytics = '/api/v1/admin/analytics';
// SUBSCRIPTIONS
export const getSubscriptions = '/api/v1/admin/subscription/all'
// SCHEDULE
export const createHoliday = '/api/v1/doctor/addOrUpdateSchedule';
export const getHoliday = '/api/v1/doctor/getSchedule';

// APPOINTMENTS
export const createAppointments = '/api/v1/doctor/appointments';
export const getAppointments = '/api/v1/doctor/appointment/getAll';
export const getAllAppointments = '/api/v1/doctor/getPatientsByAppointments';

