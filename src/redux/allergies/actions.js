import { AllergiesActionTypes } from "./constants";

// Helper function to create action creators
const createAction = (type: string) => (data: any): AuthAction => ({ type, data });

// Encounter actions
export const createAllergiesAction = createAction(AllergiesActionTypes.CREATE_ALLERGIES);
export const updateAllergiesAction = createAction(AllergiesActionTypes.UPDATE_ALLERGIES);
export const getAllergiesAction = createAction(AllergiesActionTypes.GET_ALLERGIES);
export const deleteAllergiesAction = createAction(AllergiesActionTypes.DELETE_ALLERGIES);
export const getAllergyById = createAction(AllergiesActionTypes.GET_ALLERGY_BY_ID);
export const getFoodAllergiesAction = createAction(AllergiesActionTypes.GET_FOOD_ALLERGIES);
