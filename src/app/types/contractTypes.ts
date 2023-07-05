import { CreateAndEditUserType } from "./userTypes"

export type CreateContractAttorneyType = {
    contractType: "PreSettlement" | "PostSettlement"
    amountSettlement: number
    estimatedSettlement: string
    caseId: string
    estimatedDuration: string | null
    opposingInsurance: string
    insuranceAdjuster: string
    adjusterPhone: string
    claimNumber: string
    liability: boolean
    propertyDamage: string
    injuryLevel: string
    dateAccident: string
    caseManager: string
    accidentDescription: string
    contractComments: Array<ContractCommentType> | null
    recipientCheck: string
    amountRequested: AmountRequestedType | null

    contractClientDTO: ContractClientDTOType | null
    contractAttorneyDTO: Array<ContractAttorneyType> | null
    contractLawFirmDTO: Array<ContractLawFirmType> | null
}

export type EditContractType = {
    id: number
    identifier: string
    contractType: string
    amountRequestedId: number
    amountApprovedId: number
    amountReducedId: number
    finalAmountOwed: number
    amountSettlement: number
    estimatedSettlement: string
    estimatedAdditional: string
    recipientCheck: string
    caseId: string
    estimatedDuration: string
    opposingInsurance: string
    insuranceAdjuster: string
    adjusterPhone: string
    claimNumber: string
    liability: boolean
    propertyDamage: string
    injuryLevel: string
    dateAccident: string
    caseManager: string
    accidentDescription: string
    contractComments: Array<ContractCommentType>
    contractStatus: Array<ContractStatusType>
    amountApproved: AmountApprovedType | null
    amountReduced: AmountReducedType | null
    amountPayments: Array<AmountPaymentsType>
    amountRequested: AmountRequestedType | null
    additionalFundingRequestsDto: Array<additionalFundingRequestsType> | null
    contractClientDTO: ContractClientDTOType | null
    contractAttorneyDTO: Array<ContractAttorneyType> | null | []
    contractLawFirmDTO: Array<ContractLawFirmType> | null | []
    childContracts: Array<EditContractType>
    userDTO: CreateAndEditUserType | null
    insertRate: number | null
    createDate: string
}

export type ContractCommentType = {
    commentAttachments?: Array<CommentAttachmentsType>
    contractId?: number
    dateComment?: string
    visible: boolean
    commentText: string
    userId?: number
    userName?: string
    currentLoggedUserIdentityId?: any
    id?: any
}

export type CommentAttachmentsType = {
    attachmentType: string
    base64: string
    contractCommentId: number
    createBy: number
    createDate: string
    fileId: string
    fileName: string
    id: number
    isDeleted: false
    mimeType: string
    modBy: number
    modDate: string
    size: number
    type: number
}

export type AmountApprovedType = {
    amount: number
    date: string
    contractId?: number
    approvedByUserId?: number
    insertRate: number | null
    checkNumber: string
    userId?: number
    user?: any
}

export type AmountReducedType = {
    amount: number
    date: string
    contractId?: number
}

export type AmountPaymentsType = {
    amount: number
    date: string
    contractId?: number
}

export type AmountRequestedType = {
    id?: number
    amount: number
    date: string
    contractId?: number
    userId: number
    insertRate?: number
}

export type ContractStatusType = {
    id?: number,
    contractsStatus: string,
    dateChange: string,
    userId: number,
    contractId?: number,
    currentLoggedUserIdentityId?: string
}

export type ContractClientDTOType = {
    userId: number | null
    user: any
}

export type ContractAttorneyType = {
    userId: number | null
    user: any
    date: string
}

export type ContractLawFirmType = {
    userId: number | null
    user: any
    date: string
}

export type additionalFundingRequestsType = {
    id?: number
    amount: number
    date: string
    contractId: number
    userId: number
    insertRate?: number
    user?: any
}