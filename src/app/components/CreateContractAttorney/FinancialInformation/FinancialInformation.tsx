import { createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, TextField, Theme } from '@material-ui/core'
import { useSelector } from 'react-redux';
import { RootState } from '../../../reducers/rootReducers';

import s from './FinancialInformation.module.scss'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            width: 260,
            marginBottom: 20,
            [theme.breakpoints.down('xs')]: {
                width: "100%"
            }
        },
        formControl2Type: {
            width: 390,
            marginBottom: 20,
            [theme.breakpoints.down('xs')]: {
                width: "100%",
                fontSize: "11px"
            }
        },
        mediumInput: {
            width: 240,
            marginBottom: 20,
            [theme.breakpoints.down('xs')]: {
                width: "100%"
            }
        },
        longSelectLabel: {
            [theme.breakpoints.down('xs')]: {
                fontSize: 12
            }
        }
    }),
);

type FinancialInformationType = {
    handlerForInputs(e: any): void
    fundingRecipientEmailIsValid: boolean
}

export default function FinancialInformation(props: FinancialInformationType) {
    const classes = useStyles()
    let contractType = useSelector((state: RootState) => state.createContractAttorney.contractType)

    return (
        <section className={s["FinancialInformation"]}>
            <h1 className={s["FinancialInformation-Title"]}>Financial Information</h1>

            <div className={s["FinancialInformation-Body"]}>
                <TextField className={classes.mediumInput} name="amountRequested" variant="outlined" type="number" size="small"
                    label="Funding Amount Requested" onChange={(e) => props.handlerForInputs(e)} required />

                {contractType === "PostSettlement" &&
                    <TextField className={classes.mediumInput} name="amountSettlement" variant="outlined" type="number" size="small"
                        onChange={(e) => props.handlerForInputs(e)} label="Settlement Amount" required={contractType === "PostSettlement"} />
                }

                {contractType === "PreSettlement" &&
                    <FormControl className={s["FinancialInformation-Label"]} >
                        <InputLabel id="estimated-settlement-amount">Estimated Settlement Amount *</InputLabel>
                        <Select labelId="estimated-settlement-amount" className={classes.formControl}
                            name="estimatedSettlement" onChange={(e) => props.handlerForInputs(e)} required={contractType === "PreSettlement"}>
                            <MenuItem value="0-25k">0-25k</MenuItem>
                            <MenuItem value="26k-50k">26k-50k</MenuItem>
                            <MenuItem value="51k-100k">51k-100k</MenuItem>
                            <MenuItem value="101k-200k">101k-200k</MenuItem>
                            <MenuItem value="Over 201k">Over 201k</MenuItem>
                        </Select>
                    </FormControl>
                }

                <FormControl className={s["FinancialInformation-Label"]} >
                    <InputLabel id="amount-funds-for-future" className={classes.longSelectLabel}>Estimated amount of funds needed in the future</InputLabel>
                    <Select label="amodunt-funds-for-future" className={classes.formControl2Type}
                        name="estimatedAdditional" onChange={(e) => props.handlerForInputs(e)}>
                        <MenuItem value="None">None</MenuItem>
                        <MenuItem value="500-1000">500-1000</MenuItem>
                        <MenuItem value="1001-2000">1001-2000</MenuItem>
                        <MenuItem value="2001-3000">2001-3000</MenuItem>
                        <MenuItem value="Over 3000">Over 3000</MenuItem>
                    </Select>
                </FormControl>

                <TextField className={classes.mediumInput} name="recipientCheck" variant="outlined" size="small"
                    onChange={(e) => props.handlerForInputs(e)} label="Funding Recipient Email" required />
                {!props.fundingRecipientEmailIsValid && <span style={{ color: "red", marginTop: "-10px" }}>The email address is invalid</span>}
            </div>

        </section>
    )
}
