import { useDispatch } from 'react-redux'
import { setNotificationInfo, toggleNotification } from '../../../../actions/actions'
import { uploadDocument } from '../../../../scripts/uploadDocument'
import s from '../AssociatedAttorneys.module.scss'
import FileUploadIcon from '@material-ui/icons/CloudUpload'
import { makeStyles, Theme, createStyles } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textInput: {
            width: 220,
            [theme.breakpoints.down('xs')]: {
                width: "100%",
            }
        },
        uploadContractInput: {
            display: "none"
        }
    }),
);

type UploadAttorneyAgreementPropsType = {
    contractId: number
    contractAttachmentHasBeenUploaded: boolean
    setContractAttachmentHasBeenUploaded(toggle: boolean): void
}

export default function UploadAttorneyAgreement(props: UploadAttorneyAgreementPropsType) {
    const classes = useStyles()
    const dispatch = useDispatch()

    const uplooadDocumentHandler = async (files: any) => {
        const documentHasBeenUploaded = await uploadDocument(files, props.contractId, 3)

        if (documentHasBeenUploaded) {
            props.setContractAttachmentHasBeenUploaded(!props.contractAttachmentHasBeenUploaded)
            dispatch(setNotificationInfo({ message: "Document uploaded successfully", severity: "success" }))
            dispatch(toggleNotification(true))
        }
        else {
            dispatch(setNotificationInfo({ message: "Document not uploaded", severity: "error" }))
            dispatch(toggleNotification(true))
        }
    }

    return (
        <label>
            <input
                className={classes.textInput + " " + classes.uploadContractInput}
                type="file"
                onChange={(e) => uplooadDocumentHandler(e.target.files)}
            />
            <div className={s["AssociatedAttorneys-UploadBtn"]}>
                <FileUploadIcon className={s["AssociatedAttorneys-UploadIcon"]} />
                <span>Upload Attorney Agreement</span>
            </div>
        </label>
    )
}