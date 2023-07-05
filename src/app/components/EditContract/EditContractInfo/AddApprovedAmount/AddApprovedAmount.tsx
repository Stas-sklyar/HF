import { Button, createStyles, makeStyles, TextField, Theme } from '@material-ui/core'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { addAmountApprovedEditContractPage, setNotificationInfo, toggleNotification } from '../../../../actions/actions'
import { URL_FOR_API } from '../../../../constants/constants'
import actionsWithApi from '../../../../customHooks/actionsWithApi'
import { RootState } from '../../../../reducers/rootReducers'
import dateFormatting from '../../../../scripts/dateFormatting'
import getCookie from '../../../../scripts/getCookie'
import AddBtn from '../../../shared/AddBtn/AddBtn'
import s from '../EditContractInfo.module.scss'
import AddApprovedAmountConfirmationWindow from "../AmountConfirmationWindow";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            width: 220,
            marginRight: 20,
            marginBottom: 20,
            [theme.breakpoints.down('xs')]: {
                marginRight: 0,
                width: "100%",
            }
        },
        button: {
            height: 35
        }
    }),
)

export default function AddApprovedAmount() {
    const dispatch = useDispatch()
    const classes = useStyles()
    const currentUserId = getCookie("currentUserId")
    const location = useLocation()
    const contractId = location.search.split("").slice(1, location.search.split("").length).join("")
    const contractData = useSelector((state: RootState) => state.editContract)
    const checkNumber: string = contractData.identifier

    const [showAddApprovedAmountSection, setShowAddApprovedAmountSection] = useState<boolean>(false)
    const [addedAmprovedAmount, setAdedAmprovedAmount] = useState<number | null>(null)

    const [openConfirmationWindow, setOpenConfirmationWindow] = useState<boolean>(false)

    const addApprovedAmount = async (): Promise<void> => {
        let currentDate = new Date().toISOString() + ""
        contractData.amountApproved = { amount: parseInt(addedAmprovedAmount + ""), insertRate: null, checkNumber: checkNumber, date: currentDate, userId: parseInt(currentUserId + "") }
        try {
            let response = await actionsWithApi("POST", URL_FOR_API + `/api/v1/Contract/${contractId}/update`, contractData)
            dispatch(addAmountApprovedEditContractPage(
                {
                    amount: response.data.amountApproved.amount,
                    insertRate: response.data.amountApproved.insertRate,
                    checkNumber: response.data.amountApproved.checkNumber,
                    date: response.data.amountApproved.date,
                    user: { ...response.data.amountApproved.user }
                }
            ))
            dispatch(toggleNotification(true))
            dispatch(setNotificationInfo({ message: "Amproved Amount has been added!", severity: "success" }))
            setOpenConfirmationWindow(false)
        }
        catch (error) {
            console.log(error.message)
            dispatch(toggleNotification(true))
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
        }
    }

    const closeConfirmationWindow = (): void => {
        setOpenConfirmationWindow(false)
    }

    return (
        <section className={s["EditContractInfo-ApprovedAmount"] + " " + s["ApprovedAmount"]}>

            <h1 className={s["ApprovedAmount-Title"]}>Amount Approved</h1>
            <div className={s["ApprovedAmount-Body"]}>
                {contractData.amountApproved &&
                    <div className={s["ApprovedAmount-Row"]}>
                        <TextField className={classes.formControl} type="number" variant="outlined" size="small" label="Approved Amount" value={contractData.amountApproved.amount} />
                        <TextField className={classes.formControl} type="text" variant="outlined" size="small" label="Interest Rate" value={contractData.amountApproved.insertRate} />
                        <TextField className={classes.formControl} type="text" variant="outlined" size="small" label="Check Number" value={checkNumber} />
                        <TextField className={classes.formControl} type="text" variant="outlined" size="small" label="Approving Admin" value={contractData?.amountApproved?.user?.firstName + " " + contractData?.amountApproved?.user?.lastName} />
                        <TextField className={classes.formControl} type="text" variant="outlined" size="small" label="Approval Date" value={dateFormatting(contractData.amountApproved.date)} />
                    </div>
                }
            </div>

            {!contractData.amountApproved &&
                <div onClick={() => setShowAddApprovedAmountSection(!showAddApprovedAmountSection)} >
                    <AddBtn text="Add Amount Approved" />
                </div>
            }

            {showAddApprovedAmountSection && !contractData.amountApproved &&
                <div className={s["ApprovedAmount-Body"]}>
                    <div className={s["ApprovedAmount-Row"]}>
                        <TextField
                            className={classes.formControl}
                            value={addedAmprovedAmount}
                            onChange={(e) => setAdedAmprovedAmount(parseInt(e.target.value + ""))}
                            type="text"
                            variant="outlined"
                            size="small"
                            label="Approved Amount"
                            required
                        />
                        <TextField className={classes.formControl} value={checkNumber} type="text" variant="outlined" size="small" label="Check Number" />
                        <Button
                            className={classes.formControl + " " + classes.button}
                            onClick={() => setOpenConfirmationWindow(true)}
                            variant="contained"
                            color="primary"
                        >
                            Add Amount Approved
                        </Button>
                    </div>
                </div>
            }

            <AddApprovedAmountConfirmationWindow
                open={openConfirmationWindow}
                approveAmount={addApprovedAmount}
                closeConfirmationWindow={closeConfirmationWindow}
            ></AddApprovedAmountConfirmationWindow>

        </section>
    )
}