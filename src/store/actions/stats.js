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
const defaultStat = async (id, token, prev = null) => {
    if (prev) {
        const update = {
            optional: {
                ...prev.optional,
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
        }
        const response = await axios.put(`${BASE_URL}users/${id}/statistics`,
            update,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            })
        return response.data
    } else {
        const data = {
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
        }
        const response = await axios.put(`${BASE_URL}users/${id}/statistics`,
            data,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            })
        return response.data
    }
}


export const asyncGetStats = (id, token) => {
    return async dispatch => {
        if (id) {
            const response = await axios.get(`${BASE_URL}users/${id}/statistics`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            }).catch(async (error) => {
                if (error) {
                    dispatch(getStats(await defaultStat(id, token)))
                }
            })
            if (response) {
                const exist = response.data.optional[new Date().toLocaleDateString()]
                if (typeof exist === "undefined") {
                    dispatch(getStats(await defaultStat(id, token, response.data)))
                } else
                    dispatch(getStats(response.data))
            }
        }
    }
}
export const asyncSetStats = (id, token, value) => {
    return async (dispatch,getState) => {
        const state = getState()
        const response = await axios.put(`${BASE_URL}users/${id}/statistics`,
            {
                optional: {
                    ...state.stats.statistic.optional,
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
