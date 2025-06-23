
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
    'CREATE_TOBACCO_HISTORY',
    'UPDATE_TOBACCO_HISTORY',
    'GET_TOBACCO_HISTORY',
    'DELETE_TOBACCO_HISTORY',
];

// Generate all action types
export const TobaccoActionTypes = baseActions.reduce((acc, action) => ({
    ...acc,
    ...createActionTypes(action)
}), {});