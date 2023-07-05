import { withStyles, createStyles, TableCell, TableRow, TableContainer, Paper, Table, TableBody, Button } from '@material-ui/core'
import { ratingItemType } from '../../../types/ratingType'
import s from './RatingControllerItem.module.scss'
import RatingItemTableHead from './RatingItemTableHead/RatingItemTableHead'

const StyledTableCell = withStyles(() =>
    createStyles({
        body: {
            fontSize: 16,
            whiteSpace: "nowrap",
            "&:first-child": {
                fontSize: 14,
                fontWeight: 600
            }
        },
    }),
)(TableCell)

export type RatingControllerItemPropsType = {
    title: string
    explainer: string
    ratingValueInTable: string
    ratingData: Array<ratingItemType>
    setCurrentEditingRatingTitle(title: string): void
    setCurrentEditingRatingExplainer(explainer: string): void
    setEditRatingWindowIsOpen(state: boolean): void
    setCurrentEditingRatingData(ratingData: Array<ratingItemType>): void
    ratingType: string
    setRatingType(type: string): void
}

export default function RatingControllerItem(props: RatingControllerItemPropsType) {

    const editRating = () => {
        props.setCurrentEditingRatingTitle(props.title)
        props.setCurrentEditingRatingExplainer(props.explainer)
        props.setCurrentEditingRatingData(props.ratingData)
        props.setRatingType(props.ratingType)
        props.setEditRatingWindowIsOpen(true)
    }

    return (
        <section className={s["RatingControllerItem"]}>
            <h2 className={s["RatingControllerItem-Title"]}>{props.title}</h2>

            <TableContainer component={Paper}>
                <Table>
                    <RatingItemTableHead ratingData={props.ratingData} />
                    <TableBody>
                        <TableRow>
                            <StyledTableCell>{props.ratingValueInTable}</StyledTableCell>
                            {props.ratingData && props.ratingData
                                .sort((item1, item2) => item2.star - item1.star)
                                .map((item: ratingItemType) => {
                                    return (
                                        <StyledTableCell align="center">{item.from + "-" + item.to}</StyledTableCell>
                                    )
                                })
                            }
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Button className={s["RatingControllerItem-Btn"]} onClick={() => editRating()} variant="contained" color="primary">Edit</Button>
        </section>
    )
}