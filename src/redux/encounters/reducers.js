import { EncounterActionTypes } from './constants';

// Common initial state
const INITIAL_STATE = {
    data: [],
    loading: false,
};

// Generic reducer factory
const createReducer = (actionPrefix: string, hasReset = false) =>
    (state = INITIAL_STATE, action: any) => {
        switch (action.type) {
            case EncounterActionTypes[`${actionPrefix}_LOADING`]:
                return { ...state, loading: true };

            case EncounterActionTypes[`${actionPrefix}_SUCCESS`]:
                return { data: action.payload, loading: false };

            case EncounterActionTypes[`${actionPrefix}_ERROR`]:
                return { data: action.payload, loading: false };

            case hasReset ? EncounterActionTypes[`${actionPrefix}_RESET`] : null:
                return hasReset ? INITIAL_STATE : state;

            default:
                return state;
        }
    };

// Export all reducers
export const createEncounterReducer = createReducer('CREATE_ENCOUNTER', true);
export const updateEncounterReducer = createReducer('UPDATE_ENCOUNTER', true);
export const getEncounterReducer = createReducer('GET_ENCOUNTER');
export const getEncounterNotesTypeReducer = createReducer('GET_ENCOUNTER_NOTES');
export const getEncounterNotesFieldsReducer = createReducer('GET_ENCOUNTER_NOTES_FIELDS');
export const createEncounterSettingsReducer = createReducer('CREATE_ENCOUNTER_SETTINGS', true);
export const updateEncounterSettingsReducer = createReducer('UPDATE_ENCOUNTER_SETTINGS', true);
export const getEncounterSettingsReducer = createReducer('GET_ENCOUNTER_SETTINGS');
export const getEncounterByIdReducer = createReducer('GET_ENCOUNTER_BY_ID');