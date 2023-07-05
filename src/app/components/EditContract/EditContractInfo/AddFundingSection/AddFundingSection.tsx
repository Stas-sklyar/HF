import { Button, createStyles, makeStyles, TextField, Theme } from '@material-ui/core'
import React, { useState } from 'react'
import AddBtn from '../../../shared/AddBtn/AddBtn'
import s from '../EditContractInfo.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setNotificationInfo, toggleNotification } from '../../../../actions/actions'
import { RootState } from '../../../../reducers/rootReducers'
import { URL_FOR_API } from '../../../../constants/constants'
import actionsWithApi from '../../../../customHooks/actionsWithApi'
import getCookie from '../../../../scripts/getCookie'
import { useLocation } from 'react-router-dom'
import dateFormatting from '../../../../scripts/dateFormatting'
import AddApprovedAmountConfirmationWindow from "../AmountConfirmationWindow";

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
        },
        button: {
            height: 35
        }
    })
)
type AddFundingSectionPropsType = {
    checkNumber: string
    childContractHasBeenAdded: boolean
    setChildContractHasBeenAdded(toggle: boolean): void
}

export default function AddFundingSection(props: AddFundingSectionPropsType) {
    const classes = useStyles()
    const dispatch = useDispatch()
    const currentUserId = getCookie("currentUserId")
    const location = useLocation()
    const contractId = location.search.split("").slice(1, location.search.split("").length).join("")
    const parentContractInfo = useSelector((state: RootState) => state.editContract)

    const childContracts = useSelector((state: RootState) => state.editContract.childContracts)
    const [addFundingSection, setAddFundingSection] = useState(false)
    const [addedAdditionalAmount, setAdedAdditionalAmount] = useState<string>("")

    const [openConfirmationWindow, setOpenConfirmationWindow] = useState<boolean>(false)

    const addFunding = async (): Promise<void> => {
        try {
            let currentDate = new Date().toISOString() + ""
            let childContractInfo = await actionsWithApi(
                "POST",
                URL_FOR_API + `/api/v1/Contract`,
                {
                    caseId: "caseId",
                    contractType: parentContractInfo.contractType,
                    parentContractId: parseInt(contractId),
                    amountRequested: {
                        amount: parseInt(addedAdditionalAmount),
                        date: currentDate,
                        userId: currentUserId
                    },

                    contractClientDTO: parentContractInfo?.contractClientDTO
                        ? {
                            user: null,
                            userId: parentContractInfo?.contractClientDTO?.userId
                        }
                        : null,
                }
            )
            props.setChildContractHasBeenAdded(!props.childContractHasBeenAdded)
            dispatch(toggleNotification(true))
            dispatch(setNotificationInfo({ message: "Additional Funding added", severity: "success" }))
            setOpenConfirmationWindow(false)
            setAdedAdditionalAmount("")
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
        <section className={s["EditContractInfo-AddFundingSection"] + " " + s["AddFundingSection"]}>

            <h1 className={s["AddFundingSection-Title"]}>Additional Funding</h1>
            <div className={s["AddFundingSection-Body"]}>
                {childContracts.length > 0 && childContracts
                    .map((childContract, index) => (
                        <div key={index} className={s["AddFundingSection-Row"]}>
                            <TextField className={classes.formControl}
                                value={childContract.amountRequested?.amount}
                                type="number"
                                variant="outlined"
                                size="small"
                                label="Additional Funding"
                            />
                            <TextField
                                className={classes.formControl}
                                value={childContract.amountRequested?.insertRate}
                                type="text"
                                variant="outlined"
                                size="small"
                                label="Interest Rate"
                            />
                            <TextField
                                className={classes.formControl}
                                value={childContract.identifier}
                                type="text"
                                variant="outlined"
                                size="small"
                                label="Check Number"
                            />
                            <TextField
                                className={classes.formControl}
                                value={childContract.userDTO?.firstName + " " + childContract.userDTO?.lastName}
                                type="text"
                                variant="outlined"
                                size="small"
                                label="Approving Admin"
                            />
                            <TextField
                                className={classes.formControl}
                                value={dateFormatting(childContract.amountRequested?.date)}
                                type="text"
                                variant="outlined"
                                size="small"
                                label="Approval Date"
                            />
                        </div>
                    ))
                }
            </div>

            <div
                className={!addFundingSection ? s["AddFundingSection-AddBtnBox"] : s["AddFundingSection-AddBtnBox__Active"]}
                onClick={() => setAddFundingSection(!addFundingSection)}
            >
                <AddBtn text="Add Funding" />
            </div>

            {addFundingSection &&
                <div className={s["AddFundingSection-Body"]}>
                    <div className={s["AddFundingSection-Row"]}>
                        <TextField
                            className={classes.formControl}
                            onChange={(e) => setAdedAdditionalAmount(e.target.value)}
                            type="text"
                            variant="outlined"
                            size="small"
                            label="Additional Funding"
                            required
                        />
                        <Button
                            className={classes.button}
                            onClick={() => setOpenConfirmationWindow(true)}
                            variant="contained"
                            color="primary"
                        >
                            Add Funding
                        </Button>
                    </div>
                </div>
            }

            <AddApprovedAmountConfirmationWindow
                open={openConfirmationWindow}
                approveAmount={addFunding}
                closeConfirmationWindow={closeConfirmationWindow}
            ></AddApprovedAmountConfirmationWindow>
        </section>
    )
}