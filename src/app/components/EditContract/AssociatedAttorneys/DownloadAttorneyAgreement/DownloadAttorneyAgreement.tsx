import { downloadBase64File } from '../../../../scripts/downloadBase64File'
import s from '../AssociatedAttorneys.module.scss'
import GetAppIcon from '@material-ui/icons/GetApp'
import { Button, CircularProgress, Tooltip } from '@material-ui/core'
import { CSSProperties, useState } from 'react'
import { uploadDocument } from '../../../../scripts/uploadDocument'
import { useDispatch } from 'react-redux'
import { setNotificationInfo, toggleNotification } from '../../../../actions/actions'

const inputStyles: CSSProperties = {
    zIndex: 2,
    opacity: 0,
    position: "absolute",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    cursor: "pointer"
}

type DownloadAttorneyAgreementPropsType = {
    mimeType: string
    base64String: string
    fileName: string
    contractId: number
    contractAttachmentHasBeenUploaded: boolean
    setContractAttachmentHasBeenUploaded(toggle: boolean): void
}

export default function DownloadAttorneyAgreement(props: DownloadAttorneyAgreementPropsType) {
    const dispatch = useDispatch()
    const [loaderIsActive, setLoaderIsActive] = useState<boolean>(false)
    const uploadClientContract = async (files: FileList | null) => {
        if (!files) return
        setLoaderIsActive(true)

        try {
            await uploadDocument(files, props.contractId, 3)
            dispatch(setNotificationInfo({ message: "Document uploaded successfully", severity: "success" }))
        }
        catch {
            dispatch(setNotificationInfo({ message: "Document not uploaded", severity: "error" }))
        }
        finally {
            dispatch(toggleNotification(true))
            setLoaderIsActive(false)
            props.setContractAttachmentHasBeenUploaded(!props.contractAttachmentHasBeenUploaded)
        }
    }

    return (
        <span className={s["AssociatedAttorneys-DownloadSection"]}>
            <span className={s["AssociatedAttorneys-DownloadAgreementBtn"]}>
                <GetAppIcon className="PrimaryIcon" />
                <Tooltip title="Download File" placement="bottom" arrow>
                    <span className={s["AssociatedAttorneys-AttorneyAgreementFileName"]}
                        onClick={() => downloadBase64File(props.mimeType, props.base64String, props.fileName)}
                    >
                        {props.fileName}
                    </span>
                </Tooltip>
            </span>

            <label className={s["AssociatedAttorneys-UploadNewCotractBox"]}>
                <Button variant="contained" color="primary">
                    Upload New Attorney Agreement

                    <input
                        style={{ ...inputStyles }}
                        type="file"
                        onChange={(e) => uploadClientContract(e.target.files)}
                    />
                </Button>
                {loaderIsActive &&
                    <CircularProgress size={"25px"} className={s["AssociatedAttorneys-Loader"]} />
                }
            </label>
        </span>
    )
}