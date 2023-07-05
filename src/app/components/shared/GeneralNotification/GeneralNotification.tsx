import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../reducers/rootReducers'
import { toggleNotification } from '../../../actions/actions'

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  

export default function GeneralNotification() {
    const dispatch = useDispatch()
    let isOpen = useSelector((state: RootState) => state.notification["isOpen"])
    let message = useSelector((state: RootState) => state.notification["message"])
    let severity = useSelector((state: RootState) => state.notification["severity"])

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={isOpen}
                autoHideDuration={3000}
                onClose={() => dispatch(toggleNotification(false))}
                message={message}>
                    <Alert onClose={() => dispatch(toggleNotification(false))} severity={severity}>
                        {message}
                    </Alert>
            </Snackbar>
        </div>
    );
}