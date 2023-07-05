import s from '../CreateUser.module.scss'
import { Button, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { useEffect, useState } from 'react'
import AddBtn from '../../shared/AddBtn/AddBtn'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import { useDispatch, useSelector } from 'react-redux'
import { addLawFirmForCreateUser, setNotificationInfo, toggleNotification } from '../../../actions/actions'
import { URL_FOR_API } from '../../../constants/constants'
import actionsWithApi from '../../../customHooks/actionsWithApi'
import { RootState } from '../../../reducers/rootReducers'
import dateFormatting from '../../../scripts/dateFormatting'
import { LawFirmType } from "../../../types/lawFirmType";

export default function CreateUserAddFirm() {
    const dispatch = useDispatch()
    const addedLawFirms = useSelector((state: RootState) => state.createUser.lawFirms)
    const [addFirmSection, showAddFirmSection] = useState(false)
    const [firmId, setFirmId] = useState<string>("")
    const [lawFirmName, setLawFirmName] = useState("")
    const [dateJoined, setDateJoined] = useState<Date | null>(new Date('2021-01-01T23:59:59'))
    const [endDate, setEndDate] = useState<Date | null>(new Date('2021-01-01T23:59:59'))

    const handleJoinedDateChange = (date: Date | null) => {
        setDateJoined(date)
    }

    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date)
    }

    const addNewLawFirm = (e: React.FormEvent<EventTarget>) => {
        e.preventDefault()
        dispatch(addLawFirmForCreateUser({ firmId: firmId, startDate: dateJoined ? dateJoined.toISOString() : "", endDate: endDate ? endDate.toISOString() : "", lawFirmName: lawFirmName }))
    }

    const [lawFirms, setLawFirms] = useState<Array<LawFirmType>>([])
    const getLawFirms = async () => {
        try {
            let response = await actionsWithApi("GET", URL_FOR_API + "/api/v1/AdminUser?UserType=LawFirm")
            setLawFirms(response.data)
        }
        catch (error) {
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            dispatch(toggleNotification(true))
            console.log(error.message)
        }
    }

    useEffect(() => {
        getLawFirms()
    }, [])

    return (
        <section className={s["CreateUserAddFirm"]}>
            <h1 className={s["CreateUserAddFirm-Title"]}>Law Firms</h1>

            {addedLawFirms && addedLawFirms
                .map((firm: any) => {
                    return (
                        <ul key={firm.lawFirmUserId} className={s["AddedFirmsList"]}>
                            <li className={s["AddedFirmsList-Item"]}>
                                <span>Firm name:</span>
                                <span>{firm.lawFirmName}</span>
                            </li>
                            <li className={s["AddedFirmsList-Item"]}>
                                <span>Date joined:</span>
                                <span>{dateFormatting(firm.startDate + "")}</span>
                            </li>
                            <li className={s["AddedFirmsList-Item"]}>
                                <span>End Date:</span>
                                <span>{dateFormatting(firm.endDate + "")}</span>
                            </li>
                        </ul>
                    )
                })

            }

            <div className={s["CreateUserAddFirm-AddFirmBtn"]} onClick={() => showAddFirmSection(!addFirmSection)}>
                <AddBtn text="Add Law Firm" />
            </div>

            {addFirmSection &&
                <form className={s["AddFirmSection"]} onSubmit={(e) => addNewLawFirm(e)}>
                    <FormControl className={s["AddFirmSection-FormControl"]}>
                        <InputLabel id="law-firm-label">Law Firm</InputLabel>
                        <Select labelId="law-firm-label" name="addFirmFirstName" onChange={(e) => {
                            setFirmId((e.target.value + "").split(" ")[0] + "")
                            setLawFirmName((e.target.value + "").split(" ")[1] + "")
                        }} required>
                            {lawFirms.length > 0 && lawFirms.map((lawFirm: LawFirmType) => {
                                return (
                                    <MenuItem key={lawFirm.id} value={lawFirm.id + " " + lawFirm.firstName} data-name={lawFirm.firstName}>{lawFirm.firstName}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker className={s["AddFirmSection-FormControl"]} name="addFirmDateOfJoined" value={dateJoined} disableToolbar variant="inline"
                            format="MM/dd/yyyy" label="Date Joined"
                            onChange={(data) => handleJoinedDateChange(data)} required
                        />
                    </MuiPickersUtilsProvider>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker className={s["AddFirmSection-FormControl"]} name="addFirmDateEnd" value={endDate} disableToolbar variant="inline"
                            format="MM/dd/yyyy" label="End Date"
                            onChange={(data) => handleEndDateChange(data)} required
                        />
                    </MuiPickersUtilsProvider>
                    <div className={s["AddFirmSection-FormControl"] + " " + s["AddFirmSection-BtnBox"]}>
                        <Button type="submit" variant="contained" color="primary">Add Firm</Button>
                    </div>
                </form>
            }
        </section>
    )
}