import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import {useEffect, useRef, useState} from 'react'
import AddBtn from '../../shared/AddBtn/AddBtn'
import s from './LawFirms.module.scss'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../reducers/rootReducers'
import { addNewLawFirmForEditUser, setDataToAddFirmSectionForEditUser, setNotificationInfo, toggleNotification } from '../../../actions/actions'
import { URL_FOR_API } from '../../../constants/constants'
import actionsWithApi from '../../../customHooks/actionsWithApi'
import { Autocomplete } from '@material-ui/lab'
import dateFormatting from '../../../scripts/dateFormatting'
import { useLocation } from 'react-router-dom'
import EditLawFirmInfo from './EditLawFirmInfo/EditLawFirmInfo'
import { LawFirmType } from "../../../types/lawFirmType";
import Preloader from '../../shared/Preloader/Preloader'


export default function LawFirms(props: any) {
    const dispatch = useDispatch()
    const editingUser = useSelector((state: RootState) => state.editUserPage)
    const [addFirmSection, showAddFirmSection] = useState<boolean>(false)
    let location = useLocation()
    let editableUserId = location.search.split("").slice(1, location.search.split("").length).join("")
    const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

    const [userData, setUserData] = useState(props.data)
    useEffect(() => {
        setUserData(props.data)
    }, [props]);

    const [dateJoined, setDateJoined] = useState<Date | null>(new Date('2021-01-01T23:59:59'))
    const [endDate, setEndDate] = useState<Date | null>(new Date('2021-01-01T23:59:59'))

    const handleJoinedDateChange = (date: Date | null) => {
        setDateJoined(date)
    }
    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date)
    }

    const handleAddFirm = (e: any) => {
        let value = e.target.value
        const name = e.target.name
        dispatch(setDataToAddFirmSectionForEditUser({ [name]: value }))
    }

    const [selectedLawFirm, setSelectedLawFirm] = useState<number>(-1)
    const [selectedLawFirmName, setSelectedLawFirmName] = useState<string>("")
    const [selectedLawFirmIsPresent, setSelectedLawFirmIsPresent] = useState<string>("No")
    const addNewLawFirm = async (e: React.FormEvent<EventTarget>) => {
        e.preventDefault()
        if (selectedLawFirm !== -1) {
            try {
                let response = await actionsWithApi("POST", URL_FOR_API + `/api/v1/User/${editableUserId}/addLawFirms`,
                    {
                        lawFirmUserId: selectedLawFirm,
                        startDate: dateJoined,
                        endDate: selectedLawFirmIsPresent === "No" ? endDate : new Date().toISOString() + "",
                        present: selectedLawFirmIsPresent === "Yes" ? true : false,
                        userId: editableUserId,
                        firstName: selectedLawFirmName
                    }
                )

                let addedLawFirm = response.data.lawFirms[response.data.lawFirms.length - 1]
                dispatch(addNewLawFirmForEditUser(
                    {
                        lawFirmUserId: addedLawFirm.lawFirmUserId,
                        startDate: addedLawFirm.startDate,
                        endDate: addedLawFirm.endDate,
                        present: addedLawFirm.present,
                        userId: addedLawFirm.userId,
                        firstName: addedLawFirm.firstName
                    }
                ))
            }
            catch (error) {
                dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
                dispatch(toggleNotification(true))
                console.log(error.message)
            }
        }
    }

    const [loaderIsActive, setLoaderIsActive] = useState<boolean>(false)
    const [lawFirms, setLawFirms] = useState<any>([])
    const getLawFirms = async (searchValue: string = "") => {
        if (searchValue.length < 3) {
            return
        }

        try {
            setLoaderIsActive(true)
            let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/Autocomplete/lawFirm?userName=${searchValue}`)
            setLawFirms(response.data)
            setLoaderIsActive(false)
        }
        catch (error) {
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            dispatch(toggleNotification(true))
            console.log(error.message)
            setLoaderIsActive(false)
            setLawFirms([])
        }
    }

    const [editableLawFirmInfo, seteEditableLawFirmInfo] = useState<any>({})
    const [openEditLawFirmWindow, setOpenEditLawFirmWindow] = useState<boolean>(false)
    const handleOpenEditLawFirmWindow = (indexOfEditableLawFirm: number) => {
        setOpenEditLawFirmWindow(true)
        seteEditableLawFirmInfo(editingUser.lawFirms[indexOfEditableLawFirm])
    }
    const handleCloseEditLawFirmWindow = () => setOpenEditLawFirmWindow(false)

    const handleAutocomplete = async (value: string): Promise<void> => {
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current)
        }

        searchTimerRef.current = setTimeout(() => {
            getLawFirms(value)
        }, 500)
    }

    if (!props) {
        return (
            <Preloader size="100" position="center" />
        )
    }

    else {
        return (
            <section className={s["LawFirms"]}>
                {userData?.lawFirms?.length === 0 &&
                    <h2 className={s["LawFirms-Subtitle"]}>Firms not found</h2>
                }

                {userData?.textLawFirm &&
                    <div className={s["LawFirms-Subtitle"]}>
                        Law Firm specified by the user during registration:
                        <span className={s["LawFirms-TextLawFirmName"]}>{userData?.textLawFirm}</span>
                    </div>
                }

                {editingUser.lawFirms.length > 0 && editingUser.lawFirms
                    .map((lawFirm, index: number) => {
                        return (
                            <div className={s["LawFirms-Item"]} key={lawFirm.id}>
                                <TextField label="Law Firm" className={s["LawFirms-FormControl"]} value={lawFirm.firstName} variant="outlined" size="small" />
                                <TextField label="Date Joined" className={s["LawFirms-FormControl"]} type="text" value={lawFirm.startDate ? dateFormatting(lawFirm.startDate) : ""} variant="outlined" size="small" />

                                {!lawFirm.present &&
                                    <TextField label="End Date" className={s["LawFirms-FormControl"]} type="text" value={lawFirm.endDate ? dateFormatting(lawFirm.endDate) : ""} variant="outlined" size="small" />
                                }

                                {lawFirm.present &&
                                    <TextField label="End Date" className={s["LawFirms-FormControl"]} type="text" value="Still Working Here" variant="outlined" size="small" />
                                }

                                <div id={index + ""} onClick={(e) => handleOpenEditLawFirmWindow(index)}><Button type="button" variant="contained" color="primary">Edit</Button></div>
                            </div>
                        )
                    })
                }
                <div onClick={() => showAddFirmSection(!addFirmSection)}>
                    <AddBtn text="Add Law Firm" />
                </div>

                {addFirmSection &&
                    <form className={s["LawFirms-AddFirmSection"] + " " + s["AddFirmSection"]} onSubmit={(e) => addNewLawFirm(e)}>
                        <Autocomplete
                            className={s['LawFirms-FormControl']}
                            options={lawFirms || []}
                            loading={loaderIsActive}
                            getOptionLabel={(option: any) =>
                                (option.firstName ? (option.firstName.toString() + " ") : "") +
                                (option.lastName ? option.lastName.toString() + "" : "")
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Law Firm"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    onChange={e => handleAutocomplete(e.target.value || "")}
                                />
                            )}
                            onChange={(e, value) => {
                                setSelectedLawFirmName(value && value.firstName ? value.firstName : "")
                                setSelectedLawFirm(value && value.id ? value.id : -1)
                            }}
                        />

                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker className={s['LawFirms-FormControl']} name="addFirmDateOfJoined" value={dateJoined} disableToolbar variant="inline"
                                format="MM/dd/yyyy" margin="normal" label="Date Joined"
                                onChange={(data) => handleJoinedDateChange(data)} onKeyUp={(e) => handleAddFirm(e)} KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }} required
                            />
                        </MuiPickersUtilsProvider>

                        <FormControl className={s['LawFirms-FormControl']}>
                            <InputLabel id="still-working-label">Still Working Here</InputLabel>
                            <Select labelId="still-working-label" defaultValue="No" onChange={(e) => setSelectedLawFirmIsPresent(e.target.value + "")} required>
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                            </Select>
                        </FormControl>

                        {selectedLawFirmIsPresent === "No" &&
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker className={s['LawFirms-FormControl']} name="addFirmDateEnd" value={endDate} disableToolbar variant="inline"
                                    format="MM/dd/yyyy" margin="normal" label="End Date"
                                    onChange={(data) => handleEndDateChange(data)} onKeyUp={(e) => handleAddFirm(e)} KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }} required={selectedLawFirmIsPresent === "No"}
                                />
                            </MuiPickersUtilsProvider>
                        }

                        <Button className={s['LawFirms-Btn']} type="submit" variant="contained" color="primary">Add Firm</Button>
                    </form>
                }
                <EditLawFirmInfo
                    openEditLawFirmWindow={openEditLawFirmWindow}
                    handleCloseEditLawFirmWindow={handleCloseEditLawFirmWindow}
                    editableLawFirmInfo={editableLawFirmInfo}
                    editableUserId={editableUserId}
                />
            </section >
        )
    }
}