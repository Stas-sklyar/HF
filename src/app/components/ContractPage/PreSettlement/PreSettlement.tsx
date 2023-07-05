import { Button } from "@material-ui/core"
import { useState } from "react"
import Preloader from "../../shared/Preloader/Preloader"
import s from "./PreSettlement.module.scss"
import RequestAdditionalFundingWindow from "./RequestAdditionalFundingWindow/RequestAdditionalFundingWindow"

type PreSettlementPropsType = {
    data: any
    additionalFundingHasBeenAdded: boolean
    setAdditionalFundingHasBeenAdded(toggle: boolean): void
}

export default function PreSettlement({ data, additionalFundingHasBeenAdded, setAdditionalFundingHasBeenAdded }: PreSettlementPropsType) {
    const [openRequestAdditionalFundingWindow, setOpenRequestAdditionalFundingWindow] = useState<boolean>(false)
    const handleOpenRequestAdditionalFundingWindow = () => {
        setOpenRequestAdditionalFundingWindow(true)
    }
    const handleCloseRequestAdditionalFundingWindow = () => {
        setOpenRequestAdditionalFundingWindow(false)
    }

    if (data) {
        return (
            <section className={s["PreSettlement"]}>
                <div className={s["PreSettlement-Body"]}>
                    <h1 className={s["PreSettlement-Title"]}>{data.contractType}</h1>

                    <ul className={s["PreSettlement-List"]}>
                        <li className={s["PreSettlement-Item"]}>
                            <span>Case ID: </span>
                            <span>{data.caseId}</span>
                        </li>
                        <li className={s["PreSettlement-Item"]}>
                            <span>Contract ID: </span>
                            <span>{data.id}</span>
                        </li>
                        <li className={s["PreSettlement-Item"]}>
                            <span>Status: </span>
                            <span>{data.contractStatus[data.contractStatus.length - 1].contractsStatus}</span>
                        </li>
                        {data?.daysBeforePriceIncrease > 0 &&
                            <li className={s["PreSettlement-Item"] + " " + s["PreSettlement-Item__danger"]}>
                                <span>Days Until Price Increase: </span>
                                <span>{data.daysBeforePriceIncrease + " days left"}</span>
                            </li>
                        }
                    </ul>
                </div>
                <div className={s["PreSettlement-BtnBox"]}>
                    <Button
                        variant="contained" color="primary"
                        onClick={() => handleOpenRequestAdditionalFundingWindow()}
                    >
                        Request Additional Funds
                    </Button>
                </div>
                <RequestAdditionalFundingWindow
                    openRequestAdditionalFundingWindow={openRequestAdditionalFundingWindow}
                    handleCloseRequestAdditionalFundingWindow={handleCloseRequestAdditionalFundingWindow}
                    contractId={data.id}
                    additionalFundingHasBeenAdded={additionalFundingHasBeenAdded}
                    setAdditionalFundingHasBeenAdded={setAdditionalFundingHasBeenAdded}
                />
            </section>
        )
    }
    else return (
        <Preloader size="100" position="center" />
    )
}