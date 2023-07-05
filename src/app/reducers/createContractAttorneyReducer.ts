import { ActionsTypes } from "../actions/actions"
import { CreateContractAttorneyType } from "../types/contractTypes";

const initialState: CreateContractAttorneyType = {
    contractType: "PreSettlement",
    amountSettlement: 0,
    estimatedSettlement: "",
    caseId: "",
    estimatedDuration: null,
    opposingInsurance: "",
    insuranceAdjuster: "",
    adjusterPhone: "",
    claimNumber: "",
    liability: true,
    propertyDamage: "Slight",
    injuryLevel: "Slight",
    dateAccident: new Date().toISOString() + "",
    caseManager: "",
    accidentDescription: "",
    contractComments: null,
    recipientCheck: "",
    amountRequested: null,

    contractClientDTO: null,
    contractAttorneyDTO: [],
    contractLawFirmDTO: []
}

export const createContractAttorneyReducer = (state = initialState, action: ActionsTypes): CreateContractAttorneyType => {
    switch (action.type) {
        case "HANDLER_FOR_CREATE_CONTRACT_ATTORNEY_INPUTS":
            return { ...state, ...action.payload }

        case "SET_COMMENT_FOR_CREATE_CONTRACT":
            state = JSON.parse(JSON.stringify(state))
            let contractHasComment

            if (contractHasComment = state.contractComments) {
                state.contractComments[0].commentText = action.payload.commentText
            }
            else {
                state.contractComments = []
                state.contractComments.push(
                    {
                        commentText: action.payload.commentText,
                        visible: true,
                        dateComment: new Date().toISOString() + "",
                        userId: action.payload.userId
                    }
                )
            }
            return state

        case "ADD_AMOUNT_REQUESTED_CREATE_CONTRACT_PAGE":
            state = JSON.parse(JSON.stringify(state))
            let newRequestedAmount = { amount: action.payload.amount, date: action.payload.date, userId: action.payload.userId }
            state.amountRequested = newRequestedAmount
            return state

        case "ADD_EXISTING_USER_CREATE_CONTRACT_PAGE":
            state = JSON.parse(JSON.stringify(state))
            var contractHasClient
            contractHasClient = state.contractClientDTO
                ? state.contractClientDTO.userId = action.payload.userId
                : state.contractClientDTO = { userId: action.payload.userId, user: null }
            return state

        case "CREATE_USER_CREATE_CONTRACT_PAGE":
            state = JSON.parse(JSON.stringify(state))
            var contractHasClient
            contractHasClient = state.contractClientDTO
            state.contractClientDTO
                ? state.contractClientDTO.user = action.payload
                : state.contractClientDTO = { user: action.payload, userId: null }
            return state

        case "ADD_EXISTING_ATTORNEY_CREATE_CONTRACT_PAGE":
            state = JSON.parse(JSON.stringify(state))
            if (state.contractAttorneyDTO ? state.contractAttorneyDTO[0] : false) {
                if (state.contractAttorneyDTO) {
                    state.contractAttorneyDTO[0].userId = action.payload.attorneyId
                    state.contractAttorneyDTO[0].user = null
                    state.contractAttorneyDTO[0].date = new Date().toISOString() + ""
                }
            }
            else {
                state.contractAttorneyDTO = []
                state.contractAttorneyDTO.push(
                    {
                        userId: action.payload.attorneyId,
                        user: null,
                        date: new Date().toISOString() + ""
                    })
            }
            return state

        case "CREATE_ATTORNEY_FOR_CREATE_CONTRACT_PAGE":
            state = JSON.parse(JSON.stringify(state))
            if (state.contractAttorneyDTO ? state.contractAttorneyDTO[0] : null) {
                if (state.contractAttorneyDTO) {
                    state.contractAttorneyDTO[0].userId = null
                    state.contractAttorneyDTO[0].user = action.payload
                    state.contractAttorneyDTO[0].date = new Date().toISOString()
                }
            }
            else {
                state.contractAttorneyDTO = []
                state.contractAttorneyDTO.push(
                    {
                        userId: null,
                        user: action.payload,
                        date: new Date().toISOString()
                    }
                )
            }
            return state

        case "ADD_EXISTING_LAWFIRM_FOR_CREATE_CONTRACT_PAGE":
            state = JSON.parse(JSON.stringify(state))
            if (state.contractLawFirmDTO ? state.contractLawFirmDTO[0] : false) {
                if (state.contractLawFirmDTO) {
                    state.contractLawFirmDTO[0].userId = action.payload.lawFirmId
                    state.contractLawFirmDTO[0].user = null
                    state.contractLawFirmDTO[0].date = new Date().toISOString()
                }
            }
            else {
                state.contractLawFirmDTO = []
                state.contractLawFirmDTO.push(
                    {
                        userId: action.payload.lawFirmId,
                        user: null,
                        date: new Date().toISOString()
                    }
                )
            }
            return state

        case "RESET_DATA_FOR_CREATE_CONTRACT":
            return state = initialState

        default:
            return state;
    }
};
