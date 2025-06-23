import { AllergiesActionTypes } from './constants';

// Common initial state
const INITIAL_STATE = {
    data: [],
    loading: false,
};

// Generic reducer factory
const createReducer = (actionPrefix: string, hasReset = false) =>
    (state = INITIAL_STATE, action: any) => {
        switch (action.type) {
            case AllergiesActionTypes[`${actionPrefix}_LOADING`]:
                return { ...state, loading: true };

            case AllergiesActionTypes[`${actionPrefix}_SUCCESS`]:
                return { data: action.payload, loading: false };

            case AllergiesActionTypes[`${actionPrefix}_ERROR`]:
                return { data: action.payload, loading: false };

            case hasReset ? AllergiesActionTypes[`${actionPrefix}_RESET`] : null:
                return hasReset ? INITIAL_STATE : state;

            default:
                return state;
        }
    };

// Export all reducers
export const createAllergiesReducer = createReducer('CREATE_ALLERGIES', true);
export const updateAllergiesReducer = createReducer('UPDATE_ALLERGIES', true);
export const getAllergiesReducer = createReducer('GET_ALLERGIES');
export const deleteAllergiesReducer = createReducer('DELETE_ALLERGIES', true);
export const getAllergyByIdReducer = createReducer('GET_ALLERGY_BY_ID');
export const getFoodAllergiesReducer = createReducer('GET_FOOD_ALLERGIES');