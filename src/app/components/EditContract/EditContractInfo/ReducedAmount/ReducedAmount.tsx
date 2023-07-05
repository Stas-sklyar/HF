import { TextField, Button, createStyles, makeStyles, Theme } from "@material-ui/core"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { setNotificationInfo, toggleNotification } from "../../../../actions/actions"
import { URL_FOR_API } from "../../../../constants/constants"
import actionsWithApi from "../../../../customHooks/actionsWithApi"
import { RootState } from "../../../../reducers/rootReducers"
import dateFormatting from "../../../../scripts/dateFormatting"
import AddBtn from "../../../shared/AddBtn/AddBtn"
import s from '../EditContractInfo.module.scss'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            marginRight: 20,
            marginBottom: 20,
            width: 220,
            [theme.breakpoints.down('xs')]: {
                marginRight: 0,
                width: "100%",
            }
        }
    })
)

export default function ReducedAmount() {
    const classes = useStyles()
    const dispatch = useDispatch()
    const location = useLocation()
    const contractId = location.search.split("").slice(1, location.search.split("").length).join("")
    const contractData = useSelector((state: RootState) => state.editContract)
    const amountReduced = useSelector((state: RootState) => state.editContract.amountReduced)
    const [addReducedAmountSection, setAddReducedAmountSection] = useState<boolean>(false)

    const [addedReducedAmount, setAddedReducedAmount] = useState<number>(0)

    const addReducedAmount = async (e: React.FormEvent<EventTarget>) => {
        e.preventDefault()

        let newReducedAmount = {
            amount: addedReducedAmount,
            date: new Date().toISOString()
        }
        contractData.amountReduced = { ...newReducedAmount }

        try {
            await actionsWithApi("POST", URL_FOR_API + `/api/v1/Contract/${contractId}/update`, contractData)
            dispatch(toggleNotification(true))
            dispatch(setNotificationInfo({ message: "Reduced Amount added!", severity: "success" }))
        }
        catch (error) {
            dispatch(toggleNotification(true))
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
        }
    }

    return (
        <section className={s["ReducedAmount"]}>
            <h1 className={s["ReducedAmount-Title"]}>Amount Due After Reduction</h1>

            {amountReduced &&
                <div>
                    <TextField
                        className={classes.formControl}
                        type="text" variant="outlined" size="small"
                        label="Amount After Reduction"
                        defaultValue={amountReduced.amount}
                    />
                    <TextField
                        className={classes.formControl}
                        type="text" variant="outlined" size="small"
                        label="Approval Date"
                        defaultValue={dateFormatting(amountReduced.date)}
                    />
                </div>
            }

            {!amountReduced &&
                <div
                    className={
                        !addReducedAmountSection
                            ? s["ReducedAmount-ShowBtn"]
                            : s["ReducedAmount-ShowBtn__Active"]
                    }
                    onClick={() => { setAddReducedAmountSection(!addReducedAmountSection) }}
                >
                    <AddBtn text="Add Amount Due After Reduction" />
                </div>
            }

            {addReducedAmountSection && !amountReduced &&
                <form onSubmit={(e) => addReducedAmount(e)}>
                    <TextField
                        className={classes.formControl}
                        onChange={(e) => setAddedReducedAmount(parseInt(e.target.value + ""))}
                        type="number" variant="outlined" size="small"
                        label="Amount After Reduction"
                        required
                        inputProps={{ min: "0" }}
                    />
                    <Button type="submit" variant="contained" color="primary">Add Amount</Button>
                </form>
            }
        </section >
    )
}
