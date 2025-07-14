
// Helper function to generate action types with suffixes
const createMedicationTypes = (base: string) => ({
    [base]: base,
    [`${base}_LOADING`]: `${base}_LOADING`,
    [`${base}_SUCCESS`]: `${base}_SUCCESS`,
    [`${base}_ERROR`]: `${base}_ERROR`,
    [`${base}_RESET`]: `${base}_RESET`,
});


// Base action names
const baseActions = [
    'CREATE_MEDICATION',
    'UPDATE_MEDICATION',
    'GET_MEDICATION',
    'GET_MEDICATION_DRUGS',
];

// Generate all action types
export const MedicationActionTypes = baseActions.reduce((acc, action) => ({
    ...acc,
    ...createMedicationTypes(action)
}), {});


