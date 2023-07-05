export type ratingItemType = {
    id: number
    from: number
    to: number
    star: number
    userRatingType: string
}

export type userRatingType = {
    avgDaysClose: number
    avgDaysCloseRating: number
    avgFundedPerClient: number
    avgRating: number
    lifetimeReceivedAverage: number
    pctCasesLost: number
    pctCasesLostRating: number
    pctCasesReduced: number
    pctCasesReducedRating: number
    pctReductionPerCase: number
    pctReductionPerCaseRating: number
    totalLostCases: number
    totalLostCasesRating: number
    totalReducedCases: number
    totalReducedCasesRating: number
}