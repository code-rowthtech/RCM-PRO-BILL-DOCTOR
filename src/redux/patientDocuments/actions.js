import { PatientDocumentsActionTypes } from "./constants";

// Helper function to create action creators
const createAction = (type: string) => (data: any): AuthAction => ({ type, data });

// Encounter actions
export const uploadPatientDocumentsAction = createAction(PatientDocumentsActionTypes.UPLOAD_DOCUMENTS);
export const updatePatientDocumentsAction = createAction(PatientDocumentsActionTypes.UPDATE_DOCUMENTS);
export const getPatientDocumentsAction = createAction(PatientDocumentsActionTypes.GET_DOCUMENTS);
export const getPatientDocumentsByIdAction = createAction(PatientDocumentsActionTypes.GET_DOCUMENTS_BY_ID);
export const deletePatientDocumentsAction = createAction(PatientDocumentsActionTypes.DELETE_DOCUMENTS);
