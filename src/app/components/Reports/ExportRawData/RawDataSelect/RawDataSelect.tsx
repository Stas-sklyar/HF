import { createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        select: {
            width: 250,
            [theme.breakpoints.down('xs')]: {
                width: "100%"
            }
        },
    }),
);

type RawDataSelectType = {
    rawData: Array<string>
    setRawData(rawData: Array<string> | unknown): void
    values: Array<string> | unknown
}

export default function RawDataSelect(props: RawDataSelectType) {
    const classes = useStyles()

    return (
        <FormControl className={classes.select}>
            <InputLabel required>Raw Data:</InputLabel>
            <Select
                onChange={(e) => props.setRawData(e.target.value)}
                value={props.rawData}
                multiple
                required
            >
                <MenuItem value="dateOfCheckSent">Date Of CheckSent</MenuItem>
                <MenuItem value="currentContractStatus">Current Contract Status</MenuItem>
                <MenuItem value="lastModified">Last Modified</MenuItem>
                <MenuItem value="responsibleAttorney">Responsible Attorney</MenuItem>
                <MenuItem value="previousAttorney">Previous Attorney</MenuItem>
                <MenuItem value="responsibleLawFirm">Responsible LawFirm</MenuItem>
                <MenuItem value="previousLawFirm">Previous Law Firm</MenuItem>
                <MenuItem value="client">Client</MenuItem>
                <MenuItem value="amountApproved">Amount Approved</MenuItem>
                <MenuItem value="interestRateAmountApproved">Interest Rate Amount Approved</MenuItem>
                <MenuItem value="dateOfNextInterestRateAmountApproved">Date Of Next Interest Rate Amount Approved</MenuItem>
                <MenuItem value="expectedContractValue">Expected Contract Value</MenuItem>
                <MenuItem value="additionalFunds">Additional Funds</MenuItem>
                <MenuItem value="dateAmountAdditionalApproved">Date Amount Additional Approved</MenuItem>
                <MenuItem value="dateOfNextNextInterestRateAdditionalApproved">Date Of Next Next Interest Rate Additional Approved</MenuItem>
                <MenuItem value="interestRateAdditionalApproved">Interest Rate Additional Approved</MenuItem>
                <MenuItem value="expectedContractValueAdditional">Expected Additional Contract Value</MenuItem>
                <MenuItem value="dateNextInterestRateIncreases">Date Next Interest Rate Increases</MenuItem>
                <MenuItem value="openBalance">Open Balance</MenuItem>
                <MenuItem value="amountLostOwedAfterClosing">Amount Lost Owed After Closing</MenuItem>
                <MenuItem value="totalPaid">Total Paid</MenuItem>
            </Select>
        </FormControl>
    )
}