import {GET_WORDS_BY_GROUP} from "../actions/action_types";

const InitialState = {
    words:[]
}

export default function Book(state = InitialState, action) {
    switch (action.type) {
        case GET_WORDS_BY_GROUP:{
            return{
                words:action.value
            }
        }

        default:
            return state
    }
};
