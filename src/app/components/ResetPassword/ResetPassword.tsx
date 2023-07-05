import { Button, TextField } from "@material-ui/core"
import { FormEvent, useState } from "react"
import { useDispatch } from "react-redux"
import { setContentToInfoPage, setNotificationInfo, toggleNotification } from "../../actions/actions"
import { URL_FOR_API } from "../../constants/constants"
import actionsWithApi from "../../customHooks/actionsWithApi"
import s from "./ResetPassword.module.scss"
import { history } from '../../../App'

export default function ResetPassword() {
    const dispatch = useDispatch()
    const [email, setEmail] = useState("")
    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await actionsWithApi("POST", URL_FOR_API + `/api/v1/Account/reset-password?email=${email}`)
            setEmail("")
            dispatch(setContentToInfoPage({
                title: "Email Sent",
                textDescription: "An email has been sent to the address you indicated with a link to reset your password. Click on the link to enter a new password.",
                hasInput: false,
                additionalBtn: false,
                contractSupportBtn: false
            }))
            history.push('/information-page')
        }
        catch (error) {
            if (error.response.status === 404) {
                dispatch(setNotificationInfo({ message: "No user found with this email", severity: "error" }))
                dispatch(toggleNotification(true))
            }
            else {
                dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
                dispatch(toggleNotification(true))
            }
        }
    }

    return (
        <div className={s["ResetPassword"]}>
            <h1 className={s["ResetPassword-Title"]}>Forgot your password?</h1>
            <p className={s["ResetPassword-Subtitle"]}>Enter your email account and we'll send<br /> a link to reset the password</p>
            <form className={s["ResetPassword-Form"]} onSubmit={(e) => handleSubmit(e)}>
                <TextField
                    className={s['ResetPassword-Input']}
                    variant="outlined"
                    size="small"
                    required
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email"
                />

                <Button
                    type="submit"
                    className={s['ResetPassword-Btn']}
                    variant="contained"
                    color="primary"
                    disabled={email === ""}
                >
                    Send Link
                </Button>
            </form>
        </div>
    );
}