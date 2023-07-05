import { StatesType } from './stateType'

export type RatesType = {
    id?: number
    daysFrom: number
    daysTo: number
    rate: number
}

export type InterestRateType = {
    id: number
    additionalRiskInterestRate: number
    stateId: number

    preSettlements: Array<RatesType>
    postSettlements: Array<RatesType>

    state: StatesType
}