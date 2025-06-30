import { TobaccoActionTypes } from "./constants";

// Helper function to create action creators
const createAction = (type: string) => (data: any): AuthAction => ({ type, data });

// Encounter actions
export const createTobaccoAction = createAction(TobaccoActionTypes.CREATE_TOBACCO_HISTORY);
export const updateTobaccoAction = createAction(TobaccoActionTypes.UPDATE_TOBACCO_HISTORY);
export const getTobaccoAction = createAction(TobaccoActionTypes.GET_TOBACCO_HISTORY);
export const deleteTobaccoAction = createAction(TobaccoActionTypes.DELETE_TOBACCO_HISTORY);
