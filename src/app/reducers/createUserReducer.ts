import { ActionsTypes } from "../actions/actions"
import { CreateAndEditUserType } from "../types/userTypes";

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

export const createUserReducer = (state = User, action: ActionsTypes): CreateAndEditUserType => {
    switch (action.type) {
        case "SET_DATA_FOR_CREATE_USER":
            return { ...state, ...action.payload }

        case "SET_STATE_FOR_CREATE_USER":
            let stateToJson = JSON.stringify(state)
            state = JSON.parse(stateToJson)
            state.state.key = action.payload
            return state

        case "ADD_LAWFIRM_FOR_CREATE_USER":
            state = JSON.parse(JSON.stringify(state))
            let newLawFirm = {
                lawFirmUserId: action.payload.firmId,
                startDate: action.payload.startDate,
                endDate: action.payload.endDate,
                lawFirmName: action.payload.lawFirmName
            }
            state.lawFirms.push(newLawFirm)
            return state

        default:
            return state;
    }
};
