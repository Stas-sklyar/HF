import { Button, Container, createStyles, Divider, FormControlLabel, makeStyles, Radio, RadioGroup, TextField, Theme } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { addAmountRequestedCreateContractPage, addExistingAttorneyCreateContractPage, addExistingLawFirmForCreateContractPage, addExistingUserCreateContractPage, createAttorneyForCreateContractPage, createUserCreateContractPage, handlerForCreateContractAttorneyInputs, resetCreatedAttorneyData, resetCreatedPlaintiffData, resetDataForCreateContract, setCommentForCreateContract, setNotificationInfo, toggleNotification } from '../../actions/actions'
import { URL_FOR_API } from '../../constants/constants'
import actionsWithApi from '../../customHooks/actionsWithApi'
import { RootState } from '../../reducers/rootReducers'
import AttorneyInformation from './AttorneyInformation/AttorneyInformation'
import CaseInformation from './CaseInformation/CaseInformation'
import s from './CreateContractAttorney.module.scss'
import FinancialInformation from './FinancialInformation/FinancialInformation'
import Plaintiff from './Plaintiff/Plaintiff'
import { history } from '../../../App'
import getCookie from '../../scripts/getCookie'
import AddLawFirms from './AddLawFirms/AddLawFirms'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Alert, AlertTitle } from '@material-ui/lab'
import { validateEmail } from '../../scripts/registrationValidate'
import { Element } from 'react-scroll'
import CreateContractNotes from './CreateContractNotes/CreateContractNotes'
import Preloader from '../shared/Preloader/Preloader'
let Scroll = require('react-scroll')

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textarea: {
            width: 100 + "%",
            marginTop: 10,
            marginBottom: 20,
            minHeight: 50,
            borderRadius: 10,
            resize: 'none'
        },
        mainTopAlert: {
            marginBottom: 25,
            [theme.breakpoints.down('xs')]: {
                fontSize: "12px",
                marginBottom: 15
            }
        }
    }),
);


