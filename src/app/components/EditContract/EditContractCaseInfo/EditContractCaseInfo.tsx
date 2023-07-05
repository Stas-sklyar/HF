import { createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, TextareaAutosize, TextField, Theme } from '@material-ui/core'
import dateFormatting from '../../../scripts/dateFormatting';
import { EditContractType } from '../../../types/contractTypes';
import s from './EditContractCaseInfo.module.scss'
import {useSelector} from "react-redux";
import {RootState} from "../../../reducers/rootReducers";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            width: 220,
            marginBottom: 20,
            [theme.breakpoints.down('xs')]: {
                width: "100%"
            }
        },
        caseIdFormControl: {
            width: 320,
            marginBottom: 20,
            [theme.breakpoints.down('xs')]: {
                width: "100%"
            }
        },
        textarea: {
            marginTop: 10,
            marginBottom: 20,
            minHeight: 50,
            borderRadius: 10,
            padding: 10,
            resize: 'none'
        },
        mediumInput: {
            width: 220,
            marginBottom: 20,
            [theme.breakpoints.down('xs')]: {
                width: "100%"
            }
        },
        labelForDate: {
            display: "flex",
            flexDirection: "column",
            "&>span": {
                marginBottom: 5
            }
        }
    }),
);

type CaseInformationType = {
    handlerForInputs(e: any): void
    contractInfo: EditContractType
}

const validateDate = (sourceDate: string | Date) => {
    if(!sourceDate) {
        return ''
    }
    sourceDate = new Date(sourceDate);
    let year: number | string = sourceDate.getFullYear();
    let month: number | string = sourceDate.getMonth() + 1;
    let dt: number | string = sourceDate.getDate();

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return year + '-' + month + '-' + dt
}

export default function EditContractCaseInfo(props: CaseInformationType) {
    const classes = useStyles()
    const contractType = useSelector((state: RootState) => state.editContract.contractType)

    return (
        <section className={s["CaseInformation"]}>
            <h1 className={s["CaseInformation-Title"]}>Case Information</h1>
            <div className={s["CaseInformation-Body"]}>
                <TextField className={classes.caseIdFormControl} defaultValue={props.contractInfo.caseId} name="caseId" variant="outlined" size="small" onChange={(e) => props.handlerForInputs(e)} label="Case ID (or short description if not known)" />
                <label className={classes.labelForDate}>
                    <span>Expected or Existing Settlement Date</span>
                    <TextField type="date" className={classes.mediumInput} defaultValue={validateDate(props.contractInfo.estimatedDuration)} name="estimatedDuration" variant="outlined" size="small" onChange={(e) => props.handlerForInputs(e)} />
                </label>
                {
                    contractType !== "PreSettlement"
                        ? <span className={s["CaseInformation-Notion"]}>**If your settlement payment extends beyond 60 days, your interest will increase</span>
                        : ""
                }
                <TextField className={classes.mediumInput} defaultValue={props.contractInfo.opposingInsurance} name="opposingInsurance" variant="outlined" size="small" onChange={(e) => props.handlerForInputs(e)} label="Opposing Insurance" />
                <TextField className={classes.mediumInput} defaultValue={props.contractInfo.insuranceAdjuster} name="insuranceAdjuster" variant="outlined" size="small" onChange={(e) => props.handlerForInputs(e)} label="Insurance Adjuster" />
                <TextField className={classes.mediumInput} defaultValue={props.contractInfo.adjusterPhone} name="adjusterPhone" variant="outlined" size="small" onChange={(e) => props.handlerForInputs(e)} label="Insurance Adjuster Phone" />
                <TextField className={classes.mediumInput} defaultValue={props.contractInfo.claimNumber} name="claimNumber" variant="outlined" size="small" onChange={(e) => props.handlerForInputs(e)} label="Insurance Claim" />
                <FormControl className={s["CaseInformation-Label"]}>
                    <InputLabel id="accepted-liability">Accepted Liability</InputLabel>
                    <Select labelId="accepted-liability" className={classes.formControl} defaultValue={props.contractInfo.liability ? "Yes" : "No"} name="liability" onChange={(e) => props.handlerForInputs(e)} >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className={s["CaseInformation-Label"]}>
                    <InputLabel id="property-damage">Property Damage</InputLabel>
                    <Select labelId="property-damage" className={classes.formControl} defaultValue={props.contractInfo.propertyDamage} name="propertyDamage" onChange={(e) => props.handlerForInputs(e)} >
                        <MenuItem value="Slight">Slight</MenuItem>
                        <MenuItem value="Moderate">Moderate</MenuItem>
                        <MenuItem value="Extensive">Extensive</MenuItem>
                        <MenuItem value="None">None</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className={s["CaseInformation-Label"]}>
                    <InputLabel id="injury-level-label">Injury Level</InputLabel>
                    <Select labelId="injury-level-label" className={classes.formControl} defaultValue={props.contractInfo.injuryLevel} name="injuryLevel" onChange={(e) => props.handlerForInputs(e)} >
                        <MenuItem value="Slight">Slight</MenuItem>
                        <MenuItem value="Moderate">Moderate</MenuItem>
                        <MenuItem value="Extensive">Extensive</MenuItem>
                        <MenuItem value="None">None</MenuItem>
                    </Select>
                </FormControl>
                <TextField className={classes.mediumInput} name="dateAccident" defaultValue={dateFormatting(props.contractInfo.dateAccident)} type="text" label="Date of accident or injury" onChange={(e) => props.handlerForInputs(e)} />
                <TextField className={classes.mediumInput} name="caseManager" defaultValue={props.contractInfo.caseManager} variant="outlined" size="small" onChange={(e) => props.handlerForInputs(e)} label="Case manager (email)" />
                <span>Injury/Accident Description: </span>
                <TextareaAutosize name="accidentDescription" maxRows={4} placeholder="Write comment..." className={classes.textarea} defaultValue={props.contractInfo.accidentDescription} onChange={(e) => props.handlerForInputs(e)} />
            </div>
        </section>
    )
}
