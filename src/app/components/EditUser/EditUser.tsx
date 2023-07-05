import { Button, Container, Divider } from '@material-ui/core'
import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { setDataForEditUser, setNotificationInfo, toggleNotification } from '../../actions/actions'
import { URL_FOR_API } from '../../constants/constants'
import actionsWithApi from '../../customHooks/actionsWithApi'
import { RootState } from '../../reducers/rootReducers'
import CasesAndClients from './CasesAndClients/CasesAndClients'
import Comments from './Comments/Comments'
import s from './EditUser.module.scss'
import LawFirms from './LawFirms/LawFirms'
import UserInfo from './UserInfo/UserInfo'
import getCookie from '../../scripts/getCookie'
import { history } from '../../../App'
import Preloader from '../shared/Preloader/Preloader'

export default function EditUser() {
    const dispatch = useDispatch()
    const token = getCookie("token")
    const changedData = useSelector((state: RootState) => state.editUserPage)
    let location = useLocation()
    let userId = location.search.split("").slice(1, location.search.split("").length).join("")
    const [dataFetched, setDataFetched] = useState(false)

    const [userData, setUserData] = useState(null)
    const getUserData = async () => {
        try {
            let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/AdminUser/${userId}`, null)
            setDataFetched(true)
            setUserData(response.data)
            dispatch(setDataForEditUser(response.data))
        }
        catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getUserData()
    }, [])

    const handleChange = (e: any) => {
        let value = e.target.value
        const name = e.target.name

        if (name === "id" || name === "additionalFee") {
            value = parseInt(value)
        }
        if (name === "banned") {
            value === "Yes" ? value = true : value = false
        }
        dispatch(setDataForEditUser({ [name]: value }))
    }

    const changeUserData = async () => {
        try {
            await actionsWithApi("POST", URL_FOR_API + `/api/v1/AdminUser/${userId}`, changedData)
            dispatch(setNotificationInfo({ message: "Data changed successfully", severity: "success" }))
            dispatch(toggleNotification(true))
            history.push(`/user-profile?${userId}`)
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
        catch (error) {
            console.log(error.message)
        }
    }

    if (!token) {
        return (<h1 style={{ padding: "20px 0", textAlign: "center" }}>Please, Login!</h1>)
    }
    else if (!userData) {
        return (<Preloader size="100" position="center" />)
    }
    else {
        return (
            <>
                {userData &&
                    <Container maxWidth="lg" className={s["EditUser"]}>
                        <UserInfo data={userData} handler={handleChange} />
                        <Divider />
                        <LawFirms data={userData} />
                        <Divider />
                        <CasesAndClients data={userData} handler={handleChange} />
                        <Divider />
                        <Comments data={userData} handler={handleChange} />
                        <Divider />
                        <div className={s["EditUser-Btns"]}>
                            <Button className={s["EditUser-DeleteBtn"]} variant="contained" color="secondary">Block User</Button>
                            <Button variant="contained" color="primary" onClick={() => changeUserData()}>Save</Button>
                        </div>
                    </Container>
                }
            </>
        )
    }
}