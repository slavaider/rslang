import {AUTH_LOGOUT, AUTH_SUCCESS} from "../actions/action_types";

const InitialState = {
    email: null,
    id: null,
    name: null,
    token: null,
    refreshToken: null,
}
// eslint-disable-next-line
export default function (state = InitialState, action) {
    switch (action.type) {
        case AUTH_SUCCESS:
            return {
                email: action.user.email,
                id: action.user.id,
                name: action.user.name,
                token: action.user.token,
                refreshToken: action.user.refreshToken,
            }
        case AUTH_LOGOUT:
            return {
                email: null,
                id: null,
                name: null,
                token: null,
                refreshToken: null,
            }
        default:
            return state
    }
};
