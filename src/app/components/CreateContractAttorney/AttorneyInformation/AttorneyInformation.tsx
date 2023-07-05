
import { Button, createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, TextField, Theme } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import {useState, useEffect, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addExistingAttorneyCreateContractPage, handlerCreateAttorneyInputs, resetCreatedAttorneyData, setNotificationInfo, toggleNotification } from '../../../actions/actions'
import { URL_FOR_API } from '../../../constants/constants'
import actionsWithApi from '../../../customHooks/actionsWithApi'
import { RootState } from '../../../reducers/rootReducers'
import { StatesType } from '../../../types/stateType'
import s from './AttorneyInformation.module.scss'
import getCookie from "../../../scripts/getCookie";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            width: 210,
            marginBottom: 20,
            marginRight: 20,
            [theme.breakpoints.down('xs')]: {
                width: "100%"
            }
        },
        lawFirmNameInput: {
            width: 210,
            marginRight: 20,
            [theme.breakpoints.down('xs')]: {
                width: "100%"
            }
        },
        textarea: {
            width: 100 + "%",
            marginTop: 10,
            marginBottom: 20,
            minHeight: 50,
            borderRadius: 10,
            padding: 10
        },
        autocomplete: {
            width: 210,
            marginRight: 20,
            [theme.breakpoints.down('xs')]: {
                width: "100%",
                marginRight: 0
            }
        },
        chooseLawFirmBtn: {
            marginLeft: 25,
            width: 250
        }
    }),
);

type AttorneyInformationType = {
    handlerForInputs(e: any): void
    setStateForCreateAttorneySection(state: boolean): void
    createdAttorneyEmailIsValid: boolean
    setLawFrimIdSelectedAttorney(id: number | null): void
    lawFrimIdSelectedAttorney: number | null
    userWithCurrentEmailIsAlreadyExist: boolean
}

