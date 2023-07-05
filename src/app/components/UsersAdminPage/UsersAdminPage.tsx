import { Container, createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, TextField, Theme } from "@material-ui/core"
import SearchIcon from '@material-ui/icons/Search'
import UsersAdminTable from './UsersAdminTable/UsersAdminTable'

import s from '../FindUser/FindUser.module.scss'
import { useRef, useState } from "react"
import getCookie from "../../scripts/getCookie"
import AddBtn from "../shared/AddBtn/AddBtn"
import { NavLink } from "react-router-dom"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            width: 200,
            marginRight: 20,
            marginBottom: 20,
            "&:last-child": {
                marginRight: 0
            },
            [theme.breakpoints.down('xs')]: {
                width: "100%",
                marginRight: 0
            }
        },
        searchField: {
            width: 200,
            [theme.breakpoints.down('xs')]: {
                width: "100%",
                marginRight: 0
            }
        }
    }),
)

export default function UsersAdminPage() {
    const classes = useStyles()
    const [userType, setUserType] = useState("")
    const [registerStatus, setRegisterStatus] = useState("")
    const [name, setName] = useState("")
    const token = getCookie("token")
    const searchTimerRef = useRef<NodeJS.Timeout | null>(null)

    const handleSearchInput = async (searchQuery: string): Promise<void> => {
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current)
        }

        searchTimerRef.current = setTimeout(() => {
            setName(searchQuery)
        }, 500)
    }

    if (!token) {
        return (
            <h1 style={{ textAlign: "center", padding: "50px 0" }}>Please, login!</h1>
        )
    }
    else {
        return (
            <Container maxWidth="lg" className={s["FindUser"]} >
                <div className={s["FindUser-Header"]}>
                    <FormControl className={classes.formControl + " " + s["FindUser-Select"]}>
                        <InputLabel id="user-type-label">User Type</InputLabel>
                        <Select labelId="user-type-label" value={userType} onChange={(e) => setUserType(e.target.value + "")} >
                            <MenuItem value="">All Types</MenuItem>
                            <MenuItem value="Client">Client</MenuItem>
                            <MenuItem value="Attorney">Attorney</MenuItem>
                            <MenuItem value="LawFirm">Law firm</MenuItem>
                            <MenuItem value="Administrator">Administrator</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl className={classes.formControl + " " + s["FindUser-Select"]}>
                        <InputLabel id="registered-status-label">Registered Status</InputLabel>
                        <Select labelId="registered-status-label" value={registerStatus} onChange={(e) => setRegisterStatus(e.target.value + "")} >
                            <MenuItem value="">All statuses</MenuItem>
                            <MenuItem value="New">New</MenuItem>
                            <MenuItem value="Approved">Approved</MenuItem>
                            <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                    </FormControl>

                    <label className={s["FindUser-Search"]}>
                        <SearchIcon />
                        <TextField className={classes.searchField} label="Name" type="search" onChange={(e) => handleSearchInput(e.target.value + "")} />
                    </label>

                    <div className={s["FindUser-CreateNewUser"]}>
                        <NavLink to="/create-user" className={s["FindUser-CreateNewUserLink"]}>
                            <AddBtn text="Create New User" />
                        </NavLink>
                    </div>
                </div>

                <UsersAdminTable userType={userType} status={registerStatus} name={name} />
            </Container>
        )
    }
}