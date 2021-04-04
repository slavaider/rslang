import {CREATE_USER_WORD, DELETE_USER_WORD, GET_USER_WORDS, UPDATE_USER_WORD} from "./action_types";
import axios from "axios";
import {BASE_URL} from "../../config";


export const createWord = (type, group, value, wordId, image, textExample,textExampleTranslate, success, fail, audio, hard) => {
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
            textExampleTranslate,
            fail,
            success,
            audio,
            hard
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
export const updateWord = (type, group, value, wordId, image, textExample,textExampleTranslate, fail, success, audio, hard) => {
    return {
        type: UPDATE_USER_WORD,
        wordType: type,
        word: {
            value,
            group,
            wordId,
            type,
            image,
            textExample,
            textExampleTranslate,
            fail,
            success,
            audio,
            hard
        }
    }
}

export const asyncCreateWord = (type, group, value, wordId, image, textExample,textExampleTranslate, userId, token, fail, success, audio, hard) => {
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
                    const data = {
                        value,
                        type,
                        group,
                        image,
                        textExample,
                        textExampleTranslate,
                        fail,
                        success,
                        audio,
                        hard
                    }
                    await axios.post(`${BASE_URL}users/${userId}/words/${wordId}`,
                        {
                            optional: data
                        }, {
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            }
                        }
                    )
                    console.clear();
                    dispatch(createWord(type, group, value, wordId, image, textExample,textExampleTranslate, fail, success, audio, hard))
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
                    textExample,
                    textExampleTranslate,
                    fail,
                    success,
                    audio,
                    hard
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
            dispatch(updateWord(type, group, value, wordId, image, textExample, textExampleTranslate,response.data.optional.fail + fail, response.data.optional.success + success, audio, hard))
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
        if (userId) {
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
                const data = {
                    value: item.optional.value,
                    group: item.optional.group,
                    wordId: item.wordId,
                    type: item.optional.type,
                    image: item.optional.image,
                    textExample: item.optional.textExample,
                    textExampleTranslate: item.optional.textExampleTranslate,
                    fail: item.optional.fail,
                    success: item.optional.success,
                    audio: item.optional.audio,
                    hard: item.optional.hard,
                }
                if (item.optional.type === "delete") {
                    deleted.push(data)
                }
                if (item.optional.type === "learn") {
                    if (item.optional.hard) {
                        hard.push(data)
                    } else {
                        learning.push(data)
                    }
                }
            })
            dispatch(getUserWords(learning, deleted, hard))
        } else {
            dispatch(getUserWords([], [], []))
        }

    }
}
