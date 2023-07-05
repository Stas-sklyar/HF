import { useEffect, useState } from "react"
import { URL_FOR_API } from "../../../constants/constants"
import actionsWithApi from "../../../customHooks/actionsWithApi"
import dateFormatting from "../../../scripts/dateFormatting"
import { additionalFundingRequestsType } from "../../../types/contractTypes"
import s from "./ContractInfo.module.scss"
import Preloader from '../../shared/Preloader/Preloader'
import ChildContractsList from "./ChildContractsList/ChildContractsList"

export default function ContractInfo({ data }: any) {
    const [finalAmount, setFinalAmount] = useState<number | null>(null)
    const [totalDueIsVisible, setTotalDueIsVisible] = useState<boolean>(false)

    const getFinalAmount = async (data: any) => {
        if (data && data.id) {
            try {
                let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/Contract/${data.id}/calculate`)
                setFinalAmount(response.data.totalAmountOwed)
            }
            catch (error) {
                console.log(error.message)
            }
        }
    }

    const calcTotalDueVisible = (data: any) => {
        if (data && data.contractStatus.length > 0) {
            for (let i = 0; i < data.contractStatus.length; i++) {
                if (data.contractStatus[i].contractsStatus === "CheckSent") setTotalDueIsVisible(true)
            }
        }
    }

    useEffect(() => {
        getFinalAmount(data)
        calcTotalDueVisible(data)
    }, [data?.id])

    if (data) {
        return (
            <section className={s["ContractInfo"]}>

                <div className={s["ContractInfo-Col"]}>
                    <ul className={s["ContractInfo-List"]}>
                        <li className={s["ContractInfo-Item"]}>
                            <span>Requested amount:</span>
                            <span>{data.amountRequested ? data.amountRequested.amount : ""}</span>
                        </li>
                        {data.additionalFundingRequestsDto && data.additionalFundingRequestsDto.length > 0 &&
                            data.additionalFundingRequestsDto
                                .map((request: additionalFundingRequestsType, index: number) => {
                                    return (
                                        <li className={s["ContractInfo-Item"] + " " + s["ContractInfo-Item__AdditionalRequest"]} key={request.id}>
                                            <span>Additional Request {index + 1}: </span>
                                            <span>{request.amount}</span>
                                        </li>
                                    )
                                })
                        }
                        <li className={s["ContractInfo-Item"]}>
                            <span>Settlement amount:</span>
                            <span>{data.amountSettlement}</span>
                        </li>
                        <li className={s["ContractInfo-Item"]}>
                            <span>Estimated Settlement amount:</span>
                            <span>{data.estimatedSettlement}</span>
                        </li>
                        <li className={s["ContractInfo-Item"]}>
                            <span>Estimated Additional Funding Needed:</span>
                            <span>{data.estimatedAdditional}</span>
                        </li>
                        <li className={s["ContractInfo-Item"]}>
                            <span>Approved amount:</span>
                            <span>{data.amountApproved ? data.amountApproved.amount : ""}</span>
                        </li>
                        {
                            data.childContracts && data.childContracts.length > 0 &&
                            <ChildContractsList childContracts={data.childContracts} />

                        }
                        <li className={s["ContractInfo-Item"]}>
                            <span>Current Amount Due:</span>
                            <span>{finalAmount ? finalAmount : ""}</span>
                        </li>
                        <li className={s["ContractInfo-Item"]}>
                            <span>Amount owed after closing:</span>
                            <span>{data.owedAfterClosing ? data.owedAfterClosing : ""}</span>
                        </li>
                    </ul>
                </div>

                <div className={s["ContractInfo-Col"]}>
                    <ul className={s["ContractInfo-List"]}>
                        {data && data.amountPayments && data.amountPayments.map((item: any, index: number) => {
                            return (
                                <li className={s["ContractInfo-Item"]} key={index}>
                                    <div>
                                        <span>Payment {index + 1}: </span>
                                        <span>${item.amount}</span>
                                    </div>
                                    <div>
                                        {dateFormatting(item.date)}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    {data.amountPayments.length === 0 &&
                        <b>No payments</b>
                    }
                    {totalDueIsVisible &&
                        <div>
                            <b>Total Due: </b>
                            <span>{data.totalDue}</span>
                        </div>
                    }
                </div>

            </section>
        )
    }
    else {
        return (
            <Preloader size="100" position="center" />
        )
    }
}