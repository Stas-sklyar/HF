import { makeStyles, Theme, createStyles, TextField } from "@material-ui/core"
import { useDispatch } from "react-redux"
import { addAmountRequestedEditContractPage } from "../../../../actions/actions"
import dateFormatting from "../../../../scripts/dateFormatting"
import getCookie from "../../../../scripts/getCookie"
import { additionalFundingRequestsType, EditContractType } from "../../../../types/contractTypes"
import s from '../EditContractInfo.module.scss'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            width: 220,
            marginBottom: 20,
            marginRight: 30,
            [theme.breakpoints.down('xs')]: {
                marginRight: 0,
                width: "100%",
            }
        }
    }),
)

type RequestedAmountsPropsType = {
    contractInfo: EditContractType
}

export default function RequestedAmounts(props: RequestedAmountsPropsType) {
    const classes = useStyles()
    const dispatch = useDispatch()
    const currentUserId = parseInt(getCookie("currentUserId") + "")

    const addRequestedAmount = (amount: number) => {
        dispatch(addAmountRequestedEditContractPage(amount, new Date().toISOString(), props.contractInfo.id, currentUserId))
    }

    return (
        <section className={s["EditContractInfo"]}>
            <h1 className={s["EditContractInfo-Title"]}>Requested Amount</h1>

            <div className={s["EditContractInfo-RequestedAmount"]}>
                <TextField className={classes.formControl} type="number" name="amountRequested" variant="outlined" size="small"
                    defaultValue={props.contractInfo.amountRequested ? props.contractInfo.amountRequested.amount : ""}
                    label="Requested Amount" onChange={(e) => addRequestedAmount(parseInt(e.target.value + ""))}
                />
            </div>
            {props.contractInfo.additionalFundingRequestsDto && props.contractInfo.additionalFundingRequestsDto
                .map((additionalRequest: additionalFundingRequestsType) => {
                    return (
                        <div key={additionalRequest.id}>
                            <TextField className={classes.formControl} type="number" variant="outlined" size="small"
                                value={additionalRequest.amount}
                                label="Additional Requested Amount"
                            />
                            <TextField className={classes.formControl} variant="outlined" size="small"
                                value={additionalRequest.user?.firstName + " " + additionalRequest.user?.lastName}
                                label="Requester"
                            />
                            <TextField className={classes.formControl} variant="outlined" size="small"
                                value={dateFormatting(additionalRequest.date)}
                                label="Date"
                            />
                        </div>
                    )
                })
            }
        </section>
    )
}