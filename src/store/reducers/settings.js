import {GET_SETTINGS, SET_ACTIONS, SET_TRANSLATE} from "../actions/action_types";

const InitialState = {
    translate: true,
    actions: true
}

export default function Settings(state = InitialState, action) {
    switch (action.type) {
        case SET_TRANSLATE: {
            return {
                ...state,
                translate: action.value,
            }
        }
        case SET_ACTIONS: {
            return {
                ...state,
                actions: action.value,
            }
        }
        case GET_SETTINGS: {
            return {
                translate: action.data.translate,
                actions: action.data.actions,
            }
        }

        default:
            return state
    }
};

