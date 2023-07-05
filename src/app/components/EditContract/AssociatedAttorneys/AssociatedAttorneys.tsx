import { Checkbox, createStyles, FormControlLabel, makeStyles, TextField, Theme } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router'
import { setNotificationInfo, toggleNotification } from '../../../actions/actions'
import { URL_FOR_API } from '../../../constants/constants'
import actionsWithApi from '../../../customHooks/actionsWithApi'
import dateFormatting from '../../../scripts/dateFormatting'
import { AttachmentType } from '../../../types/attachmentsType'
import AddBtn from '../../shared/AddBtn/AddBtn'
import s from './AssociatedAttorneys.module.scss'
import AddAssociatedAttorney from './AddAssociatedAttorney/AddAssociatedAttorney'
import DownloadAttorneyAgreement from './DownloadAttorneyAgreement/DownloadAttorneyAgreement'
import UploadAttorneyAgreement from './UploadAttorneyAgreement/UploadAttorneyAgreement'
import getCookie from "../../../scripts/getCookie";

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
)

type AssociatedAttorneysType = {
    handlerForInputs(e: any): void
    contractAttorneyDTO: any
    setUserHasBeenAdded(e: boolean): void
    userHasBeenAdded: boolean
    attachments: Array<AttachmentType>
    contractAttachmentHasBeenUploaded: boolean
    setContractAttachmentHasBeenUploaded(toggle: boolean): void
}

export default function AssociatedAttorneys(props: AssociatedAttorneysType) {
    const currentUserType = getCookie("currentUserRole")
    const classes = useStyles()
    const dispatch = useDispatch()
    const location = useLocation()
    const contractId: number = parseInt(location.search.split("").slice(1, location.search.split("").length).join("") + "")
    const [addAttorneyToggle, setAddAttorneyToggle] = useState<boolean>(false)

    const [selectedAttorney, setSelectedAttorney] = useState<number | null>(null)

    const addExistingAttorney = async (e: React.FormEvent<EventTarget>) => {
        e.preventDefault()

        if(selectedAttorney) {
            try {
                await actionsWithApi("POST", URL_FOR_API + `/api/v1/Contract/${contractId}/addAttorney`,
                    {
                        userId: selectedAttorney,
                        date: new Date().toISOString() + ""
                    }
                )
                props.setUserHasBeenAdded(!props.userHasBeenAdded)
                dispatch(setNotificationInfo({ message: "New attorney has been added", severity: "success" }))
                dispatch(toggleNotification(true))
            }
            catch (error) {
                dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
                dispatch(toggleNotification(true))
                console.log(error.message)
            }
        }
    }

    const [attachments, setAttachments] = useState<Array<AttachmentType>>(props.attachments)
    const [attourneyAgreementIndex, setAttourneyAgreementIndex] = useState<number>(-1)
    const calcAttourneyAgreementIndex = (attachments: Array<AttachmentType>) => {
        for (let i = attachments.length; i >= 0; i--) {
            if (attachments[i]?.type === 3) {
                setAttourneyAgreementIndex(i)
                break
            }
        }
    }
    useEffect(() => {
        attachments?.length > 0 && calcAttourneyAgreementIndex(attachments)
    }, [attachments])

    useEffect(() => {
        setAttachments(props.attachments)
        calcAttourneyAgreementIndex(attachments)
    }, [props])

    return (
        <section className={s["AssociatedAttorneys"]}>
            <h1 className={s["AssociatedAttorneys-Title"]}>Associated Attorneys</h1>

            <div className={s["AssociatedAttorneys-Body"]}>
                {props.contractAttorneyDTO.length > 0 &&
                    props.contractAttorneyDTO.map((attorney: any, index: number) => {
                        return (
                            <div key={attorney.user?.id || index} className={s["AssociatedAttorneys-Row"]}>

                                <div className={s["AssociatedAttorneys-Col"]}>
                                    <TextField
                                        className={classes.textInput}
                                        value={attorney.user?.userName || ""}
                                        label="Attorney Name"
                                        type="text" variant="outlined" size="small"
                                    />
                                </div>
                                <div className={s["AssociatedAttorneys-Col"]}>
                                    <FormControlLabel
                                        name="isResponsibleAttorney"
                                        control={<Checkbox checked={attorney.responsible} color="primary" />}
                                        label="Responsible Attorney"
                                    />
                                </div>
                                <div className={s["AssociatedAttorneys-Col"]}>
                                    <TextField
                                        className={classes.textInput}
                                        name="attorneyDateSelected" type="text"
                                        value={dateFormatting(attorney.date)}
                                        variant="outlined" size="small"
                                        label="Added Date"
                                    />
                                </div>

                                <div className={s["AssociatedAttorneys-Col"]}>
                                    {attourneyAgreementIndex === -1 && attorney.responsible &&
                                        <UploadAttorneyAgreement
                                            contractId={contractId}
                                            contractAttachmentHasBeenUploaded={props.contractAttachmentHasBeenUploaded}
                                            setContractAttachmentHasBeenUploaded={props.setContractAttachmentHasBeenUploaded}
                                        />
                                    }

                                    {attourneyAgreementIndex !== -1 && attorney.responsible &&
                                        <DownloadAttorneyAgreement
                                            mimeType={attachments[attourneyAgreementIndex].mimeType}
                                            base64String={attachments[attourneyAgreementIndex].base64}
                                            fileName={attachments[attourneyAgreementIndex].fileName}
                                            contractId={contractId}
                                            contractAttachmentHasBeenUploaded={props.contractAttachmentHasBeenUploaded}
                                            setContractAttachmentHasBeenUploaded={props.setContractAttachmentHasBeenUploaded}
                                        />
                                    }
                                </div>

                            </div>
                        )
                    })
                }
                {props.contractAttorneyDTO.length === 0 &&
                    <span>The contract does not have anyone attorney</span>
                }
            </div>

            {currentUserType === "Administrator" ?
                <div
                    className={s["AssociatedAttorneys-AddAttorneyBtn"]}
                    onClick={() => setAddAttorneyToggle(!addAttorneyToggle)}
                >
                    <AddBtn text="Add Attorney" />
                </div> : ""
            }

            {addAttorneyToggle &&
                <AddAssociatedAttorney
                    addExistingAttorney={addExistingAttorney}
                    setSelectedAttorney={setSelectedAttorney}
                    addAttorneyToggle={addAttorneyToggle}
                />
            }

        </section>
    )
}