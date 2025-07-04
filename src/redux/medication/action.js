import {MedicationActionTypes} from './constants'
// Helper function to create action creators
const createAction = (type: string) => (data: any): AuthAction => ({ type, data });

// Encounter actions
export const createMedicationAction = createAction(MedicationActionTypes.CREATE_MEDICATION);
export const updateMedicationAction = createAction(MedicationActionTypes.UPDATE_MEDICATION);
export const getMedicationAction = createAction(MedicationActionTypes.GET_MEDICATION);
export const getDrugsAction = createAction(MedicationActionTypes.GET_MEDICATION_DRUGS);

