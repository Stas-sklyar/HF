import { Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem, makeStyles } from '@material-ui/core'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import s from '../Header.module.scss'
import { UserRoleType } from '../../../../types/userRoleType'
import { UserStatusType } from '../../../../types/userStatusType'

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    paper: {
        marginRight: theme.spacing(2),
    },
    accountBtn: {
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        color: "#ffffff !important"
    },
    accountLink: {
        padding: 0
    }
}))

type UserProfileMenuPropsType = {
    logout(): void
    userRole: UserRoleType | string | undefined
    currentUserStatus: UserStatusType | string | undefined
    token: string | undefined
    currentUserId: string | undefined
}

export default function UserProfileMenu(props: UserProfileMenuPropsType) {
    const classes = useStyles()
    const [open, setOpen] = useState<boolean>(false)
    const anchorRef = useRef<HTMLButtonElement>(null)

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen)
    }

    const handleClose = (event: any, name?: string) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }
        setOpen(false)
        if (name === 'logout') {
            props.logout()
        }
    }

    const handleListKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Tab') {
            event.preventDefault()
            setOpen(false)
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open)
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current!.focus()
        }

        prevOpen.current = open
    }, [open])

    return (
        <div className={s['Header-Col']}>
            <button className={classes.accountBtn} ref={anchorRef} aria-controls={open ? 'menu-list-grow' : undefined} aria-haspopup="true" onClick={handleToggle}>
                <AccountCircleIcon fontSize="large" style={{ fill: "#ffffff" }} />
            </button>
            <Popper open={open} anchorEl={anchorRef.current} transition>
                {({ TransitionProps, placement }) => (
                    <Grow {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                    {props.token && <MenuItem className={classes.accountLink} onClick={handleClose}>
                                        <NavLink to={`/user-profile?${props.currentUserId}`} className={s['Header-Link__account']}>
                                            My Profile
                                        </NavLink>
                                    </MenuItem>}

                                    {props.token && props.userRole === "Administrator" && props.currentUserStatus === "Approved" &&
                                        <MenuItem className={classes.accountLink} onClick={handleClose}>
                                            <NavLink to="/create-user" className={s['Header-Link__account']}>
                                                Create User
                                            </NavLink>
                                        </MenuItem>}

                                    {props.token && props.userRole === "Administrator" && props.currentUserStatus === "Approved" &&
                                        <MenuItem className={classes.accountLink} onClick={handleClose}>
                                            <NavLink to="/admin" className={s['Header-Link__account']}>
                                                Admin
                                            </NavLink>
                                        </MenuItem>}

                                    {props.token && <MenuItem data-name="logout" className={classes.accountLink} onClick={(e) => handleClose(e, "logout")}>
                                        <span className={s['Header-Link__account']}>
                                            Log Out
                                        </span>
                                    </MenuItem>}

                                    {!props.token && <MenuItem data-name="login" className={classes.accountLink} onClick={(e) => handleClose(e, "login")}>
                                        <NavLink to="/login" className={s['Header-Link__account']}>
                                            Login
                                        </NavLink>
                                    </MenuItem>}

                                    {!props.token && <MenuItem className={classes.accountLink} onClick={handleClose}>
                                        <NavLink to="/registration" className={s['Header-Link__account']}>
                                            Registration
                                        </NavLink>
                                    </MenuItem>}

                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    )
}