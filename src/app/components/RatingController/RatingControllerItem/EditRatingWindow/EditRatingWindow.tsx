import { Modal, Backdrop, Fade, Box, Typography, createStyles, makeStyles, Theme, Button, Grid, TextField } from "@material-ui/core"
import { FormEvent, useEffect, useState } from "react"
import { ratingItemType } from "../../../../types/ratingType"
import AddNewRatingPoint from "./AddNewRatingPoint/AddNewRatingPoint"
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { useDispatch } from "react-redux"
import { setNotificationInfo, toggleNotification } from "../../../../actions/actions"
import { URL_FOR_API } from "../../../../constants/constants"
import actionsWithApi from "../../../../customHooks/actionsWithApi"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modalWindowWrapp: {
            overflowY: "scroll",
            marginTop: 20,
            marginBottom: 20
        },
        modalWindow: {
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            width: 900,
            backgroundColor: "#ffffff",
            boxShadow: "24",
            padding: 20,
            [theme.breakpoints.down('md')]: {
                width: "270px",
                padding: 10,
            }
        },
        form: {
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        },
        subtitle: {
            marginBottom: 20,
            maxWidth: "80%",
            [theme.breakpoints.down('md')]: {
                maxWidth: "100%",
                fontSize: 12
            }
        },
        formControl: {
            maxWidth: 100,
            marginBottom: 20,
            [theme.breakpoints.down('md')]: {
                maxWidth: 70
            }
        },
        numberOfItem: {
            marginBottom: 15
        },
        btnsBox: {
            width: 250,
            display: "flex",
            justifyContent: "space-between",
            marginTop: 40
        },
        btn: {
            width: 100,
        },
        nav: {
            marginBottom: 10
        },
        icon: {
            margin: "0 5px",
            cursor: "pointer"
        }
    }),
)

export type EditRatingWindowPropsType = {
    title: string
    explainer: string
    currentEditingRatingData: Array<ratingItemType>
    setCurrentEditingRatingData(ratingItem: Array<ratingItemType> | null): void
    windowIsOpen: boolean
    setWindowIsOpen(state: boolean): void
    ratingType: string
    setRatingUpdated(state: boolean): void
}

