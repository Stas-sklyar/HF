import { ActionsTypes } from "../actions/actions";

export type GeneralNotificationType = {
    isOpen: boolean
    message: string
    severity: 'error' | 'info' | 'success' | 'warning'
}

export type NotificationInfoType = {
    message: string
    severity: 'error' | 'info' | 'success' | 'warning'
}

const initialState: GeneralNotificationType = {
    isOpen: false,
    message: "",
    severity: "info"
}

export const generalNotificationReducer = (state = initialState, action: ActionsTypes): GeneralNotificationType => {
    switch (action.type) {
        case "TOGGLE_NOTIFICATION":
            return { ...state, isOpen: action.payload }

        case "SET_NOTIFICATION_INFO":
            return { ...state, ...action.payload }

        default:
            return state;
    }
};
