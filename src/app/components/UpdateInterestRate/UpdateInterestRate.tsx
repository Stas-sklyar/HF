import { Container, Divider } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { setNotificationInfo, toggleNotification } from '../../actions/actions'
import { URL_FOR_API } from '../../constants/constants'
import actionsWithApi from '../../customHooks/actionsWithApi'
import { RatesType } from '../../types/ratesType'
import PostSettlementRates from '../CreateNewInterestRate/PostSettlementRates/PostSettlementRates'
import PreSettlementRates from '../CreateNewInterestRate/PreSettlementRates/PreSettlementRates'
import s from './UpdateInterestRate.module.scss'
import UpdateSettlementDataWindow from './UpdateSettlementDataWindow/UpdateSettlementDataWindow'

export default function UpdateInterestRate() {
    const dispatch = useDispatch()
    let location = useLocation()
    let interestRateId = parseInt(location.search.split("").slice(1, location.search.split("").length).join("") + "")

    const [stateName, setStateName] = useState<string>("State name")
    const [stateKey, setStateKey] = useState<string>("State key")
    const [preSettlementRatesArr, setPreSettlementRatesArr] = useState<Array<RatesType>>([])
    const [postSettlementRatesArr, setPostSettlementRatesArr] = useState<Array<RatesType>>([])
    const [settlementDataIsUpdatedToggle, setSettlementDataIsUpdatedToggle] = useState<boolean>(false)
    const [settlementDataHasBeenAddedToggle, setSettlementDataHasBeenAddedToggle] = useState<boolean>(false)
    const getInterestRate = async () => {
        try {
            let response = await actionsWithApi("GET", URL_FOR_API + `/api/v1/Interest/${interestRateId}`)
            setPreSettlementRatesArr(response.data.preSettlements)
            setPostSettlementRatesArr(response.data.postSettlements)
            setStateName(response.data.state.name)
            setStateKey(response.data.state.key)
        }
        catch (error) {
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            dispatch(toggleNotification(true))
            console.log(error.message)
        }
    }
    useEffect(() => {
        getInterestRate()
    }, [settlementDataIsUpdatedToggle, settlementDataHasBeenAddedToggle])

    const [editableSettlementInfo, setEditableSettlementInfo] = useState<RatesType | null>(null)
    const [editableSettlementType, setEditableSettlementType] = useState<"pre" | "post" | null>(null)
    const [openUpdateSettlementDataWindow, setOpenUpdateSettlementDataWindow] = useState<boolean>(false)
    const handleOpenEditLawFirmWindow = (indexOfEditableSettlement: number, settlementType: "pre" | "post") => {
        setOpenUpdateSettlementDataWindow(true)
        setEditableSettlementType(settlementType)
        settlementType === "pre"
            ? setEditableSettlementInfo(preSettlementRatesArr[indexOfEditableSettlement])
            : setEditableSettlementInfo(postSettlementRatesArr[indexOfEditableSettlement])
    }
    const handleCloseUpdateSettlementDataWindow = () => {
        setOpenUpdateSettlementDataWindow(false)
    }

    return (
        <Container maxWidth="lg" className={s["UpdateInterestRate"]} >
            <h1 className={s["UpdateInterestRate-Title"]}>Interest Rates</h1>
            <span className={s["UpdateInterestRate-StateName"]}>{stateName} ({stateKey})</span>
            <Divider />

            <div className={s["UpdateInterestRate-Body"]}>
                <PreSettlementRates
                    handleOpenEditLawFirmWindow={handleOpenEditLawFirmWindow}
                    preSettlementRatesArr={preSettlementRatesArr}
                    setPreSettlementRatesArr={setPreSettlementRatesArr}
                    interestRateId={interestRateId}
                    settlementDataHasBeenAddedToggle={settlementDataHasBeenAddedToggle}
                    setSettlementDataHasBeenAddedToggle={setSettlementDataHasBeenAddedToggle}
                />
                <Divider />
                <PostSettlementRates
                    handleOpenEditLawFirmWindow={handleOpenEditLawFirmWindow}
                    postSettlementRatesArr={postSettlementRatesArr}
                    setPostSettlementRatesArr={setPostSettlementRatesArr}
                    interestRateId={interestRateId}
                    settlementDataHasBeenAddedToggle={settlementDataHasBeenAddedToggle}
                    setSettlementDataHasBeenAddedToggle={setSettlementDataHasBeenAddedToggle}
                />
            </div>

            <UpdateSettlementDataWindow
                openUpdateSettlementDataWindow={openUpdateSettlementDataWindow}
                handleCloseUpdateSettlementDataWindow={handleCloseUpdateSettlementDataWindow}
                editableSettlementInfo={editableSettlementInfo}
                editableSettlementType={editableSettlementType}
                settlementDataIsUpdatedToggle={settlementDataIsUpdatedToggle}
                setSettlementDataIsUpdatedToggle={setSettlementDataIsUpdatedToggle}
            />

        </Container>
    )
}