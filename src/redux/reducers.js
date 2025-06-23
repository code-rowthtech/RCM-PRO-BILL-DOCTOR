// @flow
import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import { getPermissionsDataReducer, createPermissionsDataReducer, deletePermissionsDataReducer, updatePermissionsDataReducer } from './permissions/reducers';
import { createRolesReducer, getRolesDataReducer, updateRolesReducer } from './roles/reducers';
import { createClinicsReducer, getClinicsReducer, getClinicByIdReducer, updateClinicsReducer } from './clinics/reducers';
import { getCitiesReducer, getDoctorsReducer, getStatesReducer, UpdateDoctorsReducer } from './doctors/reducers';
import { getAnalyticsReducer } from './dashboard/reducers';
import { createPatientsReducer, createReferringDoctorReducer, createResponsiblePartyReducer, getPatientsByIdReducer, getPatientsReducer, updatePatientsReducer } from './patients/reducers';
import { getSubscriptionsReducer } from './subscriptions/reducers';
import { createHolidayScheduleReducer, createScheduleReducer, deleteHolidayScheduleReducer, getHolidayScheduleReducer, getScheduleReducer, updateScheduleReducer } from './schedule/reducers';
import { createVitalsReducer, getVitalsByPatientIdReducer, getVitalsReducer, updateVitalsReducer } from './vitals/reducers';
import { createAppointmentsReducer, getAllAppointmentsReducer, getAppointmentByPatientProviderReducer, getAppointmentDetailsReducer, getAppointmentsReducer, getPractitionerAvailabilityReducer, updateAppointmentDetailsReducer } from './appointments/reducers';
import { createAllergyReducer, createProblemReducer, createTaskReducer, getAllergiesOfAPatientReducer, getAllergyDetailsReducer, getClinicEmployeesReducer, getPatientAppointmentsReducer, getPatientProblemsReducer, getProblemDetailsReducer, getSearchCodesReducer, getTaskDetailsReducer, getTaskReducer, updateAllergyReducer, updateProblemReducer, updateTaskReducer } from './clinicNotes/reducers';
import { createEncounterReducer, createEncounterSettingsReducer, getEncounterByIdReducer, getEncounterNotesFieldsReducer, getEncounterNotesTypeReducer, getEncounterReducer, getEncounterSettingsReducer, updateEncounterReducer, updateEncounterSettingsReducer } from './encounters/reducers';
import { createAllergiesReducer, deleteAllergiesReducer, getAllergiesReducer, getAllergyByIdReducer, getFoodAllergiesReducer, updateAllergiesReducer } from './allergies/reducers';
import { createTobaccoReducer, deleteTobaccoReducer, getTobaccoReducer, updateTobaccoReducer } from './tobacco/reducers';

export default (combineReducers({
    Auth,
    Layout,
    createPermissionsDataReducer, getPermissionsDataReducer, deletePermissionsDataReducer, updatePermissionsDataReducer,
    createRolesReducer, getRolesDataReducer, updateRolesReducer,
    createClinicsReducer, getClinicsReducer, getClinicByIdReducer, updateClinicsReducer,
    getAnalyticsReducer,
    getDoctorsReducer, getStatesReducer, getCitiesReducer, UpdateDoctorsReducer,
    getPatientsReducer, createPatientsReducer, getPatientsByIdReducer, updatePatientsReducer, createReferringDoctorReducer, createResponsiblePartyReducer,
    getSubscriptionsReducer,
    createHolidayScheduleReducer, getHolidayScheduleReducer, deleteHolidayScheduleReducer, createScheduleReducer, getScheduleReducer, updateScheduleReducer,
    createVitalsReducer, updateVitalsReducer, getVitalsReducer, getVitalsByPatientIdReducer,
    createAppointmentsReducer, getAppointmentsReducer, getAllAppointmentsReducer, getAppointmentByPatientProviderReducer,
    getClinicEmployeesReducer, createTaskReducer, getTaskReducer, updateTaskReducer, getTaskDetailsReducer,
    createProblemReducer, getPatientProblemsReducer, updateProblemReducer, getProblemDetailsReducer, getSearchCodesReducer, getPatientAppointmentsReducer, getPractitionerAvailabilityReducer,
    getAppointmentDetailsReducer, updateAppointmentDetailsReducer,
    createAllergyReducer, getAllergyDetailsReducer, getAllergiesOfAPatientReducer, updateAllergyReducer,
    // Encounters
    createEncounterReducer, updateEncounterReducer, getEncounterReducer, getEncounterNotesTypeReducer, getEncounterNotesFieldsReducer, createEncounterSettingsReducer,
    updateEncounterSettingsReducer, getEncounterSettingsReducer, getEncounterByIdReducer,
    // ALLERGIES
    createAllergiesReducer, updateAllergiesReducer, getAllergiesReducer, deleteAllergiesReducer, getAllergyByIdReducer, getFoodAllergiesReducer,
    // TOBACCO HISTORY
    createTobaccoReducer, getTobaccoReducer, updateTobaccoReducer, deleteTobaccoReducer
}): any);
