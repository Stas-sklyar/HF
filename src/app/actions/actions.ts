import { NotificationInfoType } from "../reducers/generalNotificationReducer"
import { InformationPageType } from "../reducers/informationPageReducer"
import { AmountApprovedType, AmountPaymentsType } from "../types/contractTypes"
import { LawFirmType } from "../types/lawFirmType"
import { StatesType } from "../types/stateType"

export const setAllStatesToStore = (states: Array<StatesType>) => ({
    type: "SET_ALL_STATES_TO_STORE",
    payload: states
})

export type HandlerForRegistrationInputs = {
    type: "HANDLER_FOR_REGISTRATION_INPUTS"
    payload: any
}

export const handlerForRegistrationInputs = (formData: any): HandlerForRegistrationInputs => ({
    type: "HANDLER_FOR_REGISTRATION_INPUTS",
    payload: formData,
})

export type HandlerForLoginInputs = {
    type: "HANDLER_FOR_LOGIN_INPUTS"
    payload: any
}

export const handlerForLoginInputs = (formData: any): HandlerForLoginInputs => ({
    type: "HANDLER_FOR_LOGIN_INPUTS",
    payload: formData,
})

export type HandlerForCreateContractAttorneyInputsType = {
    type: "HANDLER_FOR_CREATE_CONTRACT_ATTORNEY_INPUTS"
    payload: any
}

export const handlerForCreateContractAttorneyInputs = (formData: any): HandlerForCreateContractAttorneyInputsType => ({
    type: "HANDLER_FOR_CREATE_CONTRACT_ATTORNEY_INPUTS",
    payload: formData,
})

export type SetDataForEditUserType = {
    type: "SET_DATA_FOR_EDIT_USER"
    payload: any
}

export const setDataForEditUser = (userInfoData: any): SetDataForEditUserType => ({
    type: "SET_DATA_FOR_EDIT_USER",
    payload: userInfoData,
})

export type HandlerForEditContractInputsType = {
    type: "HANDLER_FOR_EDIT_CONTRACT_INPUTS"
    payload: any
}

export const handlerForEditContractInputs = (userInfoData: any): HandlerForEditContractInputsType => ({
    type: "HANDLER_FOR_EDIT_CONTRACT_INPUTS",
    payload: userInfoData,
})
export type HandlerForCreateReportType = {
    type: "HANDLER_FOR_CREATE_REPORT_INPUTS"
    payload: any
}

export const handlerForCreateReport = (data: any): HandlerForCreateReportType => ({
    type: "HANDLER_FOR_CREATE_REPORT_INPUTS",
    payload: data,
})

export type ToggleNotificationType = {
    type: "TOGGLE_NOTIFICATION"
    payload: any
}

export const toggleNotification = (isOpen: boolean): ToggleNotificationType => ({
    type: "TOGGLE_NOTIFICATION",
    payload: isOpen,
})

export type SetNotificationInfoType = {
    type: "SET_NOTIFICATION_INFO"
    payload: NotificationInfoType
}

export const setNotificationInfo = (info: NotificationInfoType): SetNotificationInfoType => ({
    type: "SET_NOTIFICATION_INFO",
    payload: info,
})

export type SetContentToInfoPageType = {
    type: "SET_CONTENT_TO_INFO_PAGE"
    payload: InformationPageType
}

export const setContentToInfoPage = (info: InformationPageType): SetContentToInfoPageType => ({
    type: "SET_CONTENT_TO_INFO_PAGE",
    payload: info,
})

export type SetDataToAddFirmSectionForEditUser = {
    type: "SET_DATA_FOR_ADD_FIRM_SECTION"
    payload: InformationPageType
}

export const setDataToAddFirmSectionForEditUser = (info: any): SetDataToAddFirmSectionForEditUser => ({
    type: "SET_DATA_FOR_ADD_FIRM_SECTION",
    payload: info,
})

