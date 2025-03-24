// @flow
import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import { getPermissionsDataReducer, createPermissionsDataReducer, deletePermissionsDataReducer, updatePermissionsDataReducer } from './permissions/reducers';
import { createRolesReducer, getRolesDataReducer, updateRolesReducer } from './roles/reducers';
import { createClinicsReducer, getClinicsReducer, getClinicByIdReducer, updateClinicsReducer } from './clinics/reducers';
import { getCitiesReducer, getDoctorsReducer, getStatesReducer } from './doctors/reducers';
import { getAnalyticsReducer } from './dashboard/reducers';
import { createPatientsReducer, getPatientsByIdReducer, getPatientsReducer, updatePatientsReducer } from './patients/reducers';
import { getSubscriptionsReducer } from './subscriptions/reducers';
import { createHolidayScheduleReducer, deleteHolidayScheduleReducer, getHolidayScheduleReducer } from './schedule/reducers';
import { createVitalsReducer, getVitalsByPatientIdReducer, getVitalsReducer, updateVitalsReducer } from './vitals/reducers';
import { createAppointmentsReducer, getAllAppointmentsReducer, getAppointmentsReducer } from './appointments/reducers';
import { createAllergyReducer, createProblemReducer, createTaskReducer, getAllergiesOfAPatientReducer, getAllergyDetailsReducer, getClinicEmployeesReducer, getPatientAppointmentsReducer, getPatientProblemsReducer, getProblemDetailsReducer, getSearchCodesReducer, getTaskDetailsReducer, getTaskReducer, updateAllergyReducer, updateProblemReducer, updateTaskReducer } from './clinicNotes/reducers';

export default (combineReducers({
    Auth,
    Layout,
    createPermissionsDataReducer, getPermissionsDataReducer, deletePermissionsDataReducer, updatePermissionsDataReducer,
    createRolesReducer, getRolesDataReducer, updateRolesReducer,
    createClinicsReducer, getClinicsReducer, getClinicByIdReducer, updateClinicsReducer,
    getAnalyticsReducer,
    getDoctorsReducer, getStatesReducer, getCitiesReducer,
    getPatientsReducer, createPatientsReducer, getPatientsByIdReducer, updatePatientsReducer,
    getSubscriptionsReducer,
    createHolidayScheduleReducer, getHolidayScheduleReducer, deleteHolidayScheduleReducer,
    createVitalsReducer, updateVitalsReducer, getVitalsReducer, getVitalsByPatientIdReducer,
    createAppointmentsReducer, getAppointmentsReducer, getAllAppointmentsReducer,
    getClinicEmployeesReducer, createTaskReducer, getTaskReducer, updateTaskReducer,getTaskDetailsReducer, 
    createProblemReducer, getPatientProblemsReducer, updateProblemReducer, getProblemDetailsReducer, getSearchCodesReducer, getPatientAppointmentsReducer,
    createAllergyReducer, getAllergyDetailsReducer, getAllergiesOfAPatientReducer, updateAllergyReducer,
}): any);
