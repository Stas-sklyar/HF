import { ActionsTypes } from "../actions/actions";

export type LoginType = {
    email: string,
    password: string
}

const initialState: LoginType = {
    email: "",
    password: ""
}

export const loginReducer = (state = initialState, action: ActionsTypes): LoginType => {
    switch (action.type) {
        case "HANDLER_FOR_LOGIN_INPUTS":
            return { ...state, ...action.payload }

        default:
            return state;
    }
};
