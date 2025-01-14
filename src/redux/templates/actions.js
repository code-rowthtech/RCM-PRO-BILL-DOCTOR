// @flow
import { TemplateActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const getTemplateAction = (data): AuthAction => ({
    type: TemplateActionTypes.GET_TEMPLATE,
    data
});

export const stateEmptydAction = (): LayoutAction => ({
    type: TemplateActionTypes.STATE_EMPTY_INTIAL_STATE,

});