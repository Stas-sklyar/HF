import { ActionsTypes } from "../actions/actions"

export type InformationPageType = {
    title: string
    textDescription: string
    hasInput: boolean
    inputPlaceholder?: string
    inputLabel?: string
    additionalBtn: boolean
    buttonText?: string
    btnLink?: string
    contractSupportBtn: boolean
}

const initialState: InformationPageType = {
    title: "Title of Page",
    textDescription: "Text Description",
    hasInput: false,
    inputPlaceholder: "",
    additionalBtn: false,
    buttonText: "Action Button",
    btnLink: "/",
    contractSupportBtn: false
}

export const informationPageReducer = (state = initialState, action: ActionsTypes): InformationPageType => {
    switch (action.type) {
        case "SET_CONTENT_TO_INFO_PAGE":
            return { ...state, ...action.payload }

        default:
            return state;
    }
}
