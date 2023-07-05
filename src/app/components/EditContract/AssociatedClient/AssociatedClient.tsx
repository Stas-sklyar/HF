import { createStyles, makeStyles, TextField, Theme } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { toggleNotification, setNotificationInfo } from '../../../actions/actions'
import dateFormatting from '../../../scripts/dateFormatting'
import s from './AssociatedClient.module.scss'
import { uploadDocument } from '../../../scripts/uploadDocument'
import { useState, useEffect } from 'react'
import { AttachmentType } from '../../../types/attachmentsType'
import DownloadClientContract from './DownloadClientContract/DownloadClientContract'
import UploadClientContract from './UploadClientContract/UploadClientContract'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textInput: {
            width: 250,
            marginBottom: 20,
            marginRight: 20,
            [theme.breakpoints.down('xs')]: {
                marginRight: 0,
                width: "100%"
            }
        }
    }),
)

type AssociatedClientType = {
    handlerForInputs(e: any): void
    contractClientDTO: any
    contractCreatedDate: string | null
    contractId: number
    attachments: Array<AttachmentType>
    contractAttachmentHasBeenUploaded: boolean
    setContractAttachmentHasBeenUploaded(toggle: boolean): void
}

export default function AssociatedClient(props: AssociatedClientType) {
    const classes = useStyles()
    const dispatch = useDispatch()

    const uplooadDocumentHandler = async (files: FileList | null) => {
        if (!files) return

        const documentHasBeenUploaded = await uploadDocument(files, props.contractId, 2)
        if (documentHasBeenUploaded) {
            props.setContractAttachmentHasBeenUploaded(!props.contractAttachmentHasBeenUploaded)
            dispatch(setNotificationInfo({ message: "Document uploaded successfully", severity: "success" }))
        }
        else {
            dispatch(setNotificationInfo({ message: "Document not uploaded", severity: "error" }))
        }
        dispatch(toggleNotification(true))
    }

    const [attachments, setAttachments] = useState<Array<AttachmentType>>(props.attachments)
    const [clientContractIndex, setClientContractIndex] = useState<number>(-1)
    const calcClientContractIndex = (attachments: Array<AttachmentType>) => {
        for (let i = attachments.length; i >= 0; i--) {
            if (attachments[i]?.type === 2) {
                setClientContractIndex(i)
                break
            }
        }
    }
    useEffect(() => {
        attachments && attachments.length > 0 && calcClientContractIndex(attachments)
    }, [attachments])

    useEffect(() => {
        setAttachments(props.attachments)
        calcClientContractIndex(attachments)
    }, [props])

    return (
        <section className={s["AssociatedClient"]}>

            <h1 className={s["AssociatedClient-Title"]}>Associated Client</h1>

            <div className={s["AssociatedClient-Body"]}>

                <div className={s["AssociatedClient-Row"]}>
                    <div className={s["AssociatedClient-Col"]}>
                        <TextField
                            className={classes.textInput}
                            value={props.contractClientDTO.user.firstName + " " + props.contractClientDTO.user.lastName}
                            label="Current Client"
                            type="text" variant="outlined" size="small"
                        />
                    </div>

                    <div className={s["AssociatedClient-Col"]}>
                        <TextField
                            className={classes.textInput}
                            value={dateFormatting(props.contractCreatedDate + "")}
                            label="Date Added"
                            type="text" variant="outlined" size="small"
                        />
                    </div>

                    {clientContractIndex === -1 &&
                        <UploadClientContract
                            uplooadDocumentHandler={uplooadDocumentHandler}
                        />
                    }

                    {clientContractIndex !== -1 &&
                        <div>
                            <DownloadClientContract
                                mimeType={attachments[clientContractIndex].mimeType}
                                base64String={attachments[clientContractIndex].base64}
                                fileName={attachments[clientContractIndex].fileName}
                                uplooadDocumentHandler={uplooadDocumentHandler}
                            />
                        </div>
                    }
                </div>

            </div>
        </section>
    )
}