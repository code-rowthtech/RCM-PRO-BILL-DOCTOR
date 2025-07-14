
// Helper function to generate action types with suffixes
const createProblemTypes = (base: string) => ({
    [base]: base,
    [`${base}_LOADING`]: `${base}_LOADING`,
    [`${base}_SUCCESS`]: `${base}_SUCCESS`,
    [`${base}_ERROR`]: `${base}_ERROR`,
    [`${base}_RESET`]: `${base}_RESET`,
});


// Base action names
const baseActions = [
    'CREATE_PROBLEMS',
    'UPDATE_PROBLEMS',
    'GET_PROBLEMS',
    'DELETE_PROBLEMS',
    'GET_PROBLEM_BY_ID',
    'ALL_CODES',
    'GET_PATIENT_APPOINTMENTS',
];

// Generate all action types
export const ProblemsActionTypes = baseActions.reduce((acc, action) => ({
    ...acc,
    ...createProblemTypes(action)
}), {});