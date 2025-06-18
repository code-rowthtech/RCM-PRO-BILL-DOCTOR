export * from './auth/actions';
export * from './layout/actions';

export {
  createPermissionAction,
  getPermissionAction,
  deletePermissionAction,
  updatePermissionAction,
  stateEmptydAction as permissionStateEmptydAction
} from './permissions/actions';

export {
  createRolesAction,
  updateRolesAction,
  getRolesAction,
  stateEmptydAction as roleStateEmptydAction
} from './roles/actions';

// ✅ Replace these problem exports:
export {
  createClinicAction,
  getClinicAction,
  updateClinicAction,
  getClinicById,
  stateEmptydAction as clinicStateEmptydAction
} from './clinics/actions';

export {
  getAnalyticsAction,
  stateEmptydAction as dashboardStateEmptydAction
} from './dashboard/actions';

export {
  getDoctorsAction,
  getCitiesAction,
  getCities2Action,
  getCities3Action,
  getStatesByCountryAction,
  updateDoctorAction,
  stateEmptydAction as doctorStateEmptydAction
} from './doctors/actions';

export {
  getSubscriptionsAction,
  stateEmptydAction as subscriptionStateEmptydAction
} from './subscriptions/actions';

export {
  createHolidayScheduleAction,
  getHolidayScheduleAction,
  deleteHolidayScheduleAction,
  stateEmptydAction,
  createScheduleAction,
  updateScheduleAction,
  stateEmptydAction as scheduleStateEmptydAction
} from './schedule/actions';

export * from './patients/actions';
export * from './vitals/actions';
export * from './appointments/actions';
export * from './clinicNotes/actions';
