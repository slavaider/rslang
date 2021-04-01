import {CREATE_USER_WORD, DELETE_USER_WORD, GET_USER_WORDS} from "./action_types";
import axios from "axios";
import {BASE_URL} from "../../config";


export const createWord = (type, group, value, wordId, image,textExample,success, fail) => {
    return {
        type: CREATE_USER_WORD,
        wordType: type,
        word: {
            value,
            group,
            wordId,
            type,
            image,
            textExample,
            success,
            fail
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
export const updateWord = (type, group, value, wordId,image,textExample, success, fail) => {
    return {
        type: CREATE_USER_WORD,
        wordType: type,
        word: {
            value,
            group,
            wordId,
            type,
            image,
            textExample,
            success,
            fail
        }
    }
}

export const asyncCreateWord = (type, group, value, wordId, image,textExample, userId, token, fail = 0, success = 0) => {
    return async dispatch => {
        // Check existing word
        const response = await axios.get(`${BASE_URL}users/${userId}/words/${wordId}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            })
            .catch(async (error) => {
                // Create if not exist
                if (error.response.status === 404) {
                    await axios.post(`${BASE_URL}users/${userId}/words/${wordId}`,
                        {
                            optional: {
                                value,
                                type,
                                group,
                                image,
                                textExample,
                                fail,
                                success,
                            }
                        }, {
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            }
                        }
                    )
                    console.clear();
                    dispatch(createWord(type, group, value, wordId, image,textExample,fail, success))
                }
            })
        if (typeof response !== "undefined") {
            // Update if exist
            const updateData = {
                optional: {
                    value,
                    type,
                    group,
                    image,
                    textExample
                }
            }
            if (type === "learn") {
                updateData.optional["fail"] = response.data.optional.fail + fail
                updateData.optional["success"] = response.data.optional.success + success
            }
            await axios.put(`${BASE_URL}users/${userId}/words/${wordId}`,
                updateData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                }
            )
            dispatch(updateWord(type, group, value, wordId,image,textExample, fail, success))
        }
    }
}

export const asyncDeleteWord = (type, wordId, userId, token) => {
    return async dispatch => {
        await axios.delete(`${BASE_URL}users/${userId}/words/${wordId}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
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
                "Authorization": `Bearer ${token}`,
            }
        }).catch((error) => {
            console.log(error.response.data);
        })
        const learning = []
        const deleted = []
        const hard = []
        response.data.forEach((item) => {
            if (item.optional.type === "delete") {
                deleted.push({
                    value: item.optional.value,
                    group: item.optional.group,
                    wordId: item.wordId,
                    type: item.optional.type,
                    image: item.optional.image,
                    textExample:item.optional.textExample,
                    fail: item.optional.fail,
                    success: item.optional.success,
                })
            }
            if (item.optional.type === "learn") {
                learning.push({
                    value: item.optional.value,
                    group: item.optional.group,
                    wordId: item.wordId,
                    type: item.optional.type,
                    image: item.optional.image,
                    textExample:item.optional.textExample,
                    fail: item.optional.fail,
                    success: item.optional.success,
                })
            }
            if (item.optional.type === "hard") {
                hard.push({
                    value: item.optional.value,
                    group: item.optional.group,
                    wordId: item.wordId,
                    type: item.optional.type,
                    image: item.optional.image,
                    textExample:item.optional.textExample,
                    fail: item.optional.fail,
                    success: item.optional.success,
                })
            }
        })
        dispatch(getUserWords(learning, deleted, hard))
    }
}
