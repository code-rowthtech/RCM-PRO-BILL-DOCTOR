// Helper function to generate action types with suffixes
const createActionTypes = (base: string) => ({
    [base]: base,
    [`${base}_LOADING`]: `${base}_LOADING`,
    [`${base}_SUCCESS`]: `${base}_SUCCESS`,
    [`${base}_ERROR`]: `${base}_ERROR`,
    [`${base}_RESET`]: `${base}_RESET`,
});


// Base action names
const baseActions = [
    'CREATE_SUGGESTION',
];

// Generate all action types
export const SuggestionsListActionTypes = baseActions.reduce((acc, action) => ({
    ...acc,
    ...createActionTypes(action)
}), {});