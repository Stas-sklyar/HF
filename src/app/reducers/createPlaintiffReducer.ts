import { ActionsTypes } from "../actions/actions";

export type CreatePlaintiffType = {
    firstName: string
    lastName: string
    dateOfBirth: string
    streetAddress: string
    city: string
    zipCode: string
    state: {
        key: string
    }
    email: string
    phoneNumber: string
}

const initialState: CreatePlaintiffType = {
    firstName: "",
    lastName: "",
    dateOfBirth: new Date().toISOString() + "",
    streetAddress: "",
    city: "",
    zipCode: "",
    state: {
        key: ""
    },
    email: "",
    phoneNumber: "",
}

export const createPlaintiffReducer = (state = initialState, action: ActionsTypes): CreatePlaintiffType => {
    switch (action.type) {
        case "HANDLER_FOR_CREATE_PLAINTIFF_INPUTS":
            if (Object.keys(action.payload)[0] === "state") {
                state = JSON.parse(JSON.stringify(state))
                state.state.key = action.payload.state
                return state
            }
            else {
                return { ...state, ...action.payload }
            }

        case "RESET_CREATED_PLAINTIFF_DATA":
            state = JSON.parse(JSON.stringify(state))
            return state = initialState

        default:
            return state;
    }
};
