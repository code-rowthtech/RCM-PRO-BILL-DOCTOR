
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
    'UPLOAD_DOCUMENTS',
    'UPDATE_DOCUMENTS',
    'GET_DOCUMENTS',
    'GET_DOCUMENTS_BY_ID',
    'DELETE_DOCUMENTS',
];

// Generate all action types
export const PatientDocumentsActionTypes = baseActions.reduce((acc, action) => ({
    ...acc,
    ...createActionTypes(action)
}), {});