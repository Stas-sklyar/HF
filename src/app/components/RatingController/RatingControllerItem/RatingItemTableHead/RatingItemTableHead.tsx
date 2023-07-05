import { withStyles, Theme, createStyles, TableCell, TableRow, TableHead } from '@material-ui/core'
import { ratingItemType } from '../../../../types/ratingType'

const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
            fontSize: 16
        },
    }),
)(TableCell)

type RatingItemTableHeadPropsType = {
    ratingData: Array<ratingItemType>
}

export default function RatingItemTableHead(props: RatingItemTableHeadPropsType) {
    return (
        <TableHead>
            <TableRow>
                <StyledTableCell>Star rating</StyledTableCell>
                {props.ratingData && props.ratingData
                    .sort((item1, item2) => item2.star - item1.star)
                    .map((item: ratingItemType) => {
                        return (
                            <StyledTableCell align="center">{item.star}</StyledTableCell>
                        )
                    })
                }

            </TableRow>
        </TableHead>
    )
}