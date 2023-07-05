import { Button, Container, Divider } from '@material-ui/core'
import CreateUserData from './CreateUserData/CreateUserData'
import CreateUserAddFirm from './CreateUserAddFirm/CreateUserAddFirm'
import CreateUserClients from './CreateUserClients/CreateUserClients'
import CreateUserAddComment from './CreateUserAddComment/CreateUserAddComment'
import { setNotificationInfo, toggleNotification } from '../../actions/actions'
import { URL_FOR_API } from '../../constants/constants'
import actionsWithApi from '../../customHooks/actionsWithApi'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../reducers/rootReducers'
import { history } from '../../../App'
import s from './CreateUser.module.scss'

export default function CreateUser() {
    const dispatch = useDispatch()
    let userData = useSelector((state: RootState) => state.createUser)

    const createUser = async () => {

        try {
            let response = await actionsWithApi("POST", URL_FOR_API + "/api/v1/AdminUser", userData)
            dispatch(setNotificationInfo({ message: "User created successfully", severity: "success" }))
            dispatch(toggleNotification(true))
            if (response.data.id) {
                history.push(`/user-profile?${response.data.id}`)
                window.scrollTo({ top: 0, behavior: "smooth" })
            }
        }
        catch (error) {
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            dispatch(toggleNotification(true))
            console.log(error.message)
        }
    }

    return (
        <Container maxWidth="lg" className={s["CreateUser"]}>
            <CreateUserData />
            <Divider />
            <CreateUserAddFirm />
            <Divider />
            <CreateUserClients />
            <Divider />
            <CreateUserAddComment />
            <div className={s["CreateUser-BtnBox"]}>
                <Button variant="contained" color="primary" onClick={() => createUser()}>Create User</Button>
            </div>
        </Container>
    )
}