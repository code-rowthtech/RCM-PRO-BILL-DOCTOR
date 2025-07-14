// @flow
import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import { getPermissionsDataReducer, createPermissionsDataReducer, deletePermissionsDataReducer, updatePermissionsDataReducer } from './permissions/reducers';
import { createRolesReducer, getRolesDataReducer, updateRolesReducer } from './roles/reducers';
import { createClinicsReducer, getClinicsReducer, getClinicByIdReducer, updateClinicsReducer } from './clinics/reducers';
import { getAllDoctorsReducer, getCitiesReducer, getDoctorsReducer, getStatesReducer, UpdateDoctorsReducer } from './doctors/reducers';
import { getAnalyticsReducer } from './dashboard/reducers';
import { createPatientsReducer, createReferringDoctorReducer, createResponsiblePartyReducer, getPatientsByIdReducer, getPatientsReducer, updatePatientsReducer } from './patients/reducers';
import { getSubscriptionsReducer } from './subscriptions/reducers';
import { createHolidayScheduleReducer, createScheduleReducer, deleteHolidayScheduleReducer, getHolidayScheduleReducer, getScheduleReducer, updateScheduleReducer } from './schedule/reducers';
import { createVitalsReducer, getVitalsByPatientIdReducer, getVitalsReducer, updateVitalsReducer } from './vitals/reducers';
import { createAppointmentsReducer, getAllAppointmentsReducer, getAppointmentByPatientProviderReducer, getAppointmentDetailsReducer, getAppointmentsReducer, getPractitionerAvailabilityReducer, updateAppointmentDetailsReducer } from './appointments/reducers';
import { createAllergyReducer, createProblemReducer, createTaskReducer, getAllergiesOfAPatientReducer, getAllergyDetailsReducer, getClinicEmployeesReducer, getPatientAppointmentsReducer, getPatientProblemsReducer, getProblemDetailsReducer, getSearchCodesReducer, getTaskDetailsReducer, getTaskReducer, updateAllergyReducer, updateProblemReducer, updateTaskReducer } from './clinicNotes/reducers';
import { createEncounterReducer, createEncounterSettingsReducer, getEncounterByIdReducer, getEncounterNotesFieldsReducer, getEncounterNotesTypeReducer, getEncounterReducer, getEncounterSettingsReducer, updateEncounterReducer, updateEncounterSettingsReducer } from './encounters/reducers';
import { createAllergiesReducer, deleteAllergiesReducer, getAllergiesReducer, getAllergyByIdReducer, getFoodAllergiesReducer, updateAllergiesReducer } from './allergies/reducers';
import { createSuggestionsReducer } from './suggestion/reducer';
import { createProblemsReducer, deleteProblemsReducer, getAllCodeReducer, getPatientAppointmentReducer, getProblemByIdReducer, getProblemsReducer, updateProblemsReducer } from './problems/reducer';
import { createMedicationReducer, getDrugsReducer, getMedicationReducer, updateMedicationReducer } from './medication/reducer';
import { createTemplateReducer, deleteTemplateReducer, getTemplateReducer, updateTemplateReducer } from './templates/reducer';
import { createNoteCategoriesReducer, createSettingsTabsReducer, getNoteCategoriesReducer, getSettingsTabsReducer, updateNoteCategoriesReducer, updateSettingsTabsReducer } from './noteCategories/reducer';
import { createUserTasksReducer, getTaskByIdReducer, getUserTasksReducer, updateUserTasksReducer } from './Tasks/reducer';
import { createMastersDataReducer, getDepartmentDataReducer, getMastersDataReducer, updateMastersDataReducer } from './settings/reducers';
import { createRoleDataReducer, getRoleDataReducer, updateRoleDataReducer } from './settings/rolesetting/reducers';
import { createAlcoholHistoryReducer, createFamilyGeneticReducer, createMedicalHistoryReducer, createSurgicalHistoryReducer, createTobaccooReducer, deleteAlcoholHistoryReducer, deleteFamilyGenticReducer, deleteMedicalHistoryReducer, deleteSurgicalHistoryReducer, deleteTobaccooReducer, getAlcoholHistoryReducer, getFamilyGeneticReducer, getMedicalHistoryReducer, getSurgicalHistoryReducer, getTobaccooReducer, updateAlcoholHistoryReducer, updateFamilyGeneticReducer, updateMedicalHistoryReducer, updateSurgicalHistoryReducer, updateTobaccooReducer } from './socialHistory/reducer';
import { getIcdProcedureReducer } from './icdCodes/reducer';

export default (combineReducers({
    Auth,
    Layout,
    createPermissionsDataReducer, getPermissionsDataReducer, deletePermissionsDataReducer, updatePermissionsDataReducer,
    createRolesReducer, getRolesDataReducer, updateRolesReducer,
    createClinicsReducer, getClinicsReducer, getClinicByIdReducer, updateClinicsReducer,
    getAnalyticsReducer,
    // Doctors Profile 
    getDoctorsReducer, getStatesReducer, getCitiesReducer, UpdateDoctorsReducer,getAllDoctorsReducer,
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
    // Socail History 
    createTobaccooReducer,deleteTobaccooReducer,updateTobaccooReducer,getTobaccooReducer,createFamilyGeneticReducer,updateFamilyGeneticReducer,getFamilyGeneticReducer,deleteFamilyGenticReducer,createSurgicalHistoryReducer,updateSurgicalHistoryReducer,deleteSurgicalHistoryReducer,getSurgicalHistoryReducer,createMedicalHistoryReducer,getMedicalHistoryReducer,updateMedicalHistoryReducer,deleteMedicalHistoryReducer,createAlcoholHistoryReducer,updateAlcoholHistoryReducer,deleteAlcoholHistoryReducer,getAlcoholHistoryReducer,
    // suggestions
    createSuggestionsReducer,
    // Problems
    createProblemsReducer, updateProblemsReducer,deleteProblemsReducer,getProblemByIdReducer,getAllCodeReducer, getProblemsReducer,getPatientAppointmentReducer,
    // medication
    createMedicationReducer,updateMedicationReducer,getMedicationReducer,getDrugsReducer,
    // notesCategories
    createNoteCategoriesReducer,getNoteCategoriesReducer,updateNoteCategoriesReducer,getSettingsTabsReducer,createSettingsTabsReducer,updateSettingsTabsReducer,
    // notesTEmplates
    createTemplateReducer,updateTemplateReducer,deleteTemplateReducer,getTemplateReducer,
    // Tasks
    createUserTasksReducer,updateUserTasksReducer,getUserTasksReducer,getTaskByIdReducer,
    // icdCodes
    getIcdProcedureReducer,
    // settings
    createMastersDataReducer,getMastersDataReducer,getDepartmentDataReducer,updateMastersDataReducer,createRoleDataReducer,getRoleDataReducer,updateRoleDataReducer,

}): any);
