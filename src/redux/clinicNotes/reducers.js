import { ClinicNotesActionTypes } from "./constants"


const GET_CLINIC_EMPLOYEES_INITIAL_STATE = {
    data: [],
    loading: false
}

const CREATE_TASK_INITIAL_STATE = {
    data: [],
    loading: false,
}

const GET_TASK_INITIAL_STATE = {
    data: [],
    loading: false,
}

const UPDATE_TASK_INITIAL_STATE = {
    data: [],
    loading: false,
}

const GET_TASK_DETAILS_INITIAL_STATE = {
    data: [],
    loading: false,
}

const CREATE_PROBLEM_INITIAL_STATE = {
    data: [],
    loading: false,
}

const GET_PATIENT_PROBLEMS_INITIAL_STATE = {
    data: [],
    loading: false,
}

const UPDATE_PROBLEM_INITIAL_STATE = {
    data: [],
    loading: false,
}

const GET_PROBLEM_DETAILS_INITIAL_STATE = {
    data: [],
    loading: false,
}

const GET_SEARCH_CODES_INITIAL_STATE = {
    data: [],
    loading: false,
}

const GET_PATIENT_APPOINTMENTS_INITIAL_STATE = {
    data: [],
    loading: false,
}

const CREATE_ALLERGY_INITIAL_STATE = {
    data: [],
    loading: false,
}

const GET_ALLERGY_DETAILS_INITIAL_STATE = { 
    data: [],
    loading: false,
}

export const GET_ALLERGIES_OF_A_PATIENT_INITIAL_STATE = {
    data: [],
    loading: false,
}

export const UPDATE_ALLERGY_INITIAL_STATE = {
    data: [],
    loading: false,
}

export const getClinicEmployeesReducer = (state = GET_CLINIC_EMPLOYEES_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.GET_CLINIC_EMPLOYEES_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.GET_CLINIC_EMPLOYEES_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.GET_CLINIC_EMPLOYEES_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const createTaskReducer = (state = CREATE_TASK_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.CREATE_TASK_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.CREATE_TASK_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.CREATE_TASK_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getTaskReducer = (state = GET_TASK_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.GET_TASK_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.GET_TASK_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.GET_TASK_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const updateTaskReducer = (state = UPDATE_TASK_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.UPDATE_TASK_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.UPDATE_TASK_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.UPDATE_TASK_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getTaskDetailsReducer = (state = GET_TASK_DETAILS_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.GET_TASK_DETAILS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.GET_TASK_DETAILS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.GET_TASK_DETAILS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const createProblemReducer = (state = CREATE_PROBLEM_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.CREATE_PROBLEM_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.CREATE_PROBLEM_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.CREATE_PROBLEM_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getPatientProblemsReducer = (state = GET_PATIENT_PROBLEMS_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.GET_PATIENT_PROBLEMS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.GET_PATIENT_PROBLEMS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.GET_PATIENT_PROBLEMS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const updateProblemReducer = (state = UPDATE_PROBLEM_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.UPDATE_PROBLEM_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.UPDATE_PROBLEM_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.UPDATE_PROBLEM_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getProblemDetailsReducer = (state = GET_PROBLEM_DETAILS_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.GET_PROBLEM_DETAILS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.GET_PROBLEM_DETAILS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.GET_PROBLEM_DETAILS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getSearchCodesReducer = (state = GET_SEARCH_CODES_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.GET_SEARCH_CODES_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.GET_SEARCH_CODES_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.GET_SEARCH_CODES_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getPatientAppointmentsReducer = (state = GET_PATIENT_APPOINTMENTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.GET_PATIENT_APPOINTMENTS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.GET_PATIENT_APPOINTMENTS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.GET_PATIENT_APPOINTMENTS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const createAllergyReducer = (state = CREATE_ALLERGY_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.CREATE_ALLERGY_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.CREATE_ALLERGY_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.CREATE_ALLERGY_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getAllergyDetailsReducer = (state = GET_ALLERGY_DETAILS_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.GET_ALLERGY_DETAILS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.GET_ALLERGY_DETAILS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.GET_ALLERGY_DETAILS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getAllergiesOfAPatientReducer = (state = GET_ALLERGIES_OF_A_PATIENT_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.GET_ALLERGIES_OF_A_PATIENT_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.GET_ALLERGIES_OF_A_PATIENT_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.GET_ALLERGIES_OF_A_PATIENT_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const updateAllergyReducer = (state = UPDATE_ALLERGY_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.UPDATE_ALLERGY_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.UPDATE_ALLERGY_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.UPDATE_ALLERGY_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}