import { Button, TextField } from "@material-ui/core"
import { FormEvent, useEffect, useState } from "react"
import { setContentToInfoPage, setNotificationInfo, toggleNotification } from "../../actions/actions"
import { URL_FOR_API } from "../../constants/constants"
import actionsWithApi from "../../customHooks/actionsWithApi"
import { validatePassword } from "../../scripts/registrationValidate"
import s from "./ResetPasswordSuccess.module.scss"
import { history } from '../../../App'
import { useDispatch } from "react-redux"
import { useLocation } from "react-router-dom"
import { TokenAndEmailDataFromURL, getTokenAndEmailFromURL } from "../../scripts/getTokenAndEmailFromLink"

export default function ResetPasswordSuccess() {
    const dispatch = useDispatch()
    
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")

    const location = useLocation()
    const [tokenAndEmailDataFromURL, setTokenAndEmailDataFromURL] = useState<TokenAndEmailDataFromURL>({
        token: "",
        email: ""
    })

    const [resultValidationPasswords, setResultValidationPasswords] = useState<boolean>(true)
    const [passwordsIsMatch, setPasswordsIsMatch] = useState<boolean>(true)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let [validationIsSuccessfull, passwordsIsIdentical] = validatePassword(password, confirmPassword)
        setResultValidationPasswords(validationIsSuccessfull)
        setPasswordsIsMatch(passwordsIsIdentical)

        if (validationIsSuccessfull && passwordsIsIdentical) {
            try {
                await actionsWithApi(
                    "POST",
                    URL_FOR_API + "/api/v1/Account/reset-password-success?passwordToken=" + tokenAndEmailDataFromURL.token,
                    {
                        password,
                        email: tokenAndEmailDataFromURL.email
                    }
                )
                setPassword("")
                setConfirmPassword("")

                dispatch(setContentToInfoPage({
                    title: "Password changed successfully!",
                    textDescription: "Go to the login page to log in with a new password.",
                    hasInput: false,
                    contractSupportBtn: false,
                    additionalBtn: true,
                    buttonText: "Go to Login",
                    btnLink: "/login"
                }))
                history.push('/information-page')
            }
            catch (error) {
                dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
                dispatch(toggleNotification(true))
            }
        }
    }

    useEffect(() => {
        setTokenAndEmailDataFromURL(getTokenAndEmailFromURL(location.search))
    }, [])

    return (
        <div className={s["ResetPasswordSuccess"]}>
            <h1 className={s["ResetPasswordSuccess-Title"]}>Welcome Back</h1>
            <p className={s["ResetPasswordSuccess-Subtitle"]}>Enter a new password to acces your account.</p>

            <form className={s["ResetPasswordSuccess-Form"]} onSubmit={e => handleSubmit(e)}>
                <TextField
                    className={s['ResetPasswordSuccess-Input']}
                    type="password" variant="outlined" size="small"
                    label="New Password"
                    required
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <TextField
                    className={s['ResetPasswordSuccess-Input']}
                    type="password" variant="outlined" size="small"
                    label="Repeat Password"
                    required
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!resultValidationPasswords || !passwordsIsMatch}
                    helperText={
                        (!resultValidationPasswords || !passwordsIsMatch)
                            ? !passwordsIsMatch ? "Password mismatch" : "Password must be at least 8 characters, including 1 number and 1 uppercase letter"
                            : false
                    }
                />

                <Button
                    disabled={password === "" || confirmPassword === ""}
                    type="submit"
                    className={s['ResetPasswordSuccess-Btn']}
                    variant="contained"
                    color="primary"
                >
                    Reset Password
                </Button>
            </form>
        </div>
    );
}