import { useEffect } from 'react'
import s from './Header.module.scss'
import { useDispatch } from 'react-redux'
import actionsWithApi from '../../../customHooks/actionsWithApi'
import { URL_FOR_API } from '../../../constants/constants'
import { setNotificationInfo, toggleNotification } from '../../../actions/actions'
import { history } from '../../../../App'
import getCookie from '../../../scripts/getCookie'
import deleteCookie from '../../../scripts/deleteCookie'
import AdaptiveMenu from './AdaptiveMenu/AdaptiveMenu'
import HeaderLogo from './HeaderLogo/HeaderLogo'
import HeaderMenu from './HeaderMenu/HeaderMenu'
import { UserRoleType } from '../../../types/userRoleType'
import { UserStatusType } from '../../../types/userStatusType'
import UserProfileMenu from './UserProfileMenu/UserProfileMenu'

type HeaderPropsType = {
    userIsLogined: boolean
    userIsLogout: boolean
    setUserIsLogout(e: boolean): void
}

export default function Header(props: HeaderPropsType) {
    const dispatch = useDispatch()

    let userRole: UserRoleType | string | undefined = getCookie("currentUserRole")
    let token: string | undefined = getCookie("token")
    let currentUserId: string | undefined = getCookie("currentUserId")
    let currentUserStatus: UserStatusType | string | undefined = getCookie("currentUserStatus")

    const getLoginedUserInfo = () => {
        userRole = getCookie("currentUserRole")
        token = getCookie("token")
        currentUserId = getCookie("currentUserId")
    }

    useEffect(() => {
        getLoginedUserInfo()
    }, [props.userIsLogined, props.userIsLogout])

    const logout = async () => {
        try {
            await actionsWithApi("POST", URL_FOR_API + "/api/v1/Account/logOut", null)
            deleteCookie()
            props.setUserIsLogout(!props.userIsLogout)
            dispatch(setNotificationInfo({ message: "Log Out success", severity: "success" }))
            dispatch(toggleNotification(true))
            history.push('/login')
        }
        catch (error) {
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            dispatch(toggleNotification(true))
            console.log("error - " + error.message)
        }
    }

    return (
        <div className={s['Header']}>

            <div className={s['Header-AdaptiveMenu']}>
                <AdaptiveMenu
                    userRole={userRole}
                    currentUserId={currentUserId}
                    currentUserStatus={currentUserStatus}
                    token={token}
                />
            </div>

            <HeaderLogo />

            <HeaderMenu
                userRole={userRole}
                currentUserStatus={currentUserStatus}
                token={token}
            />

            <UserProfileMenu
                logout={logout}
                userRole={userRole}
                currentUserStatus={currentUserStatus}
                token={token}
                currentUserId={currentUserId}
            />

        </div>
    )
}