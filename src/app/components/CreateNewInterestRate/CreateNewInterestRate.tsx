import { Button, Container, createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, Theme } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotificationInfo, toggleNotification } from '../../actions/actions'
import { URL_FOR_API } from '../../constants/constants'
import actionsWithApi from '../../customHooks/actionsWithApi'
import { StatesType } from '../../types/stateType'
import s from './CreateNewInterestRate.module.scss'
import PreSettlementRates from './PreSettlementRates/PreSettlementRates'
import PostSettlementRates from './PostSettlementRates/PostSettlementRates'
import { RatesType } from '../../types/ratesType'
import { history } from '../../../App'
import getStates from '../../customHooks/getStates'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        select: {
            width: 400,
            [theme.breakpoints.down('xs')]: {
                width: 200,
            }
        },
        submitBtn: {
            "&:disabled": {
                opacity: 0.5
            }
        }
    }),
);

export default function InterestRate() {
    const classes = useStyles()
    const dispatch = useDispatch()

    const [availableStatesArr, setAvailableStatesArr] = useState<Array<StatesType>>([])
    const [stateIsSelected, setStateIsSelected] = useState<boolean>(false)

    const [selectedStateKey, setSelectedStateKey] = useState<string>("")
    const [selectedStateName, setSelectedStateName] = useState<string>("")
    const [preSettlementRatesArr, setPreSettlementRatesArr] = useState<Array<RatesType>>([])
    const [postSettlementRatesArr, setPostSettlementRatesArr] = useState<Array<RatesType>>([])

    const getAllInterestRates = async () => {
        try {
            let response = await actionsWithApi("GET", URL_FOR_API + "/api/v1/Interest/all")
            return response.data
        }
        catch (error) {
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            dispatch(toggleNotification(true))
            console.log(error.message)
        }
    }

    const getAllUniqueStatesFromAllInterestRatesArr = async () => {
        let availableStatesArrFinalResult: Array<StatesType> = []
        let states = await getStates()
        let interestRates = await getAllInterestRates()

        // get all states for which there is interestRate
        let statesInInterestRateArr: Array<StatesType> = []
        for (let i = 0; i < interestRates.length; i++) {
            statesInInterestRateArr.push(interestRates[i].state)
        }
        // remove duplicate states
        let uniqueStatesInInterestRateArr = statesInInterestRateArr.filter((item: StatesType, pos: number) => {
            return statesInInterestRateArr.indexOf(item) === pos;
        })

        // iterate over an array of all states and if there is no interest rate for such a state, then add it to a new array
        for (let i = 0; i < states.length; i++) {
            if (!uniqueStatesInInterestRateArr.some((item: StatesType) => item.key === states[i].key)) {
                let updatedAvailableStatesArr = availableStatesArr
                updatedAvailableStatesArr.push(states[i])
                availableStatesArrFinalResult = updatedAvailableStatesArr
            }
        }
        return availableStatesArrFinalResult
    }

    const [availableStatesArrIsReady, setAvailableStatesArrIsReady] = useState<boolean>(false)
    useEffect(() => {
        getAllUniqueStatesFromAllInterestRatesArr().then((result) => {
            setAvailableStatesArr(result)
            setAvailableStatesArrIsReady(true)
        })
    }, [])

    const choiseState = (value: string) => {
        let stateKey = value.split(" ")[0]
        let stateName = value.split(" ")[1]
        setSelectedStateKey(stateKey)
        setSelectedStateName(stateName)
        setStateIsSelected(true)
    }

    const createNewInterestRate = async () => {
        let newInterestRate = {
            preSettlements: preSettlementRatesArr,
            postSettlements: postSettlementRatesArr,
            state: {
                key: selectedStateKey,
                name: selectedStateName
            }
        }

        try {
            await actionsWithApi("POST", URL_FOR_API + "/api/v1/Interest", newInterestRate)
            dispatch(setNotificationInfo({ message: "Interest Rate created successfully", severity: "success" }))
            dispatch(toggleNotification(true))
            history.push("interest-rates-list")
        }
        catch (error) {
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            dispatch(toggleNotification(true))
            console.log(error.message)
        }
    }

    return (
        <Container maxWidth="lg" className={s["InterestRate"]} >
            <h1 className={s["InterestRate-Title"]}>Interest Rates</h1>

            <FormControl>
                <InputLabel id="state-label">Select State</InputLabel>
                <Select labelId="state-label" className={classes.select} onChange={(e) => choiseState(e.target.value + "")}>
                    {availableStatesArr.map((state) => {
                        return (
                            <MenuItem key={state.key} value={state.key + " " + state.name}>{state.name}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>

            {stateIsSelected &&
                <div className={s["InterestRate-Body"]}>
                    <PreSettlementRates preSettlementRatesArr={preSettlementRatesArr} setPreSettlementRatesArr={setPreSettlementRatesArr} />
                    <PostSettlementRates postSettlementRatesArr={postSettlementRatesArr} setPostSettlementRatesArr={setPostSettlementRatesArr} />
                </div>
            }

            <div className={s["InterestRate-SubmitBtnBox"]}>
                <Button className={classes.submitBtn} variant="contained" color="primary" onClick={() => createNewInterestRate()} disabled={!stateIsSelected}>Save</Button>
            </div>
        </Container>
    )
}