import { Divider } from "@material-ui/core"
import { useState, useEffect } from "react"
import { URL_FOR_API } from "../../../constants/constants"
import actionsWithApi from "../../../customHooks/actionsWithApi"
import s from "./Statistics.module.scss"
import {StatisticType} from "../../../types/statisticType";
import Preloader from "../Preloader/Preloader"

type StatisticsPropsType = {
    userId: number | undefined
    updateStatisticsToggle?: boolean
}

export default function Statistics(props: StatisticsPropsType) {
    const [userStatistics, setUserStatistics] = useState<StatisticType>()
    const [statisticsIsReady, setStatisticsIsReady] = useState<boolean>(false)
    const [loanLimit, setLoanLimit] = useState<number>()
    const getUserStatistic = async (props: StatisticsPropsType) => {
        if (props.userId) {
            try {
                let statistics = await actionsWithApi("GET", URL_FOR_API + `/api/v1/statistics/${props.userId}/getFullStatistic`, null)
                let userInfo = await actionsWithApi("GET", URL_FOR_API + `/api/v1/AdminUser/${props.userId}`, null)
                setUserStatistics(statistics.data)
                setLoanLimit(userInfo.data.loanLimit)
                setStatisticsIsReady(true)
            }
            catch (error) {
                console.log(error.message)
            }
        }
    }
    useEffect(() => {
        setStatisticsIsReady(false)
        getUserStatistic(props)
    }, [props.userId, props.updateStatisticsToggle])

    if(!statisticsIsReady) {
        return (
            <Preloader size="100" position="center" />
        )
    }
    else if (userStatistics) {
        return (
            <section className={s["Statistics"]}>
                <ul className={s["Statistics-List"]}>
                    <li className={s["Statistics-Item"]}>
                        <span>Loan Limit: </span>
                        <span>{loanLimit ? "$" + loanLimit : "N/A"}</span>
                    </li>
                    <li className={s["Statistics-Item"]}>
                        <span>Lifetime total requested: </span>
                        <span>{Math.round(userStatistics?.lifeTimeRequested * 100) / 100}</span>
                    </li>
                    <Divider className={s["Statistics-Divider"]} />

                    <li className={s["Statistics-Item"]}>
                        <span>Current Open Cases: </span>
                        <span>{Math.round(userStatistics?.openContractsCount * 100) / 100}</span>
                    </li>
                    <li className={s["Statistics-Item"]}>
                        <span>Current Amount Open: </span>
                        <span>{Math.round(userStatistics?.openContractAmount * 100) / 100}</span>
                    </li>
                    <li className={s["Statistics-Item"]}>
                        <span>Avg amount Open: </span>
                        <span>{Math.round(userStatistics?.openAmountAverage * 100) / 100}</span>
                    </li>
                    <li className={s["Statistics-Item"]}>
                        <span>Avg duration open: </span>
                        <span>{Math.round(userStatistics?.openDurationAverage * 100) / 100}</span>
                    </li>
                    <Divider className={s["Statistics-Divider"]} />

                    <li className={s["Statistics-Item"]}>
                        <span>Total Closed Cases: </span>
                        <span>{Math.round(userStatistics?.closedContractsCount * 100) / 100}</span>
                    </li>
                    <li className={s["Statistics-Item"]}>
                        <span>Projected Closed Case Value: </span>
                        <span>{Math.round(userStatistics?.lifetimeProjectedAmountClosed * 100) / 100}</span>
                    </li>
                    <li className={s["Statistics-Item"]}>
                        <span>Avg Projected Closed Value: </span>
                        <span>{Math.round(userStatistics?.closedProjectedAmountAverage * 100) / 100}</span>
                    </li>
                    <li className={s["Statistics-Item"]}>
                        <span>Avg Actual Closed Value: </span>
                        <span>{Math.round(userStatistics?.closedRealAmountAverage * 100) / 100}</span>
                    </li>
                    <li className={s["Statistics-Item"]}>
                        <span>Avg duration closed: </span>
                        <span>{Math.round(userStatistics?.closedDurationAverage * 100) / 100}</span>
                    </li>
                    <Divider className={s["Statistics-Divider"]} />

                    <li className={s["Statistics-Item"]}>
                        <span>Avg funded amount: </span>
                        <span>{Math.round(userStatistics?.lifeTimeReceivedAverage * 100) / 100}</span>
                    </li>
                    <li className={s["Statistics-Item"]}>
                        <span>Total paid back: </span>
                        <span>{Math.round(userStatistics?.lifeTimePayments * 100) / 100}</span>
                    </li>
                    <li className={s["Statistics-Item"]}>
                        <span>Returned avg: </span>
                        <span>{Math.round(userStatistics?.lifeTimePaidAverage * 100) / 100}</span>
                    </li>
                    <li className={s["Statistics-Item"]}>
                        <span>Total amt never paid back: </span>
                        <span>{Math.round(userStatistics?.lifeTimeLost * 100) / 100}</span>
                    </li>
                    <li className={s["Statistics-Item"]}>
                        <span>ROI Closed Profitability: </span>
                        <span>{userStatistics?.roi.toFixed(5)}</span>
                    </li>
                </ul>
            </section>
        )
    }
    else {
        return (
            <div className={s["Statistics-Subtitle"]}>This user has no statistics</div>
        )
    }
}