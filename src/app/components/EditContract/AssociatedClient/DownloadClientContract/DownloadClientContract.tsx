import { downloadBase64File } from '../../../../scripts/downloadBase64File'
import s from '../AssociatedClient.module.scss'
import GetAppIcon from '@material-ui/icons/GetApp'
import { Button, CircularProgress, Tooltip } from '@material-ui/core'
import { CSSProperties, useState } from 'react'

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

type DownloadClientContractPropsType = {
    mimeType: string
    base64String: string
    fileName: string
    uplooadDocumentHandler(files: FileList | null): void
}

export default function DownloadClientContract(props: DownloadClientContractPropsType) {

    const [loaderIsActive, setLoaderIsActive] = useState<boolean>(false)
    const uploadClientContract = async (files: FileList | null) => {
        if (!files) return

        try {
            setLoaderIsActive(true)
            await props.uplooadDocumentHandler(files)
        }
        finally {
            setLoaderIsActive(false)
        }
    }

    return (
        <div className={s["AssociatedClient-DownloadContainer"]}>
            <div
                className={s["AssociatedClient-DownloadSection"]}
                onClick={() => downloadBase64File(
                    props.mimeType,
                    props.base64String,
                    props.fileName
                )}
            >
                <GetAppIcon className="PrimaryIcon" />
                <Tooltip title="Download File" placement="bottom" arrow>
                    <span className={s["AssociatedClient-ClientContractFileName"]}>
                        {props.fileName}
                    </span>
                </Tooltip>
            </div>

            <label>
                <Button variant="contained" color="primary">
                    Upload New Client Contract

                    <input
                        style={{ ...inputStyles }}
                        type="file"
                        onChange={(e) => uploadClientContract(e.target.files)}
                    />
                </Button>
            </label>

            {loaderIsActive &&
                <CircularProgress size={"25px"} className={s["AssociatedClient-Loader"]} />
            }

        </div>
    )
}