export default function CreateContractAttorney() {
    let scroller = Scroll.scroller
    const classes = useStyles()
    const dispatch = useDispatch()

    // Selectors
    let fundingRecipientEmail = useSelector((state: RootState) => state.createContractAttorney.recipientCheck)
    let caseManagerEmail = useSelector((state: RootState) => state.createContractAttorney.caseManager)
    let createdPlaintiffEmail = useSelector((state: RootState) => state.createdPlaintiffData.email)
    let createdAttorneyEmail = useSelector((state: RootState) => state.createdAttorneyfData.email)
    let contractData = useSelector((state: RootState) => state.createContractAttorney)

    let createdPlaintiffData = useSelector((state: RootState) => state.createdPlaintiffData)
    let createdPlaintiffId = useSelector((state: RootState) => state.createContractAttorney.contractClientDTO
        ? state.createContractAttorney.contractClientDTO.userId : null)

    let createdAttorneyData = useSelector((state: RootState) => state.createdAttorneyfData)
    let createdAttorneyId = useSelector((state: RootState) => state.createContractAttorney.contractAttorneyDTO
        ? (state.createContractAttorney.contractAttorneyDTO.length > 0 ? state.createContractAttorney.contractAttorneyDTO[0].userId : null)
        : null)
    let contractType = useSelector((state: RootState) => state.createContractAttorney.contractType)

    // States
    const [fundingRecipientEmailIsValid, setFundingRecipientEmailIsValid] = useState<boolean>(true)
    const [createdPlaintiffEmailIsValid, setCreatedPlaintiffEmailIsValid] = useState<boolean>(true)
    const [createdAttorneyEmailIsValid, setCreatedAttorneyEmailIsValid] = useState<boolean>(true)
    const [caseManagerEmailIsValid, setCaseManagerEmailIsValid] = useState<boolean>(true)
    // check if the button "create client" || "create attorney" || "create lawFirm" was touched
    const [createPlaintiffSectionIsOpen, setStateForCreatePlaintiffSection] = useState<boolean>(false)
    const [createAttorneySectionIsOpen, setStateForCreateAttorneySection] = useState<boolean>(false)
    const [createLawFirmSectionIsOpen, setStateForCreateLawFirmSection] = useState<boolean>(false)
    // data about created new lawFirm
    const [nameCreatedLawFirm, setNameCreatedLawFirm] = useState<string>("")
    const [stateCreatedLawFirm, setStateCreatedLawFirm] = useState<string>("")
    // ID of the last lawFirm for the selected(existing) atorney (we use it if we have not chosen and did not create any lawFirm)
    const [lawFrimIdSelectedAttorney, setLawFrimIdSelectedAttorney] = useState<number | null>(null)
    const [loaderIsActive, setLoaderIsActive] = useState<boolean>(false)

    const [plaintiffWithCurrentEmailIsAlreadyExist, setPlaintiffWithCurrentEmailIsAlreadyExist] = useState<boolean>(false)
    const [attorneyWithCurrentEmailIsAlreadyExist, setAttorneyWithCurrentEmailIsAlreadyExist] = useState<boolean>(false)

    const currentUserId = parseInt(getCookie("currentUserId") + "")
    const currentUserType = getCookie("currentUserRole")

    const actionsIfPropIsNotValid = (setPropIsNotValid: Dispatch<SetStateAction<boolean>>, message: string, anchor: string) => {
        setPropIsNotValid(false)
        dispatch(setNotificationInfo({ message: message, severity: "error" }))
        dispatch(toggleNotification(true))
        scroller.scrollTo(anchor, { duration: 800, delay: 0, smooth: 'easeInOutQuart' })
    }

    const handlerInputChange = (e: any) => {
        let value = e.target.value
        const name = e.target.name

        if (name === "liability") {
            value === "Yes" ? value = true : value = false
            dispatch(handlerForCreateContractAttorneyInputs({ [name]: value }))
        }
        else if (name === "comment") {
            dispatch(setCommentForCreateContract(value, currentUserId))
        }
        else if (name === "amountRequested") {
            dispatch(addAmountRequestedCreateContractPage(parseInt(value), new Date().toISOString() + "", parseInt(currentUserId + "")))
        }
        else {
            dispatch(handlerForCreateContractAttorneyInputs({ [name]: value }))
        }
    }

    const handlePlaintiff = () => {
        // If there is no id of an existing client, we create new one, if we do not create new one, we select the current logged client
        // + check if the client creation section is open, if the section is not open sending null for contractClientDTO
        if (!createdPlaintiffId && createPlaintiffSectionIsOpen) {
            dispatch(createUserCreateContractPage(createdPlaintiffData))
            contractData.contractClientDTO ? contractData.contractClientDTO.user = createdPlaintiffData : contractData.contractClientDTO = { user: createdPlaintiffData, userId: null }
        }
        else if (!createdPlaintiffId) {
            contractData.contractClientDTO ? contractData.contractClientDTO.userId = currentUserId : contractData.contractClientDTO = { user: null, userId: currentUserId }
        }
    }

    const handleAttorney = () => {
        // If there is no existing attorney id, create a new one + check if there is already a new attorney object in the attorneys array
        // + check if the attorney creation section is open, if the section is not open, send null for new attorney data obj in contractAttorneyDTO
        if (!createdAttorneyId && createAttorneySectionIsOpen) {
            dispatch(createAttorneyForCreateContractPage(createdAttorneyData))
            if (contractData.contractAttorneyDTO) {
                // if the array already exists then we update the data of the first element, if it does not exist, add 1 element to the array
                if (contractData.contractAttorneyDTO.length === 0) {
                    contractData.contractAttorneyDTO.push(
                        {
                            user: createdAttorneyData,
                            userId: null,
                            date: new Date().toISOString()
                        }
                    )
                }
                else {
                    contractData.contractAttorneyDTO[0].user = createdAttorneyData
                    contractData.contractAttorneyDTO[0].userId = null
                    contractData.contractAttorneyDTO[0].date = new Date().toISOString()
                }
            }
        }
    }

    const handleLawFirm = () => {
        // check if the lawFirm creation section is open then setData about new lawFirm
        if (createLawFirmSectionIsOpen) {
            if (contractData.contractLawFirmDTO) {
                if (contractData.contractLawFirmDTO.length === 0) {
                    contractData.contractLawFirmDTO.push(
                        {
                            user: { firstName: nameCreatedLawFirm, state: { key: stateCreatedLawFirm } },
                            userId: null,
                            date: new Date().toISOString()
                        }
                    )
                }
                else {
                    contractData.contractLawFirmDTO[0].user = { firstName: nameCreatedLawFirm, state: { key: stateCreatedLawFirm } }
                    contractData.contractLawFirmDTO[0].userId = null
                    contractData.contractLawFirmDTO[0].date = new Date().toISOString()
                }
            }
        }
        // if we have not created a new lawFirm we take the lawFirm of the selected(existing) attorney
        else {
            if (contractData && contractData.contractLawFirmDTO && lawFrimIdSelectedAttorney) {
                if (contractData.contractLawFirmDTO.length === 0) {
                    contractData.contractLawFirmDTO.push(
                        {
                            user: null,
                            userId: lawFrimIdSelectedAttorney,
                            date: new Date().toISOString()
                        }
                    )
                }
                else {
                    contractData.contractLawFirmDTO[0].user = null
                    contractData.contractLawFirmDTO[0].userId = lawFrimIdSelectedAttorney
                    contractData.contractLawFirmDTO[0].date = new Date().toISOString()
                }
            }
        }
    }

    const validateEmails = async () => {

        if (!validateEmail(fundingRecipientEmail) && fundingRecipientEmail.length > 0) {
            actionsIfPropIsNotValid(setFundingRecipientEmailIsValid, "The Funding Recipient Email address is invalid", 'financial-information-section')
            return false
        }
        else {
            setFundingRecipientEmailIsValid(true)
        }
        if (!validateEmail(createdPlaintiffEmail) && createPlaintiffSectionIsOpen) {
            actionsIfPropIsNotValid(setCreatedPlaintiffEmailIsValid, "Plaintiff's email address is invalid", 'created-plaintiff-section')
            return false
        }
        else {
            setCreatedPlaintiffEmailIsValid(true)
        }
        if (!validateEmail(createdAttorneyEmail) && createAttorneySectionIsOpen) {
            actionsIfPropIsNotValid(setCreatedAttorneyEmailIsValid, "Attorney's email address is invalid", 'attorney-information-section')
            return false
        }
        else {
            setCreatedAttorneyEmailIsValid(true)
        }
        if (!validateEmail(caseManagerEmail) && caseManagerEmail.length > 0) {
            actionsIfPropIsNotValid(setCaseManagerEmailIsValid, "Case manager email address is invalid", 'case-information-section')
            return false
        }
        else {
            setCaseManagerEmailIsValid(true)
        }

        if (createPlaintiffSectionIsOpen) {
            const emailIsAlreadyRegistered = await checkPlaintiffEmailForRegistrationInSystem(createdPlaintiffEmail)

            if (emailIsAlreadyRegistered) { return false }
        }

        if (createAttorneySectionIsOpen) {
            const emailIsAlreadyRegistered = await checkAttorneyEmailForRegistrationInSystem(createdAttorneyEmail)

            if (emailIsAlreadyRegistered) { return false }
        }

        return true

    }

    const checkPlaintiffEmailForRegistrationInSystem = async (currentNewPlaintiffEmail: string): Promise<boolean> => {
        return new Promise (async (resolve, reject) => {
            try {
                const emailIsAlreadyRegistered = await checkEmailForRegistrationInSystem(currentNewPlaintiffEmail)

                if (emailIsAlreadyRegistered) {
                    actionsIfPropIsNotValid(setCreatedPlaintiffEmailIsValid, "A user with this email is already registered", 'created-plaintiff-section')
                    setPlaintiffWithCurrentEmailIsAlreadyExist(true)
                    resolve(true)
                } else {
                    setCreatedPlaintiffEmailIsValid(true)
                    setPlaintiffWithCurrentEmailIsAlreadyExist(false)
                    resolve(false)
                }
            }
            catch {
                reject()
            }
        })
    }

    const checkAttorneyEmailForRegistrationInSystem = async (currentNewAttorneyEmail: string): Promise<boolean> => {
        return new Promise (async (resolve, reject) => {
            try {
                const emailIsAlreadyRegistered = await checkEmailForRegistrationInSystem(currentNewAttorneyEmail)

                if (emailIsAlreadyRegistered) {
                    actionsIfPropIsNotValid(setCreatedAttorneyEmailIsValid, "A user with this email is already registered", 'attorney-information-section')
                    setAttorneyWithCurrentEmailIsAlreadyExist(true)
                    resolve(true)
                } else {
                    setCreatedAttorneyEmailIsValid(true)
                    setAttorneyWithCurrentEmailIsAlreadyExist(false)
                    resolve(false)
                }
            }
            catch {
                reject()
            }
        })
    }

    const checkEmailForRegistrationInSystem = async (email: string): Promise<boolean> => {
        return new Promise (async (resolve, reject) => {
            try {
                let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/User?Email=${email}`)
                const emailIsAlreadyRegistered = response.data.length > 0;
                resolve(emailIsAlreadyRegistered)
            }
            catch {
                reject()
            }
        })
    }

    const handleSubmit = async (e: React.FormEvent<EventTarget>) => {
        e.preventDefault()
        setLoaderIsActive(true)

        // validate form and if validation is successful...
        if (await validateEmails()) {
            try {
                handlePlaintiff()
                handleAttorney()
                handleLawFirm()

                // try to send query
                try {
                    let response = await actionsWithApi("POST", URL_FOR_API + "/api/v1/Contract", contractData)
                    // if response is ok - reset all id in the store
                    dispatch(addExistingUserCreateContractPage(null))
                    dispatch(addExistingAttorneyCreateContractPage(null))
                    dispatch(addExistingLawFirmForCreateContractPage(null))

                    // reset attorney + plaintiff data
                    dispatch(resetCreatedAttorneyData())
                    dispatch(resetCreatedPlaintiffData())

                    // reset store (Create Contract Page)
                    dispatch(resetDataForCreateContract())

                    dispatch(setNotificationInfo({ message: "Contract created successfully", severity: "success" }))
                    dispatch(toggleNotification(true))
                    history.push(`/contract-page?${response.data.id}`)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                }
                catch (error) {
                    dispatch(setNotificationInfo({ message: "some error from BE " + error.message, severity: "error" }))
                    dispatch(toggleNotification(true))
                    console.log(error.message)
                }
            }
            catch (error) {
                dispatch(setNotificationInfo({ message: "some error from FE, please reload the page", severity: "error" }))
                dispatch(toggleNotification(true))
                console.log(error.message)
            }
            finally {
                // if we decided not to create attorney/lawFirm or something went wrong
                if (contractData.contractAttorneyDTO && contractData.contractAttorneyDTO[0]?.user === null && contractData.contractAttorneyDTO[0]?.userId === null) {
                    contractData.contractAttorneyDTO = null
                }
                if (contractData.contractLawFirmDTO && contractData.contractLawFirmDTO[0]?.user === null && contractData.contractLawFirmDTO[0]?.userId === null) {
                    contractData.contractLawFirmDTO = null
                }
                setLoaderIsActive(false)
            }
        }
        setLoaderIsActive(false)
    }

    return (
        <>
            <Container maxWidth="lg" className={s["CreateContractAttorney"]} >
                <Alert severity="warning" variant="outlined" className={classes.mainTopAlert}>
                    <AlertTitle><span className={s["CreateContractAttorney-AlertText"]}>Warning</span></AlertTitle>
                    <span className={s["CreateContractAttorney-AlertText"]}>If you would like to request additional funds for an existing case, please do so by visiting the existing case page and clicking ‘Request Additional Funds’. Your cases can be found by clicking ‘Case History’ in the top menu.</span>
                </Alert>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <h1 className={s["CreateContractAttorney-Title"]}>Select the Contract Type</h1>

                    <RadioGroup className={s["CreateContractAttorney-RadioBtns"]} row name="contractType" defaultValue="PreSettlement" onChange={(e) => handlerInputChange(e)}>
                        <FormControlLabel value="PreSettlement" control={<Radio color="primary" />} label="Pre-Settlement" labelPlacement="top" />
                        <FormControlLabel value="PostSettlement" control={<Radio color="primary" />} label="Post-Settlement" labelPlacement="top" />
                    </RadioGroup>

                    <Element name="financial-information-section"><FinancialInformation handlerForInputs={handlerInputChange}
                        fundingRecipientEmailIsValid={fundingRecipientEmailIsValid} />
                        <Divider />
                    </Element>
                    {currentUserType !== "Client" &&
                        <Element name="created-plaintiff-section">
                            <Plaintiff
                                handlerForInputs={handlerInputChange}
                                setStateForCreatePlaintiffSection={setStateForCreatePlaintiffSection}
                                createdPlaintiffEmailIsValid={createdPlaintiffEmailIsValid}
                                contractType={contractType}
                                userWithCurrentEmailIsAlreadyExist={plaintiffWithCurrentEmailIsAlreadyExist}
                            /><Divider />
                        </Element>
                    }
                    <Element name="case-information-section">
                        <CaseInformation handlerForInputs={handlerInputChange} caseManagerEmailIsValid={caseManagerEmailIsValid} contractType={contractType} />
                        <Divider />
                    </Element>
                    <Element name="attorney-information-section">
                        <AttorneyInformation
                            handlerForInputs={handlerInputChange}
                            setStateForCreateAttorneySection={setStateForCreateAttorneySection}
                            createdAttorneyEmailIsValid={createdAttorneyEmailIsValid}
                            setLawFrimIdSelectedAttorney={setLawFrimIdSelectedAttorney}
                            lawFrimIdSelectedAttorney={lawFrimIdSelectedAttorney}
                            userWithCurrentEmailIsAlreadyExist={attorneyWithCurrentEmailIsAlreadyExist}
                        /><Divider />
                    </Element>
                    {!lawFrimIdSelectedAttorney &&
                        <AddLawFirms setStateForCreateLawFirmSection={setStateForCreateLawFirmSection} setNameCreatedLawFirm={setNameCreatedLawFirm}
                            setStateCreatedLawFirm={setStateCreatedLawFirm}
                        />
                    }

                    <div className={s["CreateContractAttorney-Comment"]}>
                        <span>Comments: </span>
                        <TextField name="comment" variant="outlined" rows={4} className={classes.textarea} onChange={(e) => handlerInputChange(e)}
                            placeholder="Write comment..." multiline />
                    </div>

                    <CreateContractNotes contractType={contractType} />

                    <div className={s["CreateContractAttorney-Btns"]}>
                        <span>
                            <Button
                                type="submit" variant="contained" color="primary"
                                disabled={loaderIsActive}
                            >
                                Submit
                            </Button>
                        </span>
                        {loaderIsActive && <Preloader size="30" position="center" />}
                    </div>

                </form>
            </Container>
        </>
    )
}
