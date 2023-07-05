import DateFnsUtils from '@date-io/date-fns'
import { createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, TextField, Theme } from '@material-ui/core'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editUserStatus, setDataForEditUser, setNotificationInfo, toggleNotification } from '../../../actions/actions'
import { URL_FOR_API } from '../../../constants/constants'
import actionsWithApi from '../../../customHooks/actionsWithApi'
import dateFormatting from '../../../scripts/dateFormatting'
import getCookie from '../../../scripts/getCookie'
import { StatesType } from '../../../types/stateType'
import s from './UserInfo.module.scss'
import { RootState } from '../../../reducers/rootReducers'
import Preloader from '../../shared/Preloader/Preloader'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            width: 220,
            marginBottom: 20,
            [theme.breakpoints.down('xs')]: {
                width: "100%"
            }
        }
    }),
);

export default function UserInfo(props: any) {
    const dispatch = useDispatch()
    const classes = useStyles()
    let states: Array<StatesType> = useSelector((state: RootState) => state.states)
    const [userData, setUserData] = useState(props.data)
    useEffect(() => {
        setUserData(props.data)
    }, [props]);

    const setUserStatus = (status: string | unknown) => {
        dispatch(editUserStatus(status + ""))
        userStatusChanged()
    }

    const editStateHandle = (e: any) => {
        let value = e.target.value
        const name = e.target.name

        value = value.split(" ")
        dispatch(setDataForEditUser({
            [name]:
            {
                key: value[0],
                name: value[1],
            }
        }))
    }

    const [statusChanged, setStatusChanged] = useState<boolean>(false)
    const [currentUsername, setCurrentUsername] = useState<string>("")
    let currentUserId = getCookie("currentUserId")
    const userStatusChanged = async () => {
        setStatusChanged(true)
        try {
            let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/User/${currentUserId}`)
            setCurrentUsername(response.data.firstName + " " + response.data.lastName)
        }
        catch (error) {
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            dispatch(toggleNotification(true))
            console.log(error.message)
        }
    }

    const [dateOfBirth, setDateOfBirth] = useState<MaterialUiPickersDate | string>(userData.dateOfBirth ? dateFormatting(userData.dateOfBirth) : "")
    useEffect(() => {
        setDateOfBirth(props.data.dateOfBirth)
    }, [props.data.dateOfBirth])
    const handleDateOfBirdth = (date: MaterialUiPickersDate) => {
        dispatch(setDataForEditUser({ "dateOfBirth": date }))
        setDateOfBirth(date)
    }

    if (!props) {
        return (
            <Preloader size="100" position="center" />
        )
    }

    else if (userData.id) {
        return (
            <section className={s["UserInfo"]}>
                <div className={s["UserInfo-Column"]}>
                    <TextField className={classes.formControl} name="createDate" type="text" value={dateFormatting(userData?.createDate + "")} variant="outlined" size="small" label="Date Created" />
                    <TextField className={classes.formControl} name="dateLogin" type="text" label="Last Log In" value={dateFormatting(userData.dateLogin)} variant="outlined" size="small" onChange={(e) => props.handler(e)} />
                    <TextField className={classes.formControl} label="User ID" value={userData.id} type="number" variant="outlined" size="small" />
                    <TextField className={classes.formControl} name="email" label="Email" defaultValue={userData.email} variant="outlined" size="small" onChange={(e) => props.handler(e)} />
                    <TextField className={classes.formControl} name="firstName" label="First Name" defaultValue={userData.firstName} variant="outlined" size="small" onChange={(e) => props.handler(e)} />
                    <TextField className={classes.formControl} name="lastName" label="Last Name" defaultValue={userData.lastName} variant="outlined" size="small" onChange={(e) => props.handler(e)} />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker className={classes.formControl} name="dateOfBirth" disableToolbar variant="inline" format="MM/dd/yyyy" margin="normal" value={dateOfBirth} label="Date of Birth" onChange={(date) => handleDateOfBirdth(date)} />
                    </MuiPickersUtilsProvider>
                    <TextField className={classes.formControl} name="streetAddress" label="Street Adress" defaultValue={userData.streetAddress} variant="outlined" size="small" onChange={(e) => props.handler(e)} />
                    <TextField className={classes.formControl} name="city" label="City" defaultValue={userData.city} variant="outlined" size="small" onChange={(e) => props.handler(e)} />
                    <FormControl className={classes.formControl}>
                        <InputLabel id="state-label">State</InputLabel>
                        <Select labelId="state-label" name="state" defaultValue={userData.state ? userData.state.key + " " + userData.state.name : "Arkansas"} onChange={(e) => editStateHandle(e)}>
                            {states.length > 0 && states.map((state) => {
                                return (
                                    <MenuItem key={state.key} value={state.key + " " + state.name}>{state.name}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <TextField className={classes.formControl} name="zipCode" label="Zipcode" defaultValue={userData.zipCode} variant="outlined" size="small" onChange={(e) => props.handler(e)} />
                    <TextField className={classes.formControl} name="phoneNumber" label="Phone Number" defaultValue={userData.phoneNumber} variant="outlined" size="small" onChange={(e) => props.handler(e)} />
                    <TextField className={classes.formControl} name="website" label="Law Firm Website" defaultValue={userData.website} variant="outlined" size="small" onChange={(e) => props.handler(e)} />
                    <TextField className={classes.formControl} name="loanLimit" type="number" label="Loan Limit" defaultValue={userData.loanLimit ? userData.loanLimit : ""} variant="outlined" size="small" onChange={(e) => props.handler(e)} />
                    <FormControl className={classes.formControl}>
                        <InputLabel id="ban-label">Ban on New Contracts</InputLabel>
                        <Select labelId="ban-label" name="banned" defaultValue={userData.banned ? "Yes" : "No"} onChange={(e) => props.handler(e)}>
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField className={classes.formControl} name="additionalFee" type="number" label="Additional Interest Rate" defaultValue={userData.additionalFee ? userData.additionalFee : ""} variant="outlined" size="small" onChange={(e) => props.handler(e)} />
                </div>

                <div className={s["UserInfo-Column"]}>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="dregister-status-label">User Status</InputLabel>
                        <Select labelId="register-status-label" name="userStatusId" defaultValue={userData.userStatus.userStatusesValue} onChange={(e) => setUserStatus(e.target.value)} >
                            <MenuItem value="New">New</MenuItem>
                            <MenuItem value="Approved">Approved</MenuItem>
                            <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="user-type-label">User Type</InputLabel>
                        <Select labelId="user-type-label" name="userType" defaultValue={userData.userType} onChange={(e) => props.handler(e)}>
                            <MenuItem value="Attorney">Attorney</MenuItem>
                            <MenuItem value="Client">Client</MenuItem>
                            <MenuItem value="LawFirm">LawFirm</MenuItem>
                            <MenuItem value="Administrator">Admin</MenuItem>
                        </Select>
                    </FormControl>
                    {
                        statusChanged &&
                        <div className={s["UserInfo-Column"]}>
                            <TextField className={classes.formControl} type="string" value={dateFormatting(new Date().toISOString())} variant="outlined" size="small" label="Update Date" />
                            <TextField className={classes.formControl} type="text" value={currentUsername} variant="outlined" size="small" label="Updated By" />
                        </div>
                    }
                    {
                        userData.userStatus.userStatusesValue != "New" && !statusChanged &&
                        <div className={s["UserInfo-Column"]}>
                            <TextField className={classes.formControl} type="string" value={dateFormatting(userData.userStatus.date)} variant="outlined" size="small" label="Update Date" />
                            <TextField className={classes.formControl} type="text" value={userData.userStatus.approvedByUserId} variant="outlined" size="small" label="Approved By User Id" />
                        </div>
                    }
                </div>
            </section>
        )
    }
    else {
        return (
            <h1>No data has been received, please refresh the page</h1>
        )
    }
}