export default function EditRatingWindow(props: EditRatingWindowPropsType) {
    const classes = useStyles()
    const dispatch = useDispatch()

    const [visibleEditRatingItemSectionArr, setVisibleEditRatingItemSectionArr] = useState<Array<boolean>>([])
    const setVisibleEditRatingItemSectionArrFunc = () => {
        for (let i = 0; i < props.currentEditingRatingData.length; i++) {
            let temp = [...visibleEditRatingItemSectionArr]
            temp.push(false)
            setVisibleEditRatingItemSectionArr([...temp])
        }
    }
    useEffect(() => {
        setVisibleEditRatingItemSectionArrFunc()
    }, [])

    const [currentEditingRatingItemFromValue, setCurrentEditingRatingItemFromValue] = useState<number>(0)
    const [currentEditingRatingItemToValue, setCurrentEditingRatingItemToValue] = useState<number>(0)
    const [currentEditingRatingItemStarValue, setCurrentEditingRatingItemStarValue] = useState<number>(0)
    const [currentEditingRatingItemId, setCurrentEditingRatingItemId] = useState<number>(0)
    const editRatingItemPoint = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let newRatingItemData = {
            from: currentEditingRatingItemFromValue,
            to: currentEditingRatingItemToValue,
            star: currentEditingRatingItemStarValue
        }
        let response = await actionsWithApi("POST", URL_FOR_API + `/api/v1/UserRating/update/${currentEditingRatingItemId}`, newRatingItemData)

        let indexOfUpdatedRatingItem = props.currentEditingRatingData.findIndex(ratingItem => ratingItem.id === currentEditingRatingItemId)
        let tempEditingRatingData = JSON.parse(JSON.stringify(props.currentEditingRatingData))
        tempEditingRatingData[indexOfUpdatedRatingItem] = { ...response.data }
        props.setCurrentEditingRatingData(tempEditingRatingData)
        dispatch(setNotificationInfo({ message: "Successfully updated", severity: "success" }))
        dispatch(toggleNotification(true))
        props.setRatingUpdated(true)
    }

    const deleteRatingItemPont = async (ratingItemPointId: number) => {
        if (ratingItemPointId) {
            try {
                await actionsWithApi("POST", URL_FOR_API + `/api/v1/UserRating/delete/${ratingItemPointId}`)
                let tempEditingRatingData = props.currentEditingRatingData.filter(ratingItem => ratingItem.id != ratingItemPointId)
                props.setCurrentEditingRatingData(tempEditingRatingData)
                dispatch(setNotificationInfo({ message: "Successfully removed", severity: "success" }))
                dispatch(toggleNotification(true))
                props.setRatingUpdated(true)
            }
            catch (error) {
                dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
                dispatch(toggleNotification(true))
            }
        }
        else {
            dispatch(setNotificationInfo({ message: "There was an error while deleting", severity: "error" }))
            dispatch(toggleNotification(true))
        }
    }

    const handleEditRating = (index: number, star: number, id: number, from: number, to: number) => {
        let tempArr = [...visibleEditRatingItemSectionArr]
        tempArr[index] = !tempArr[index]
        setVisibleEditRatingItemSectionArr([...tempArr])
        setCurrentEditingRatingItemStarValue(star)
        setCurrentEditingRatingItemId(id)
        setCurrentEditingRatingItemFromValue(from)
        setCurrentEditingRatingItemToValue(to)
    }

    return (
        <Modal
            open={props.windowIsOpen}
            onClose={() => props.setWindowIsOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            className={classes.modalWindowWrapp}
        >
            <Fade in={props.windowIsOpen}>
                <Box className={classes.modalWindow}>
                    <Typography>
                        <div className={classes.form}>
                            <h1>{props.title}</h1>
                            <p className={classes.subtitle}>{props.explainer}</p>

                            <Grid container spacing={2}>
                                {props.currentEditingRatingData && props.currentEditingRatingData
                                    .sort((item1, item2) => item2.star - item1.star)
                                    .map((ratingItem, index: number) => {
                                        return (
                                            <Grid key={ratingItem.id} item xs={6} lg={2}>
                                                <div className={classes.numberOfItem}>{ratingItem.star}</div>
                                                <TextField className={classes.formControl} value={ratingItem.from}
                                                    variant="outlined" size="small" label="From" type="number" inputProps={{ min: "0" }}
                                                />
                                                <TextField className={classes.formControl} value={ratingItem.to}
                                                    variant="outlined" size="small" label="To" type="number" inputProps={{ min: "0" }}
                                                />
                                                <div className={classes.nav}>
                                                    <EditIcon className={classes.icon}
                                                        onClick={() => handleEditRating(index, ratingItem.star, ratingItem.id, ratingItem.from, ratingItem.to)}
                                                    />
                                                    <DeleteIcon className={classes.icon}
                                                        onClick={() => deleteRatingItemPont(ratingItem.id)}
                                                    />
                                                </div>
                                                {visibleEditRatingItemSectionArr[index] &&
                                                    <form onSubmit={(e) => editRatingItemPoint(e)}>
                                                        <TextField className={classes.formControl} defaultValue={currentEditingRatingItemFromValue}
                                                            variant="outlined" size="small" label="From" type="number"
                                                            onChange={(e) => setCurrentEditingRatingItemFromValue(parseFloat(e.target.value))}
                                                            inputProps={{ min: "0", step: "0.001" }} required
                                                        />
                                                        <TextField className={classes.formControl} defaultValue={currentEditingRatingItemToValue}
                                                            variant="outlined" size="small" label="To" type="number"
                                                            onChange={(e) => setCurrentEditingRatingItemToValue(parseFloat(e.target.value))}
                                                            inputProps={{ min: "0", step: "0.001" }} required
                                                        />
                                                        <Button type="submit" variant="contained" color="primary">Edit</Button>
                                                    </form>
                                                }
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>

                            {props.currentEditingRatingData.length <= 5 &&
                                <AddNewRatingPoint
                                    editingRatingType={props.ratingType}
                                    currentEditingRatingData={props.currentEditingRatingData}
                                    setCurrentEditingRatingData={props.setCurrentEditingRatingData}
                                />
                            }

                            <div className={classes.btnsBox}>
                                <Button className={classes.btn} onClick={() => props.setWindowIsOpen(false)} variant="contained" color="secondary">Cancel</Button>
                                <Button className={classes.btn} onClick={() => props.setWindowIsOpen(false)} type="submit" variant="contained" color="primary">Save</Button>
                            </div>
                        </div>
                    </Typography>
                </Box>
            </Fade>
        </Modal>
    )
}