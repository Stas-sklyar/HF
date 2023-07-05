export type CreateUserLawFirmsType = {
    lawFirmUserId: number
    startDate: Date | string
    endDate: Date | string
    lawFirmName: string
    id?: number
    firstName?: string
    present?: boolean
}

export type CreateAndEditUserType = {
    createDate: Date | string
    userType: string
    firstName: string
    lastName: string
    dateOfBirth: Date | string
    streetAddress: string
    city: string
    state: {
        key: string
    }
    zipCode: string
    website: string
    banned: boolean
    loanLimit: number
    userStatus: {
        userStatusesValue: string
    }
    lawFirms: Array<CreateUserLawFirmsType>
    email: string
    phoneNumber: string | null

    addFirmFirstName: string
    addFirmDateOfJoined: Date | string | null
    addFirmDateEnd: Date | string | null
}

export type UserLawFirmsType = {
    firstName?: string
    endDate?: string
    present?: boolean
    userId?: number
    lawFirmUserId: number
    startDate: string
}