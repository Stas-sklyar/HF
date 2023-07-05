import {
    Button,
    Container,
    createStyles,
    makeStyles, Paper, Table, TableBody,
    TableCell,
    TableContainer, TableHead,
    TableRow,
    TextField,
    Theme,
    withStyles
} from '@material-ui/core'
import s from './MyLawFirmsContracts.module.scss'
import { useEffect, useRef, useState } from "react";
import actionsWithApi from "../../customHooks/actionsWithApi";
import { URL_FOR_API } from "../../constants/constants";
import SearchIcon from "@material-ui/icons/Search";
import { NavLink } from "react-router-dom";
import Preloader from "../shared/Preloader/Preloader";
import dateFormatting from "../../scripts/dateFormatting";
import getCookie from "../../scripts/getCookie";
import { setNotificationInfo, toggleNotification } from "../../actions/actions";
import { useDispatch } from "react-redux";

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
export default function MyLawFirmsContracts() {
    const classes = useStyles()
    const [casesArr, setCasesArr] = useState<any>()
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [viewMoreBtnIsVisible, setViewMoreBtnIsVisible] = useState<boolean>(true)
    const [userLawFirmId, setUserLawFirmId] = useState<number | null>(null)
    const [loaderIsActive, setLoaderIsActive] = useState<boolean>(false)
    const [errorOccurred, setErrorOccurred] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    const currentUserId = getCookie("currentUserId")
    const dispatch = useDispatch()
    const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

    async function getCases(pageNumber: number, userLawFirmId: number | null, isQueryForFiltering: boolean, searchQuery: string) {
        if (!userLawFirmId) return

        if (!isQueryForFiltering) setLoaderIsActive(true);

        try {
            let response = await actionsWithApi(
                "get",
                URL_FOR_API + `/api/v1/Contract/all/${userLawFirmId}?PageNumber=${pageNumber}&PageSize=10&sortingType=desc&userName=${searchQuery}`,
                null
            )
            let newContractsArr = [...response.data]
            let updatedContractsArr

            newContractsArr.length < 10 ? setViewMoreBtnIsVisible(false) : setViewMoreBtnIsVisible(true);
            pageNumber === 1 ? updatedContractsArr = newContractsArr : updatedContractsArr = casesArr.concat(newContractsArr)
            setCasesArr(updatedContractsArr)
        }
        catch (error) {
            console.error(error.message)
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            dispatch(toggleNotification(true))
            setErrorOccurred(true)
            setErrorMessage(error.message)
        }
        finally {
            setLoaderIsActive(false)
        }
    }

    async function getUserData(): Promise<number | null | undefined> {
        setLoaderIsActive(true);

        try {
            let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/User/${currentUserId}`, null)
            const userLawFirmId = response.data.lawFirms.find((lawFirm: any) => (lawFirm.present))?.lawFirmUserId;
            setUserLawFirmId(userLawFirmId)
            return userLawFirmId
        }
        catch (error) {
            console.error(error.message)
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            dispatch(toggleNotification(true))
            setErrorOccurred(true)
            setErrorMessage(error.message)
        }
        finally {
            setLoaderIsActive(false)
        }
    }

    const handleSearchInput = async (searchQuery: string): Promise<void> => {
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current)
        }

        searchTimerRef.current = setTimeout(() => {
            setPageNumber(1)
            getCases(1, userLawFirmId, true, searchQuery)
        }, 500)
    }

    const openLink = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    useEffect(() => {
        getCases(pageNumber, userLawFirmId, true, '')
    }, [pageNumber])

    useEffect(() => {
        getUserData()
            .then((userLawFirmId) => {
                if (userLawFirmId) {
                    getCases(pageNumber, userLawFirmId, false, '')
                }
            }
        )
    }, [])

    if (errorOccurred) {
        return (
            <Container maxWidth="lg" className={s["MyLawFirmsContracts"]}>
                <h2 className={s["MyLawFirmsContracts-Title"]}>{ errorMessage ? errorMessage : 'Something went wrong while receiving data from the server' }</h2>
            </Container>
        )
    } else if (loaderIsActive) {
        return (
            <Container maxWidth="lg" className={s["MyLawFirmsContracts"]}>
                <div className={s["MyLawFirmsContracts-Loader"]}>
                    <Preloader size="100" position="center" />
                </div>
            </Container>
        )
    } else if (!userLawFirmId) {
        return (
            <Container maxWidth="lg" className={s["MyLawFirmsContracts"]}>
                <h2 className={s["MyLawFirmsContracts-Title"]}>User does not have a current law firm</h2>
            </Container>
        )
    }

    else {
        return (
            <Container maxWidth="lg" className={s["MyLawFirmsContracts"]}>
                <div className={s["MyLawFirmsContracts-Nav"]}>
                    <label className={s["MyLawFirmsContracts-Search"]}>
                        <SearchIcon className={s["MyLawFirmsContracts-SearchIcon"]} />
                        <TextField className={classes.formControl} label="Search" type="text" onChange={(e) => handleSearchInput(e.target.value + "")} />
                    </label>
                </div>
                {casesArr &&
                    <TableContainer component={Paper}>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Case ID</StyledTableCell>
                                    <StyledTableCell align="center">Date Created</StyledTableCell>
                                    <StyledTableCell align="center">Status</StyledTableCell>
                                    <StyledTableCell align="center">Amount Due</StyledTableCell>
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

                {viewMoreBtnIsVisible && casesArr &&
                    <Button color="primary" variant="outlined" className={classes.btn}
                            onClick={() => setPageNumber(pageNumber + 1)}>
                        View more
                    </Button>
                }

                {!casesArr &&
                    <h2 className={s["MyLawFirmsContracts-Title"]}>The current user's law firm has no contracts</h2>
                }
            </Container>
        )
    }
}