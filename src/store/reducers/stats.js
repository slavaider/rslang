import {GET_STATS, SET_STATS} from "../actions/action_types";


const InitialState = {
    statistic: null
}

export default function Stats(state = InitialState, action) {
    switch (action.type) {
        case GET_STATS: {
            return {
                statistic: action.value
            }
        }
        case SET_STATS: {
            return {
                statistic: action.value
            }
        }
        default:
            return state
    }
};
