import RawDataSelect from './RawDataSelect/RawDataSelect'
import { createStyles, makeStyles, Theme, Button } from '@material-ui/core'
import s from "../Reports.module.scss"
import { FormEvent, useState } from "react"
import DateFnsUtils from "@date-io/date-fns"
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers"
import { setNotificationInfo, toggleNotification } from '../../../actions/actions'
import { URL_FOR_API } from '../../../constants/constants'
import actionsWithApi from '../../../customHooks/actionsWithApi'
import { useDispatch } from 'react-redux'
import { downloadBase64File } from '../../../scripts/downloadBase64File'
import Preloader from "../../shared/Preloader/Preloader";


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
)

export default function Reports() {
    const classes = useStyles()
    const dispatch = useDispatch()

    const [rawData, setRawData] = useState<Array<string>>([])
    const [fromDate, setFromDate] = useState<Date | null>(
        new Date(),
    )
    const [toDate, setToDate] = useState<Date | null>(
        new Date(),
    )
    const [loaderIsActive, setLoaderIsActive] = useState<boolean>(false)

    const exportRawData = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoaderIsActive(true)
        try {
            let exportRawDataOptions = {
                from: fromDate,
                to: toDate,
                exportPropertiesList: rawData
            }
            let response = await actionsWithApi("POST", URL_FOR_API + "/api/v1/Report/createReport/all", exportRawDataOptions)
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
        <section className={s["CreateReport-DownloadRawDataContainer"]}>
            <h1 className={s["CreateReport-Title"]}>Download Raw Data</h1>

            <form className={s["CreateReport-Form"]} onSubmit={(e) => exportRawData(e)}>
                <div className={s["CreateReport-Step"]}>
                    <h2 className={s["CreateReport-Subtitle"]}>Step 1: Select Date Range, based upon Date Check Sent</h2>
                    <div>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                className={classes.select}
                                value={fromDate}
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                label="From"
                                onChange={(data) => setFromDate(data)}
                                required
                            />
                        </MuiPickersUtilsProvider>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                className={classes.select}
                                value={toDate}
                                disableToolbar
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                label="To"
                                onChange={(data) => setToDate(data)}
                                required
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                </div>

                <div className={s["CreateReport-Step"]}>
                    <h2 className={s["CreateReport-Subtitle"]}>Step 2: Select the types of Raw Data you want to see for the Date Range</h2>
                    <RawDataSelect
                        rawData={rawData}
                        setRawData={setRawData}
                        values={rawData}
                    />

                    <div className={s["CreateReport-BtnContainer"]}>
                        <Button
                            className={classes.btn}
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={loaderIsActive}
                        >
                            Export Raw Data
                        </Button>

                        {loaderIsActive && <Preloader size="30" position="center" />}
                    </div>
                </div>

            </form>
        </section>
    )
}