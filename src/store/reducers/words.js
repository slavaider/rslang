import {CREATE_USER_WORD, DELETE_USER_WORD, GET_USER_WORDS, UPDATE_USER_WORD,} from "../actions/action_types";

const InitialState = {
    learning: [],
    deleted: [],
    hard: []
}

export default function Words(state = InitialState, action) {
    switch (action.type) {
        case CREATE_USER_WORD: {
            if (action.wordType === 'learn') {
                return {
                    ...state,
                    learning: [...state.learning, action.word],
                }
            }
            if (action.wordType === 'hard') {
                return {
                    ...state,
                    learning: [...state.learning, action.word],
                    hard: [...state.hard, action.word],
                }
            }
            if (action.wordType === 'delete') {
                return {
                    ...state,
                    deleted: [...state.deleted, action.word],
                }
            }
            break
        }
        case UPDATE_USER_WORD: {
            if (action.wordType === 'delete') {
                return {
                    ...state,
                    hard: state.hard.filter((item) => item.wordId !== action.word.wordId),
                    learning: state.learning.filter((item) => item.wordId !== action.word.wordId),
                    deleted: [...state.deleted, action.word],
                }
            }
            return {...state}
        }
        case DELETE_USER_WORD: {
            if (action.wordType === 'hard') {
                return {
                    ...state,
                    hard: state.hard.filter((item) => item.wordId !== action.wordId),
                    learning: state.learning.filter((item) => item.wordId !== action.wordId),
                }
            }
            if (action.wordType === 'delete') {
                return {
                    ...state,
                    deleted: state.deleted.filter((item) => item.wordId !== action.wordId)
                }
            }
            break
        }
        case GET_USER_WORDS: {
            return {
                learning: [...action.hard, ...action.learning],
                deleted: action.deleted,
                hard: action.hard,
            }
        }

        default:
            return state
    }
};
