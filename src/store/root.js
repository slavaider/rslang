import Auth from './reducers/auth'
import Loading from './reducers/loading'
import {combineReducers} from "redux";


export default combineReducers({auth: Auth,loading:Loading});

