import { useEffect, useState } from 'react'
import AddBtn from '../../shared/AddBtn/AddBtn'
import Preloader from '../../shared/Preloader/Preloader';
import s from './CasesAndClients.module.scss'

export default function CasesAndClients(props: any) {
    const [userData, setUserData] = useState(props.data)
    useEffect(() => {
        setUserData(props.data)
    }, [props])

    if (!props) {
        return (
            <Preloader size="100" position="center" />
        )
    }

    else {
        return (
            <section className={s["CasesAndClients"]}>
                <h1 className={s["CasesAndClients-Title"]}>Associated Cases and Clients</h1>
                {userData?.associatedContracts?.length === 0 &&
                    <h2 style={{ padding: "20px 0" }}>Cases not found</h2>
                }
                {userData.associatedContracts.length > 0 && 
                    <ul className={s["CasesAndClients-List"]}>
                        {userData?.associatedContracts?.map((item: any) => {
                            return (
                                <li className={s["CasesAndClients-Item"]} key={item.id}>
                                    <span>Case ID: <a href="/">{item.caseID}</a></span>
                                    <span>Client: <a href="/">{item.client}</a></span>
                                </li>
                            )
                        })}
                    </ul>
                }
                <AddBtn text="Add to Existing Case" />
            </section>
        )
    }
}
