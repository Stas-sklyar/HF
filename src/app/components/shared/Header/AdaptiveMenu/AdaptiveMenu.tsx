import { IconButton, Menu } from '@material-ui/core'
import React from 'react'
import { NavLink } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu'
import s from './AdaptiveMenu.module.scss'

type AdaptiveMenuPropsType = {
    userRole: string | undefined
    currentUserId: string | undefined
    currentUserStatus: string | undefined
    token: string | undefined
}

export default function AdaptiveMenu(props: AdaptiveMenuPropsType) {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget)
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null)
    }

    return (
        <div className={s["AdaptiveMenu"]}>
            <IconButton className={s['AdaptiveMenu-ToggleBtn']} size="medium" onClick={handleOpenNavMenu} color="inherit">
                <MenuIcon className={s['AdaptiveMenu-Icon']} />
            </IconButton>

            <Menu anchorEl={anchorElNav}
                keepMounted
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                onClick={handleCloseNavMenu}
                style={{ top: 55, outline: 0, }}
            >
                <div className={s["AdaptiveMenu-Menu"]}>

                    <NavLink to={`/user-profile?${props.currentUserId}`} className={s['AdaptiveMenu-Link']}>
                        Home
                    </NavLink>

                    {props.userRole === "Administrator" && props.currentUserStatus === "Approved" &&
                        <NavLink to="/create-reports" className={s['AdaptiveMenu-Link']}>
                            Reports
                        </NavLink>
                    }

                    {props.userRole !== "Administrator" && props.currentUserStatus === "Approved" &&
                        <NavLink to="/request-funds" className={s['AdaptiveMenu-Link']}>
                            Request funds
                        </NavLink>
                    }

                    {props.token &&
                        <NavLink to="/contract-history" className={s['AdaptiveMenu-Link']}>
                            Case History
                        </NavLink>
                    }

                    {props.userRole === "Administrator" && props.currentUserStatus === "Approved" &&
                        <NavLink to="/find-user" className={s['AdaptiveMenu-Link']}>
                            Find User
                        </NavLink>
                    }

                    <NavLink to="/payment-calculator" className={s['AdaptiveMenu-Link']}>
                        Payment Calculator
                    </NavLink >

                    {props.token &&
                        <NavLink to="/my-law-firms-contracts" className={s['AdaptiveMenu-Link']}>
                            My Law Firms Contracts
                        </NavLink>
                    }

                </div>
            </Menu>
        </div>
    )
}