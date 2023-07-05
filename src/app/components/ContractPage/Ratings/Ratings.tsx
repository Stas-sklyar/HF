import s from "./Ratings.module.scss"
import { useEffect, useState } from "react"
import { AttachmentType } from "../../../types/attachmentsType"
import Preloader from "../../shared/Preloader/Preloader"
import actionsWithApi from "../../../customHooks/actionsWithApi"
import RatingTable from "../../shared/RatingTable/RatingTable"
import DownloadBtn from "../../shared/DownloadBtn/DownloadBtn"
import { Button } from "@material-ui/core"
import { downloadBase64File } from "../../../scripts/downloadBase64File"

export default function Ratings(props: any) {
    const [responsibleAttorneyUserId, setResponsibleAttorneyUserId] = useState<number | null>(null)
    const [responsibleLawFirmUserId, setResponsibleLawFirmUserId] = useState<number | null>(null)

    const [attorneyRatingIsVisble, setAttorneyRatingIsVisble] = useState<boolean>(false)
    const [updateRatingsForAttorneyToggle, setUpdateRatingsForAttorneyToggle] = useState<boolean>(false)
    const [lawFirmRatingIsVisble, setLawFirmRatingIsVisble] = useState<boolean>(false)
    const [updateRatingsForLawFirmToggle, setUpdateRatingsForLawFirmToggle] = useState<boolean>(false)

    const setResponsibleUsersId = (contractData: any) => {
        if (contractData.contractAttorneyDTO.length > 0) {
            setResponsibleAttorneyUserId(contractData.contractAttorneyDTO[contractData.contractAttorneyDTO.length - 1].userId || null)
        }
        if (contractData.contractLawFirmDTO.length > 0) {
            setResponsibleLawFirmUserId(contractData.contractLawFirmDTO[contractData.contractLawFirmDTO.length - 1].userId || null)
        }
    }

    useEffect(() => {
        if (props.contractData) {
            setResponsibleUsersId(props.contractData)
        }
    }, [props])



    if (props.contractData) {
        return (
            <section className={s["Ratings"]}>
                <h1 className={s["Ratings-Title"]}>Ratings</h1>
                <div className={s["Ratings-Body"]}>

                    <div className={s["Ratings-Column"]}></div>

                    {responsibleAttorneyUserId &&
                        <div className={s["Ratings-Column"]}>
                            {!attorneyRatingIsVisble &&
                                <Button className={s["Ratings-Btn"]} variant="contained" color="primary"
                                    onClick={() => setAttorneyRatingIsVisble(true)}>
                                    Calculate Rating for Attorney
                                </Button>
                            }
                            {attorneyRatingIsVisble &&
                                <Button className={s["Ratings-Btn"]} variant="contained" color="primary"
                                    onClick={() => setUpdateRatingsForAttorneyToggle(!updateRatingsForAttorneyToggle)}>
                                    Update Rating for Attorney
                                </Button>
                            }
                            {attorneyRatingIsVisble &&
                                <RatingTable userId={responsibleAttorneyUserId} updateRatingsToggle={updateRatingsForAttorneyToggle} />
                            }
                        </div>
                    }

                    {responsibleLawFirmUserId &&
                        <div className={s["Ratings-Column"]}>
                            {!lawFirmRatingIsVisble &&
                                <Button className={s["Ratings-Btn"]} variant="contained" color="primary"
                                    onClick={() => setLawFirmRatingIsVisble(true)}>
                                    Calculate Rating for Law Firm
                                </Button>
                            }
                            {lawFirmRatingIsVisble &&
                                <Button className={s["Ratings-Btn"]} variant="contained" color="primary"
                                    onClick={() => setUpdateRatingsForLawFirmToggle(!updateRatingsForLawFirmToggle)}>
                                    Update Rating for Law Firm
                                </Button>
                            }
                            {lawFirmRatingIsVisble &&
                                <RatingTable userId={responsibleLawFirmUserId} updateRatingsToggle={updateRatingsForLawFirmToggle} />
                            }
                        </div>
                    }

                </div>
            </section>
        )
    }
    else {
        return (
            <Preloader size="100" position="center" />
        )
    }
}