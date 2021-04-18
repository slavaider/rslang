import {CLEAR_ERROR, SET_ERROR, SET_LOADING} from "./action_types";

export const setLoading = (value)=>{
    return {
        type:SET_LOADING,
        value
    }
}
export const setError = (value)=>{
    return {
        type:SET_ERROR,
        value
    }
}
export const clearError = ()=>{
    return{
        type:CLEAR_ERROR
    }
}
