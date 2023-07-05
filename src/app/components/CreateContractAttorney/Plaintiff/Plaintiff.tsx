
import { Button, createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, TextField, Theme } from '@material-ui/core'
import { Alert, Autocomplete } from '@material-ui/lab'
import {useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addExistingUserCreateContractPage, createUserCreateContractPage, handlerCreatePlaintiffInputs, resetCreatedPlaintiffData, setNotificationInfo, toggleNotification } from '../../../actions/actions'
import { SUPPORT_EMAIL, URL_FOR_API } from '../../../constants/constants'
import actionsWithApi from '../../../customHooks/actionsWithApi'
import { RootState } from '../../../reducers/rootReducers'
import dateFormatting from '../../../scripts/dateFormatting'
import { StatesType } from '../../../types/stateType'
import s from './Plaintiff.module.scss'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            width: 210,
            marginBottom: 20,
            "&>span": {
                display: "block",
                marginBottom: 5
            },
            [theme.breakpoints.down('xs')]: {
                width: "100%"
            }
        },
        autocomplete: {
            width: 210,
            [theme.breakpoints.down('xs')]: {
                width: "100%"
            }
        },
        formControlCreateUser: {
            marginRight: 20
        }
    }),
);

type PlaintiffType = {
    handlerForInputs(e: any): void
    setStateForCreatePlaintiffSection(state: boolean): void
    createdPlaintiffEmailIsValid: boolean
    contractType: "PreSettlement" | "PostSettlement"
    userWithCurrentEmailIsAlreadyExist: boolean
}

