import { SuggestionsListActionTypes } from './constant';

// Common initial state
const INITIAL_STATE = {
    data: [],
    loading: false,
};

// Generic reducer factory
const createReducer = (actionPrefix: string, hasReset = false) =>
    (state = INITIAL_STATE, action: any) => {
        switch (action.type) {
            case SuggestionsListActionTypes[`${actionPrefix}_LOADING`]:
                return { ...state, loading: true };

            case SuggestionsListActionTypes[`${actionPrefix}_SUCCESS`]:
                return { data: action.payload, loading: false };

            case SuggestionsListActionTypes[`${actionPrefix}_ERROR`]:
                return { data: action.payload, loading: false };

            case hasReset ? SuggestionsListActionTypes[`${actionPrefix}_RESET`] : null:
                return hasReset ? INITIAL_STATE : state;
            default:
                return state;
        }
    };

// Export all reducers
export const createSuggestionsReducer = createReducer('CREATE_SUGGESTION', true);

