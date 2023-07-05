import { Theme, createStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles } from "@material-ui/core"

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white
        },
        body: {
            fontSize: 14
        }
    }),
)(TableCell)

type PaymentCalcResultPropsType = {
    dayValuePairs: any
}

export default function PaymentCalcResult(props: PaymentCalcResultPropsType) {
    let dayValuePairsParseArr = Object.entries(props.dayValuePairs ? props.dayValuePairs : {})

    return (
        <div>
            <TableContainer component={Paper} style={{ maxWidth: "450px", margin: "0 auto" }}>
                <Table>

                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">Contract Period (days)</StyledTableCell>
                            <StyledTableCell align="center">Amount owed (USD)</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {
                            dayValuePairsParseArr
                            && dayValuePairsParseArr.length > 0
                            && dayValuePairsParseArr
                                .map((row: any, index: number) => (
                                    <TableRow key={index}>

                                        <StyledTableCell align="center">
                                            {row[0]}
                                        </StyledTableCell>

                                        <StyledTableCell align="center">
                                            {row[1]}
                                        </StyledTableCell>

                                    </TableRow>
                                ))
                        }
                    </TableBody>

                </Table>
            </TableContainer>
        </div>
    )
}