export default function AttorneyInformation(props: AttorneyInformationType) {
    const currentUserType = getCookie("currentUserRole")
    const classes = useStyles()
    const dispatch = useDispatch()
    let states: Array<StatesType> = useSelector((state: RootState) => state.states)
    const [showAttorneyInfoSection, setShowAttorneyInfoSection] = useState<boolean>(false)
    const [attorneys, setAttorneys] = useState<any>([])
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [loaderIsActive, setLoaderIsActive] = useState<boolean>(false)
    const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
    const getAttorneys = async (searchQuery: string) => {
        if (searchQuery.length > 2) {
            try {
                setLoaderIsActive(true)
                let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/Autocomplete/attorney?userName=${searchQuery}`)
                setAttorneys(response.data)
                setLoaderIsActive(false)
            }
            catch (error) {
                dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
                dispatch(toggleNotification(true))
                console.log(error.message)
                setLoaderIsActive(false)
            }
        }
        else {
            setAttorneys([])
        }
    }

    useEffect(() => {
        searchQuery.length === 0 && props.setLawFrimIdSelectedAttorney(null)
        getAttorneys(searchQuery)
    }, [searchQuery])

    const handleChange = (e: any) => {
        const value = e.target.value
        const name = e.target.name
        dispatch(handlerCreateAttorneyInputs({ [name]: value }))
    }

    const [selectedAttorney, setSelectedAttorney] = useState<any>()
    const [idSelectedAttorney, setIdSelectedAttorney] = useState<number | null>()
    const selectAttorney = async (attorneyId: number) => {
        if (!isNaN(attorneyId)) {
            setIdSelectedAttorney(attorneyId)
            dispatch(addExistingAttorneyCreateContractPage(attorneyId))
            setShowAttorneyInfoSection(true)
            dispatch(resetCreatedAttorneyData())

            try {
                let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/User/${attorneyId}`)
                setSelectedAttorney(response.data)
                response.data.lawFirms[response.data.lawFirms.length - 1].lawFirmUserId &&
                    props.setLawFrimIdSelectedAttorney(response.data.lawFirms[response.data.lawFirms.length - 1].lawFirmUserId)
            }
            catch (error) {
                props.setLawFrimIdSelectedAttorney(null)
                console.log(error.message)
            }
        }
        else {
            setIdSelectedAttorney(null)
            dispatch(addExistingAttorneyCreateContractPage(null))
            setShowAttorneyInfoSection(false)
        }
    }

    const [createdAttorneySection, setCreatedAttorneySection] = useState<boolean>(false)

    const handleAutocomplete = async (value: string): Promise<void> => {
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current)
        }

        searchTimerRef.current = setTimeout(() => {
            setSearchQuery(value)
        }, 500)
    }

    return (
        <>
            <section className={s["AttorneyInformation"]}>
                <h1 className={s["AttorneyInformation-Title"]}>Attorney Information</h1>

                <p className={s["AttorneyInformation-Subtitle"]}>
                    Type in the name of your desired Attorney below to search and select the right user.
                    <br></br>
                    {
                        currentUserType === "Administrator"
                            ? <span>If the person doesn't exist within the system, then click 'Create Attorney' and add their personal information.</span>
                            : ''
                    }
                </p>

                <div className={s["AttorneyInformation-AddAttorneySection"]}>
                    <Autocomplete
                        options={attorneys || []}
                        loading={loaderIsActive}
                        getOptionLabel={(option: any) =>
                            (option.firstName ? (option.firstName.toString() + " ") : "") +
                            (option.lastName ? option.lastName.toString() + "" : "")
                        }
                        className={classes.autocomplete}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Attorneys"
                                variant="outlined"
                                onChange={e => handleAutocomplete(e.target.value || "")}
                                fullWidth required={!createdAttorneySection}
                            />
                        )}
                        onChange={(e, value, reason) => {
                            {
                                selectAttorney(parseInt(value ? value.id + "" : ""))
                                reason === "clear" && props.setLawFrimIdSelectedAttorney(null)
                            }
                        }}
                    />

                    {currentUserType === "Administrator" ? <div className={s["AttorneyInformation-DiviiderText"]}>Or</div> : ""}

                    {currentUserType === "Administrator" ?
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                showAttorneyInfoSection ? setCreatedAttorneySection(createdAttorneySection) : setCreatedAttorneySection(!createdAttorneySection)
                                props.setStateForCreateAttorneySection(!createdAttorneySection)
                            }}
                        >
                            Create attorney
                        </Button> : ""
                    }
                </div>

                {showAttorneyInfoSection && selectedAttorney &&
                    <div className={s["AttorneyInformation-Body"]}>
                        {selectedAttorney.email && <TextField name="attorneyEmail" className={classes.formControl} value={selectedAttorney.email} variant="outlined" size="small" label="Email" />}

                        {selectedAttorney.phoneNumber && <TextField name="attorneyPhone" className={classes.formControl} value={selectedAttorney.phoneNumber} variant="outlined" size="small" label="Phone Number" />}
                    </div>
                }

                {createdAttorneySection && !showAttorneyInfoSection &&
                    <div className={s["AttorneyInformation-CreatedAttorneySection"]}>
                        <TextField name="firstName" className={classes.formControl} variant="outlined" size="small" label="First Name" onChange={(e) => { handleChange(e) }} required={createdAttorneySection ? true : false} />
                        <TextField name="lastName" className={classes.formControl} variant="outlined" size="small" label="Last Name" onChange={(e) => { handleChange(e) }} required={createdAttorneySection ? true : false} />
                        <TextField name="email" className={classes.formControl} variant="outlined" size="small" label="Email" onChange={(e) => { handleChange(e) }} required={createdAttorneySection ? true : false} />
                        {(!props.createdAttorneyEmailIsValid && !props.userWithCurrentEmailIsAlreadyExist) && <span style={{ color: "red", marginTop: "-15px", marginBottom: "20px" }}>The email address is invalid</span>}
                        {props.userWithCurrentEmailIsAlreadyExist && <span style={{ color: "red", marginTop: "-15px", marginBottom: "20px" }}>A user with this email already exists. Please type in the name and select from the list to create a new Contract.</span>}

                        <TextField name="phoneNumber" className={classes.formControl} variant="outlined" size="small" label="Phone Number" onChange={(e) => { handleChange(e) }} required={createdAttorneySection ? true : false} />
                        <FormControl variant="standard">
                            <InputLabel id="state-label">State</InputLabel>
                            <Select labelId="state-label" name="state" onChange={(e) => handleChange(e)} className={classes.formControl} required={createdAttorneySection ? true : false}>
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

            {props.lawFrimIdSelectedAttorney &&
                <section className={s["AttorneyInformation-LawFirmSection"]}>
                    <h1 className={s["AttorneyInformation-LawFirmSectionTitle"]}>Law Firm</h1>
                    <div className={s["AttorneyInformation-LawFirmBox"]}>
                        {selectedAttorney.lawFirms.length > 0 &&
                            <TextField name="attorneyLawFirm" className={classes.lawFirmNameInput}
                                value={selectedAttorney.lawFirms[selectedAttorney.lawFirms.length - 1].firstName}
                                variant="outlined" size="small" label="Law Firm"
                            />
                        }

                        <div className={s["AttorneyInformation-DiviiderText"]}>Or</div>

                        <Button className={classes.chooseLawFirmBtn} variant="contained" color="primary"
                            onClick={() => { props.setLawFrimIdSelectedAttorney(null) }}>
                            Сhoose another Law Firm
                        </Button>
                    </div>
                </section>
            }
        </>
    )
}
