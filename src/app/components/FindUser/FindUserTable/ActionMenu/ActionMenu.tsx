import { Popper, Fade, Paper } from "@material-ui/core"
import { CSSProperties } from "react"
import { useDispatch } from "react-redux"
import { setNotificationInfo, toggleNotification } from "../../../../actions/actions"
import { URL_FOR_API } from "../../../../constants/constants"
import actionsWithApi from "../../../../customHooks/actionsWithApi"
import s from "./ActionMenu.module.scss"

const menuWrapper: CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    cursor: "default"
}

type ActionMenuPropsType = {
    finalSortedData: any
    updateStatusUserId: number
    open: boolean
    setMoreMenuIsOpen(toggle: boolean): any
    anchorEl: any
}

export default function ActionMenu(props: ActionMenuPropsType) {
    const dispatch = useDispatch()
    const userStatusArr: Array<"New" | "Approved" | "Rejected"> = ["New", "Approved", "Rejected"]

    const handleUpdateStatus = async (newStatus: "New" | "Approved" | "Rejected") => {
        try {
            let editableUser = props.finalSortedData.find((user: any) => user.id === props.updateStatusUserId) // search editable user
            editableUser.userStatus.userStatusesValue = newStatus // change userStatusesValue for editable user
            await actionsWithApi("POST", URL_FOR_API + `/api/v1/AdminUser/${props.updateStatusUserId}`, editableUser) // sending edited data to BE

            dispatch(setNotificationInfo({ message: "Data changed successfully", severity: "success" }))
            dispatch(toggleNotification(true))
        }
        catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div onClick={() => props.setMoreMenuIsOpen(false)} style={menuWrapper}>
            <Popper open={props.open} anchorEl={props.anchorEl} placement={'bottom'} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper>
                            <ul>
                                {userStatusArr &&
                                    userStatusArr.map((status) => {
                                        return (
                                            <li className={s["ActionMenu-Item"]}
                                                onClick={() => handleUpdateStatus(status)}
                                            >
                                                {status}
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </Paper>

                    </Fade>
                )}
            </Popper>
        </div>
    )
}