export type AddNewLawFirmForEditUserType = {
    type: "ADD_NEW_LAW_FIRM"
    payload: any
}

export const addNewLawFirmForEditUser = (info: LawFirmType): AddNewLawFirmForEditUserType => ({
    type: "ADD_NEW_LAW_FIRM",
    payload: info,
})

export type EditUserStatusType = {
    type: "EDIT_USER_STATUS"
    payload: string
}

export const editUserStatus = (status: string): EditUserStatusType => ({
    type: "EDIT_USER_STATUS",
    payload: status,
})

export type SetDataForCreateUserType = {
    type: "SET_DATA_FOR_CREATE_USER"
    payload: any
}

export const setDataForCreateUser = (userInfoData: any): SetDataForCreateUserType => ({
    type: "SET_DATA_FOR_CREATE_USER",
    payload: userInfoData,
})

export type SetStateForCreateUserType = {
    type: "SET_STATE_FOR_CREATE_USER"
    payload: any
}

export const setStateForCreateUser = (state: string): SetStateForCreateUserType => ({
    type: "SET_STATE_FOR_CREATE_USER",
    payload: state,
})

export type AddLawFirmForCreateUserType = {
    type: "ADD_LAWFIRM_FOR_CREATE_USER"
    payload: any
}

export const addLawFirmForCreateUser = ({ firmId, startDate, endDate, lawFirmName }: any): AddLawFirmForCreateUserType => ({
    type: "ADD_LAWFIRM_FOR_CREATE_USER",
    payload: { firmId, startDate, endDate, lawFirmName },
})

export type AddAmountApprovedEditContractPageType = {
    type: "ADD_AMOUNT_APPROVED_EDIT_CONTRACT_PAGE",
    payload: any
}

export const addAmountApprovedEditContractPage = ({ amount, insertRate, checkNumber, date, user }: AmountApprovedType): AddAmountApprovedEditContractPageType => ({
    type: "ADD_AMOUNT_APPROVED_EDIT_CONTRACT_PAGE",
    payload: { amount, insertRate, checkNumber, date, user }
})

export type AddAmountRequestedEditContractPageType = {
    type: "ADD_AMOUNT_REQUESTED_EDIT_CONTRACT_PAGE",
    payload: any
}

export const addAmountRequestedEditContractPage = (amount: number, date: string, contractId: number, userId: number): AddAmountRequestedEditContractPageType => ({
    type: "ADD_AMOUNT_REQUESTED_EDIT_CONTRACT_PAGE",
    payload: { amount, date, contractId, userId }
})

export type AddAmountRequestedCreateContractPageType = {
    type: "ADD_AMOUNT_REQUESTED_CREATE_CONTRACT_PAGE",
    payload: any
}

export const addAmountRequestedCreateContractPage = (amount: number, date: string, userId: number): AddAmountRequestedCreateContractPageType => ({
    type: "ADD_AMOUNT_REQUESTED_CREATE_CONTRACT_PAGE",
    payload: { amount, date, userId }
})

export type AddExistingUserCreateContractPageType = {
    type: "ADD_EXISTING_USER_CREATE_CONTRACT_PAGE",
    payload: any
}

export const addExistingUserCreateContractPage = (userId: number | null): AddExistingUserCreateContractPageType => ({
    type: "ADD_EXISTING_USER_CREATE_CONTRACT_PAGE",
    payload: { userId }
})

export type AddExistingAttorneyCreateContractPageType = {
    type: "ADD_EXISTING_ATTORNEY_CREATE_CONTRACT_PAGE",
    payload: any
}

export const addExistingAttorneyCreateContractPage = (attorneyId: number | null): AddExistingAttorneyCreateContractPageType => ({
    type: "ADD_EXISTING_ATTORNEY_CREATE_CONTRACT_PAGE",
    payload: { attorneyId }
})

