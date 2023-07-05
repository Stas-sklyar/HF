import { Container, Divider } from '@material-ui/core'
import s from "./Reports.module.scss"
import getCookie from "../../scripts/getCookie"
import ExportReport from './ExportReport/ExportReport'
import ExportRawData from './ExportRawData/ExportRawData'

export default function Reports() {
    const userRole = getCookie("currentUserRole")
    const currentUserStatus = getCookie("currentUserStatus")


    if (userRole === "Administrator" && currentUserStatus === "Approved") {
        return (
            <Container maxWidth="lg" className={s["CreateReport"]} >
                <ExportReport />
                <Divider />
                <ExportRawData />
            </Container>
        )
    }
    else {
        return (
            <h1 className={s["CreateReport-BlockAccessTitle"]}>Please Login as Administrator!</h1>
        )
    }
}