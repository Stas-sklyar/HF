
import { Button, createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, TextField, Theme } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import {useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addExistingLawFirmForCreateContractPage, setLawFirmToCreatedAttorney, setNotificationInfo, toggleNotification } from '../../../actions/actions'
import { URL_FOR_API } from '../../../constants/constants'
import actionsWithApi from '../../../customHooks/actionsWithApi'
import { RootState } from '../../../reducers/rootReducers'
import { StatesType } from '../../../types/stateType'
import s from './AddLawFirms.module.scss'
import getCookie from "../../../scripts/getCookie";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            width: 210,
            marginRight: 20,
            [theme.breakpoints.down('xs')]: {
                width: "100%",
                marginRight: 0
            }
        },
        lawFirmNameField: {
            marginBottom: 20,
            [theme.breakpoints.down('xs')]: {
                width: "100%",
            }
        }
    }),
)

export type AddLAwFirmsType = {
    setStateForCreateLawFirmSection(state: boolean): void
    setNameCreatedLawFirm(state: string): void
    setStateCreatedLawFirm(state: string): void
}

export default function AddLawFirms(props: AddLAwFirmsType) {
    const currentUserType = getCookie("currentUserRole")
    const classes = useStyles()
    const dispatch = useDispatch()
    const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
    let states: Array<StatesType> = useSelector((state: RootState) => state.states)
    const [createdLawFirmSection, setCreatedLawFirmSection] = useState<boolean>(false)
    const [idSelectedLawFirm, setIdSelectedLawFirm] = useState<number>()
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

    const handleAutocomplete = async (value: string): Promise<void> => {
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current)
        }

        searchTimerRef.current = setTimeout(() => {
            getLawFirms(value)
        }, 500)
    }

    return (
        <section className={s["LawFirm"]}>
            <h1 className={s["LawFirm-Title"]}>Law Firms</h1>

            <p className={s["LawFirm-Subtitle"]}>
                If your Law Firm doesn't immediately appear after indicating the Attorney, then you need to be sure to request the admin to connect a Law Firm to the Attorney's account.Type in the name of your desired Attorney below to search and select the right user.
                {
                    currentUserType === "Administrator"
                        ? <span>If the person doesn't exist within the system, then click 'Create Attorney' and add their personal information.</span>
                        : ''
                }
            </p>

            <div className={s["LawFirm-AddLawFirmSection"]}>
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
                            label="Law Firms"
                            variant="outlined"
                            onChange={e => handleAutocomplete(e.target.value || "")}
                            fullWidth required={!createdLawFirmSection}
                        />
                    )}
                    onChange={(e, value) => {
                        setIdSelectedLawFirm(value ? value.id : null)
                        dispatch(addExistingLawFirmForCreateContractPage(value ? value.id : null))
                        setCreatedLawFirmSection(false)
                        props.setStateForCreateLawFirmSection(false)
                        dispatch(setLawFirmToCreatedAttorney(parseInt(value?.id)))
                    }}
                />
                {currentUserType === "Administrator" ? <div className={s["LawFirm-DiviiderText"]}>Or</div> : ""}

                {currentUserType === "Administrator" ?
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setCreatedLawFirmSection(!createdLawFirmSection)
                            props.setStateForCreateLawFirmSection(!createdLawFirmSection)
                        }}
                    >
                        Create Law Firm
                    </Button> : ""}
            </div>

            {createdLawFirmSection && !idSelectedLawFirm &&
                <div className={s["LawFirm-CreatedLawFirmSection"]}>
                    <TextField
                        name="lawFirmName"
                        className={classes.formControl + " " + classes.lawFirmNameField}
                        variant="outlined"
                        size="small"
                        label="Law firm name"
                        onChange={(e) => { props.setNameCreatedLawFirm(e.target.value) }}
                        required={createdLawFirmSection}
                    />

                    <FormControl variant="standard">
                        <InputLabel id="state-label">State</InputLabel>

                        <Select labelId="state-label" onChange={(e) => props.setStateCreatedLawFirm(e.target.value + "")} className={classes.formControl}
                            required={createdLawFirmSection}>
                            {states.length > 0 && states.map((state) => {
                                return (
                                    <MenuItem key={state.key} value={state.key}>{state.name}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                </div>
            }

        </section>
    )
}
