import { ActionsTypes } from "../actions/actions"
import { CreateAndEditUserType } from "../types/userTypes"

const User: CreateAndEditUserType = {
    createDate: new Date(),
    userType: "attorney",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    streetAddress: "",
    city: "",
    state: {
        key: ""
    },
    zipCode: "",
    website: "",
    banned: false,
    loanLimit: 0,
    userStatus: {
        userStatusesValue: "new"
    },
    lawFirms: [],
    email: "",
    phoneNumber: "",

    addFirmFirstName: "",
    addFirmDateOfJoined: "",
    addFirmDateEnd: ""
}

export const editUserReducer = (state = User, action: ActionsTypes): CreateAndEditUserType => {
    switch (action.type) {
        case "SET_DATA_FOR_EDIT_USER":
            return { ...state, ...action.payload }

        case "SET_DATA_FOR_ADD_FIRM_SECTION":
            return { ...state, ...action.payload }

        case "ADD_NEW_LAW_FIRM":
            state = JSON.parse(JSON.stringify(state))
            state.lawFirms.push(action.payload)
            return { ...state }

        case "EDIT_USER_STATUS":
            state = JSON.parse(JSON.stringify(state))
            state.userStatus.userStatusesValue = action.payload + ""
            return state

        case "EDIT_USERS_LAWFIRM":
            state = JSON.parse(JSON.stringify(state))
            let editableLawFirmIndex = state.lawFirms
                .findIndex((lawFirm) => action.payload.editableLawFirmId === lawFirm.id)

            state.lawFirms[editableLawFirmIndex] = { ...action.payload.newDataOfLawFirm }
            return state

        default:
            return state;
    }
};
