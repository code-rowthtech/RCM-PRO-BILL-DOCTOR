import { SuggestionsListActionTypes } from "./constant";

// Helper function to create action creators
const createAction = (type) => (data) => ({ type, data });

// Suggestion actions
export const createSuggestionAction = createAction(SuggestionsListActionTypes.CREATE_SUGGESTION);