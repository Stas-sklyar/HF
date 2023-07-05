import { makeStyles, Theme, createStyles, Modal, Backdrop, Fade, Box, Typography, Button } from "@material-ui/core"
import { useState } from "react";
import Preloader from "../../shared/Preloader/Preloader";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        btnsBox: {
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
            textAlign: 'center',
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


type AddApprovedAmountConfirmationWindowPropsType = {
    open: boolean;
    approveAmount(): Promise<void>;
    closeConfirmationWindow(): void;
}

export default function AmountConfirmationWindow(props: AddApprovedAmountConfirmationWindowPropsType) {
    const classes = useStyles()
    const [loaderIsActive, setLoaderIsActive] = useState<boolean>(false)

    const onClickApproveBtn = async (): Promise<void> => {
        setLoaderIsActive(true)
        await  props.approveAmount()
        setLoaderIsActive(false)
    }

    return (
        <>
            <Modal
                open={props.open}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={props.open}>
                    <Box className={classes.modalWindow}>
                        <Typography>
                            <h3>Are you sure you want to Approve the amount? This action cannot be undone.</h3>

                            { loaderIsActive && <Preloader size="70" position="center" /> }

                            <div className={classes.btnsBox}>
                                <Button
                                    className={classes.btn}
                                    onClick={() => props.closeConfirmationWindow()}
                                    variant="contained"
                                    color="secondary"
                                    disabled={loaderIsActive}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    className={classes.btn}
                                    onClick={() => onClickApproveBtn()}
                                    variant="contained"
                                    color="primary"
                                    disabled={loaderIsActive}
                                >
                                    Approve
                                </Button>
                            </div>
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}