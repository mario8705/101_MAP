import {DISCONNECT_APP, CONNECT_APP, ACTIVE_THEME_SWAP} from "../actions/globalState";

import globalConfig from "../../config/globalConfig";

const initialState = {
    connected: false,
    themes: {
        array: globalConfig.themeArray,
        value: localStorage.getItem("param_theme") || globalConfig.themeArray.indexOf(globalConfig.defaultTheme)
    }
};

const globalState = (state = initialState, {type, payload}) => {
    switch (type) {
    case ACTIVE_THEME_SWAP:
        return {
            ...state,
            themes: {
                ...state.themes,
                ...payload
            }
        };
    case DISCONNECT_APP:
        return {
            ...state,
            connected: false
        };
    case CONNECT_APP:
        return {
            ...state,
            connected: true
        };
    default:
        return state;
    }
};

export default globalState;