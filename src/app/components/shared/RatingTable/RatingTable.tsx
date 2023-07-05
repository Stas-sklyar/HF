import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, createStyles, Theme, withStyles } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { URL_FOR_API } from '../../../constants/constants'
import actionsWithApi from '../../../customHooks/actionsWithApi'
import { userRatingType } from '../../../types/ratingType'
import Preloader from '../Preloader/Preloader'
import WarningIcon from '@material-ui/icons/Warning'

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        table: {
            maxWidth: 320
        },
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white
        },
        body: {
            fontSize: 16,
            [theme.breakpoints.down('xs')]: {
                fontSize: 12
            },
            "&:first-child": {
                fontSize: 14,
                fontWeight: 600,
                [theme.breakpoints.down('xs')]: {
                    fontSize: 12
                },
            },
        }
    }),
)(TableCell)

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(even)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }),
)(TableRow)

type RatingTablePropsType = {
    userId: number
    updateRatingsToggle?: boolean
}

export default function RatingTable(props: RatingTablePropsType) {
    const [loaderIsActive, setLoaderIsActive] = useState<boolean>(false)
    const [userRating, setUserRating] = useState<userRatingType | null>(null)

    const getUserData = async (userId: number) => {
        setLoaderIsActive(true)
        try {
            let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/Statistics/${userId}/getUserRating`, null)
            setUserRating(response.data)
        }
        catch (error) {
            console.log(error.message)
        }
        finally {
            setLoaderIsActive(false)
        }
    }

    useEffect(() => {
        getUserData(props.userId)
    }, [props.updateRatingsToggle])

    if (userRating) {
        return (
            <div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Rating name</StyledTableCell>
                                <StyledTableCell>Calculation</StyledTableCell>
                                <StyledTableCell>Rating</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow>
                                <StyledTableCell>Avg Days to Close</StyledTableCell>
                                <StyledTableCell align="center">
                                    {userRating.avgDaysClose?.toFixed(2)}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {userRating.avgDaysClose ? userRating.avgDaysCloseRating : ""}
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell>Total Cases Lost</StyledTableCell>
                                <StyledTableCell align="center">
                                    {userRating.totalLostCases?.toFixed(2)}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {userRating.totalLostCases ? userRating.totalLostCasesRating : ""}
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell>% Cases Lost</StyledTableCell>
                                <StyledTableCell align="center">
                                    {userRating.pctCasesLost
                                        ? (userRating.pctCasesLost * 100).toFixed(2) + "%"
                                        : ""
                                    }
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {userRating.pctCasesLost ? userRating.pctCasesLostRating : ""}
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell>Avg Amt Funded Per Case</StyledTableCell>
                                <StyledTableCell align="center">
                                    {userRating.lifetimeReceivedAverage
                                        ? userRating.lifetimeReceivedAverage.toFixed(2)
                                        : ""
                                    }
                                </StyledTableCell>
                                <StyledTableCell align="center"></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell>Avg Amt Funded Per Client</StyledTableCell>
                                <StyledTableCell align="center">
                                    {userRating.avgFundedPerClient
                                        ? userRating.avgFundedPerClient.toFixed(2)
                                        : ""
                                    }
                                </StyledTableCell>
                                <StyledTableCell align="center"></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell>Total Reduced Cases</StyledTableCell>
                                <StyledTableCell align="center">
                                    {userRating.totalReducedCases?.toFixed(2)}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {userRating.totalReducedCases ? userRating.totalReducedCasesRating : ""}
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell>% of Cases with Reduction</StyledTableCell>
                                <StyledTableCell align="center">
                                    {userRating.pctCasesReduced != null
                                        ? (userRating.pctCasesReduced * 100).toFixed(2) + "%"
                                        : ""
                                    }
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {userRating.pctCasesReduced ? userRating.pctCasesReducedRating : ""}
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell>% Reduction Per Reduced Case</StyledTableCell>
                                <StyledTableCell align="center">
                                    {userRating.pctReductionPerCase != null
                                        ? (userRating.pctReductionPerCase * 100).toFixed(2) + "%"
                                        : ""
                                    }
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {userRating.pctReductionPerCase ? userRating.pctReductionPerCaseRating : ""}
                                </StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell align="center"><b>Average Rating: {userRating.avgRating.toFixed(2)}</b></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    }
    else if (!loaderIsActive && !userRating) {
        return (
            <div style={{ textAlign: "center" }}>
                <WarningIcon style={{ fill: "#EF574E" }} /><br></br>
                An error has occurred on the server
            </div>
        )
    }
    else {
        return (
            <Preloader size="100" position="center" />
        )
    }
}