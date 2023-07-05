import { Button, createStyles, makeStyles, TextField, Theme } from '@material-ui/core'
import { FormEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotificationInfo, toggleNotification } from '../../../actions/actions'
import { URL_FOR_API } from '../../../constants/constants'
import actionsWithApi from '../../../customHooks/actionsWithApi'
import { RatesType } from '../../../types/ratesType'
import AddBtn from '../../shared/AddBtn/AddBtn'
import s from '../CreateNewInterestRate.module.scss'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        smallInput: {
            width: 80,
            margin: "0 10px",
            [theme.breakpoints.down('xs')]: {
                width: 150,
                margin: "0 0 10px 0"
            }
        },
        select: {
            width: 400
        },
        mediumInput: {
            [theme.breakpoints.down('xs')]: {
                width: 150,
                margin: "0 0 10px 0"
            }
        },
    }),
)

type PostSettlementRatesPropsType = {
    postSettlementRatesArr: Array<RatesType>
    setPostSettlementRatesArr(e: any): any
    interestRateId?: number
    handleOpenEditLawFirmWindow?(index: number, type: "pre" | "post"): any
    settlementDataHasBeenAddedToggle?: boolean
    setSettlementDataHasBeenAddedToggle?(toggle: boolean): void
}

export default function PostSettlementRates(props: PostSettlementRatesPropsType) {
    const classes = useStyles()
    const dispatch = useDispatch()

    const [addDataRangePostSettlementSection, setAddDataRangePostSettlementSection] = useState<boolean>(false)

    const [daysFrom, setDaysFrom] = useState<number>(0)
    const [daysTo, setDaysTo] = useState<number>(0)
    const [rate, setRate] = useState<number>(0)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let updatedPostSettlementRatesArr: Array<RatesType> = [...props.postSettlementRatesArr]
        let newRate = {
            daysFrom,
            daysTo,
            rate
        }
        updatedPostSettlementRatesArr.push(newRate)
        props.setPostSettlementRatesArr(updatedPostSettlementRatesArr)

        if (props.interestRateId) {
            try {
                await actionsWithApi("POST", URL_FOR_API + `/api/v1/Interest/assign/${props.interestRateId}/postSettlement`, newRate)
                dispatch(setNotificationInfo({ message: "New post settlement Interest Rate has been successfully created", severity: "success" }))
                dispatch(toggleNotification(true))
                props.setSettlementDataHasBeenAddedToggle ? props.setSettlementDataHasBeenAddedToggle(!props.settlementDataHasBeenAddedToggle) : console.log("props.settlementDataHasBeenAddedToggle is not exist")
            }
            catch (error) {
                dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
                dispatch(toggleNotification(true))
                console.log(error.message)
            }
        }

        setDaysFrom(0)
        setDaysTo(0)
        setRate(0)
    }

    const updatePostSettlementInfo = (index: number) => {
        if (props.handleOpenEditLawFirmWindow) props.handleOpenEditLawFirmWindow(index, "post")
    }

    return (
        <div className={s["InterestRate-Item"]}>
            <h2 className={s["InterestRate-Subtitle"]}>Post-settlement</h2>
            <ul className={s["InterestRate-PostSettlementRatesList"]}>
                {props.postSettlementRatesArr && props.postSettlementRatesArr
                    .map((rateItem: RatesType, index) => {
                        return (
                            <li key={rateItem.id} className={s["InterestRate-PostSettlementRateItem"]}>
                                <div>
                                    <div>{index + 1}) Days after Check Sent: <span>{rateItem.daysFrom}-{rateItem.daysTo}</span></div>
                                    <div>Rate: <span>{rateItem.rate}%</span></div>
                                </div>
                                {props.interestRateId &&
                                    <div onClick={() => updatePostSettlementInfo(index)}>
                                        <Button type="button" variant="contained" color="primary">Edit</Button>
                                    </div>
                                }
                            </li>
                        )
                    })
                }
            </ul>
            <div onClick={() => setAddDataRangePostSettlementSection(!addDataRangePostSettlementSection)} className={s["InterestRate-AddBtn"]}>
                <AddBtn text="Add Date Range" />
            </div>
            {addDataRangePostSettlementSection &&
                <form className={s["InterestRate-Form"]} onSubmit={(e) => handleSubmit(e)}>
                    <div className={s["InterestRate-FormColumn"]}>
                        <div className={s["InterestRate-FormColumnHeader"]}>
                            <span className={s["InterestRate-Label"]}>Days after Check Sent:</span>
                            <TextField type="number" size="small" variant="outlined" className={classes.smallInput} label="From" value={daysFrom}
                                onChange={(e) => setDaysFrom(parseInt(e.target.value))} InputProps={{ inputProps: { min: 0 } }} required />
                            <TextField type="number" size="small" variant="outlined" className={classes.smallInput} label="To" value={daysTo}
                                onChange={(e) => setDaysTo(parseInt(e.target.value))} InputProps={{ inputProps: { min: 0 } }} required />
                        </div>
                        <div>
                            <TextField className={classes.mediumInput} type="number" size="small" variant="outlined" label="Rate" value={rate}
                                onChange={(e) => setRate(parseInt(e.target.value))} InputProps={{ inputProps: { min: 0 } }} required />
                        </div>
                    </div>
                    <div className={s["InterestRate-FormColumn"]}>
                        <Button type="submit" variant="contained" color="primary">Save Range</Button>
                    </div>
                </form>
            }
        </div>
    )
}