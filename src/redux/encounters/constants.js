
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
    'CREATE_ENCOUNTER',
    'UPDATE_ENCOUNTER',
    'GET_ENCOUNTER',
    'GET_ENCOUNTER_NOTES',
    'GET_ENCOUNTER_NOTES_FIELDS',
    'CREATE_ENCOUNTER_SETTINGS',
    'UPDATE_ENCOUNTER_SETTINGS',
    'GET_ENCOUNTER_SETTINGS',
    'GET_ENCOUNTER_BY_ID'
];

// Generate all action types
export const EncounterActionTypes = baseActions.reduce((acc, action) => ({
    ...acc,
    ...createActionTypes(action)
}), {});