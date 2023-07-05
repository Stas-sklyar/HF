import s from './ContractComments.module.scss'
import dateFormatting from "../../../scripts/dateFormatting"
import { TextField, FormControlLabel, Checkbox, Button, Divider } from '@material-ui/core'
import { useState } from 'react'
import { toggleNotification, setNotificationInfo } from '../../../actions/actions'
import { URL_FOR_API } from '../../../constants/constants'
import actionsWithApi from '../../../customHooks/actionsWithApi'
import getCookie from '../../../scripts/getCookie'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import { convertFileToBase64 } from '../../../scripts/toBase64'
import ImageIcon from '@material-ui/icons/Image'
import ClearIcon from '@material-ui/icons/Clear'
import { CommentAttachmentsType, ContractCommentType } from '../../../types/contractTypes'
import { downloadBase64File } from '../../../scripts/downloadBase64File'

export type ContractCommentsPropsType = {
    comments: Array<ContractCommentType>
}

export default function ContractCommentsPropsType(props: ContractCommentsPropsType) {
    const dispatch = useDispatch()
    const location = useLocation()
    const currentUserId = parseInt(getCookie("currentUserId") + "")
    const currentUserRole = getCookie("currentUserRole")
    const currentUserStatus = getCookie("currentUserStatus")
    const contractId = location.search.split("").slice(1, location.search.split("").length).join("")

    const [comments, setComments] = useState<Array<ContractCommentType>>(props.comments)
    const [commentText, setCommentText] = useState<string | unknown>("")
    const [visibleComment, setVisibleComment] = useState<boolean>(true)

    const [attachmentInBase64, setAttachmentInBase64] = useState<string>("")
    const [attachmentMimeType, setAttachmentMimeType] = useState<string>("")
    const [attachmentFileName, setAttachmentFileName] = useState<string>("")
    const attachmentHandle = async (files: any) => {
        const file = files[0]
        if (file) {
            setAttachmentInBase64(await convertFileToBase64(file))
            setAttachmentMimeType(file.type)
            setAttachmentFileName(file.name)
        }
    }

    const addComment = async () => {
        try {
            let newCommentData = {
                commentText,
                visible: visibleComment,
                dateComment: new Date().toISOString() + "",
                userId: currentUserId,
                contractId
            }
            let response = await actionsWithApi("POST", URL_FOR_API + `/api/v1/Contract/${contractId}/addComment`, newCommentData)
            setComments([...response.data.contractComments])

            attachmentInBase64 && uploadAttachment(
                response.data.contractComments[response.data.contractComments.length - 1].id,
                [...response.data.contractComments]
            )
            dispatch(toggleNotification(true))
            dispatch(setNotificationInfo({ message: "Comment has been added!", severity: "success" }))
        }
        catch (error) {
            console.log(error.message)
            dispatch(toggleNotification(true))
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
        }
    }

    const uploadAttachment = async (commentId: number, updatedComments: Array<ContractCommentType>) => {
        try {
            let commentAttachment = {
                mimeType: attachmentMimeType,
                type: 0,
                documentBase64String: attachmentInBase64,
                fileName: attachmentFileName
            }
            const response = await actionsWithApi("POST", URL_FOR_API + `/api/v1/Contract/${commentId}/uploadCommentAttachment`, commentAttachment)
            let updatedCommentsWithAttachment = [...updatedComments]
            updatedCommentsWithAttachment[updatedCommentsWithAttachment?.length - 1]?.commentAttachments?.push(response.data)
            setComments([...updatedCommentsWithAttachment])
            clearAttachment()
        }
        catch (error) {
            dispatch(toggleNotification(true))
            dispatch(setNotificationInfo({ message: "Attachment was not saved", severity: "error" }))
        }
    }

    const clearAttachment = () => {
        setAttachmentInBase64("")
        setAttachmentMimeType("")
        setAttachmentFileName("")
    }

    const downloadCommentAttachment = (attachment: CommentAttachmentsType | null) => {
        attachment && downloadBase64File(attachment.mimeType, attachment.base64, attachment.fileName)
    }

    return (
        <section className={s["Comment"]}>
            <h1 className={s["Comment-Title"]}>Comments</h1>

            <div className={s["Comment-CommentsContainer"]}>
                {comments && comments.length > 0 &&
                    comments
                        .filter((comment: ContractCommentType) => comment.visible)
                        .map((comment: ContractCommentType) => {
                            return (
                                <div key={comment.id} className={s["Comment-Item"]}>
                                    <div className={s["Comment-Info"]}>
                                        <span>{comment.userName ? comment.userName : "Unknown"}</span>
                                        <span>{dateFormatting(comment.dateComment)}</span>
                                    </div>
                                    <TextField className={s["Comment-TextBody"]}
                                        name="comment"
                                        variant="outlined"
                                        rows={4}
                                        value={comment.commentText}
                                        multiline
                                    />
                                    {comment.commentAttachments && comment.commentAttachments.length > 0 &&
                                        <div
                                            className={s["Comment-Attachments"]}
                                            onClick={() => downloadCommentAttachment(comment?.commentAttachments ? comment?.commentAttachments[0] : null)}
                                        >
                                            <ImageIcon className={s["Comment-Icon"]} />
                                            <span>{comment?.commentAttachments[0]?.fileName}</span>
                                        </div>
                                    }
                                </div>
                            )
                        })
                }
            </div>
            <Divider className={s["Comment-Divider"]} />

            <TextField className={s["Comment-Input"]}
                variant="outlined"
                size="small"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value + "")}
                label="Write Comment"
            />
            <div className={s["Comment-ControllsBody"]}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => addComment()}
                >
                    Send
                </Button>
                <label className={s["Comment-AttachmentFileLabel"]}>
                    <AttachFileIcon className={s["Comment-Icon"]} />
                    <input className={s["Comment-AttachmentFileInput"]}
                        type="file"
                        onChange={(e) => attachmentHandle(e.target.files)}
                        value=""
                    />
                    {attachmentInBase64 &&
                        <div className={s["Comment-AttachmentBox"]}>
                            <span>{attachmentFileName}</span>
                        </div>
                    }
                </label>
                {attachmentFileName &&
                    <ClearIcon
                        className={s["Comment-ClearIcon"]}
                        onClick={() => clearAttachment()}
                    />
                }
            </div>
            <br />

            {currentUserRole === "Administrator" && currentUserStatus === "Approved" &&
                <label className={s["Comment-Label"]}>
                    <FormControlLabel control={
                        <Checkbox color="primary"
                            checked={visibleComment}
                            onChange={(e) => setVisibleComment(e.target.checked)}
                        />}
                        label="Viewable by Attorney" />
                </label>
            }
        </section>
    )
}