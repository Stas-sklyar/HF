import { Button, createStyles, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, withStyles } from "@material-ui/core"
import Paper from '@material-ui/core/Paper'
import { useEffect, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { URL_FOR_API } from "../../../constants/constants"
import actionsWithApi from "../../../customHooks/actionsWithApi"
import getCookie from "../../../scripts/getCookie"
import dateFormatting from "../../../scripts/dateFormatting"
import Preloader from "../Preloader/Preloader"
import {setNotificationInfo, toggleNotification} from "../../../actions/actions";
import {useDispatch} from "react-redux";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        btn: {
            display: "block",
            margin: "20px auto",
            "&:hover": {
                border: "1px solid #3062A0"
            }
        }
    }),
)

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
        btn: {
            display: "block",
            margin: "20px auto"
        }
    }),
)(TableCell)

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }),
)(TableRow)

type CasesTableComponentPropsType = {
    searchQuery?: string
    contracts?: any[]
}

export default function CasesTable(props: CasesTableComponentPropsType) {
    const classes = useStyles()
    const location = useLocation()
    const dispatch = useDispatch()
    const currentUserId = parseInt(getCookie("currentUserId") + "")
    const userIdFromLink = parseInt(location.search.split("").slice(1, location.search.split("").length).join(""))
    const [initialLoaderIsActive, setInitialLoaderIsActive] = useState<boolean>(false)
    const [viewMoreLoaderIsActive, setViewMoreLoaderIsActive] = useState<boolean>(false)
    const [casesArr, setCasesArr] = useState<any>()
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [viewMoreBtnIsVisible, setViewMoreBtnIsVisible] = useState<boolean>(true)

    const openLink = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    const getCases = async (pageNumber: number) => {
        let trueUserId = location.pathname !== "/contract-history"
            ? ((userIdFromLink !== currentUserId) ? userIdFromLink : currentUserId)
            : currentUserId

        if (pageNumber === 1) setInitialLoaderIsActive(true)

        try {
            let response = await actionsWithApi(
                "GET",
                URL_FOR_API + `/api/v1/Contract/all/${trueUserId}?PageNumber=${pageNumber}&PageSize=10&sortingType=1&userName=${props.searchQuery || ''}`,
                null
            )
            let newContractsArr = [...response.data]
            let updatedContractsArr

            newContractsArr.length < 10
                ? setViewMoreBtnIsVisible(false)
                : setViewMoreBtnIsVisible(true);

            pageNumber === 1
                ? updatedContractsArr = newContractsArr
                : updatedContractsArr = casesArr.concat(newContractsArr);

            setCasesArr(updatedContractsArr)
            setViewMoreLoaderIsActive(false)
        }
        catch (error) {
            console.error(error.message)
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            dispatch(toggleNotification(true))
        }
        finally {
            if (pageNumber === 1) setInitialLoaderIsActive(false)
        }
    }

    useEffect(() => {
        getCases(pageNumber)
    }, [location, pageNumber])

    useEffect(() => {
        setPageNumber(1)
        getCases(1)
    }, [props.searchQuery])

    if (casesArr && casesArr.length > 0) {
        return (
            <>
                <TableContainer component={Paper}>
                    <Table>
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
                            {casesArr && casesArr.map((caseItem: any) => (
                                <StyledTableRow key={caseItem.id}>
                                    <StyledTableCell component="th" scope="row">
                                        <NavLink to={`contract-page?${caseItem.id}`} onClick={openLink}>{caseItem.caseId}</NavLink>
                                    </StyledTableCell>

                                    <StyledTableCell align="center">
                                        {dateFormatting(caseItem?.contractStatus[0].dateChange)}
                                    </StyledTableCell>

                                    <StyledTableCell align="center">
                                        {caseItem?.contractStatus[caseItem?.contractStatus.length - 1].contractsStatus.split(/(?=[A-Z])/)[0]}
                                        <br></br>
                                        {caseItem?.contractStatus[caseItem?.contractStatus.length - 1].contractsStatus.split(/(?=[A-Z])/)[1]}
                                    </StyledTableCell>

                                    <StyledTableCell align="center">
                                        {caseItem.totalDue < 0
                                            ? "-$" + (caseItem.totalDue * -1)
                                            : caseItem.totalDue
                                        }
                                    </StyledTableCell>

                                    <StyledTableCell align="center">{caseItem.daysBeforePriceIncrease && caseItem.daysBeforePriceIncrease !== 0 && caseItem.daysBeforePriceIncrease + " days"}</StyledTableCell>

                                    <StyledTableCell align="center">${caseItem.paidOff}</StyledTableCell>

                                    <StyledTableCell align="center">
                                        {caseItem.contractClientDTO &&
                                            <NavLink to={`user-profile?${caseItem.contractClientDTO.userId}`} onClick={openLink} >
                                                {caseItem.contractClientDTO.user?.firstName + " " + caseItem.contractClientDTO.user?.lastName}
                                            </NavLink>
                                        }
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
            </>
        )
    }
    else if ((props.searchQuery + "").length > 0) {
        return (
            <h2 style={{ textAlign: "center" }}>Cases not found</h2>
        )
    }
    else if (initialLoaderIsActive) {
        return (
            <Preloader size="100" position="center" />
        )
    }
    else {
        return (
            <h2 style={{ textAlign: "center" }}>Cases not found</h2>
        )
    }
}
