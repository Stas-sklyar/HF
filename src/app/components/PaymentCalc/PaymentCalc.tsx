import { Button, Container, createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, TextField } from '@material-ui/core'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNotificationInfo, toggleNotification } from '../../actions/actions'
import { URL_FOR_API } from '../../constants/constants'
import actionsWithApi from '../../customHooks/actionsWithApi'
import { StatesType } from '../../types/stateType'
import s from './PaymentCalc.module.scss'
import { FormEvent } from 'react'
import PaymentCalcResult from './PaymentCalcResult/PaymentCalcResult'
import { RootState } from '../../reducers/rootReducers'
import Preloader from '../shared/Preloader/Preloader'

const useStyles = makeStyles(() =>
    createStyles({
        btn: {
            width: 200,
            margin: "0 auto 50px auto"
        },
        formControl: {
            width: 250,
            margin: "0 auto 40px auto"
        }
    })
)

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export default function PaymentCalc() {
    const classes = useStyles()
    const dispatch = useDispatch()
    const states: Array<StatesType> = useSelector((state: RootState) => state.states)
    const [stateIsSelected, setStateIsSelected] = useState<boolean>(false)
    const [selectedState, setSelectedState] = useState<number | unknown>()
    const [contractType, setContractType] = useState<string | unknown>("PreSettlement")
    const [amountRequested, setAmountRequested] = useState<number | unknown>()

    const [paymentCalcResult, setPaymentCalcResult] = useState<any>()
    const [paymentCalcResultIsReady, setPaymentCalcResultIsReady] = useState<boolean>(true)
    const [showResultTable, setShowResultTable] = useState<boolean>(false)
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setPaymentCalcResultIsReady(false)
            const requestOptions = {
                stateId: selectedState,
                contractType,
                amountRequested
            }
            await sleep(1000)
            const response = await actionsWithApi("POST", URL_FOR_API + "/api/v1/PaymentCalculator/calculate", requestOptions)
            setPaymentCalcResult(response.data)
            setShowResultTable(true)
        }
        catch (error) {
            setShowResultTable(false)
            dispatch(setNotificationInfo({ message: "It seems that this state does not have its own Interest Rate", severity: "error" }))
            dispatch(toggleNotification(true))
        }
        finally {
            setPaymentCalcResultIsReady(true)
        }
    }

    const stateСhoice = (value: string | unknown) => {
        setStateIsSelected(true)
        setSelectedState(parseInt(value + ""))
    }

    return (
        <Container maxWidth="lg" className={s["PaymentCalc"]}>
            <h1 className={s["PaymentCalc-Title"]}>Indicate the Plaintiff’s state<br></br> to create a funding price estimate.</h1>
            <form className={s["PaymentCalc-Body"]} onSubmit={(e) => handleSubmit(e)}>

                <FormControl className={classes.formControl} variant="standard">
                    <InputLabel id="state-label">Select State</InputLabel>
                    <Select
                        labelId="state-label"
                        onChange={(e) => stateСhoice(e.target.value)}
                        required
                    >
                        {
                            states.length > 0 && states
                                .map((state) => {
                                    return (
                                        <MenuItem
                                            key={state.key}
                                            value={state.id}
                                        >
                                            {state.name}
                                        </MenuItem>
                                    )
                                })
                        }
                    </Select>
                </FormControl>

                {stateIsSelected &&
                    <FormControl className={classes.formControl} variant="standard">
                        <InputLabel id="state-label">Contract Type</InputLabel>
                        <Select
                            labelId="state-label"
                            defaultValue="PreSettlement"
                            onChange={(e) => setContractType(e.target.value)}
                            required
                        >
                            <MenuItem value="PreSettlement">Pre-Settlement</MenuItem>
                            <MenuItem value="PostSettlement">Post-Settlement</MenuItem>
                        </Select>
                    </FormControl>
                }

                {stateIsSelected &&
                    <TextField
                        type="number" size="small" variant="outlined"
                        className={classes.formControl}
                        label="Amount Requested"
                        onChange={(e) => setAmountRequested(parseInt(e.target.value))}
                        inputProps={{ min: "0"}}
                        required
                    />
                }
                {stateIsSelected &&
                    <Button className={classes.btn} type="submit" variant="contained" color="primary">
                        Calculate
                    </Button>
                }
            </form>

            {
                paymentCalcResultIsReady && showResultTable
                && <PaymentCalcResult dayValuePairs={paymentCalcResult?.dayValuePairs} />
            }

            {
                !paymentCalcResultIsReady &&
                <Preloader size="100" position="center" />
            }

        </Container>
    )
}