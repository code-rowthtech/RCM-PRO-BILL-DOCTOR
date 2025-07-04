import {ProblemsActionTypes} from './constants'
// Helper function to create action creators
const createAction = (type: string) => (data: any): AuthAction => ({ type, data });

// Encounter actions
export const createProblemsAction = createAction(ProblemsActionTypes.CREATE_PROBLEMS);
export const updateProblemsAction = createAction(ProblemsActionTypes.UPDATE_PROBLEMS);
export const getProblemsAction = createAction(ProblemsActionTypes.GET_PROBLEMS);
export const deleteProblemsAction = createAction(ProblemsActionTypes.DELETE_PROBLEMS);
export const getProblemById = createAction(ProblemsActionTypes.GET_PROBLEM_BY_ID);
export const getAllCodesAction = createAction(ProblemsActionTypes.ALL_CODES);
export const getPatientAppointmentsAllAction = createAction(ProblemsActionTypes.GET_PATIENT_APPOINTMENTS);
