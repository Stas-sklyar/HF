import { createStyles, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, withStyles } from "@material-ui/core"
import Paper from '@material-ui/core/Paper'
import { NavLink } from "react-router-dom"
import dateFormatting from "../../../scripts/dateFormatting"

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

type UserContractsPropsType = {
    contracts?: any[]
}

export default function UserContracts(props: UserContractsPropsType) {
    const classes = useStyles()

    const openLink = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    if (props.contracts) {
        return (
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
                        {props.contracts && props.contracts.map((caseItem: any) => (
                            <StyledTableRow key={caseItem.id}>
                                <StyledTableCell component="th" scope="row">
                                    <NavLink to={`contract-page?${caseItem.id}`} onClick={openLink}>{caseItem.caseId}</NavLink>
                                </StyledTableCell>

                                <StyledTableCell align="center">{dateFormatting(caseItem?.contractStatus[0].dateChange)}</StyledTableCell>

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

                                <StyledTableCell align="center">
                                    {caseItem.daysBeforePriceIncrease && caseItem.daysBeforePriceIncrease !== 0 && caseItem.daysBeforePriceIncrease + " days"}
                                </StyledTableCell>

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
        )
    }
    else {
        return (
            <h2 style={{ textAlign: "center" }}>Cases not found</h2>
        )
    }
}