export type AddExistingLawFirmForCreateContractPageType = {
    type: "ADD_EXISTING_LAWFIRM_FOR_CREATE_CONTRACT_PAGE",
    payload: any
}

export const addExistingLawFirmForCreateContractPage = (lawFirmId: number | null): AddExistingLawFirmForCreateContractPageType => ({
    type: "ADD_EXISTING_LAWFIRM_FOR_CREATE_CONTRACT_PAGE",
    payload: { lawFirmId }
})

export type CreateUserCreateContractPageType = {
    type: "CREATE_USER_CREATE_CONTRACT_PAGE",
    payload: any
}

export const createUserCreateContractPage = (user: any): CreateUserCreateContractPageType => ({
    type: "CREATE_USER_CREATE_CONTRACT_PAGE",
    payload: user
})

export type CreateAttorneyForCreateContractPageType = {
    type: "CREATE_ATTORNEY_FOR_CREATE_CONTRACT_PAGE",
    payload: any
}

export const createAttorneyForCreateContractPage = (user: any): CreateAttorneyForCreateContractPageType => ({
    type: "CREATE_ATTORNEY_FOR_CREATE_CONTRACT_PAGE",
    payload: user
})

export type AddAmountPaymentEditContractPageType = {
    type: "ADD_AMOUNT_PAYMENT_EDIT_CONTRACT_PAGE",
    payload: any
}

export const addAmountPaymentEditContractPage = ({ amount, date }: AmountPaymentsType): AddAmountPaymentEditContractPageType => ({
    type: "ADD_AMOUNT_PAYMENT_EDIT_CONTRACT_PAGE",
    payload: { amount, date }
})

export type SetDataForEditContractPageType = {
    type: "SET_DATA_FOR_EDIT_CONTRACT_PAGE"
    payload: any
}

export const setDataForEditContractPage = (contractData: any): SetDataForEditContractPageType => ({
    type: "SET_DATA_FOR_EDIT_CONTRACT_PAGE",
    payload: contractData,
})

export type SetCommentForCreateContractType = {
    type: "SET_COMMENT_FOR_CREATE_CONTRACT"
    payload: any
}

export const setCommentForCreateContract = (commentText: string, userId?: number): SetCommentForCreateContractType => ({
    type: "SET_COMMENT_FOR_CREATE_CONTRACT",
    payload: { commentText, userId },
})

export type AddCommentForEditContractType = {
    type: "ADD_COMMENT_EDIT_CONTRACT_PAGE"
    payload: any
}

export const addCommentForEditContract = (commentText: string, visible: boolean, userId: number, userName: string): AddCommentForEditContractType => ({
    type: "ADD_COMMENT_EDIT_CONTRACT_PAGE",
    payload: { commentText, visible, userId, userName }
})

export type AddStatusForEditContractType = {
    type: "ADD_STATUS_EDIT_CONTRACT_PAGE"
    payload: any
}

export const addStatusForEditContract = (contractsStatus: string, dateChange: string, userId: number): AddStatusForEditContractType => ({
    type: "ADD_STATUS_EDIT_CONTRACT_PAGE",
    payload: { contractsStatus, dateChange, userId }
})

export type HandlerForCreatePlaintiffInputs = {
    type: "HANDLER_FOR_CREATE_PLAINTIFF_INPUTS"
    payload: any
}

export const handlerCreatePlaintiffInputs = (formData: any): HandlerForCreatePlaintiffInputs => ({
    type: "HANDLER_FOR_CREATE_PLAINTIFF_INPUTS",
    payload: formData,
})

export type HandlerForCreateAttorneyInputs = {
    type: "HANDLER_FOR_CREATE_ATTORNEY_INPUTS"
    payload: any
}

export const handlerCreateAttorneyInputs = (formData: any): HandlerForCreateAttorneyInputs => ({
    type: "HANDLER_FOR_CREATE_ATTORNEY_INPUTS",
    payload: formData,
})

