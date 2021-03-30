import {combineReducers} from "redux";
import Auth from './reducers/auth'
import Loading from './reducers/loading'
import Book from "./reducers/book";


export default combineReducers({auth: Auth,loading:Loading,book:Book});

