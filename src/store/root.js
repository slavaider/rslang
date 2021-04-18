import {combineReducers} from "redux";
import Auth from "./reducers/auth"
import Loading from "./reducers/loading"
import Book from "./reducers/book";
import Settings from "./reducers/settings"
import Words from "./reducers/words"
import Stats from "./reducers/stats";

export default combineReducers(
    {
        auth: Auth,
        loading: Loading,
        book: Book,
        settings: Settings,
        words: Words,
        stats: Stats
    });

