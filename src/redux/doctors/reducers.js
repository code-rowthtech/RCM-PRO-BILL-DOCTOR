import { DoctorsActionTypes } from "./constants"


const GET_DOCTORS_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_CITIES_INITIAL_STATE = {
    cities1: {
        data: [],
        loading: false,
    },
    cities2: {
        data: [],
        loading: false,
    }
};

export const getDoctorsReducer = (state = GET_DOCTORS_INITIAL_STATE, action) => {
    switch (action.type) {
        case DoctorsActionTypes.GET_DOCTORS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case DoctorsActionTypes.GET_DOCTORS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case DoctorsActionTypes.GET_DOCTORS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case DoctorsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
};

export const getCitiesReducer = (state = GET_CITIES_INITIAL_STATE, action) => {
    switch (action.type) {
        case DoctorsActionTypes.GET_CITIES_LOADING:
            return {
                ...state,
                cities1: {
                    ...state.cities1,
                    loading: true
                }
            };
        case DoctorsActionTypes.GET_CITIES_SUCCESS:
            return {
                ...state,
                cities1: {
                    data: action.payload,
                    loading: false
                }
            };
        case DoctorsActionTypes.GET_CITIES_ERROR:
            return {
                ...state,
                cities1: {
                    data: [],
                    loading: false
                }
            };
        case DoctorsActionTypes.GET_CITIES2_LOADING:
            return {
                ...state,
                cities2: {
                    ...state.cities2,
                    loading: true
                }
            };
        case DoctorsActionTypes.GET_CITIES2_SUCCESS:
            return {
                ...state,
                cities2: {
                    data: action.payload,
                    loading: false
                }
            };
        case DoctorsActionTypes.GET_CITIES2_ERROR:
            return {
                ...state,
                cities2: {
                    data: [],
                    loading: false
                }
            };
        default:
            return state;
    }
};


