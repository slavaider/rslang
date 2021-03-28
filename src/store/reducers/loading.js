import {SET_ERROR, SET_LOADING} from "../actions/action_types";

const InitialState = {
    loading: false,
    error: null
}
// eslint-disable-next-line
export default function (state = InitialState, action) {
    switch (action.type) {
        case SET_LOADING: {
            return {
                ...state,
                loading: action.value
            }
        }
        case SET_ERROR: {
            return {
                ...state,
                error: action.value
            }
        }
        default:
            return state
    }
};
