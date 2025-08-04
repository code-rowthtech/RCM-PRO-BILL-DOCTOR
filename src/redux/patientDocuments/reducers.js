import { PatientDocumentsActionTypes } from './constants';

// Common initial state
const INITIAL_STATE = {
    data: [],
    loading: false,
};

// Generic reducer factory
const createReducer = (actionPrefix: string, hasReset = false) =>
    (state = INITIAL_STATE, action: any) => {
        switch (action.type) {
            case PatientDocumentsActionTypes[`${actionPrefix}_LOADING`]:
                return { ...state, loading: true };

            case PatientDocumentsActionTypes[`${actionPrefix}_SUCCESS`]:
                return { data: action.payload, loading: false };

            case PatientDocumentsActionTypes[`${actionPrefix}_ERROR`]:
                return { data: action.payload, loading: false };

            case hasReset ? PatientDocumentsActionTypes[`${actionPrefix}_RESET`] : null:
                return hasReset ? INITIAL_STATE : state;

            default:
                return state;
        }
    };

// Export all reducers
export const uploadDocumentsReducer = createReducer('UPLOAD_DOCUMENTS', true);
export const updateDocumentsReducer = createReducer('UPDATE_DOCUMENTS', true);
export const getDocumentsReducer = createReducer('GET_DOCUMENTS');
export const getDocumentsByIdReducer = createReducer('GET_DOCUMENTS_BY_ID');
export const deleteDocumentsReducer = createReducer('DELETE_DOCUMENTS', true);