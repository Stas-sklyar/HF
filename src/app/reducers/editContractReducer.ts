import { ActionsTypes } from "../actions/actions"
import { EditContractType } from "../types/contractTypes";

const initialState: EditContractType = {
    id: 0,
    identifier: "",
    contractType: "",
    amountRequestedId: 0,
    amountApprovedId: 0,
    amountReducedId: 0,
    finalAmountOwed: 0,
    amountSettlement: 0,
    estimatedSettlement: "",
    estimatedAdditional: "",
    recipientCheck: "",
    caseId: "",
    estimatedDuration: "",
    opposingInsurance: "",
    insuranceAdjuster: "",
    adjusterPhone: "",
    claimNumber: "",
    liability: false,
    propertyDamage: "",
    injuryLevel: "",
    dateAccident: "",
    caseManager: "",
    accidentDescription: "",
    contractComments: [],
    contractStatus: [],
    amountApproved: null,
    amountReduced: null,
    amountPayments: [],
    amountRequested: null,
    additionalFundingRequestsDto: null,
    contractClientDTO: null,
    contractAttorneyDTO: [],
    contractLawFirmDTO: [],
    childContracts: [],
    userDTO: null,
    insertRate: null,
    createDate: ""
}

export const editContractReducer = (state = initialState, action: ActionsTypes): EditContractType => {
    switch (action.type) {
        case "SET_DATA_FOR_EDIT_CONTRACT_PAGE":
            state = { ...action.payload }
            return state

        case "HANDLER_FOR_EDIT_CONTRACT_INPUTS":
            return { ...state, ...action.payload }

        case "ADD_AMOUNT_APPROVED_EDIT_CONTRACT_PAGE":
            state = JSON.parse(JSON.stringify(state))
            let newApprovedAmmount = {
                amount: action.payload.amount,
                insertRate: action.payload.insertRate,
                checkNumber: action.payload.checkNumber,
                date: action.payload.date,
                user: action.payload.user
            }
            state.amountApproved = newApprovedAmmount
            return state

        case "ADD_AMOUNT_REQUESTED_EDIT_CONTRACT_PAGE":
            state = JSON.parse(JSON.stringify(state))
            let newRequestedAmount = {
                amount: action.payload.amount,
                date: action.payload.date,
                contractId: action.payload.contractId,
                userId: action.payload.userId
            }
            state.amountRequested = newRequestedAmount
            return state

        case "ADD_AMOUNT_PAYMENT_EDIT_CONTRACT_PAGE":
            state = JSON.parse(JSON.stringify(state))
            let newPaymentAmmount = { amount: action.payload.amount, date: action.payload.date }
            state.amountPayments.push(newPaymentAmmount)
            return state

        case "ADD_COMMENT_EDIT_CONTRACT_PAGE":
            state = JSON.parse(JSON.stringify(state))
            let newComment = {
                commentText: action.payload.commentText,
                visible: action.payload.visible,
                dateComment: new Date().toISOString() + "",
                userId: action.payload.userId,
                userName: action.payload.userName
            }
            state.contractComments.push(newComment)
            return state

        case "ADD_STATUS_EDIT_CONTRACT_PAGE":
            state = JSON.parse(JSON.stringify(state))
            let newStatus = {
                contractsStatus: action.payload.contractsStatus,
                dateChange: new Date().toISOString() + "",
                userId: action.payload.userId
            }
            state.contractStatus.push(newStatus)
            return state

        default:
            return state;
    }
};
