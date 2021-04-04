import axios from "axios";
import {BASE_URL} from "../../config";
import {GET_STATS, SET_STATS} from "./action_types";


export const getStats = (value) => {
    return {
        type: GET_STATS,
        value
    }
}
export const setStats = (value) => {
    return {
        type: SET_STATS,
        value
    }
}
const defaultStat = async (id, token) => {
    const response = await axios.put(`${BASE_URL}users/${id}/statistics`,
        {
            optional: {
                [new Date().toLocaleDateString()]: {
                    wordPerDay: 0,
                    savanna: {
                        count: 0,
                        success: 0,
                        series: 0
                    },
                    sprint: {
                        count: 0,
                        success: 0,
                        series: 0
                    },
                    audio: {
                        count: 0,
                        success: 0,
                        series: 0
                    },
                    our: {
                        count: 0,
                        success: 0,
                        series: 0
                    },
                }
            }
        },
        {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
    return response.data
}

export const asyncGetStats = (id, token) => {
    return async dispatch => {
        const response = await axios.get(`${BASE_URL}users/${id}/statistics`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }).catch(async (error) => {
            if (error) {
                dispatch(getStats(await defaultStat(id, token)))
            }
        })
        if (response)
            dispatch(getStats(response.data))
    }
}
export const asyncSetStats = (id, token, value) => {
    return async dispatch => {
        const response = await axios.put(`${BASE_URL}users/${id}/statistics`,
            {
                optional: {
                    [new Date().toLocaleDateString()]: value
                }
            }
            , {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            })
        dispatch(setStats(response.data))
    }
}
