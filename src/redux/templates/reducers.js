import {TemplateActionTypes } from "./constants"


const GET_TEMPLATE_INITIAL_STATE = {
    data: [],
    loading: false
}

export const getTemplateReducer = (state = GET_TEMPLATE_INITIAL_STATE, action) => {
    switch (action.type) {
        case TemplateActionTypes.GET_TEMPLATE_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case TemplateActionTypes.GET_TEMPLATE_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case TemplateActionTypes.GET_TEMPLATE_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case TemplateActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}


