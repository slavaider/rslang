import {GET_SETTINGS, SET_ACTIONS, SET_TRANSLATE} from "./action_types";
import axios from "axios";
import {BASE_URL} from "../../config";

export const setTranslate = (value) => {
    return {
        type: SET_TRANSLATE,
        value
    }
}
export const setActions = (value) => {
    return {
        type: SET_ACTIONS,
        value
    }
}
export const getSettings = (value) => {
    return {
        type: GET_SETTINGS,
        data: {...value}
    }
}

export const asyncSetTranslate = (value, id, token) => {
    return async (dispatch, getState) => {
        const state = getState()
        const response = await axios.put(`${BASE_URL}users/${id}/settings`, {
            "optional": {
                translate: value,
                actions: state.settings.actions,
            }
        }, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })

        dispatch(setTranslate(response.data.optional.translate))
    }
}
export const asyncSetActions = (value, id, token) => {
    return async (dispatch, getState) => {
        const state = getState()
        const response = await axios.put(`${BASE_URL}users/${id}/settings`, {
            "optional": {
                translate: state.settings.translate,
                actions: value
            }
        }, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        dispatch(setActions(response.data.optional.actions))
    }
}
export const asyncGetSettings = (id, token) => {
    return async dispatch => {
        const response = await axios.get(`${BASE_URL}users/${id}/settings`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
        dispatch(getSettings(response.data.optional))
    }
}
