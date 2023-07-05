import { makeStyles, Theme, createStyles } from '@material-ui/core'
import s from '../AssociatedClient.module.scss'
import FileUploadIcon from '@material-ui/icons/CloudUpload'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textInput: {
            width: 250,
            marginBottom: 20,
            marginRight: 20,
            [theme.breakpoints.down('xs')]: {
                marginRight: 0,
                width: "100%",
            }
        },
        uploadFileInput: {
            display: "none"
        }
    }),
)

type UploadClientContractPropsType = {
    uplooadDocumentHandler(files: FileList | null): void
}

export default function UploadClientContract(props: UploadClientContractPropsType) {
    const classes = useStyles()

    return (
        <div className={s["AssociatedClient-Col"]}>
            <label>
                <input
                    className={classes.textInput + " " + classes.uploadFileInput}
                    type="file"
                    onChange={(e) => props.uplooadDocumentHandler(e.target.files)}
                />

                <span className={s["AssociatedClient-UploadContractBtn"]}>
                    <FileUploadIcon className={s["AssociatedClient-UploadContractIcon"] + " " + "FileUploadIcon"} />
                    <span>Upload Client Contract</span>
                </span>
            </label>
        </div>
    )
}