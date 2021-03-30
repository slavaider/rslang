import {CLEAR_ERROR, SET_ERROR, SET_LOADING} from "../actions/action_types";

const InitialState = {
    loading: false,
    error: null
}

export default function Loading(state = InitialState, action) {
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
        case CLEAR_ERROR: {
            return {
                ...state,
                error: null
            }
        }
        default:
            return state
    }
};
