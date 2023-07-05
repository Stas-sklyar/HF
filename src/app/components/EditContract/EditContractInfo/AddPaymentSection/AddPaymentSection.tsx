import { Button, createStyles, makeStyles, TextField, Theme } from '@material-ui/core'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { addAmountPaymentEditContractPage, setNotificationInfo, toggleNotification } from '../../../../actions/actions'
import { URL_FOR_API } from '../../../../constants/constants'
import actionsWithApi from '../../../../customHooks/actionsWithApi'
import { RootState } from '../../../../reducers/rootReducers'
import dateFormatting from '../../../../scripts/dateFormatting'
import getCookie from '../../../../scripts/getCookie'
import AddBtn from '../../../shared/AddBtn/AddBtn'

import s from './AddPaymentSection.module.scss'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            width: 200,
            marginBottom: 20,
            marginRight: 30,
            [theme.breakpoints.down('xs')]: {
                width: "100%",
                marginRight: 0
            }
        },
        button: {
            height: 35
        }
    }),
)

export default function AddPaymentSection() {
    const classes = useStyles()
    const dispatch = useDispatch()
    const location = useLocation()
    const contractId = location.search.split("").slice(1, location.search.split("").length).join("")
    const currentUserId = getCookie("currentUserId")
    const amountPayments = useSelector((state: RootState) => state.editContract.amountPayments)
    const [showAddPaymentSection, setShowAddPaymentSection] = useState<boolean>(false)

    const [addedPaymentAmount, setAddedPaymentAmount] = useState<number>(0)

    const addPaymentHandle = async (e: React.FormEvent<EventTarget>) => {
        e.preventDefault()
        if (addedPaymentAmount > 0) {
            let currentDate = new Date().toISOString() + ""
            try {
                await actionsWithApi(
                    "POST",
                    URL_FOR_API + `/api/v1/Contract/${contractId}/updateAmountPayment`,
                    {
                        amount: addedPaymentAmount,
                        date: currentDate,
                        userId: currentUserId
                    }
                )
                dispatch(addAmountPaymentEditContractPage({ amount: addedPaymentAmount, date: currentDate }))
                dispatch(toggleNotification(true))
                dispatch(setNotificationInfo({ message: "Payment added", severity: "success" }))
            }
            catch (error) {
                console.log(error.message)
                dispatch(toggleNotification(true))
                dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            }
        }
        else {
            dispatch(toggleNotification(true))
            dispatch(setNotificationInfo({ message: "Enter amount more than 0", severity: "error" }))
        }
    }

    return (
        <section className={s["AddPayment"]} >
            <h1 className={s["AddPayment-Title"]}>Payments</h1>
            {amountPayments.length > 0 && amountPayments
                .map((item, index: number) => (
                    <div key={index} className={s["AddPayment-Panel"]}>
                        <TextField className={classes.formControl} value={item.amount} type="number" variant="outlined" size="small" label="Amount" />
                        <TextField className={classes.formControl} value={dateFormatting(item.date)} type="text" variant="outlined" size="small" label="Payment Date" />
                    </div>
                ))
            }
            <div className={s["AddPayment-ShowBtn"]} onClick={() => setShowAddPaymentSection(!showAddPaymentSection)}>
                <AddBtn text="Add Payment" />
            </div>
            {showAddPaymentSection &&
                <form className={s["AddPayment-Panel"]} onSubmit={(e) => addPaymentHandle(e)}>
                    <TextField className={classes.formControl} onChange={(e) => { setAddedPaymentAmount(parseInt(e.target.value + "")) }} type="number" variant="outlined" size="small" label="Amount" required />
                    <TextField className={classes.formControl} type="text" variant="outlined" size="small" label="Payment Date" value={dateFormatting(new Date().toISOString())} />
                    <Button className={classes.button} type="submit" variant="contained" color="primary">Add Payment</Button>
                </form>
            }
        </section>
    )
}