export type SetLawFirmToCreatedAttorneyType = {
    type: "SET_LAWFIRM_TO_CREATED_ATTORNEY"
    payload: number
}

export const setLawFirmToCreatedAttorney = (lawFirmId: number): SetLawFirmToCreatedAttorneyType => ({
    type: "SET_LAWFIRM_TO_CREATED_ATTORNEY",
    payload: lawFirmId,
})

export type ResetCreatedPlaintiffDataType = {
    type: "RESET_CREATED_PLAINTIFF_DATA"
}

export const resetCreatedPlaintiffData = (): ResetCreatedPlaintiffDataType => ({
    type: "RESET_CREATED_PLAINTIFF_DATA"
})

export type ResetCreatedAttorneyDataType = {
    type: "RESET_CREATED_ATTORNEY_DATA"
}

export const resetCreatedAttorneyData = (): ResetCreatedAttorneyDataType => ({
    type: "RESET_CREATED_ATTORNEY_DATA"
})

export type ResetDataForCreateContractType = {
    type: "RESET_DATA_FOR_CREATE_CONTRACT"
}

export const resetDataForCreateContract = (): ResetDataForCreateContractType => ({
    type: "RESET_DATA_FOR_CREATE_CONTRACT"
})

export type EditUsersLawFirmType = {
    type: "EDIT_USERS_LAWFIRM",
    payload: any
}

export const editUsersLawFirm = (editableLawFirmId: number, newDataOfLawFirm: any): EditUsersLawFirmType => ({
    type: "EDIT_USERS_LAWFIRM",
    payload: { editableLawFirmId, newDataOfLawFirm }
})

export type ActionsTypes =
    ReturnType<typeof setAllStatesToStore> |
    ReturnType<typeof handlerForRegistrationInputs> |
    ReturnType<typeof handlerForLoginInputs> |
    ReturnType<typeof handlerForCreateContractAttorneyInputs> |
    ReturnType<typeof setDataForEditUser> |
    ReturnType<typeof handlerForCreateReport> |
    ReturnType<typeof handlerForEditContractInputs> |
    ReturnType<typeof handlerForCreateReport> |
    ReturnType<typeof toggleNotification> |
    ReturnType<typeof setNotificationInfo> |
    ReturnType<typeof setContentToInfoPage> |
    ReturnType<typeof setDataToAddFirmSectionForEditUser> |
    ReturnType<typeof addNewLawFirmForEditUser> |
    ReturnType<typeof editUserStatus> |
    ReturnType<typeof setDataForCreateUser> |
    ReturnType<typeof setStateForCreateUser> |
    ReturnType<typeof addLawFirmForCreateUser> |
    ReturnType<typeof addAmountApprovedEditContractPage> |
    ReturnType<typeof addAmountPaymentEditContractPage> |
    ReturnType<typeof setDataForEditContractPage> |
    ReturnType<typeof setCommentForCreateContract> |
    ReturnType<typeof addCommentForEditContract> |
    ReturnType<typeof addStatusForEditContract> |
    ReturnType<typeof addAmountRequestedEditContractPage> |
    ReturnType<typeof addAmountRequestedCreateContractPage> |
    ReturnType<typeof addExistingUserCreateContractPage> |
    ReturnType<typeof createUserCreateContractPage> |
    ReturnType<typeof handlerCreatePlaintiffInputs> |
    ReturnType<typeof handlerCreateAttorneyInputs> |
    ReturnType<typeof addExistingAttorneyCreateContractPage> |
    ReturnType<typeof createAttorneyForCreateContractPage> |
    ReturnType<typeof addExistingLawFirmForCreateContractPage> |
    ReturnType<typeof setLawFirmToCreatedAttorney> |
    ReturnType<typeof resetCreatedPlaintiffData> |
    ReturnType<typeof resetCreatedAttorneyData> |
    ReturnType<typeof resetDataForCreateContract> |
    ReturnType<typeof editUsersLawFirm>





