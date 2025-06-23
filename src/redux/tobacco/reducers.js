import { TobaccoActionTypes } from './constants';

// Common initial state
const INITIAL_STATE = {
    data: [],
    loading: false,
};

// Generic reducer factory
const createReducer = (actionPrefix: string, hasReset = false) =>
    (state = INITIAL_STATE, action: any) => {
        switch (action.type) {
            case TobaccoActionTypes[`${actionPrefix}_LOADING`]:
                return { ...state, loading: true };

            case TobaccoActionTypes[`${actionPrefix}_SUCCESS`]:
                return { data: action.payload, loading: false };

            case TobaccoActionTypes[`${actionPrefix}_ERROR`]:
                return { data: action.payload, loading: false };

            case hasReset ? TobaccoActionTypes[`${actionPrefix}_RESET`] : null:
                return hasReset ? INITIAL_STATE : state;

            default:
                return state;
        }
    };

// Export all reducers
export const createTobaccoReducer = createReducer('CREATE_TOBACCO_HISTORY', true);
export const updateTobaccoReducer = createReducer('UPDATE_TOBACCO_HISTORY', true);
export const getTobaccoReducer = createReducer('GET_TOBACCO_HISTORY');
export const deleteTobaccoReducer = createReducer('DELETE_TOBACCO_HISTORY', true);