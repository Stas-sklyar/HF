import { TextField, Button } from '@material-ui/core'
import { useDispatch, useSelector } from "react-redux"
import { handlerForLoginInputs, setContentToInfoPage, setNotificationInfo, toggleNotification } from "../../actions/actions"
import { NavLink } from "react-router-dom"
import { RootState } from '../../reducers/rootReducers'
import actionsWithApi from '../../customHooks/actionsWithApi'
import { URL_FOR_API } from '../../constants/constants'
import { history } from '../../../App'
import deleteCookie from '../../scripts/deleteCookie'
import { ChangeEvent } from "react"
import s from './Login.module.scss'
import { AxiosResponse } from 'axios'

type LoginPropsType = {
    setUserIsLogined(e: boolean): void
    userIsLogined: boolean
    userIsLogout: boolean
    setUserIsLogout(e: boolean): void
}

export default function Login(props: LoginPropsType) {
    const dispatch = useDispatch()
    const postData = useSelector((state: RootState) => state.login)

    const handlerInputChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const value = e.target.value
        const name = e.target.name

        dispatch(handlerForLoginInputs({ [name]: value }))
    }

    const setNessecceryCookies = (responseAfterLogin: AxiosResponse<any>, loginedUserStatus: string) => {
        document.cookie = `currentUserStatus=${loginedUserStatus}; secure; samesite`
        document.cookie = `token=${responseAfterLogin.data.accessToken}; secure; samesite`
        document.cookie = `currentUserId=${responseAfterLogin.data.userId}; secure; samesite`
        document.cookie = `currentUserRole=${responseAfterLogin.data.role}; secure; samesite`
        document.cookie = `currentUserName=${responseAfterLogin.data.userFirtsName + " " + responseAfterLogin.data.userLastName}; secure; samesite`
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            let response = await actionsWithApi("post", URL_FOR_API + "/api/v1/Account/login", postData)
            let loginedUserStatus: string = response.data.userStatus.userStatusesValue

            if (loginedUserStatus !== "New" && loginedUserStatus !== "Denied") {
                setNessecceryCookies(response, loginedUserStatus)
                e.target.reset()
                dispatch(setNotificationInfo({ message: "Login success", severity: "success" }))
                dispatch(toggleNotification(true))
                props.setUserIsLogined(!props.userIsLogined)
                history.push(`/user-profile?${response.data.userId}`)
            }
            else {
                await actionsWithApi("post", URL_FOR_API + "/api/v1/Account/logOut", null)
                deleteCookie()
                props.setUserIsLogout(!props.userIsLogout)
                dispatch(setContentToInfoPage({
                    title: "Limited Access",
                    textDescription: "You are not approved by the Admin and do not have access to the platform. If you believe there is an error or need assistance, please contact support.",
                    hasInput: false,
                    additionalBtn: false,
                    contractSupportBtn: true
                }))
                history.push('/information-page')
            }
        }
        catch (error) {
            if (error.response.status === 403) {
                dispatch(setNotificationInfo({ message: "Wrong password", severity: "error" }))
                dispatch(toggleNotification(true))
            } else if (error.response.status === 404) {
                dispatch(setNotificationInfo({ message: "It looks like the user doesn't exist", severity: "error" }))
                dispatch(toggleNotification(true))
            } else {
                dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
                dispatch(toggleNotification(true))
            }
            console.log(error.message)
        }
    }

    return (
        <div className={s['Login']}>

            <form className={s['Login-Form']} onSubmit={(e) => handleSubmit(e)}>
                <label className={s['Login-Label']}>
                    <TextField className={s['Login-Input']} variant="outlined" size="small" required id="email"
                        name="email" onChange={(e) => handlerInputChange(e)} placeholder="Email" />
                </label>
                <label className={s['Login-Label']}>
                    <TextField className={s['Login-Input']} variant="outlined" size="small" required id="password" name="password"
                        autoComplete="current-password" type="password" onChange={(e) => handlerInputChange(e)} placeholder="Password" />
                </label>
                <Button type="submit" className={s['Login-Btn']} variant="contained" color="primary" >Log In</Button>
            </form>

            <div className={s['Login-Footer']}>
                <NavLink className={s['Login-Link']} to="/reset-password">Forgot Password?</NavLink>
                <NavLink className={s['Login-Link']} to="/registration">Register</NavLink>
            </div>
        </div>
    )
}
