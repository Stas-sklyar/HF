import { Container } from '@material-ui/core'
import { NavLink } from 'react-router-dom'
import s from './AdminPage.module.scss'
import GroupIcon from '@material-ui/icons/Group'
import AssignmentIcon from '@material-ui/icons/Assignment'
import StarHalfIcon from '@material-ui/icons/StarHalf'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'

export default function AdminPage() {

    return (
        <Container maxWidth="lg" className={s["AdminPage"]} >
            <h1 className={s["AdminPage-Title"]}>Admin page</h1>

            <ul className={s["AdminPage-Container"]}>
                <li className={s["AdminPage-Box"]}>
                    <NavLink to="/users-admin-page" className={s["AdminPage-Link"]}>
                        <GroupIcon className={s["AdminPage-BoxIcon"]} fontSize="large" />
                        Users
                    </NavLink>
                </li>
                <li className={s["AdminPage-Box"]}>
                    <NavLink to="/all-contracts" className={s["AdminPage-Link"]}>
                        <AssignmentIcon className={s["AdminPage-BoxIcon"]} fontSize="large" />
                        Contracts
                    </NavLink>
                </li>
                <li className={s["AdminPage-Box"]}>
                    <NavLink to="/interest-rates-list" className={s["AdminPage-Link"]}>
                        <AttachMoneyIcon className={s["AdminPage-BoxIcon"]} fontSize="large" />
                        Interest Rate Controller
                    </NavLink>
                </li>
                <li className={s["AdminPage-Box"]}>
                    <NavLink to="/rating-controller" className={s["AdminPage-Link"]}>
                        <StarHalfIcon className={s["AdminPage-BoxIcon"]} fontSize="large" />
                        User Rating Controller
                    </NavLink>
                </li>
            </ul>
        </Container>
    )
}
