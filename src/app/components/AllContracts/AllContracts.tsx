import { withStyles, Container, Theme, createStyles, TableCell, TextField, makeStyles, TableRow, TableContainer, Paper, Table, TableHead, TableBody, Button } from "@material-ui/core"
import {useState, useEffect, useRef} from "react"
import { NavLink } from "react-router-dom"
import { URL_FOR_API } from "../../constants/constants"
import actionsWithApi from "../../customHooks/actionsWithApi"
import dateFormatting from "../../scripts/dateFormatting"
import AddCircleIcon from '@material-ui/icons/AddCircle'
import SearchIcon from '@material-ui/icons/Search'
import s from './AllContracts.module.scss'
import Preloader from "../shared/Preloader/Preloader"

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        }
    }),
)(TableCell)

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        btn: {
            display: "block",
            margin: "20px auto",
            "&:hover": {
                border: "1px solid #3062A0"
            }
        },
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
    }),
);

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }),
)(TableRow)

export default function AllContracts() {
    const classes = useStyles()

    const openLink = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    const [viewMoreLoaderIsActive, setViewMoreLoaderIsActive] = useState<boolean>(false)
    const [searchValue, setSearchValue] = useState<string>("")
    const [casesArr, setCassesArr] = useState<any>()
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [viewMoreBtnIsVisible, setViewMoreBtnIsVisible] = useState<boolean>(true)
    const searchTimerRef = useRef<NodeJS.Timeout | null>(null)
    async function getCases(pageNumber: number) {
        try {
            let response = await actionsWithApi("get", URL_FOR_API + `/api/v1/Contract/all?PageNumber=${pageNumber}&PageSize=10&sortingType=desc&userName=${searchValue}`, null)
            let newContractsArr = [...response.data]
            newContractsArr.length < 10 ? setViewMoreBtnIsVisible(false) : setViewMoreBtnIsVisible(true)
            let updatedContractsArr

            pageNumber === 1 ? updatedContractsArr = newContractsArr : updatedContractsArr = casesArr.concat(newContractsArr)
            setCassesArr(updatedContractsArr)
            setViewMoreLoaderIsActive(false)
        }
        catch (error) {
            console.log(error.message)
        }
    }

    const handleSearchInput = async (searchQuery: string): Promise<void> => {
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current)
        }

        searchTimerRef.current = setTimeout(() => {
            setSearchValue(searchQuery)
        }, 500)
    }

    useEffect(() => {
        getCases(pageNumber)
    }, [pageNumber])

    useEffect(() => {
        getCases(1)
    }, [searchValue])

    return (
        <Container maxWidth="lg" className={s["AllContracts"]} >
            <div className={s["AllContracts-Nav"]}>
                <label className={s["AllContracts-Search"]}>
                    <SearchIcon className={s["AllContracts-SearchIcon"]} />
                    <TextField className={classes.formControl} label="Search" type="text" onChange={(e) => handleSearchInput(e.target.value + "")} />
                </label>

                <NavLink to="/create-contract-attorney" className={s["AllContracts-CreateNewRequest"] + " " + classes.formControl}>
                    <AddCircleIcon className={s["AllContracts-CreateNewRequestIcon"]} />
                    <button className={s["AllContracts-CreateNewRequestBtn"]}>Create New Request</button>
                </NavLink>
            </div>
            {!casesArr &&
                <Preloader size="100" position="center" />
            }
            {casesArr &&
                <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Case ID</StyledTableCell>
                                <StyledTableCell align="center">Date Created</StyledTableCell>
                                <StyledTableCell align="center">Status</StyledTableCell>
                                <StyledTableCell align="center">Amount Due</StyledTableCell>
                                <StyledTableCell align="center">Current Interest Rate</StyledTableCell>
                                <StyledTableCell align="center">Days Until Rate Increase</StyledTableCell>
                                <StyledTableCell align="center">Paid Off</StyledTableCell>
                                <StyledTableCell align="center">Client</StyledTableCell>
                                <StyledTableCell align="center">Attorney</StyledTableCell>
                                <StyledTableCell align="center">Law Firm</StyledTableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {casesArr && casesArr.map((caseItem: any, index: number) => (
                                <StyledTableRow key={caseItem.id}>
                                    <StyledTableCell component="th" scope="row"> <NavLink to={`contract-page?${caseItem.id}`} onClick={openLink}>{caseItem.caseId}</NavLink> </StyledTableCell>
                                    <StyledTableCell align="center">{dateFormatting(caseItem?.contractStatus[0].dateChange)}</StyledTableCell>
                                    <StyledTableCell align="center">{caseItem?.contractStatus[caseItem?.contractStatus.length - 1].contractsStatus}</StyledTableCell>
                                    <StyledTableCell align="center">{caseItem.totalDue ? "$" + caseItem.totalDue : ""}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        {Math.round(caseItem?.currentContractRiskRatePercent * 100) + "%"}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{caseItem.daysBeforePriceIncrease && caseItem.daysBeforePriceIncrease !== 0 && caseItem.daysBeforePriceIncrease + " days left"}</StyledTableCell>
                                    <StyledTableCell align="center">${caseItem.paidOff}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <NavLink to={`user-profile?${caseItem.contractClientDTO.userId}`} onClick={openLink} >
                                            {caseItem.contractClientDTO.user?.firstName + " " + caseItem.contractClientDTO.user?.lastName}
                                        </NavLink>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {caseItem.contractAttorneyDTO.length > 0 &&
                                            <NavLink to={`user-profile?${caseItem.contractAttorneyDTO[caseItem.contractAttorneyDTO?.length - 1]?.userId}`} onClick={openLink} >
                                                {caseItem.contractAttorneyDTO[caseItem.contractAttorneyDTO?.length - 1]?.user?.firstName + " " + caseItem.contractAttorneyDTO[caseItem.contractAttorneyDTO?.length - 1]?.user?.lastName}
                                            </NavLink>
                                        }
                                        {caseItem.contractAttorneyDTO.length === 0 &&
                                            <span>No Responsible Attorney</span>
                                        }
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {caseItem.contractLawFirmDTO.length > 0 &&
                                            <NavLink to={`user-profile?${caseItem.contractLawFirmDTO[caseItem.contractLawFirmDTO?.length - 1]?.userId}`} onClick={openLink} >
                                                {caseItem.contractLawFirmDTO[caseItem.contractLawFirmDTO?.length - 1]?.user?.firstName}
                                            </NavLink>
                                        }
                                        {caseItem.contractLawFirmDTO.length === 0 &&
                                            <span>No Responsible Law Firm</span>
                                        }
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }

            {viewMoreLoaderIsActive &&
                <Preloader size="50" position="center" />
            }

            {viewMoreBtnIsVisible && !viewMoreLoaderIsActive &&
                <Button color="primary" variant="outlined" className={classes.btn}
                    onClick={() => {
                        setPageNumber(pageNumber + 1)
                        setViewMoreLoaderIsActive(true)
                    }}>
                    View more
                </Button>
            }
        </Container>
    )
}
