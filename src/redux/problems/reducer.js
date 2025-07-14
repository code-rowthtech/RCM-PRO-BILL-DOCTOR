import { ProblemsActionTypes } from './constants';

// Common initial state
const INITIAL_STATE = {
    data: [],
    loading: false,
};

// Generic reducer factory
const createReducer = (actionPrefix: string, hasReset = false) =>
    (state = INITIAL_STATE, action: any) => {
        switch (action.type) {
            case ProblemsActionTypes[`${actionPrefix}_LOADING`]:
                return { ...state, loading: true };

            case ProblemsActionTypes[`${actionPrefix}_SUCCESS`]:
                return { data: action.payload, loading: false };

            case ProblemsActionTypes[`${actionPrefix}_ERROR`]:
                return { data: action.payload, loading: false };

            case hasReset ? ProblemsActionTypes[`${actionPrefix}_RESET`] : null:
                return hasReset ? INITIAL_STATE : state;

            default:
                return state;
        }
    };

// Export all reducers
export const createProblemsReducer = createReducer('CREATE_PROBLEMS', true);
export const updateProblemsReducer = createReducer('UPDATE_PROBLEMS', true);
export const getProblemsReducer = createReducer('GET_PROBLEMS');
export const deleteProblemsReducer = createReducer('DELETE_PROBLEMS', true);
export const getProblemByIdReducer = createReducer('GET_PROBLEM_BY_ID');
export const getAllCodeReducer = createReducer('ALL_CODES' ,true);
export const getPatientAppointmentReducer = createReducer('GET_PATIENT_APPOINTMENTS');