import { ActionsTypes } from "../actions/actions"
import { UserLawFirmsType } from "../types/userTypes"

export type RegistrationType = {
    email: string
    password: string
    firstName: string
    lastName: string
    dateOfBirth: Date
    streetAddress: string
    city: string
    state: {
        key: string
        name: string
    }
    zipCode: string
    phoneNumber: string
    website: string
    dateLogin: Date

    roleName: number
    userType: string
    lawFirms: Array<UserLawFirmsType>
    textLawFirm: string
}



const initialState: RegistrationType = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dateOfBirth: new Date(),
    streetAddress: "",
    city: "",
    state: {
        key: "AL",
        name: "Alabama"
    },
    zipCode: "",
    website: "",
    phoneNumber: "",
    dateLogin: new Date(),
    roleName: 0,
    userType: "Attorney",
    lawFirms: [],
    textLawFirm: ""
}

export const registrationReducer = (state = initialState, action: ActionsTypes): RegistrationType => {
    switch (action.type) {
        case "HANDLER_FOR_REGISTRATION_INPUTS":
            return { ...state, ...action.payload }

        default:
            return state;
    }
};
