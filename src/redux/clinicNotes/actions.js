// @flow
import { ClinicNotesActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };

export const getClinicEmployeesAction = (data): AuthAction => ({
    type: ClinicNotesActionTypes.GET_CLINIC_EMPLOYEES,
    data
});

export const createTaskAction = (data): AuthAction => ({
    type: ClinicNotesActionTypes.CREATE_TASK,
    data
});

export const getTaskAction = (data): AuthAction => ({
    type: ClinicNotesActionTypes.GET_TASK,
    data
});

export const updateTaskAction = (data): AuthAction => ({
    type: ClinicNotesActionTypes.UPDATE_TASK,
    data
});

export const getTaskDetailsAction = (data): AuthAction => ({
    type: ClinicNotesActionTypes.GET_TASK_DETAILS,
    data
});

export const createProblemAction = (data): AuthAction => ({
    type: ClinicNotesActionTypes.CREATE_PROBLEM,
    data
});

export const getPatientProblemsAction = (data): AuthAction => ({
    type: ClinicNotesActionTypes.GET_PATIENT_PROBLEMS,
    data
});

export const updateProblemAction = (data): AuthAction => ({
    type: ClinicNotesActionTypes.UPDATE_PROBLEM,
    data
});

export const getProblemDetailsAction = (data): AuthAction => ({
    type: ClinicNotesActionTypes.GET_PROBLEM_DETAILS,
    data
});

export const getSearchCodesAction = (data): AuthAction => ({
    type: ClinicNotesActionTypes.GET_SEARCH_CODES,
    data
});

export const getPatientAppointmentsAction = (data): AuthAction => ({
    type: ClinicNotesActionTypes.GET_PATIENT_APPOINTMENTS,
    payload: data
});