import DateFnsUtils from "@date-io/date-fns"
import { makeStyles, Theme, createStyles, FormControl, InputLabel, Select, MenuItem, Button } from "@material-ui/core"
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers"
import { FormEvent, useState } from "react"
import { useDispatch } from "react-redux"
import { setNotificationInfo, toggleNotification } from "../../../actions/actions"
import { URL_FOR_API } from "../../../constants/constants"
import actionsWithApi from "../../../customHooks/actionsWithApi"
import { downloadBase64File } from "../../../scripts/downloadBase64File"
import s from "../Reports.module.scss"
import Preloader from "../../shared/Preloader/Preloader";

const contractTypes = [
    { value: "preSettlement", title: "Pre-settlement" },
    { value: "postSettlement", title: "Post-settlement" }
]

const contractStatuses = [
    { value: "checkSent", title: "Check Sent" },
    { value: "checkCashed", title: "Check Cashed" },
    { value: "paidOff", title: "Paid Off" },
    { value: "closedNotPaidOff", title: "Closed But Not Paid Off" },
    { value: "closedCaseLost", title: "Closed Case Lost" },
]

const periodicities = [
    { value: "monthly", title: "Monthly" },
    { value: "quarterly", title: "Quarterly" },
    { value: "yearly", title: "Yearly" }
]

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        select: {
            width: 250,
            marginBottom: 20,
            margin: "0 30px 15px 0",
            "& span": {
                marginRight: 10
            },
            [theme.breakpoints.down('xs')]: {
                width: "100%",
                margin: "0 0 15px 0",
            }
        },
        btn: {
            width: 200,
            margin: "25px 0",
            [theme.breakpoints.down('xs')]: {
                margin: "20px auto"
            }
        }
    }),
);

export default function ExportReport() {
    const classes = useStyles()
    const dispatch = useDispatch()

    const [period, setPeriod] = useState<string | unknown>()
    const [contractStatus, setContractStatus] = useState<Array<string>>([])
    const [contractType, setContractType] = useState<Array<string>>([])

    const [fromDate, setFromDate] = useState<Date | null>(
        new Date(),
    )
    const [toDate, setToDate] = useState<Date | null>(
        new Date(),
    )
    const [loaderIsActive, setLoaderIsActive] = useState<boolean>(false)

    const createReport = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoaderIsActive(true)
        try {
            let reportOptions = {
                from: fromDate,
                to: toDate,
                reportPriority: period,
                contractType: contractType,
                contractStatus: contractStatus
            }
            let response = await actionsWithApi("POST", URL_FOR_API + "/api/v1/Report/createReport/report", reportOptions)
            downloadBase64File(
                response.data.mimeType,
                response.data.base64Content,
                response.data.fileName
            )
        }
        catch (error) {
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            dispatch(toggleNotification(true))
        }
        finally {
            setLoaderIsActive(false)
        }
    }

    return (
        <section>
            <h1 className={s["CreateReport-Title"]}>Export Report</h1>

            <form className={s["CreateReport-Form"]} onSubmit={(e) => createReport(e)}>

                <div className={s["CreateReport-Step"]}>
                    <h2 className={s["CreateReport-Subtitle"]}>Step 1: Select Date Range, based upon Date Check Sent</h2>
                    <div>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker className={classes.select} value={fromDate} disableToolbar
                                variant="inline" format="MM/dd/yyyy" margin="normal" label="From"
                                onChange={(data) => setFromDate(data)}
                                required
                            />
                        </MuiPickersUtilsProvider>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker className={classes.select} value={toDate} disableToolbar
                                variant="inline" format="MM/dd/yyyy" margin="normal" label="To"
                                onChange={(data) => setToDate(data)}
                                required
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                </div>

                <div className={s["CreateReport-Step"]}>
                    <h2 className={s["CreateReport-Subtitle"]}>Step 2: Select the periodicity to present data</h2>
                    <FormControl className={classes.select}>
                        <InputLabel required>Periodicity</InputLabel>
                        <Select
                            onChange={(e) => setPeriod(e.target.value)}
                            required
                        >
                            {periodicities.map((period, index) => (
                                <MenuItem
                                    key={index}
                                    value={period.value}
                                >
                                    {period.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <div className={s["CreateReport-Step"]}>
                    <h2 className={s["CreateReport-Subtitle"]}>Step 3: Select the types of data to include</h2>

                    <FormControl className={classes.select + " " + s["CreateReport-Label"]}>
                        <InputLabel required>Contract Type:</InputLabel>
                        <Select
                            value={contractType}
                            onChange={(e) => setContractType(e.target.value as string[])}
                            type="select-multiple"
                            required
                            multiple
                        >
                            {contractTypes.map((contractType, index) => (
                                <MenuItem
                                    key={index}
                                    value={contractType.value}
                                >
                                    {contractType.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl className={classes.select + " " + s["CreateReport-Label"]}>
                        <InputLabel required>Contract Status:</InputLabel>
                        <Select
                            value={contractStatus}
                            onChange={(e) => setContractStatus(e.target.value as string[])}
                            style={{ transformOrigin: "0 0" }}
                            required
                            multiple
                        >
                            {contractStatuses.map((contractStatus, index) => (
                                <MenuItem
                                    key={index}
                                    value={contractStatus.value}
                                >
                                    {contractStatus.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <div className={s["CreateReport-BtnContainer"]}>
                        <Button
                            className={classes.btn}
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={loaderIsActive}
                        >
                            Export Report
                        </Button>

                        {loaderIsActive && <Preloader size="30" position="center" />}
                    </div>
                </div>
            </form>
        </section>
    )
}
