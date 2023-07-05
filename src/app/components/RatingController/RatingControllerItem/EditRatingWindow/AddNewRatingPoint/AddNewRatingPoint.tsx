import { createStyles, makeStyles, Theme, Button, TextField } from "@material-ui/core"
import { FormEvent, useState } from "react"
import { useDispatch } from "react-redux"
import { setNotificationInfo, toggleNotification } from "../../../../../actions/actions"
import { URL_FOR_API } from "../../../../../constants/constants"
import actionsWithApi from "../../../../../customHooks/actionsWithApi"
import { ratingItemType } from "../../../../../types/ratingType"
import s from "./AddNewRatingPoint.module.scss"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            maxWidth: 100,
            marginBottom: 20,
            marginRight: 20,
            [theme.breakpoints.down('md')]: {
                maxWidth: 60
            },
            "&:last-child": {
                marginRight: 0
            }
        },
    }),
)

export type AddNewRatingPointPropsType = {
    editingRatingType: string
    currentEditingRatingData: Array<ratingItemType>
    setCurrentEditingRatingData(ratingItem: Array<ratingItemType> | null): void
}

export default function AddNewRatingPoint(props: AddNewRatingPointPropsType) {
    const classes = useStyles()
    const dispatch = useDispatch()

    const [from, setFrom] = useState<number>(0)
    const [to, setTo] = useState<number>(0)
    const [star, setStar] = useState<number>(0)

    const addNewPoint = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(star > 5) {
            dispatch(setNotificationInfo({ message: "Star rating can't be more than 5", severity: "error" }))
            dispatch(toggleNotification(true))
            return
        }

        let starAlreadyExist = props.currentEditingRatingData.find(ratingItem => ratingItem.star === star)
        if(starAlreadyExist) {
            dispatch(setNotificationInfo({ message: "This rating star already exists", severity: "error" }))
            dispatch(toggleNotification(true))
            return
        }

        try {
            let editRatingPointData = {
                from,
                to,
                star,
                userRatingType: props.editingRatingType
            }
            let response = await actionsWithApi("POST", URL_FOR_API + `/api/v1/UserRating`, editRatingPointData)
            let tempEditingRatingData = [...props.currentEditingRatingData]
            tempEditingRatingData.push({ ...editRatingPointData, id: response.data.id })
            props.setCurrentEditingRatingData(tempEditingRatingData)

            dispatch(setNotificationInfo({ message: "User Rating added successfully", severity: "success" }))
            dispatch(toggleNotification(true))
        }
        catch (error) {
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            dispatch(toggleNotification(true))
        }
    }

    return (
        <div className={s["AddNewRatingPoint"]}>
            <h3 className={s["AddNewRatingPoint-Title"]}>Add new Item: </h3>
            <form onSubmit={(e) => addNewPoint(e)}>
                <TextField className={classes.formControl} defaultValue={0}
                    variant="outlined" size="small" label="From" type="number" inputProps={{ min: "0", step: "0.001" }}
                    onChange={(e) => setFrom(parseFloat(e.target.value))} required
                />
                <TextField className={classes.formControl} defaultValue={0}
                    variant="outlined" size="small" label="To" type="number" inputProps={{ min: "0", step: "0.001" }}
                    onChange={(e) => setTo(parseFloat(e.target.value))} required
                />
                <TextField className={classes.formControl} defaultValue={0}
                    variant="outlined" size="small" label="Star" type="number" inputProps={{ min: "0" }}
                    onChange={(e) => setStar(parseInt(e.target.value))} required
                />
                <br></br>

                <Button type="submit" variant="contained" color="primary">Add</Button>
            </form>
        </div>
    )
}