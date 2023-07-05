import { Button, createStyles, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, withStyles } from "@material-ui/core"
import Paper from '@material-ui/core/Paper'
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { URL_FOR_API } from "../../../constants/constants"
import actionsWithApi from "../../../customHooks/actionsWithApi"
import dateFormatting from "../../../scripts/dateFormatting"
import Preloader from "../../shared/Preloader/Preloader"
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ActionMenu from './ActionMenu/ActionMenu'
import {setNotificationInfo, toggleNotification} from "../../../actions/actions";
import {useDispatch} from "react-redux";

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
            padding: 20
        },
        body: {
            fontSize: 14,
            padding: 20
        },
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        table: {
            overflowX: "auto"
        },
        btn: {
            display: "block",
            margin: "20px auto",
            "&:hover": {
                border: "1px solid #3062A0"
            }
        },
        menuIcon: {
            cursor: "pointer",
            padding: 0
        }
    }),
);

export type FindUserPropsType = {
    userType: string | null
    status: string | null
    name: string | null
}

export default function FindUserTable({ userType, status, name }: FindUserPropsType) {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [updateStatusUserId, setUpdateStatusUserId] = useState<number>(0)
    const [moreMenuIsOpen, setMoreMenuIsOpen] = useState<boolean>(false)
    const [anchorEl, setAnchorEl] = useState(null)

    const handleOpenMenu = (e: any, userId: number) => {
        setAnchorEl(e.currentTarget)
        setUpdateStatusUserId(userId)
        setMoreMenuIsOpen(!moreMenuIsOpen)
    }

    const [viewMoreLoaderIsActive, setViewMoreLoaderIsActive] = useState<boolean>(false)
    const [finalSortedData, setFinalSortedData] = useState<any>(null)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [viewMoreBtnIsVisible, setViewMoreBtnIsVisible] = useState<boolean>(true)
    async function getUsers(pageNumber: number) {
        try {
            let response = await actionsWithApi("get",
                URL_FOR_API +
                "/api/v1/AdminUser?" +
                (userType ? `UserType=${userType}&` : "") +
                (status ? `UserStatus=${status}&` : "") +
                (name && name.length >= 3 ? `Name=${name}&` : "") +
                `PageNumber=${pageNumber}&PageSize=10&SortingType=desc`,
                null
            )
            let newUsersArr = [...response.data]
            newUsersArr.length < 10 ? setViewMoreBtnIsVisible(false) : setViewMoreBtnIsVisible(true)
            let updatedUsersArr

            pageNumber === 1 ? updatedUsersArr = newUsersArr : updatedUsersArr = finalSortedData.concat(newUsersArr)
            setFinalSortedData(updatedUsersArr)
            setViewMoreLoaderIsActive(false)
        }
        catch (error) {
            console.error(error.message)
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            dispatch(toggleNotification(true))
        }
    }

    useEffect(() => {
        setPageNumber(1)
        getUsers(1)
    }, [userType, status, name])

    useEffect(() => {
        pageNumber !== 1 && getUsers(pageNumber)
    }, [pageNumber])

    if (!finalSortedData) {
        return (
            <Preloader size="100" position="center" />
        )
    }

    else return (
        <div>
            <TableContainer component={Paper} className={classes.table}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">Date Created</StyledTableCell>
                            <StyledTableCell align="center">Date Logged In</StyledTableCell>
                            <StyledTableCell align="center">Name</StyledTableCell>
                            <StyledTableCell align="center">User Type</StyledTableCell>
                            <StyledTableCell align="center">Open Fund Total</StyledTableCell>
                            <StyledTableCell align="center">Total Contracts</StyledTableCell>
                            <StyledTableCell align="center">Banned</StyledTableCell>
                            <StyledTableCell align="center">Status</StyledTableCell>
                            <StyledTableCell align="center"></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {finalSortedData.length > 0 && finalSortedData.map((user: any) => (
                            <StyledTableRow key={user.id}>
                                <StyledTableCell align="center">{dateFormatting(user.createDate)}</StyledTableCell>
                                <StyledTableCell align="center">{dateFormatting(user.dateLogin)}</StyledTableCell>
                                <StyledTableCell align="center">
                                    <Link
                                        to={{
                                            pathname: "/user-profile",
                                            search: `?${user.id}`,
                                        }}
                                    >
                                        {user.firstName + " " + (user.lastName ? user.lastName : "")}
                                    </Link>
                                </StyledTableCell>
                                <StyledTableCell align="center">{user.userType}</StyledTableCell>
                                <StyledTableCell align="center">{user.openFundTotal}</StyledTableCell>
                                <StyledTableCell align="center">{user.totalContract}</StyledTableCell>
                                <StyledTableCell align="center">{user.banned ? "+" : "-"}</StyledTableCell>
                                <StyledTableCell align="center">{user.userStatus ? user.userStatus.userStatusesValue : "New"}</StyledTableCell>
                                <StyledTableCell align="center" className={classes.menuIcon}>
                                    <div onClick={(e) => handleOpenMenu(e, user.id)}>
                                        <MoreVertIcon />
                                    </div>

                                    {moreMenuIsOpen &&
                                        <ActionMenu
                                            finalSortedData={finalSortedData}
                                            updateStatusUserId={updateStatusUserId}
                                            open={moreMenuIsOpen}
                                            setMoreMenuIsOpen={setMoreMenuIsOpen}
                                            anchorEl={anchorEl}
                                        />
                                    }
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {viewMoreBtnIsVisible && !viewMoreLoaderIsActive &&
                <Button color="primary" variant="outlined" className={classes.btn}
                    onClick={() => {
                        setPageNumber(pageNumber + 1)
                        setViewMoreLoaderIsActive(true)
                    }}>
                    View more
                </Button>
            }

            {viewMoreLoaderIsActive &&
                <Preloader size="50" position="center" />
            }

        </div>
    )
}