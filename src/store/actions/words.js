import {CREATE_USER_WORD, DELETE_USER_WORD, GET_USER_WORDS, UPDATE_USER_WORD} from "./action_types";
import axios from "axios";
import {BASE_URL} from "../../config";


export const createWord = (type, group, value, wordId) => {
    return {
        type: CREATE_USER_WORD,
        wordType: type,
        word: {
            value,
            group,
            wordId,
            type
        }
    }
}
export const deleteWord = (type, wordId) => {
    return {
        type: DELETE_USER_WORD,
        wordType: type,
        wordId
    }
}
export const updateWord = (type, group, value, wordId) => {
    return {
        type: UPDATE_USER_WORD,
        wordType: type,
        word: {
            value,
            group,
            wordId,
            type
        }
    }
}

export const asyncCreateWord = (type, group, value, wordId, userId, token) => {
    return async dispatch => {
        // Check existing word
        const response = await axios.get(`${BASE_URL}users/${userId}/words/${wordId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            .catch(async (error) => {
                    // Create if not exist
                    if (error) {
                        await axios.post(`${BASE_URL}users/${userId}/words/${wordId}`,
                            {
                                optional: {
                                    value,
                                    type,
                                    group
                                }
                            }, {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                }
                            }
                        )
                        dispatch(createWord(type, group, value, wordId))
                        return true
                    }
                }
            )
        if (typeof response !== 'undefined') {
            // Update if exist
            await axios.put(`${BASE_URL}users/${userId}/words/${wordId}`,
                {
                    optional: {
                        value,
                        type,
                        group
                    }
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            )
            dispatch(updateWord(type, group, value, wordId))
        }
    }
}


export const asyncDeleteWord = (type, wordId, userId, token) => {
    return async dispatch => {
        await axios.delete(`${BASE_URL}users/${userId}/words/${wordId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
        dispatch(deleteWord(type, wordId))
    }
}
export const getUserWords = (learning, deleted, hard) => {
    return {
        type: GET_USER_WORDS,
        learning,
        deleted,
        hard,
    }
}
export const asyncGetUserWords = (userId, token) => {
    return async dispatch => {
        const response = await axios.get(`${BASE_URL}users/${userId}/words`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        const learning = []
        const deleted = []
        const hard = []
        response.data.forEach((item) => {
            if (item.optional.type === 'delete') {
                deleted.push({
                    value: item.optional.value,
                    group: item.optional.group,
                    wordId: item.wordId,
                    type: item.optional.type,
                })
            }
            if (item.optional.type === 'learn') {
                learning.push({
                    value: item.optional.value,
                    group: item.optional.group,
                    wordId: item.wordId,
                    type: item.optional.type,
                })
            }
            if (item.optional.type === 'hard') {
                hard.push({
                    value: item.optional.value,
                    group: item.optional.group,
                    wordId: item.wordId,
                    type: item.optional.type,
                })
            }
        })
        dispatch(getUserWords(learning, deleted, hard))
    }
}
