import { Button, createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, TextField, Theme } from '@material-ui/core'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleNotification, setNotificationInfo, addStatusForEditContract } from '../../../actions/actions'
import { URL_FOR_API } from '../../../constants/constants'
import actionsWithApi from '../../../customHooks/actionsWithApi'
import { ContractStatusType } from '../../../types/contractTypes'
import AddBtn from "../../shared/AddBtn/AddBtn"
import { useLocation } from 'react-router-dom'
import Preloader from '../../shared/Preloader/Preloader'
import s from './StatusHistory.module.scss'
import getCookie from '../../../scripts/getCookie'
import { RootState } from '../../../reducers/rootReducers'
import dateFormatting from '../../../scripts/dateFormatting'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            width: 200,
            marginBottom: 25,
            marginRight: 25,
            [theme.breakpoints.down('xs')]: {
                marginRight: 0,
                width: "100%",
            }
        },
        button: {
            width: 150,
            height: 35
        }
    }),
)

type StatusHistoryType = {
    handlerForInputs(e: any): void
}

export default function StatusHistory(props: StatusHistoryType) {
    const dispatch = useDispatch()
    const location = useLocation()
    const classes = useStyles()
    const [loaderIsActive, setLoaderIsActive] = useState<boolean>(false)
    const [showAddStatusSection, setShowAddStatusSection] = useState<boolean>(false)
    const contractId = location.search.split("").slice(1, location.search.split("").length).join("")
    const currentUserId = getCookie("currentUserId")
    const contractStatus = useSelector((state: RootState) => state.editContract.contractStatus)

    const [addingStatus, setAddingStatus] = useState<string>("")
    const handleSubmit = async (e: React.FormEvent<EventTarget>) => {
        e.preventDefault()
        setLoaderIsActive(true)
        let currentDate = new Date().toISOString() + ""
        try {
            await actionsWithApi(
                "POST",
                URL_FOR_API + `/api/v1/Contract/${contractId}/statusUpdate`,
                {
                    contractsStatus: addingStatus,
                    dateChange: currentDate,
                    userId: currentUserId
                }
            )
            dispatch(addStatusForEditContract(addingStatus, currentDate, parseInt(currentUserId + "")))
            dispatch(toggleNotification(true))
            dispatch(setNotificationInfo({ message: "Status added", severity: "success" }))
        }
        catch (error) {
            console.log(error.message)
            dispatch(toggleNotification(true))
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
        }
        finally {
            setLoaderIsActive(false)
        }
    }

    return (
        <section className={s["StatusHistory"]}>
            <h1 className={s["StatusHistory-Title"]}>Status History</h1>
            {contractStatus.length <= 0 &&
                <span className={s["StatusHistory-SubTitle"]}>Status History is empty</span>
            }
            <div className={s["StatusHistory-List"]} >
                {contractStatus.length > 0 && contractStatus
                    .map((status: ContractStatusType, index: number) => (
                        <div key={index} className={s["StatusHistory-Row"]} >
                            <FormControl className={classes.formControl}>
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select labelId="status-label" value={status.contractsStatus}>
                                    <MenuItem value="WaitingApproval">Waiting Approval</MenuItem>
                                    <MenuItem value="SignedPreApproval">Signed Pre-Approval</MenuItem>
                                    <MenuItem value="Approved">Approved</MenuItem>
                                    <MenuItem value="Declined">Declined</MenuItem>
                                    <MenuItem value="AwaitingFeedback">Awaiting Feedback</MenuItem>
                                    <MenuItem value="ContractSigned">Contract Signed</MenuItem>
                                    <MenuItem value="CheckSent">Check Sent</MenuItem>
                                    <MenuItem value="CheckCashed">Check Cashed</MenuItem>
                                    <MenuItem value="PaidOff">Paid Off</MenuItem>
                                    <MenuItem value="ClosedNotPaidOff">Closed Not Paid Off</MenuItem>
                                    <MenuItem value="ClosedCaseLost">Closed Case Lost</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField className={classes.formControl} value={"user id: " + status.userId} type="text" variant="outlined" size="small" label="Approved By" />
                            <TextField className={classes.formControl} value={dateFormatting(status.dateChange)} type="text" variant="outlined" size="small" label="Date Approved" />
                            <br></br>
                        </div>
                    ))
                }
            </div>

            <div className={s["StatusHistory-BtnBox"]} onClick={() => setShowAddStatusSection(!showAddStatusSection)} >
                <AddBtn text="Add Status" />
            </div>

            {showAddStatusSection &&
                <form className={s["AddStatus"]} onSubmit={(e) => handleSubmit(e)}>
                    <FormControl className={classes.formControl} >
                        <InputLabel id="add-status-label">Status</InputLabel>
                        <Select labelId="add-status-label" name="addStatus" value={addingStatus} onChange={(e) => setAddingStatus(e.target.value + "")} required>
                            <MenuItem value="WaitingApproval">Waiting Approval</MenuItem>
                            <MenuItem value="SignedPreApproval">Signed Pre-Approval</MenuItem>
                            <MenuItem value="Approved">Approved</MenuItem>
                            <MenuItem value="Declined">Declined</MenuItem>
                            <MenuItem value="AwaitingFeedback">Awaiting Feedback</MenuItem>
                            <MenuItem value="ContractSigned">Contract Signed</MenuItem>
                            <MenuItem value="CheckSent">Check Sent</MenuItem>
                            <MenuItem value="CheckCashed">Check Cashed</MenuItem>
                            <MenuItem value="PaidOff">Paid Off</MenuItem>
                            <MenuItem value="ClosedNotPaidOff">Closed Not Paid Off</MenuItem>
                            <MenuItem value="ClosedCaseLost">Closed Case Lost</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        className={classes.formControl + " " + classes.button}
                        type="submit"
                        variant="contained" color="primary"
                        disabled={loaderIsActive}
                    >
                        Add Status
                    </Button>
                    {loaderIsActive &&
                        <div className={s["AddStatus-Loader"]}>
                            <Preloader size='30' position='center' />
                        </div>
                    }
                </form>
            }

        </section >
    )
}