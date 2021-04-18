import {GET_WORDS_BY_GROUP} from "./action_types";
import axios from "axios";
import {BASE_URL} from "../../config";

export const syncGetWords = (value) => {
    return {
        type: GET_WORDS_BY_GROUP,
        value
    }
}

export const asyncGetWords = (group, page) => {
    return async dispatch => {
        const response = await axios.get(`${BASE_URL}words?page=${page - 1}&group=${group - 1}`)
        dispatch(syncGetWords(response.data))
    }
}
