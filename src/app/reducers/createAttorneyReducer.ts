import { ActionsTypes } from "../actions/actions"

export type CreateAttorneyType = {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    lawFirms: any
    state: {
        key: string
    }
}

const initialState: CreateAttorneyType = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    lawFirms: [],
    state: {
        key: ""
    }
}

export const createAttorneyReducer = (state = initialState, action: ActionsTypes): CreateAttorneyType => {
    switch (action.type) {
        case "HANDLER_FOR_CREATE_ATTORNEY_INPUTS":
            if (Object.keys(action.payload)[0] === "state") {
                state = JSON.parse(JSON.stringify(state))
                state.state.key = action.payload.state
                return state
            }
            else {
                return { ...state, ...action.payload }
            }

        case "SET_LAWFIRM_TO_CREATED_ATTORNEY":
            state = JSON.parse(JSON.stringify(state))
            if (action.payload) {
                if (state.lawFirms.length === 0) {
                    state.lawFirms.push({ lawFirmUserId: action.payload })
                }
                else {
                    state.lawFirms[0].lawFirmUserId = action.payload
                }
                return state
            }
            else {
                state.lawFirms = []
                return state
            }
        case "RESET_CREATED_ATTORNEY_DATA":
            state = JSON.parse(JSON.stringify(state))
            return state = initialState
        default:
            return state;
    }
};
