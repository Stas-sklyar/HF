import DateFnsUtils from '@date-io/date-fns';
import { createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, TextField, Theme } from '@material-ui/core'
import { Alert } from '@material-ui/lab';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { handlerForCreateContractAttorneyInputs } from '../../../actions/actions';
import s from './CaseInformation.module.scss'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            width: 210,
            marginBottom: 20,
            [theme.breakpoints.down('xs')]: {
                width: "100%"
            }
        },
        textarea: {
            marginTop: 10,
            marginBottom: 20,
        },
        mediumInput: {
            width: 340,
            marginBottom: 20,
            [theme.breakpoints.down('xs')]: {
                width: "100%",
                fontSize: 12
            }
        },
        alert: {
            maxWidth: 600,
            marginBottom: 20,
            color: "#B03534",
            fontSize: 16,
            [theme.breakpoints.down('xs')]: {
                maxWidth: "100%",
                fontSize: 12
            }
        },
        longInputLabel: {
            [theme.breakpoints.down('xs')]: {
                fontSize: 12
            }
        },
        invalidEmailLabel: {
            color: "red",
            marginTop: "-35px",
            marginBottom: "20px"
        }
    }),
);

type CaseInformationType = {
    handlerForInputs(e: any): void
    caseManagerEmailIsValid: boolean
    contractType: "PreSettlement" | "PostSettlement"
}

export default function CaseInformation(props: CaseInformationType) {
    const classes = useStyles()
    const dispatch = useDispatch()

    const [estimatedDuration, setEstimatedDuration] = useState<string>(new Date().toISOString())
    const handleEstimatedDuration = (date: any) => {
        try {
            dispatch(handlerForCreateContractAttorneyInputs({ "estimatedDuration": new Date(date).toISOString() + "" }))
            setEstimatedDuration(date)
        }
        catch (error) {
            console.log(error)
        }
    }

    const [dateAccident, setDateAccident] = useState<string>(new Date().toISOString())
    const handleDateAccident = (date: any) => {
        try {
            dispatch(handlerForCreateContractAttorneyInputs({ "dateAccident": new Date(date).toISOString() + "" }))
            setDateAccident(date)
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <section className={s["CaseInformation"]}>
            <h1 className={s["CaseInformation-Title"]}>Case Information</h1>

            <div className={s["CaseInformation-Body"]}>
                <TextField
                    className={classes.mediumInput}
                    name="caseId" variant="outlined" size="small"
                    onChange={(e) => props.handlerForInputs(e)}
                    label="Case ID (or short description if not known)"
                    InputLabelProps={{ className: classes.longInputLabel }}
                    required
                />

                <label className={s["CaseInformation-Label"] + " " + s["CaseInformation-Label--Date"]}>
                    <span>When is the case's expected or existing settlement date? *</span>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker name="estimatedDuration" className={s['CaseInformation-DateInput']} disableToolbar variant="inline"
                            format="MM/dd/yyyy" margin="normal" value={estimatedDuration}
                            onChange={(date) => handleEstimatedDuration(date)} required
                        />
                    </MuiPickersUtilsProvider>
                </label>

                {props.contractType === "PreSettlement" &&
                    <Alert className={classes.alert} icon={false} severity="warning" variant="outlined">
                        <span>
                            Your estimated repayment amount is based on your estimated settlement date.<br></br>
                            Note, this is just an estimate. When repayment is ready to be submitted, please use the payoff statement feature on your client's funding page for the actual amount due at that time.
                        </span>
                    </Alert>
                }

                <TextField className={classes.formControl}
                    name="opposingInsurance" variant="outlined" size="small"
                    onChange={(e) => props.handlerForInputs(e)}
                    label="Opposing Insurance"
                    required
                />

                <TextField className={classes.formControl}
                    name="insuranceAdjuster" variant="outlined" size="small"
                    onChange={(e) => props.handlerForInputs(e)}
                    label="Insurance Adjuster"
                />

                <TextField className={classes.formControl}
                    name="adjusterPhone" variant="outlined" size="small"
                    onChange={(e) => props.handlerForInputs(e)}
                    label="Insurance Adjuster Phone"
                />

                <TextField className={classes.formControl}
                    name="claimNumber" variant="outlined" size="small"
                    onChange={(e) => props.handlerForInputs(e)}
                    label="Insurance Claim"
                />

                <FormControl className={s["CaseInformation-Label"]}>
                    <InputLabel id="accepted-liability" required>Accepted Liability</InputLabel>
                    <Select
                        labelId="accepted-liability"
                        className={classes.formControl}
                        name="liability"
                        onChange={(e) => props.handlerForInputs(e)}
                        required
                    >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl className={s["CaseInformation-Label"]}>
                    <InputLabel id="property-damage" required>Property Damage</InputLabel>
                    <Select
                        labelId="property-damage"
                        className={classes.formControl}
                        name="propertyDamage"
                        onChange={(e) => props.handlerForInputs(e)}
                        required
                    >
                        <MenuItem value="Slight">Slight</MenuItem>
                        <MenuItem value="Moderate">Moderate</MenuItem>
                        <MenuItem value="Extensive">Extensive</MenuItem>
                        <MenuItem value="None">None</MenuItem>
                    </Select>
                </FormControl>

                <FormControl className={s["CaseInformation-Label"]}>
                    <InputLabel id="injury-level-label" required>Injury Level</InputLabel>
                    <Select labelId="injury-level-label"
                        className={classes.formControl}
                        name="injuryLevel"
                        onChange={(e) => props.handlerForInputs(e)}
                        required
                    >
                        <MenuItem value="Slight">Slight</MenuItem>
                        <MenuItem value="Moderate">Moderate</MenuItem>
                        <MenuItem value="Extensive">Extensive</MenuItem>
                        <MenuItem value="None">None</MenuItem>
                    </Select>
                </FormControl>

                <label className={s["CaseInformation-Label"] + " " + s["CaseInformation-Label--Date"]}>
                    <span>Date of accident or injury *</span>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            name="dateAccident"
                            className={s['CaseInformation-DateInput']}
                            disableToolbar variant="inline"
                            format="MM/dd/yyyy" margin="normal"
                            value={dateAccident}
                            onChange={(date) => handleDateAccident(date)}
                            required
                        />
                    </MuiPickersUtilsProvider>
                </label>

                <label className={s["CaseInformation-Label"]}>
                    <TextField className={classes.formControl}
                        name="caseManager"
                        variant="outlined" size="small"
                        onChange={(e) => props.handlerForInputs(e)}
                        label="Case manager (email)"
                    />
                </label>
                {!props.caseManagerEmailIsValid && <span className={classes.invalidEmailLabel}>The email address is invalid</span>}

                <span>Injury/Accident Description *</span>
                <TextField
                    name="accidentDescription" className={classes.textarea}
                    variant="outlined" rows={4}
                    onChange={(e) => props.handlerForInputs(e)}
                    placeholder="Write Description..."
                    multiline required
                />

            </div>
        </section>
    )
}