export default function Plaintiff(props: PlaintiffType) {
    const classes = useStyles()
    const dispatch = useDispatch()
    let states: Array<StatesType> = useSelector((state: RootState) => state.states)
    const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [showPlaintiffInfoSection, setShowPlaintiffInfoSection] = useState<boolean>(false)

    const [clients, setClients] = useState<any>([])
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [loaderIsActive, setLoaderIsActive] = useState<boolean>(false)
    const getClients = async () => {
        if (searchQuery.length > 2) {
            try {
                setLoaderIsActive(true)
                let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/Autocomplete/client?userName=${searchQuery}`)
                setClients(response.data)
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
            setClients([])
        }
    }

    useEffect(() => {
        getClients()
    }, [searchQuery])

    const [selectedClient, setSelectedClient] = useState<any>()
    const [idSelectedClient, setIdSelectedClient] = useState<number | null>(-1)
    const selectClient = async (clientId: number) => {
        if (!isNaN(clientId)) {
            dispatch(createUserCreateContractPage(null))
            setIdSelectedClient(clientId)
            dispatch(addExistingUserCreateContractPage(clientId))
            setShowPlaintiffInfoSection(true)
            dispatch(resetCreatedPlaintiffData())
            try {
                let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/User/${clientId}`)
                setSelectedClient(response.data)
            }
            catch (error) {
                dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
                dispatch(toggleNotification(true))
                console.log(error.message)
            }
        }
        else {
            setIdSelectedClient(null)
            dispatch(addExistingUserCreateContractPage(null))
            setShowPlaintiffInfoSection(false)
        }
    }

    const [createdPlaintiffSection, setCreatedPlaintiffSection] = useState<boolean>(false)

    const handleChange = (e: any) => {
        let value = e.target.value
        const name = e.target.name

        if (name === "dateOfBirth") {
            value = new Date(value).toISOString()
        }

        dispatch(handlerCreatePlaintiffInputs({ [name]: value }))
    }

    const handleAutocomplete = async (value: string): Promise<void> => {
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current)
        }

        searchTimerRef.current = setTimeout(() => {
            setSearchQuery(value)
        }, 500)
    }

    return (
        <section className={s["Plaintiff"]}>
            <h1 className={s["Plaintiff-Title"]}>Plaintiff Background</h1>

            <p className={s["Plaintiff-Subtitle"]}>
                Type in the name of your desired Plaintiff below to search and select the right user. <br></br>
                If the person doesn't exist within the system, then click 'Create New Plaintiff' and add their personal information.
            </p>

            {props.contractType === "PostSettlement"
                ? <Alert
                    icon={false}
                    severity="warning"
                    variant="outlined"
                    className={s["Plaintiff-Alert"]}
                >
                    <p>You can only request Post Settlement funding for Plaintiffs who have already received funding in a Pre-Settlement request.</p>
                    <p>If your client doesn’t not have an approved Pre-Settlement request, please contact <a href={`mailto:${SUPPORT_EMAIL}`} className={s['Footer-Link']}>{SUPPORT_EMAIL}</a></p>
                </Alert>
                : ""
            }

            <div className={s["Plaintiff-AddPlaintiffSection"]}>
                <Autocomplete
                    options={clients || []}
                    loading={loaderIsActive}
                    getOptionLabel={(option: any) =>
                        (option.firstName ? (option.firstName.toString() + " ") : "") +
                        (option.lastName ? option.lastName.toString() + "" : "")
                    }
                    className={classes.autocomplete}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Plaintiffs"
                            variant="outlined"
                            onChange={e => handleAutocomplete(e.target.value || "")}
                            fullWidth
                            required={!createdPlaintiffSection}
                        />
                    )}
                    onChange={(e, value) => selectClient(parseInt(value ? value.id + "" : ""))}
                />

                <div className={s["Plaintiff-DividerText"]}>Or</div>

                <Button variant="contained" color="primary"
                    onClick={() => {
                        setCreatedPlaintiffSection(!createdPlaintiffSection)
                        props.setStateForCreatePlaintiffSection(!createdPlaintiffSection)
                    }}>
                    Create new Plaintiff
                </Button>
            </div>

            {
                showPlaintiffInfoSection && selectedClient &&
                <div className={s["Plaintiff-Body"]}>
                    {selectedClient.dateOfBirth && <TextField type="text" variant="outlined" value={dateFormatting(selectedClient.dateOfBirth)} className={classes.formControl} size="small" label="Date of Birth" />}
                    {selectedClient.streetAddress && <TextField variant="outlined" value={selectedClient.streetAddress} className={classes.formControl} size="small" label="Street Address" />}
                    {selectedClient.city && <TextField variant="outlined" value={selectedClient.city} className={classes.formControl} size="small" label="City" />}
                    {selectedClient.zipCode && <TextField variant="outlined" value={selectedClient.zipCode} className={classes.formControl} size="small" label="Zipcode" />}
                    {selectedClient.state && <TextField variant="outlined" value={selectedClient.state.name} className={classes.formControl} size="small" label="State" />}
                    {selectedClient.email && <TextField type="email" value={selectedClient.email} className={classes.formControl} variant="outlined" size="small" label="Plaintiff Email" />}
                    {selectedClient.phoneNumber && <TextField type="text" value={selectedClient.phoneNumber} className={classes.formControl} variant="outlined" size="small" label="Phone Number" />}
                </div>
            }

            {
                createdPlaintiffSection && !showPlaintiffInfoSection &&
                <div className={s["Plaintiff-CreatedPlaintiffSection"]}>
                    <TextField name="firstName" className={classes.formControl} variant="outlined" size="small" label="First Name" onChange={(e) => { handleChange(e) }} required={createdPlaintiffSection ? true : false} />
                    <TextField name="lastName" className={classes.formControl} variant="outlined" size="small" label="Last Name" onChange={(e) => { handleChange(e) }} required={createdPlaintiffSection ? true : false} />
                    <label className={s["Plaintiff-DateOfBirdthLabel"]}>
                        <span>Date of Birth *</span>
                        <TextField type="date" variant="outlined" className={classes.formControl + " " + classes.formControlCreateUser} name="dateOfBirth" onChange={(e) => handleChange(e)} size="small" required={createdPlaintiffSection ? true : false} />
                    </label>
                    <TextField variant="outlined" className={classes.formControl + " " + classes.formControlCreateUser} name="streetAddress" onChange={(e) => handleChange(e)} size="small" label="Street Address" required={createdPlaintiffSection ? true : false} />
                    <TextField variant="outlined" className={classes.formControl + " " + classes.formControlCreateUser} name="city" onChange={(e) => handleChange(e)} size="small" label="City" required={createdPlaintiffSection ? true : false} />
                    <TextField variant="outlined" className={classes.formControl + " " + classes.formControlCreateUser} name="zipCode" onChange={(e) => handleChange(e)} size="small" label="Zipcode" required={createdPlaintiffSection ? true : false} />
                    <FormControl variant="standard">
                        <InputLabel id="state-label" required={createdPlaintiffSection ? true : false}>State</InputLabel>
                        <Select labelId="state-label" name="state" onChange={(e) => handleChange(e)} className={classes.formControl + " " + classes.formControlCreateUser} required={createdPlaintiffSection ? true : false}>
                            {states.length > 0 && states.map((state) => {
                                return (
                                    <MenuItem key={state.key} value={state.key}>{state.name}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <TextField className={classes.formControl + " " + classes.formControlCreateUser} name="email" onChange={(e) => handleChange(e)} variant="outlined" size="small" label="Plaintiff Email" required={createdPlaintiffSection ? true : false} />

                    {(!props.createdPlaintiffEmailIsValid && !props.userWithCurrentEmailIsAlreadyExist) && <span style={{ color: "red", marginTop: "-20px", marginBottom: "20px" }}>The email address is invalid</span>}
                    {props.userWithCurrentEmailIsAlreadyExist && <span style={{ color: "red", marginTop: "-20px", marginBottom: "20px" }}>A user with this email already exists. Please type in the name and select from the list to create a new Contract.</span>}
                    <TextField type="text" className={classes.formControl + " " + classes.formControlCreateUser} name="phoneNumber" onChange={(e) => handleChange(e)} variant="outlined" size="small" label="Phone Number" required={createdPlaintiffSection ? true : false} />
                </div>
            }

        </section >
    )
}
