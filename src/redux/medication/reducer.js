import { MedicationActionTypes } from './constants';

// Common initial state
const INITIAL_STATE = {
    data: [],
    loading: false,
};

// Generic reducer factory
const createReducer = (actionPrefix: string, hasReset = false) =>
    (state = INITIAL_STATE, action: any) => {
        switch (action.type) {
            case MedicationActionTypes[`${actionPrefix}_LOADING`]:
                return { ...state, loading: true };

            case MedicationActionTypes[`${actionPrefix}_SUCCESS`]:
                return { data: action.payload, loading: false };

            case MedicationActionTypes[`${actionPrefix}_ERROR`]:
                return { data: action.payload, loading: false };

            case hasReset ? MedicationActionTypes[`${actionPrefix}_RESET`] : null:
                return hasReset ? INITIAL_STATE : state;

            default:
                return state;
        }
    };

// Export all reducers
export const createMedicationReducer = createReducer('CREATE_MEDICATION', true);
export const updateMedicationReducer = createReducer('UPDATE_MEDICATION', true);
export const deleteMedicationReducer = createReducer('DELETE_MEDICATION', true);
export const getMedicationReducer = createReducer('GET_MEDICATION');
export const getDrugsReducer = createReducer('GET_MEDICATION_DRUGS');




