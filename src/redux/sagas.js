// @flow
import { all } from 'redux-saga/effects';

import authSaga from './auth/saga';
import layoutSaga from './layout/saga';
import permissionsSaga from './permissions/saga';
import rolesSaga from './roles/saga';
import clinicsSaga from './clinics/saga';
import doctorsSaga from './doctors/saga';
import patientsSaga from './patients/saga';
import dashboardSaga from './dashboard/saga';
import subscriptionsSaga from './subscriptions/saga';
import scheduleSaga from './schedule/saga';
import vitalsSaga from './vitals/saga';
import appointmentsSaga from './appointments/saga';
import clinicNotesSaga from './clinicNotes/saga';
import encounterSaga from './encounters/saga';
import allergiesSaga from './allergies/saga';
import tobaccoSaga from './tobacco/saga';
import suggestionsListSaga from './suggestion/saga';
import problemsSaga from './problems/saga';
import medicationSaga from './medication/saga';
import templateSaga from './templates/saga';
import noteCategoriesSaga from './noteCategories/saga';
import userTasksSaga from './Tasks/saga';
import settingsSaga from './settings/saga';
import settingsRoleSaga from './settings/rolesetting/saga';
export default function* rootSaga(): any {
    yield all([authSaga(), layoutSaga(), permissionsSaga(), rolesSaga(), clinicsSaga(), doctorsSaga(), patientsSaga(), dashboardSaga(),
    subscriptionsSaga(), scheduleSaga(), vitalsSaga(), appointmentsSaga(), clinicNotesSaga(), encounterSaga(), allergiesSaga(), problemsSaga(), medicationSaga(),tobaccoSaga(),
    suggestionsListSaga(),templateSaga(),noteCategoriesSaga(),userTasksSaga(),settingsSaga(),settingsRoleSaga(),
]);
}
