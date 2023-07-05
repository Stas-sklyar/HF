import AddCircleIcon from '@material-ui/icons/AddCircle'
import SearchIcon from '@material-ui/icons/Search'
import { Container, TextField } from '@material-ui/core'
import s from './ContractHistory.module.scss'

import CasesTable from '../shared/CasesTable/CasesTable'
import { NavLink } from 'react-router-dom'
import {useRef, useState} from 'react'
import getCookie from "../../scripts/getCookie"


export default function ContractHistory() {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const currentUserRole = getCookie("currentUserRole")
    const searchTimerRef = useRef<NodeJS.Timeout | null>(null)

    const handleSearchInput = async (searchQuery: string): Promise<void> => {
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current)
        }

        searchTimerRef.current = setTimeout(() => {
            setSearchQuery(searchQuery)
        }, 500)
    }

    return (
        <Container maxWidth="lg" className={s["ContractHistory"]} >
            <div className={s["ContractHistory-Panel"]}>
                <label className={s["ContractHistory-Search"]}>
                    <SearchIcon className="PrimaryIcon" />
                    <TextField label="Search" type="text" onChange={(e) => handleSearchInput(e.target.value + "")} />
                </label>

                {
                    (currentUserRole === "Administrator" || currentUserRole === "Attorney") ?
                        <NavLink to="/create-contract-attorney" className={s["ContractHistory-CreateNewRequest"]}>
                            <AddCircleIcon className="PrimaryIcon" />
                            <button>Create New Request</button>
                        </NavLink> : ''
                }
            </div>

            <CasesTable searchQuery={searchQuery} />
        </Container>
    );
}