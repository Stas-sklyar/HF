import React, { Dispatch, SetStateAction } from "react"
import 'date-fns'
import { TextField, Select, MenuItem, InputLabel, FormControl, Button } from '@material-ui/core'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { useDispatch, useSelector } from "react-redux"
import { handlerForRegistrationInputs, setContentToInfoPage, setNotificationInfo, toggleNotification } from "../../actions/actions"
import { RootState } from "../../reducers/rootReducers"
import { useState } from "react"
import { validateEmail, validatePassword, validateZipCode } from "../../scripts/registrationValidate"
import actionsWithApi from "../../customHooks/actionsWithApi"
import { URL_FOR_API } from "../../constants/constants"
import { history } from '../../../App'
import s from './Registration.module.scss'
import { StatesType } from "../../types/stateType"

export default function Registration() {
    const dispatch = useDispatch()
    let states: Array<StatesType> = useSelector((state: RootState) => state.states)
    let password = useSelector((state: RootState) => state.registration["password"])
    let email = useSelector((state: RootState) => state.registration["email"])
    let newUserData = useSelector((state: RootState) => state.registration)
    let zipCode = useSelector((state: RootState) => state.registration["zipCode"])

    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true)
    const [passwordsValidate, setPasswordsValidate] = useState<boolean>(true)
    const [emailValidate, setEmailValidate] = useState<boolean>(true)
    const [zipCodeIsValid, setZipCodeIsValid] = useState<boolean>(true)

    const handlerInputChange = (e: any) => {
        let value = e.target.value
        const name = e.target.name

        if (name === "state") {
            value = value.split(" ")
            dispatch(handlerForRegistrationInputs({
                [name]:
                {
                    key: value[0],
                    name: value[1],
                }
            }))
        }
        else {
            dispatch(handlerForRegistrationInputs({ [name]: value }))
        }
    }

    const actionsIfPropIsNotValid = (setPropIsNotValid: Dispatch<SetStateAction<boolean>>, message: string) => {
        setPropIsNotValid(false)
        dispatch(setNotificationInfo({ message: message, severity: "error" }))
        dispatch(toggleNotification(true))
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        let [resultValidation, passwordsIsMatch] = validatePassword(password, confirmPassword)
        let resultZipCodeValidation = validateZipCode(zipCode)

        if (!validateEmail(email)) {
            actionsIfPropIsNotValid(setEmailValidate, "The email address is invalid")
        }
        else if (!resultValidation) {
            actionsIfPropIsNotValid(setPasswordsValidate, "Password must be at least 8 characters, including 1 number and 1 uppercase letter")
        }
        else if (!passwordsIsMatch) {
            actionsIfPropIsNotValid(setPasswordsMatch, "Passwords do not match")
        }
        else if (!resultZipCodeValidation) {
            actionsIfPropIsNotValid(setZipCodeIsValid, "Zipcode is invalid")
        }
        else {
            setPasswordsMatch(true)
            setPasswordsValidate(true)
            setEmailValidate(true)
            setZipCodeIsValid(true)

            try {
                await actionsWithApi("post", URL_FOR_API + "/api/v1/Account/register", newUserData)
                dispatch(setContentToInfoPage({
                    title: "You successfully registered!",
                    textDescription: "Your request to register has been processed and one of our admins will review it shortly. If your application is confirmed, then you will receive a confirmation email and have access to apply for funding. Until then, please confirm your email via the link that has been sent to your email address.",
                    hasInput: false,
                    additionalBtn: false,
                    contractSupportBtn: true
                }))
                e.target.reset()
                window.scrollTo({ top: 0, behavior: "smooth" })
                history.push('/information-page')
            }
            catch (error) {
                if (error.response.status === 400) {
                    dispatch(setNotificationInfo({ message: "User already exists, please login", severity: "error" }))
                    dispatch(toggleNotification(true))
                } else {
                    dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
                    dispatch(toggleNotification(true))
                }
                console.log(error.message)
            }

        }
    }

    const [birthDate, setBirthDate] = React.useState<Date | null>(
        new Date('2021-01-01T23:59:59'),
    )
    const [startDate, setStartDate] = useState<any>(new Date('2021-01-01T23:59:59'))

    const handleBirthDateChange = (date: any) => {
        setBirthDate(date)
        try {
            if (date) {
                date = new Date(new Date(date).setHours(12, 12, 12)).toISOString()
                dispatch(handlerForRegistrationInputs({ "dateOfBirth": date }))
            }
        } catch (e) {
            console.log("invalid date")
        }
    }

    // const handleStartDateChange = (date: Date | null) => {
    //     setStartDate(date)
    // }

    return (
        <div className={s['Registration']}>

            <form className={s['Registration-Form']} onSubmit={(e) => handleSubmit(e)} >
                <TextField className={s['Registration-Input']} size="small" variant="outlined" required name="email" label="Email" onChange={handlerInputChange} />
                {!emailValidate && <span style={{ color: "red", marginTop: "-10px" }}>The email address is invalid</span>}
                <TextField type="password" className={s['Registration-Input']} size="small" variant="outlined" required name="password" label="Password" onChange={handlerInputChange} />
                <TextField type="password" className={s['Registration-Input']} size="small" variant="outlined" required name="confirmPassword" label="Confirm password" onChange={(e) => setConfirmPassword(e.target.value)} />
                {!passwordsMatch && <span style={{ color: "red", marginTop: "-10px" }}>Passwords do not match</span>}
                {!passwordsValidate && <span style={{ color: "red", marginBottom: "10px" }}>Password must be at least 8 characters, including 1 number and 1 uppercase letter</span>}
                <TextField className={s['Registration-Input']} size="small" variant="outlined" required name="firstName" label="First Name" onChange={handlerInputChange} />
                <TextField className={s['Registration-Input']} size="small" variant="outlined" required name="lastName" label="Last Name" onChange={handlerInputChange} />

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker name="dateOfBirth" className={s['Registration-DateInput']} value={birthDate} disableToolbar variant="inline" format="MM/dd/yyyy" margin="normal" label="Date of Birth *"
                        onChange={(data) => handleBirthDateChange(data)} KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider>

                <TextField className={s['Registration-Input']} size="small" variant="outlined" name="streetAddress" label="Street Address" onChange={handlerInputChange} />
                <TextField className={s['Registration-Input']} size="small" variant="outlined" name="city" label="City" onChange={handlerInputChange} />

                <FormControl className={s['Registration-Select']}>
                    <InputLabel id="state-label" required>State</InputLabel>
                    <Select labelId="state-label" name="state" onChange={(e) => handlerInputChange(e)} required>
                        {states.length > 0 && states.map((state) => {
                            return (
                                <MenuItem key={state.key} value={state.key + " " + state.name}>{state.name}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>

                <TextField className={s['Registration-Input']} size="small" variant="outlined" required name="zipCode" label="Zipcode" onChange={handlerInputChange} />
                {!zipCodeIsValid && <span style={{ color: "red", marginTop: "-5px" }}>Zipcode is invalid</span>}
                <TextField className={s['Registration-Input']} size="small" variant="outlined" required name="phoneNumber" label="Phone Number" onChange={handlerInputChange} />
                <TextField className={s['Registration-Input']} size="small" variant="outlined" id="website" label="Law Firm Website" name="website" onChange={handlerInputChange} />
                <TextField className={s['Registration-Input']} size="small" variant="outlined" label="Law Firm" name="textLawFirm" onChange={handlerInputChange} />

                {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker className={s['Registration-DateInput']} value={startDate} disableToolbar variant="inline" format="MM/dd/yyyy" margin="normal" label="Start Date"
                        onChange={(data) => handleStartDateChange(data)} KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider> */}

                <Button type="submit" className={s['Registration-Btn']} variant="contained" color="primary">Register</Button>
            </form>
        </div>
    )
}
