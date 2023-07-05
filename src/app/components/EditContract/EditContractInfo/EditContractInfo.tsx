import { createStyles, Divider, FormControl, InputLabel, makeStyles, MenuItem, Select, TextField, Theme } from '@material-ui/core'
import s from './EditContractInfo.module.scss'
import AddFundingSection from './AddFundingSection/AddFundingSection'
import AddPaymentSection from './AddPaymentSection/AddPaymentSection'
import ReducedAmount from './ReducedAmount/ReducedAmount'
import AddApprovedAmount from './AddApprovedAmount/AddApprovedAmount'
import RequestedAmounts from './RequestedAmounts/RequestedAmounts'
import { EditContractType } from '../../../types/contractTypes'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        selectMedium: {
            width: 200,
            marginBottom: 30,
            [theme.breakpoints.down('xs')]: {
                width: "100%",
            }
        },
        selectLarge: {
            width: 310,
            marginBottom: 30,
            [theme.breakpoints.down('xs')]: {
                width: "100%",
            }
        },
        formControl: {
            width: 220,
            marginBottom: 30,
            [theme.breakpoints.down('xs')]: {
                width: "100%",
            }
        },
        largeSelectLabel: {
            [theme.breakpoints.down('xs')]: {
                fontSize: 12
            }
        }
    }),
)

type EditContractInfoType = {
    handlerForInputs(e: any): void
    contractInfo: EditContractType
    childContractHasBeenAdded: boolean
    setChildContractHasBeenAdded(toggle: boolean): void
}

export default function EditContractInfo(props: EditContractInfoType) {
    const classes = useStyles()
    const checkNumber: string = props.contractInfo.identifier

    return (
        <div className={s["EditContractInfo"]}>
            <TextField className={classes.formControl} type="text" variant="outlined" size="small" value={props.contractInfo.id} label="Contract ID" />
            <FormControl className={classes.selectMedium}>
                <InputLabel id="contract-type-label">Contract Type</InputLabel>
                <Select labelId="contract-type-label" name="contractType" defaultValue={props.contractInfo.contractType} onChange={(e) => props.handlerForInputs(e)}>
                    <MenuItem value="PreSettlement">Pre-Settlement</MenuItem>
                    <MenuItem value="PostSettlement">Post-Settlement</MenuItem>
                </Select>
            </FormControl>
            <div className={s["EditContractInfo-MediumDivider"]}><Divider /></div>
            <RequestedAmounts contractInfo={props.contractInfo} />

            <div className={s["EditContractInfo-MediumDivider"]}><Divider /></div>
            <AddApprovedAmount />

            <div className={s["EditContractInfo-MediumDivider"]}><Divider /></div>
            <AddFundingSection
                checkNumber={checkNumber}
                childContractHasBeenAdded={props.childContractHasBeenAdded}
                setChildContractHasBeenAdded={props.setChildContractHasBeenAdded}
            />

            <div className={s["EditContractInfo-MediumDivider"]}><Divider /></div>
            <ReducedAmount />

            <div className={s["EditContractInfo-MediumDivider"]}><Divider /></div>
            <TextField className={classes.formControl} type="number" name="finalAmountOwed" variant="outlined" size="small" defaultValue={props.contractInfo.finalAmountOwed} label="Final Amount Owed" onChange={(e) => props.handlerForInputs(e)} />
            <TextField className={classes.formControl} type="number" name="amountSettlement" variant="outlined" size="small" defaultValue={props.contractInfo.amountSettlement} label="Settlement Amount" onChange={(e) => props.handlerForInputs(e)} />
            <FormControl className={classes.selectLarge} >
                <InputLabel id="estimated-settlement-amount-label">Estimated Settlement Amount:</InputLabel>
                <Select name="estimatedSettlement" defaultValue={props.contractInfo.estimatedSettlement} labelId="estimated-settlement-amount-label" onChange={(e) => props.handlerForInputs(e)}>
                    <MenuItem value="0-25k">0-25k</MenuItem>
                    <MenuItem value="26k-50k">26k-50k</MenuItem>
                    <MenuItem value="51k-100k">51k-100k</MenuItem>
                    <MenuItem value="101k-200k">101k-200k</MenuItem>
                    <MenuItem value="Over 201k">Over 201k</MenuItem>
                </Select>
            </FormControl>
            <FormControl className={classes.selectLarge}>
                <InputLabel id="funds-for-future-label" className={classes.largeSelectLabel}>Additional funds expected in the future</InputLabel>
                <Select labelId="funds-for-future-label" name="estimatedAdditional" defaultValue={props.contractInfo.estimatedAdditional} onChange={(e) => props.handlerForInputs(e)}>
                    <MenuItem value="None">None</MenuItem>
                    <MenuItem value="500-1000">500-1000</MenuItem>
                    <MenuItem value="1001-2000">1001-2000</MenuItem>
                    <MenuItem value="2001-3000">2001-3000</MenuItem>
                    <MenuItem value="Over 3000">Over 3000</MenuItem>
                </Select>
            </FormControl>
            <TextField className={classes.formControl} type="text" name="recipientCheck" variant="outlined" size="small" defaultValue={props.contractInfo.recipientCheck} onChange={(e) => props.handlerForInputs(e)} label="Check Recipient" />
            <div className={s["EditContractInfo-MediumDivider"]}><Divider /></div>
            <AddPaymentSection />
        </div>
    )
}