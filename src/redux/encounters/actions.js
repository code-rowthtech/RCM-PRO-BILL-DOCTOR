import { EncounterActionTypes } from "./constants";

// Helper function to create action creators
const createAction = (type: string) => (data: any): AuthAction => ({ type, data });

// Encounter actions
export const createEncounterAction = createAction(EncounterActionTypes.CREATE_ENCOUNTER);
export const updateEncounterAction = createAction(EncounterActionTypes.UPDATE_ENCOUNTER);
export const getEncounterAction = createAction(EncounterActionTypes.GET_ENCOUNTER);
export const getEncounterNotesTypeAction = createAction(EncounterActionTypes.GET_ENCOUNTER_NOTES);
export const getEncounterNotesFieldsAction = createAction(EncounterActionTypes.GET_ENCOUNTER_NOTES_FIELDS);
export const getEncounterByIdAction = createAction(EncounterActionTypes.GET_ENCOUNTER_BY_ID);

// Encounter settings actions
export const createEncounterSettingsAction = createAction(EncounterActionTypes.CREATE_ENCOUNTER_SETTINGS);
export const updateEncounterSettingsAction = createAction(EncounterActionTypes.UPDATE_ENCOUNTER_SETTINGS);
export const getEncounterSettingsAction = createAction(EncounterActionTypes.GET_ENCOUNTER_SETTINGS);