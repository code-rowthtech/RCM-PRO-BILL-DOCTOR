// @flow
import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import { getPermissionsDataReducer, createPermissionsDataReducer, deletePermissionsDataReducer, updatePermissionsDataReducer } from './permissions/reducers';
import { createRolesReducer, getRolesDataReducer, updateRolesReducer } from './roles/reducers';
import { createClinicsReducer, getClinicsReducer, getClinicByIdReducer, updateClinicsReducer } from './clinics/reducers';
import { getDoctorsReducer } from './doctors/reducers';
import { getAnalyticsReducer } from './dashboard/reducers';
import { createPatientsReducer, getPatientsByIdReducer, getPatientsReducer } from './patients/reducers';
import { getSubscriptionsReducer } from './subscriptions/reducers';
import { createHolidayScheduleReducer, getHolidayScheduleReducer } from './schedule/reducers';
export default (combineReducers({
    Auth,
    Layout,
    createPermissionsDataReducer, getPermissionsDataReducer, deletePermissionsDataReducer, updatePermissionsDataReducer,
    createRolesReducer, getRolesDataReducer, updateRolesReducer,
    createClinicsReducer, getClinicsReducer, getClinicByIdReducer, updateClinicsReducer,
    getAnalyticsReducer,
    getDoctorsReducer,
    getPatientsReducer,createPatientsReducer,getPatientsByIdReducer,
    getSubscriptionsReducer,
    createHolidayScheduleReducer,getHolidayScheduleReducer,
}): any);
