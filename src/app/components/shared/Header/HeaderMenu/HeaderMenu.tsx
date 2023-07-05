import { NavLink } from 'react-router-dom'
import { UserRoleType } from '../../../../types/userRoleType'
import { UserStatusType } from '../../../../types/userStatusType'
import s from '../Header.module.scss'

type HeaderMenuPropsType = {
    userRole: UserRoleType | string | undefined
    currentUserStatus: UserStatusType | string | undefined
    token: string | undefined
}

export default function HeaderMenu(props: HeaderMenuPropsType) {
    return (
        <div className={s['Header-Col'] + " " + s['HeaderMenu']}>
            {props.userRole === "Administrator" && props.currentUserStatus === "Approved" &&
                <NavLink to="/create-reports" className={s['Header-Link']}>
                    Reports
                </NavLink>
            }

            {props.userRole !== "Administrator" && props.currentUserStatus === "Approved" &&
                <NavLink to="/request-funds" className={s['Header-Link']}>
                    Request Funds
                </NavLink>
            }

            {props.token &&
                <NavLink to="/contract-history" className={s['Header-Link']}>
                    Case History
                </NavLink>
            }

            {props.userRole === "Administrator" && props.currentUserStatus === "Approved" &&
                <NavLink to="/find-user" className={s['Header-Link']}>
                    Find User
                </NavLink >
            }
            <NavLink to="/payment-calculator" className={s['Header-Link']}>
                Payment Calculator
            </NavLink>

            {props.token &&
                <NavLink to="/my-law-firms-contracts" className={s['Header-Link']}>
                    My Law Firms Contracts
                </NavLink>
            }
        </div>
    )
}