import { Button, createStyles, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, withStyles } from "@material-ui/core"
import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { URL_FOR_API } from "../../../constants/constants"
import actionsWithApi from "../../../customHooks/actionsWithApi"
import { useEffect } from "react"
import dateFormatting from "../../../scripts/dateFormatting"
import Preloader from "../../shared/Preloader/Preloader"

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
        btn: {
            display: "block",
            margin: "20px auto",
        }
    }),
)

export type UserAdminPageType = {
    userType: string | null
    status: string | null
    name: string | null
}

export default function UsersAdminTable(props: UserAdminPageType) {
    const classes = useStyles()
    const [viewMoreLoaderIsActive, setViewMoreLoaderIsActive] = useState<boolean>(false)
    const [finalSortedData, setFinalSortedData] = useState<any>(null)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [viewMoreBtnIsVisible, setViewMoreBtnIsVisible] = useState<boolean>(true)
    async function getUsers(pageNumber?: number, userType?: string | null, status?: string | null, name?: string | null) {
        try {
            let response = await actionsWithApi("get", URL_FOR_API +
                "/api/v1/AdminUser?" +
                (userType ? `UserType=${userType}&` : "") +
                (status ? `UserStatus=${status}&` : "") +
                (name && name.length >= 3 ? `Name=${name}&` : "") +
                `PageNumber=${pageNumber}&PageSize=10&SortingType=desc`,
                null)
            let newUsersArr = [...response.data]
            newUsersArr.length < 10 ? setViewMoreBtnIsVisible(false) : setViewMoreBtnIsVisible(true)
            let updatedUsersArr

            pageNumber === 1 ? updatedUsersArr = newUsersArr : updatedUsersArr = finalSortedData.concat(newUsersArr)
            setFinalSortedData(updatedUsersArr)
            setViewMoreLoaderIsActive(false)
        }
        catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        setPageNumber(1)
        getUsers(1, props.userType, props.status, props.name)
    }, [props.userType, props.status, props.name])

    useEffect(() => {
        pageNumber !== 1 && getUsers(pageNumber, props.userType, props.status, props.name)
    }, [pageNumber])

    if (!finalSortedData) {
        return (
            <Preloader size="100" position="center" />
        )
    }

    else return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">Date Created</StyledTableCell>
                            <StyledTableCell align="center">Date Logged In</StyledTableCell>
                            <StyledTableCell align="center">Name</StyledTableCell>
                            <StyledTableCell align="center">User Type</StyledTableCell>
                            <StyledTableCell align="center">Status</StyledTableCell>
                            <StyledTableCell align="center">Edit</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {finalSortedData.length > 0 && finalSortedData.map((item: any, index: number) => (
                            <StyledTableRow key={item.id}>
                                <StyledTableCell align="center">{dateFormatting(item.createDate)}</StyledTableCell>
                                <StyledTableCell align="center">{dateFormatting(item.dateLogin)}</StyledTableCell>
                                <StyledTableCell align="center">
                                    <NavLink to={`/user-profile?${item.id}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                                        {item.firstName + " " + (item.lastName ? item.lastName : "")}
                                    </NavLink>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {item.userType === "Attorney" && "Attorney"}
                                    {item.userType === "Client" && "Client"}
                                    {item.userType === "LawFirm" && "LawFirm"}
                                    {item.userType === "Administrator" && "Administrator"}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {item.userStatus ? item.userStatus.userStatusesValue : "New"}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <Link
                                        to={{
                                            pathname: "/edit-user",
                                            search: `?${item.id}`,
                                        }}
                                    >Edit</Link>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {viewMoreBtnIsVisible && !viewMoreLoaderIsActive &&
                <Button className={classes.btn} color="primary" variant="outlined"
                    onClick={() => {
                        setPageNumber(pageNumber + 1)
                        setViewMoreLoaderIsActive(true)
                    }}>
                    View More
                </Button>
            }
            {viewMoreLoaderIsActive &&
                <Preloader size="50" position="center" />
            }
        </>
    )
}