import { Alert } from '@material-ui/lab'
import s from './CreateContractNotes.module.scss'

export type CreateContractNotesPropsType = {
    contractType: "PreSettlement" | "PostSettlement"
}

export default function CreateContractNotes(props: CreateContractNotesPropsType) {
    return (
        <div className={s["CreateContractNotes"]}>
            {props.contractType === "PostSettlement" &&
                <Alert icon={false} severity="warning" variant="outlined" className={s["CreateContractNotes-InterestRateAlert"] + " " + s["CreateContractNotes-InterestRateBottomAlert"]}>
                    <span className={s["CreateContractNotes-AlertText"]}>NOTICE: As a reminder to your clients, all post-settlement funding rates are good for 60 days after funding. After that time, if repayment has not been received, the rates default to pre-settlement funding rates. In addition, because of the nature of the post-settlement rates and timing, by board policy, we are unable to offer reductions to the total, final amount due for a client if a post-settlement funding is issued. The committee that governs our rates and approvals require post settlement fundings be issued on cases that have settled with enough proceeds to pay back all fundings in full.</span>
                </Alert>
            }
        </div>
    )
}