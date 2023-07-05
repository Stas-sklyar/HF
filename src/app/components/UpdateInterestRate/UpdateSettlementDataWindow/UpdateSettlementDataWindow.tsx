import { Theme, Modal, Backdrop, Fade, Box, Typography, TextField, Button, makeStyles, createStyles } from "@material-ui/core"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { setNotificationInfo, toggleNotification } from "../../../actions/actions"
import { URL_FOR_API } from "../../../constants/constants"
import actionsWithApi from "../../../customHooks/actionsWithApi"
import { RatesType } from "../../../types/ratesType"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        },
        formControl: {
            width: 250,
            marginBottom: 20,
            "&:last-child": {
                marginBottom: 0
            },
        },
        btnsBox: {
            width: 250,
            display: "flex",
            justifyContent: "space-between",
            marginTop: 50,
            [theme.breakpoints.down('xs')]: {
                marginTop: 20,
            }
        },
        btn: {
            width: 100,
        },
        modalWindow: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            padding: 40,
            backgroundColor: theme.palette.background.paper,
            [theme.breakpoints.down('xs')]: {
                width: 250,
                padding: 20
            }
        }
    }),
)


type UpdateSettlementDataWindowPropsType = {
    openUpdateSettlementDataWindow: boolean
    handleCloseUpdateSettlementDataWindow(e: boolean): void
    editableSettlementInfo: RatesType | null
    editableSettlementType: "post" | "pre" | null
    settlementDataIsUpdatedToggle: boolean
    setSettlementDataIsUpdatedToggle(updateToggle: boolean): void
}

export default function UpdateSettlementDataWindow(props: UpdateSettlementDataWindowPropsType) {
    const classes = useStyles()
    const dispatch = useDispatch()

    const [daysFrom, setDaysFrom] = useState<number>()
    const [daysTo, setDaysTo] = useState<number>()
    const [rate, setRate] = useState<number>()
    const [settlementId, setSettlementId] = useState<number>()

    const setDefaultValues = (props: UpdateSettlementDataWindowPropsType) => {
        setDaysFrom(props.editableSettlementInfo?.daysFrom)
        setDaysTo(props.editableSettlementInfo?.daysTo)
        setRate(props.editableSettlementInfo?.rate)
        setSettlementId(props.editableSettlementInfo?.id)
    }

    useEffect(() => {
        setDefaultValues(props)
    }, [props])

    const handleSubmit = async (e: React.FormEvent<EventTarget>) => {
        e.preventDefault()

        try {
            let updatedSettlementData = {
                daysFrom,
                daysTo,
                rate,
                id: settlementId
            }
            await actionsWithApi("POST", URL_FOR_API + `/api/v1/Interest/update/${props.editableSettlementType}Settlement/${settlementId}`, updatedSettlementData)
            dispatch(setNotificationInfo({ message: "Interest Rate successfuly edited", severity: "success" }))
            dispatch(toggleNotification(true))
            props.handleCloseUpdateSettlementDataWindow(true)
            props.setSettlementDataIsUpdatedToggle(!props.settlementDataIsUpdatedToggle)
        }
        catch (error) {
            console.log(error.message)
        }
    }

    return (
        <>
            <Modal
                open={props.openUpdateSettlementDataWindow}
                onClose={props.handleCloseUpdateSettlementDataWindow}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={props.openUpdateSettlementDataWindow}>
                    <Box className={classes.modalWindow}>
                        <Typography>
                            <form className={classes.form} onSubmit={(e) => handleSubmit(e)}>
                                <TextField className={classes.formControl} label="From" type="number" value={daysFrom}
                                    onChange={(e) => setDaysFrom(parseInt(e.target.value + ""))} variant="outlined" size="small" />
                                <TextField className={classes.formControl} label="To" type="number" value={daysTo}
                                    onChange={(e) => setDaysTo(parseInt(e.target.value + ""))} variant="outlined" size="small" />
                                <TextField className={classes.formControl} label="Rate" type="number" value={rate}
                                    onChange={(e) => setRate(parseInt(e.target.value + ""))} variant="outlined" size="small" />

                                <div className={classes.btnsBox}>
                                    <Button className={classes.btn} variant="contained" color="secondary"
                                        onClick={() => props.handleCloseUpdateSettlementDataWindow(true)}>Cancel</Button>
                                    <Button className={classes.btn} type="submit" variant="contained" color="primary">Save</Button>
                                </div>
                            </form>
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}