import Statistics from "../../shared/Statistics/Statistics"
import s from "./StatisticsInfo.module.scss"
import { useEffect, useState } from "react"
import { Button } from "@material-ui/core"
import Preloader from "../../shared/Preloader/Preloader"

type StatisticsInfoPropsType = {
    contractData: any
}

export default function StatisticsInfo(props: StatisticsInfoPropsType) {
    const [clientStatisticsIsVisble, setClientStatisticsIsVisble] = useState<boolean>(false)
    const [attorneyStatisticsIsVisble, setAttorneyStatisticsIsVisble] = useState<boolean>(false)
    const [lawFirmStatisticsIsVisble, setLawFirmStatisticsIsVisble] = useState<boolean>(false)

    const [updateStatisticsForClientToggle, setUpdateStatisticsForClientToggle] = useState<boolean>(false)
    const [updateStatisticsForAttorneyToggle, setUpdateStatisticsForAttorneyToggle] = useState<boolean>(false)
    const [updateStatisticsForLawFirmToggle, setUpdateStatisticsForLawFirmToggle] = useState<boolean>(false)

    const [contractClientId, setContractClientId] = useState<number>()
    const [contractResponsibleAttorneyId, setContractResponsibleAttorneyId] = useState<number | null>(null)
    const [contractResponsibleLawFirmId, setContractResponsibleLawFirmId] = useState<number | null>(null)

    useEffect(() => {
        if (props.contractData) {
            setContractClientId(props.contractData.contractClientDTO.user.id)
            setContractResponsibleAttorneyId(props.contractData.contractAttorneyDTO[props.contractData.contractAttorneyDTO.length - 1]?.userId || null)
            setContractResponsibleLawFirmId(props.contractData.contractLawFirmDTO[props.contractData.contractLawFirmDTO.length - 1]?.userId || null)
        }
    }, [props])

    if (props.contractData) {
        return (
            <section className={s["StatisticsInfo"]}>
                <h1 className={s["StatisticsInfo-Title"]}>Statistics</h1>
                <div className={s["StatisticsInfo-Body"]}>

                    <div className={s["StatisticsInfo-Col"]}>
                        {contractClientId && !clientStatisticsIsVisble &&
                            <Button className={s["StatisticsInfo-Btn"]} variant="contained" color="primary" onClick={() => setClientStatisticsIsVisble(true)}>Calculate Statistics for Client</Button>
                        }
                        {clientStatisticsIsVisble &&
                            <Button className={s["StatisticsInfo-Btn"]} variant="contained" color="primary" onClick={() => setUpdateStatisticsForClientToggle(!updateStatisticsForClientToggle)}>Update Statistics for Client</Button>
                        }
                        {clientStatisticsIsVisble && contractClientId &&
                            <div className={s["StatisticsInfo-Box"]}>
                                <Statistics userId={contractClientId} updateStatisticsToggle={updateStatisticsForClientToggle} />
                            </div>
                        }
                    </div>


                    <div className={s["StatisticsInfo-Col"]}>
                        {contractResponsibleAttorneyId && !attorneyStatisticsIsVisble &&
                            <Button className={s["StatisticsInfo-Btn"]} variant="contained" color="primary" onClick={() => setAttorneyStatisticsIsVisble(true)}>Calculate Statistics for Attorney</Button>
                        }
                        {attorneyStatisticsIsVisble && attorneyStatisticsIsVisble &&
                            <Button className={s["StatisticsInfo-Btn"]} variant="contained" color="primary" onClick={() => setUpdateStatisticsForAttorneyToggle(!updateStatisticsForAttorneyToggle)}>Update Statistics for Attorney</Button>
                        }
                        {attorneyStatisticsIsVisble && contractResponsibleAttorneyId &&
                            <div className={s["StatisticsInfo-Box"]}>
                                <Statistics userId={contractResponsibleAttorneyId} updateStatisticsToggle={updateStatisticsForAttorneyToggle} />
                            </div>
                        }
                    </div>

                    <div className={s["StatisticsInfo-Col"]}>
                        {contractResponsibleLawFirmId && !lawFirmStatisticsIsVisble &&
                            <Button className={s["StatisticsInfo-Btn"]} variant="contained" color="primary" onClick={() => setLawFirmStatisticsIsVisble(true)}>Calculate Statistics for Law Firm</Button>
                        }
                        {lawFirmStatisticsIsVisble && lawFirmStatisticsIsVisble &&
                            <Button className={s["StatisticsInfo-Btn"]} variant="contained" color="primary" onClick={() => setUpdateStatisticsForLawFirmToggle(!updateStatisticsForLawFirmToggle)}>Update Statistics for Law Firm</Button>
                        }
                        {lawFirmStatisticsIsVisble && contractResponsibleLawFirmId &&
                            <div className={s["StatisticsInfo-Box"]}>
                                <Statistics userId={contractResponsibleLawFirmId} updateStatisticsToggle={updateStatisticsForLawFirmToggle} />
                            </div>
                        }
                    </div>

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