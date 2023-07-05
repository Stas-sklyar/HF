import dateFormatting from "../../../../scripts/dateFormatting"
import s from "../ContractInfo.module.scss"

type ChildContractsListPropsType = {
    childContracts: Array<any>
}

export default function ChildContractsList(props: ChildContractsListPropsType) {

    return (
        <li className={s["ContractInfo-Item"]}>
            <ul className={s["ContractInfo-List"] + " " + s["ContractInfo-List--AdditionalFunding"]}>
                {
                    props.childContracts
                        .map((childContract: any, index: number) => {
                            return (
                                <li className={s["ContractInfo-Item"]}>
                                    <div>
                                        <span>Additional funding amount: {index + 1}: </span>
                                        <span>${childContract.amountRequested.amount}</span>
                                    </div>
                                    <div className={s["ContractInfo-Data"]}>
                                        {dateFormatting(childContract.amountRequested.date)}
                                    </div>
                                </li>
                            )
                        })
                }
            </ul>
        </li>
    )
}