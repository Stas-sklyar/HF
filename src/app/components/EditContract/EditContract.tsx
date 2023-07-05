import { Button, Container, Divider } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../reducers/rootReducers'
import EditContractInfo from './EditContractInfo/EditContractInfo'
import StatusHistory from './StatusHistory/StatusHistory'
import AssociatedAttorneys from './AssociatedAttorneys/AssociatedAttorneys'
import AssociatedClient from './AssociatedClient/AssociatedClient'
import AssociatedLawFirm from './AssociatedLawFirm/AssociatedLawFirm'
import EditContractCaseInfo from './EditContractCaseInfo/EditContractCaseInfo'
import { handlerForEditContractInputs, setDataForEditContractPage, setNotificationInfo, toggleNotification } from '../../actions/actions'
import getCookie from '../../scripts/getCookie'
import { useState, useEffect } from 'react'
import { URL_FOR_API } from '../../constants/constants'
import actionsWithApi from '../../customHooks/actionsWithApi'
import { useLocation } from 'react-router-dom'
import Preloader from '../shared/Preloader/Preloader'
import { history } from '../../../App'
import ContractCommentsPropsType from '../ContractPage/ContractComments/ContractComments'

export default function EditContract() {
    const dispatch = useDispatch()
    const userRole = getCookie("currentUserRole")
    const location = useLocation()
    const contractId = location.search.split("").slice(1, location.search.split("").length).join("")
    const changedData = useSelector((state: RootState) => state.editContract)
    const [userHasBeenAdded, setUserHasBeenAdded] = useState<boolean>(false)
    const [contractAttachmentHasBeenUploaded, setContractAttachmentHasBeenUploaded] = useState<boolean>(false)
    const [childContractHasBeenAdded, setChildContractHasBeenAdded] = useState<boolean>(false)

    const [contractInfo, setContractInfo] = useState<any>()
    const getContractData = async () => {
        try {
            let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/Contract/${contractId}`, null)
            setContractInfo(response.data)
            dispatch(setDataForEditContractPage(response.data))
        }
        catch (error) {
            console.log(error.message)
        }
    }
    useEffect(() => {
        getContractData()
    }, [userHasBeenAdded, contractAttachmentHasBeenUploaded, childContractHasBeenAdded]);

    const handleInputChange = (e: any) => {
        let value = e.target.value
        const name = e.target.name
        if (name === "liability") {
            value === "Yes" ? value = true : value = false
        }
        dispatch(handlerForEditContractInputs({ [name]: value }))
    }

    const handleSubmit = async () => {
        try {
            await actionsWithApi("POST", URL_FOR_API + `/api/v1/Contract/${contractId}/update`, changedData)
            dispatch(toggleNotification(true))
            dispatch(setNotificationInfo({ message: "Contract updated!", severity: "success" }))
            history.push(`/contract-page?${contractId}`)
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
        catch (error) {
            console.log(error.message)
            dispatch(toggleNotification(true))
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
        }
    }

    const deleteContract = () => {
        alert("Contract not deleted")
    }
    if (userRole !== "Administrator") {
        return (
            <h1>Are you not admin!</h1>
        )
    }
    else if (contractInfo && contractInfo.id) {
        return (
            <Container maxWidth="lg">
                <EditContractInfo
                    handlerForInputs={handleInputChange}
                    contractInfo={contractInfo}
                    childContractHasBeenAdded={childContractHasBeenAdded}
                    setChildContractHasBeenAdded={setChildContractHasBeenAdded}
                />
                <Divider />
                <StatusHistory
                    handlerForInputs={handleInputChange}
                />
                <Divider />
                <AssociatedClient
                    handlerForInputs={handleInputChange}
                    contractClientDTO={contractInfo.contractClientDTO}
                    contractCreatedDate={contractInfo.contractStatus[0].dateChange}
                    contractId={parseInt(contractId + "")}
                    attachments={contractInfo.attachments}
                    contractAttachmentHasBeenUploaded={contractAttachmentHasBeenUploaded}
                    setContractAttachmentHasBeenUploaded={setContractAttachmentHasBeenUploaded}
                />
                <Divider />
                <AssociatedAttorneys
                    handlerForInputs={handleInputChange}
                    contractAttorneyDTO={contractInfo.contractAttorneyDTO}
                    userHasBeenAdded={userHasBeenAdded}
                    setUserHasBeenAdded={setUserHasBeenAdded}
                    attachments={contractInfo.attachments}
                    contractAttachmentHasBeenUploaded={contractAttachmentHasBeenUploaded}
                    setContractAttachmentHasBeenUploaded={setContractAttachmentHasBeenUploaded}
                />
                <Divider />
                <AssociatedLawFirm
                    handlerForInputs={handleInputChange}
                    contractLawFirmDTO={contractInfo.contractLawFirmDTO}
                    userHasBeenAdded={userHasBeenAdded}
                    setUserHasBeenAdded={setUserHasBeenAdded}
                />
                <Divider />
                <EditContractCaseInfo
                    handlerForInputs={handleInputChange}
                    contractInfo={contractInfo}
                />
                <ContractCommentsPropsType
                    comments={contractInfo.contractComments}
                />
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" color="secondary" onClick={deleteContract} style={{ marginRight: "40px" }}>Delete</Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
                </div>
            </Container>
        )
    }
    else {
        return (
            <Preloader size="100" position="center" />
        )
    }
}