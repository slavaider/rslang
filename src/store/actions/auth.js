import axios from "axios";
import {AUTH_LOGOUT, AUTH_SUCCESS} from "./action_types";
import {BASE_URL} from "../../config";
import {clearError, setError, setLoading} from "./loading";

export function AuthSuccess(data) {
    return {
        type: AUTH_SUCCESS,
        user: {...data}
    }
}

export function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user_id")
    localStorage.removeItem("expirationDate")
    return {
        type: AUTH_LOGOUT
    }
}

export function autoLogin(id, token) {
    return async (dispatch) => {
        dispatch(setLoading(true))
        dispatch(clearError())
        if (!token) {
            dispatch(logout())
        } else {
            const user_data = await axios.get(`${BASE_URL}users/${id}`, {
                headers: {"Authorization": `Bearer ${token}`}
            }).catch((error) => {
                dispatch(setError(error.response.data))
            })

            const expirationDate = new Date(localStorage.getItem("expirationDate"))
            if (expirationDate <= new Date()) {
                // Logout
                logout()
            } else {
                // Auto Login
                if (user_data) {
                    dispatch(AuthSuccess({
                        email: user_data.data.email,
                        id,
                        name: user_data.data.name,
                        token
                    }))
                }
            }
        }
        dispatch(setLoading(false))
    }
}

export function Login({email, password}) {
    return async (dispatch) => {
        dispatch(clearError())
        dispatch(setLoading(true))
        const login = await axios.post(`${BASE_URL}signin`, {
            email,
            password
        }).catch((error) => {
            dispatch(setError(error.response.data))
        })
        if (login) {
            const expirationDate = new Date(new Date().getTime() + 3600 * 4 * 1000)
            localStorage.setItem("token", login.data.token)
            localStorage.setItem("refresh_token", login.data.refreshToken)
            localStorage.setItem("user_id", login.data.userId)
            localStorage.setItem("expirationDate", expirationDate)
            dispatch(AuthSuccess({
                email: login.data.email,
                id: login.data.userId,
                name: login.data.name,
                token: login.data.token,
                refreshToken: login.data.refreshToken,
            }))
        }
        dispatch(setLoading(false))
    }
}

export function Register({name, email, password}) {
    return async dispatch => {
        dispatch(clearError())
        dispatch(setLoading(true))
        const authData = {
            name,
            email,
            password
        }
        // Create user
        await axios.post(`${BASE_URL}users`, authData).catch((error) => {
            dispatch(setError(error.response.data.error.errors[0].message))
        })
        // Get Tokens
        const token = await axios.post(`${BASE_URL}signin`, {
            email,
            password
        }).catch((error) => {
            console.error(error.response.data)
        })
        if (token) {
            const expirationDate = new Date(new Date().getTime() + 3600 * 4 * 1000)
            localStorage.setItem("token", token.data.token)
            localStorage.setItem("refresh_token", token.data.refreshToken)
            localStorage.setItem("user_id", token.data.userId)
            localStorage.setItem("expirationDate", expirationDate)
            dispatch(AuthSuccess({
                email,
                id: token.data.userId,
                name,
                token: token.data.token,
                refreshToken: token.data.refreshToken,
            }))
        }
        dispatch(setLoading(false))
    }
}
