import { createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, TextField, Theme } from '@material-ui/core'
import s from '../CreateUser.module.scss'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { ChangeEvent, useState } from 'react'
import { StatesType } from '../../../types/stateType'
import { useDispatch, useSelector } from 'react-redux'
import { setDataForCreateUser, setStateForCreateUser } from '../../../actions/actions'
import { RootState } from '../../../reducers/rootReducers'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        standartFormControl: {
            minWidth: 200,
            marginBottom: 20,
        },
        userTypeControl: {
            minWidth: 220,
            transform: "translateY(-20px)"
        },
        formControl3: {
            width: 220
        }
    }),
);

export default function CreateUserData() {
    const classes = useStyles()
    const dispatch = useDispatch()
    let states: Array<StatesType> = useSelector((state: RootState) => state.states)

    const [dateBirdth, setDateBirdth] = useState<Date | null>(new Date('2021-01-01T23:59:59'))
    const handleBirdthDateChange = (date: Date | null) => {
        if (date != dateBirdth) {
            setDateBirdth(date)
            dispatch(setDataForCreateUser({ "dateOfBirth": date }))
        }
    }

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | ChangeEvent<{ name?: string | undefined, value: unknown }>) => {
        let value: any = e.target.value
        const name = e.target.name

        if (name === "id") {
            value = parseInt(value)
        }

        if (name === "banned") {
            value === "Yes" ? value = true : value = false
        }

        dispatch(setDataForCreateUser({ [name + ""]: value }))
    }

    handleBirdthDateChange(dateBirdth);

    return (
        <section className={s["CreateUser-UserData"]}>
            <div className={s["CreateUser-Column"]}>
                <TextField className={classes.standartFormControl} name="email" label="Email" variant="outlined" size="small" onChange={(e) => handleChange(e)} />
                <TextField className={classes.standartFormControl} name="firstName" label="First Name" variant="outlined" size="small" onChange={(e) => handleChange(e)} />
                <TextField className={classes.standartFormControl} name="lastName" label="Last Name" variant="outlined" size="small" onChange={(e) => handleChange(e)} />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker name="dateOfBirth" className={classes.standartFormControl + " " + classes.formControl3} value={dateBirdth}
                        disableToolbar variant="inline" format="MM/dd/yyyy" margin="normal" label="Date of Birth"
                        onChange={(date) => handleBirdthDateChange(date)} required
                    />
                </MuiPickersUtilsProvider>
                <TextField className={classes.standartFormControl} name="streetAddress" label="Street Adress" variant="outlined" size="small" onChange={(e) => handleChange(e)} />
                <TextField className={classes.standartFormControl} name="city" label="City" variant="outlined" size="small" onChange={(e) => handleChange(e)} />
                <FormControl className={classes.standartFormControl + " " + classes.formControl3}>
                    <InputLabel id="state-label">State</InputLabel>
                    <Select labelId="state-label" name="state" defaultValue="" onChange={(e) => dispatch(setStateForCreateUser(e.target.value + ""))} >
                        {states.length > 0 && states.map((state) => {
                            return (
                                <MenuItem key={state.key} value={state.key}>{state.name}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <TextField className={classes.standartFormControl} name="zipCode" label="Zipcode" variant="outlined" size="small" onChange={(e) => handleChange(e)} />
                <TextField className={classes.standartFormControl} name="phoneNumber" label="Phone Number" variant="outlined" size="small" onChange={(e) => handleChange(e)} />
                <TextField className={classes.standartFormControl} name="website" label="Personal Website" variant="outlined" size="small" onChange={(e) => handleChange(e)} />
                <TextField className={classes.standartFormControl} name="loanLimit" label="Loan Limit" type="number" variant="outlined" size="small" onChange={(e) => handleChange(e)} />
                <FormControl className={classes.standartFormControl + " " + classes.formControl3}>
                    <InputLabel id="ban-label">Ban on New Contracts</InputLabel>
                    <Select labelId="ban-label" name="banned" defaultValue={"No"} onChange={(e) => handleChange(e)}>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <div className={s["CreateUser-Column"]}>
                <FormControl className={s["CreateUser-UserTypeControll"] + " " + classes.standartFormControl + " " + classes.userTypeControl}>
                    <InputLabel id="user-type-label">User Type</InputLabel>
                    <Select labelId="user-type-label" name="userType" onChange={(e) => handleChange(e)}>
                        <MenuItem value="client">Client</MenuItem>
                        <MenuItem value="attorney">Attorney</MenuItem>
                        <MenuItem value="lawFirm">Law Firm</MenuItem>
                        <MenuItem value="administrator">Admin</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </section>
    )
}