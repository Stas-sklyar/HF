import { Button, Checkbox, createStyles, FormControlLabel, makeStyles, TextField, Theme } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { setNotificationInfo, toggleNotification } from '../../../actions/actions'
import { URL_FOR_API } from '../../../constants/constants'
import actionsWithApi from '../../../customHooks/actionsWithApi'
import dateFormatting from '../../../scripts/dateFormatting'
import AddBtn from '../../shared/AddBtn/AddBtn'
import s from './AssociatedLawFirm.module.scss'
import getCookie from "../../../scripts/getCookie";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        selectMedium: {
            width: 200,
            marginBottom: 40,
        },
        formControl: {
            width: 220,
            marginRight: 20,
            [theme.breakpoints.down('xs')]: {
                width: "100%",
                marginRight: 0
            }
        },
        btn: {
            height: 40
        }
    }),
);

type AssociatedLawFirmType = {
    handlerForInputs(e: any): void
    contractLawFirmDTO: any
    setUserHasBeenAdded(e: boolean): void
    userHasBeenAdded: boolean
}

export default function AssociatedLawFirm(props: AssociatedLawFirmType) {
    const currentUserType = getCookie("currentUserRole")
    const classes = useStyles()
    const dispatch = useDispatch()
    const location = useLocation()
    const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
    const contractId = location.search.split("").slice(1, location.search.split("").length).join("")
    const [addFirm, setAddFirm] = useState(false)
    const [loaderIsActive, setLoaderIsActive] = useState<boolean>(false)
    const [lawFirms, setLawFirms] = useState<any>([])
    const getLawFirms = async (searchValue: string = "") => {
        if (searchValue.length < 3) {
            return
        }

        try {
            setLoaderIsActive(true)
            let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/Autocomplete/lawFirm?userName=${searchValue}`)
            setLawFirms(response.data)
            setLoaderIsActive(false)
        }
        catch (error) {
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            dispatch(toggleNotification(true))
            console.log(error.message)
            setLoaderIsActive(false)
            setLawFirms([])
        }
    }

    const [selectedLawFirm, setSelectedLawFirm] = useState<number | null>()
    const addExistingLawFirm = async (e: React.FormEvent<EventTarget>) => {
        e.preventDefault()
        if(selectedLawFirm) {
            try {
                await actionsWithApi("POST", URL_FOR_API + `/api/v1/Contract/${contractId}/addLawFirm`,
                    {
                        userId: selectedLawFirm,
                        date: new Date().toISOString() + ""
                    }
                )
                props.setUserHasBeenAdded(!props.userHasBeenAdded)
                dispatch(setNotificationInfo({ message: "New Law Firm has been added", severity: "success" }))
                dispatch(toggleNotification(true))
            }
            catch (error) {
                dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
                dispatch(toggleNotification(true))
                console.log(error.message)
            }
        }
    }

    const handleAutocomplete = async (value: string): Promise<void> => {
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current)
        }

        searchTimerRef.current = setTimeout(() => {
            getLawFirms(value)
        }, 500)
    }

    return (
        <section className={s["AssociatedLawFirm"]}>
            <h1 className={s["AssociatedLawFirm-Title"]}>Associated Law Firm</h1>

            <div className={s["AssociatedLawFirm-Body"]}>
                {props.contractLawFirmDTO.length > 0 &&
                    props.contractLawFirmDTO.map((item: any, index: number) => {
                        return (
                            <div key={index} className={s["AssociatedLawFirm-Row"]}>
                                <div className={s["AssociatedLawFirm-Col"]}>
                                    <TextField
                                        className={classes.formControl}
                                        name="lawFirmDateSelected"
                                        value={item.user?.userName ? item.user?.userName : ""}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        label="Law Firm name"
                                    />
                                </div>

                                <div className={s["AssociatedLawFirm-Col"]}>
                                    <FormControlLabel
                                        className={classes.formControl}
                                        name="isResponsibleLawFirm"
                                        control={<Checkbox checked={item.responsible} color="primary" />}
                                        label="Responsible Law Firm"
                                    />
                                </div>

                                <div className={s["AssociatedLawFirm-Col"]}>
                                    <TextField
                                        className={classes.formControl}
                                        name="lawFirmDateSelected"
                                        value={dateFormatting(item.date)} type="text"
                                        variant="outlined"
                                        size="small"
                                        label="Added Date"
                                    />
                                </div>

                                <div className={s["AssociatedLawFirm-Col"]}></div>
                            </div>
                        )
                    })
                }

                {props.contractLawFirmDTO.length === 0 &&
                    <span>The contract does not have anyone Law Firm</span>
                }
            </div>

            {currentUserType === "Administrator"
                ? <div
                    className={s["AssociatedLawFirm-AddFirmBtn"]}
                    onClick={() => setAddFirm(!addFirm)}
                >
                    <AddBtn text="Add New Law Firm" />
                </div>
                : ""
            }

            {addFirm &&
                <form onSubmit={(e) => addExistingLawFirm(e)} className={s["AssociatedLawFirm-AddFirmPanel"] + " " + s["AssociatedLawFirm-Row"]}>
                    <Autocomplete
                        options={lawFirms || []}
                        loading={loaderIsActive}
                        getOptionLabel={(option: any) =>
                            (option.firstName ? (option.firstName.toString() + " ") : "") +
                            (option.lastName ? option.lastName.toString() + "" : "")
                        }
                        className={classes.formControl}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Law Firms" variant="outlined"
                                fullWidth
                                required
                                onChange={e => handleAutocomplete(e.target.value || "")}
                            />
                        )}
                        onChange={(e, value) => setSelectedLawFirm(value?.id || null)}
                    />

                    <Button type="submit" variant="contained" color="primary" className={classes.btn}>Add LawFirm</Button>
                </form>
            }
        </section>
    )
}