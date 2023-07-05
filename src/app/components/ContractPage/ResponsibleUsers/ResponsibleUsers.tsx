import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { downloadBase64File } from "../../../scripts/downloadBase64File"
import { AttachmentType } from "../../../types/attachmentsType"
import DownloadBtn from "../../shared/DownloadBtn/DownloadBtn"
import s from "./ResponsibleUsers.module.scss"

type ResponsibleUsersPropsType = {
    contractData: any
}

export default function ResponsibleUsers(props: ResponsibleUsersPropsType) {
    const [clientName, setClientName] = useState<string>("")
    const [clientId, setClientId] = useState<number | null>(null)
    const [responsibleAttorneyUserName, setResponsibleAttorneyUserName] = useState<string>("")
    const [responsibleAttorneyUserId, setResponsibleAttorneyUserId] = useState<number | null>(null)
    const [responsibleLawFirmUserName, setResponsibleLawFirmUserName] = useState<string>("")
    const [responsibleLawFirmUserId, setResponsibleLawFirmUserId] = useState<number | null>(null)

    const setUserNames = (contractData: any) => {
        if (contractData.contractAttorneyDTO.length) {
            setResponsibleAttorneyUserName(
                contractData.contractAttorneyDTO[contractData.contractAttorneyDTO.length - 1].userName || ""
            )
            setResponsibleAttorneyUserId(contractData.contractAttorneyDTO[contractData.contractAttorneyDTO.length - 1]?.user?.id || null)
        }

        if (contractData.contractLawFirmDTO.length > 0) {
            setResponsibleLawFirmUserName(contractData.contractLawFirmDTO[contractData.contractLawFirmDTO.length - 1].userName || "")
            setResponsibleLawFirmUserId(contractData.contractLawFirmDTO[contractData.contractLawFirmDTO.length - 1].userId || "")
        }

        setClientName(contractData.contractClientDTO.userName || "")
        setClientId(contractData.contractClientDTO.userId || null)
    }

    useEffect(() => {
        setUserNames(props.contractData)
    }, [])

    const [attachments, setAttachments] = useState<Array<AttachmentType>>([])
    const [clientContractIndex, setClientContractIndex] = useState<number>(-1)
    const [attourneyAgreementIndex, setAttourneyAgreementIndex] = useState<number>(-1)

    useEffect(() => {
        if (props.contractData) {
            setAttachments(props?.contractData?.attachments)
        }
    }, [props])

    const calcFilesIndex = (attachments: Array<AttachmentType>) => {
        for (let i = attachments.length; i >= 0; i--) {
            if (attachments[i]?.type === 2) {
                setClientContractIndex(i)
                break
            }
        }
        for (let i = attachments.length; i >= 0; i--) {
            if (attachments[i]?.type === 3) {
                setAttourneyAgreementIndex(i)
                break
            }
        }
    }
    useEffect(() => {
        attachments && attachments.length > 0 && calcFilesIndex(attachments)
    }, [attachments])

    return (
        <section className={s["ResponsibleUsers"]}>
            <h1 className={s["ResponsibleUsers-Title"]}>Responsible Users</h1>
            <div className={s["ResponsibleUsers-Body"]}>
                <div className={s["ResponsibleUsers-Column"]}>
                    {clientId &&
                        <div>
                            <b className={s["ResponsibleUsers-Label"]}>Client: </b>
                            <NavLink to={`user-profile?${clientId}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{clientName}</NavLink>
                            {clientContractIndex !== -1 &&
                                <div
                                    className={s["ResponsibleUsers-DownloadSection"]}
                                    onClick={() => downloadBase64File(attachments[clientContractIndex].mimeType, attachments[clientContractIndex].base64, attachments[clientContractIndex].fileName)}
                                >
                                    <DownloadBtn text="Download Client Contract" />
                                </div>
                            }
                        </div>
                    }
                </div>
                <div className={s["ResponsibleUsers-Column"]}>
                    {responsibleAttorneyUserId &&
                        <div>
                            <b className={s["ResponsibleUsers-Label"]}>Attorney: </b>
                            <NavLink to={`user-profile?${responsibleAttorneyUserId}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{responsibleAttorneyUserName}</NavLink>
                            {attourneyAgreementIndex !== -1 &&
                                <div
                                    className={s["ResponsibleUsers-DownloadSection"]}
                                    onClick={() => downloadBase64File(attachments[attourneyAgreementIndex].mimeType, attachments[attourneyAgreementIndex].base64, attachments[attourneyAgreementIndex].fileName)}
                                >
                                    <DownloadBtn text="Download Attorney Agreement" />
                                </div>
                            }
                        </div>
                    }
                </div>
                <div className={s["ResponsibleUsers-Column"]}>
                    {responsibleLawFirmUserId &&
                        <span>
                            <b className={s["ResponsibleUsers-Label"]}>Law Firm: </b>
                            <NavLink to={`user-profile?${responsibleLawFirmUserId}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{responsibleLawFirmUserName}</NavLink>
                        </span>
                    }
                </div>
            </div>
        </section>
    )
}