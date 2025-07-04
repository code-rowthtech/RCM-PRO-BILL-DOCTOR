
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
    'CREATE_ALLERGIES',
    'UPDATE_ALLERGIES',
    'GET_ALLERGIES',
    'DELETE_ALLERGIES',
    'GET_ALLERGY_BY_ID',
    'GET_FOOD_ALLERGIES'
];

// Generate all action types
export const AllergiesActionTypes = baseActions.reduce((acc, action) => ({
    ...acc,
    ...createActionTypes(action)
}), {});