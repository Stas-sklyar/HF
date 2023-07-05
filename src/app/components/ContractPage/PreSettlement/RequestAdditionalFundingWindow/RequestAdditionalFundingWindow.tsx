import { makeStyles, Theme, createStyles, Modal, Backdrop, Fade, Box, Typography, TextField, Button } from "@material-ui/core"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { setNotificationInfo, toggleNotification } from "../../../../actions/actions"
import { URL_FOR_API } from "../../../../constants/constants"
import actionsWithApi from "../../../../customHooks/actionsWithApi"
import getCookie from "../../../../scripts/getCookie"

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


type RequestAdditionalFundingWindowPropsType = {
    openRequestAdditionalFundingWindow: boolean
    handleCloseRequestAdditionalFundingWindow(): void
    contractId: number
    additionalFundingHasBeenAdded: boolean
    setAdditionalFundingHasBeenAdded(toggle: boolean): void
}

export default function RequestAdditionalFundingWindow(props: RequestAdditionalFundingWindowPropsType) {
    const classes = useStyles()
    const dispatch = useDispatch()
    const currentUserId = parseInt(getCookie("currentUserId") + "")

    const [amount, setAmount] = useState<number>()

    const handleSubmit = async (e: React.FormEvent<EventTarget>) => {
        e.preventDefault()

        try {
            let additionalFundingRequestData = {
                amount,
                date: new Date().toISOString(),
                contractId: props.contractId,
                userId: currentUserId
            }
            await actionsWithApi("POST", URL_FOR_API + `/api/v1/Contract/${props.contractId}/addAdditionalFundingRequest`, additionalFundingRequestData)
            
            props.handleCloseRequestAdditionalFundingWindow()
            props.setAdditionalFundingHasBeenAdded(!props.additionalFundingHasBeenAdded)

            dispatch(setNotificationInfo({ message: "Your request has been sent", severity: "success" }))
            dispatch(toggleNotification(true))
        }
        catch (error) {
            console.log(error.message)
        }
    }

    return (
        <>
            <Modal
                open={props.openRequestAdditionalFundingWindow}
                onClose={props.handleCloseRequestAdditionalFundingWindow}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={props.openRequestAdditionalFundingWindow}>
                    <Box className={classes.modalWindow}>
                        <Typography>
                            <form className={classes.form} onSubmit={(e) => handleSubmit(e)}>

                                <TextField
                                    className={classes.formControl}
                                    label="Amount" type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(parseInt(e.target.value + ""))}
                                    variant="outlined" size="small"
                                />

                                <div className={classes.btnsBox}>
                                    <Button
                                        className={classes.btn}
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => props.handleCloseRequestAdditionalFundingWindow()}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        className={classes.btn}
                                        type="submit"
                                        variant="contained" color="primary"
                                    >
                                        Request
                                    </Button>
                                </div>

                            </form>
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}