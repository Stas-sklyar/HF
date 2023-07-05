import DateFnsUtils from "@date-io/date-fns"
import { Button, Modal, Backdrop, Fade, Box, Typography, TextField, createStyles, makeStyles, Theme, FormControl, InputLabel, MenuItem, Select } from "@material-ui/core"
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { editUsersLawFirm, setNotificationInfo, toggleNotification } from "../../../../actions/actions"
import { URL_FOR_API } from "../../../../constants/constants"
import actionsWithApi from "../../../../customHooks/actionsWithApi"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        },
        formControl: {
            width: 250,
            marginBottom: 20,
            "&:last-child": {
                marginBottom: 0
            },
        },
        btnsBox: {
            width: 250,
            display: "flex",
            justifyContent: "space-between",
            marginTop: 50,
            [theme.breakpoints.down('xs')]: {
                marginTop: 20,
            }
        },
        btn: {
            width: 100,
        },
        modalWindow: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            backgroundColor: theme.palette.background.paper,
            padding: 40,
            [theme.breakpoints.down('xs')]: {
                width: 250,
                padding: 20
            }
        }
    }),
)

const changeDateFormat = (sourceDate: string) => {
    let separator = '/'
    let defaultDateOfJoined: Date | string = new Date(sourceDate)
    let currentYear: string | number = defaultDateOfJoined.getFullYear()
    let currentMonth: string | number = defaultDateOfJoined.getMonth() + 1
    let currentDate: string | number = defaultDateOfJoined.getDate()

    if (currentDate < 10) {
        currentDate = '0' + currentDate
    }
    if (currentMonth < 10) {
        currentMonth = '0' + currentMonth
    }
    return currentYear + separator + currentMonth + separator + currentDate
}

type EditLawFirmInfoPropsType = {
    openEditLawFirmWindow: boolean
    handleCloseEditLawFirmWindow(e: boolean): void
    editableLawFirmInfo: any
    editableUserId: string
}

export default function EditLawFirmInfo(props: EditLawFirmInfoPropsType) {
    const classes = useStyles()
    const dispatch = useDispatch()

    const [dateOfJoined, setDateOfJoined] = useState<any>(changeDateFormat(props.editableLawFirmInfo.startDate))
    const [isPresentLawFirm, setIsPresentLawFirm] = useState<boolean>(props.editableLawFirmInfo.present)
    const [endDate, setEndDate] = useState<any>(props.editableLawFirmInfo.endDate)

    const setDefaultValues = () => {
        setIsPresentLawFirm(props.editableLawFirmInfo.present)
        setDateOfJoined(changeDateFormat(props.editableLawFirmInfo.startDate))
        if (!props.editableLawFirmInfo.present) {
            setEndDate(changeDateFormat(props.editableLawFirmInfo.endDate))
        }
    }

    useEffect(() => {
        setDefaultValues()
    }, [props])

    const handleSubmit = async (e: React.FormEvent<EventTarget>) => {
        e.preventDefault()
        let fixedDateOfJoined = new Date(new Date(dateOfJoined).setHours(12)).toISOString()
        let fixedEndDate = new Date(new Date(endDate).setHours(12)).toISOString()

        try {
            let updatedLawFirm = {
                id: props.editableLawFirmInfo.id,
                lawFirmUserId: props.editableLawFirmInfo.lawFirmUserId,
                firstName: props.editableLawFirmInfo.firstName,
                startDate: fixedDateOfJoined,
                present: isPresentLawFirm,
                endDate: fixedEndDate,
                userId: props.editableUserId
            }
            dispatch(editUsersLawFirm(props.editableLawFirmInfo.id, updatedLawFirm))

            await actionsWithApi("POST", URL_FOR_API + `/updateLawFirm/${props.editableLawFirmInfo.id}`, updatedLawFirm)
            dispatch(setNotificationInfo({ message: "LawFirm successfuly edited", severity: "success" }))
            dispatch(toggleNotification(true))
            props.handleCloseEditLawFirmWindow(true)
        }
        catch (error) {
            console.log(error.message)
        }
    }

    return (
        <>
            <Modal
                open={props.openEditLawFirmWindow}
                onClose={props.handleCloseEditLawFirmWindow}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={props.openEditLawFirmWindow}>
                    <Box className={classes.modalWindow}>
                        <Typography variant="h6" component="h2">
                            <form className={classes.form} onSubmit={(e) => handleSubmit(e)}>
                                <TextField className={classes.formControl} label="Law Firm" value={props.editableLawFirmInfo.firstName} variant="outlined" size="small" />
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker className={classes.formControl} onChange={(date) => setDateOfJoined(date)} value={dateOfJoined}
                                        disableToolbar variant="inline" format="MM/dd/yyyy" margin="normal" label="Date Joined"
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }} required
                                    />
                                </MuiPickersUtilsProvider>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="present-law-firm-label">Still Working Here</InputLabel>
                                    <Select labelId="present-law-firm-label" defaultValue={isPresentLawFirm ? "yes" : "no"} onChange={() => setIsPresentLawFirm(!isPresentLawFirm)} required>
                                        <MenuItem value="yes">Yes</MenuItem>
                                        <MenuItem value="no">No</MenuItem>
                                    </Select>
                                </FormControl>
                                {!isPresentLawFirm &&
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker className={classes.formControl} onChange={(date) => setEndDate(date)} value={endDate}
                                            disableToolbar variant="inline" format="MM/dd/yyyy" margin="normal" label="End Date"
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }} required={!isPresentLawFirm}
                                        />
                                    </MuiPickersUtilsProvider>
                                }
                                <div className={classes.btnsBox}>
                                    <Button className={classes.btn} variant="contained" color="secondary" onClick={() => props.handleCloseEditLawFirmWindow(true)}>Cancel</Button>
                                    <Button className={classes.btn} type="submit" variant="contained" color="primary">Save</Button>
                                </div>
                            </form>
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}