import { Container } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { setNotificationInfo, toggleNotification } from '../../actions/actions'
import { URL_FOR_API } from '../../constants/constants'
import actionsWithApi from '../../customHooks/actionsWithApi'
import { InterestRateType } from '../../types/ratesType'
import AddBtn from '../shared/AddBtn/AddBtn'
import Preloader from '../shared/Preloader/Preloader'
import s from './InterestRatesList.module.scss'

export default function InterestRatesList() {
    const dispatch = useDispatch()
    const [interestRates, setInterestRates] = useState<Array<InterestRateType>>([])
    const [loaderIsActive, setLoaderIsActive] = useState<boolean>(false)

    const getInterestRates = async () => {
        try {
            setLoaderIsActive(true)
            let response = await actionsWithApi("GET", URL_FOR_API + "/api/v1/Interest/all?SortingType=asc")
            setInterestRates(response.data)
            setLoaderIsActive(false)
        }
        catch (error) {
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            dispatch(toggleNotification(true))
            console.log(error.message)
        }
    }
    useEffect(() => {
        getInterestRates()
    }, [])

    return (
        <Container maxWidth="lg" className={s["InterestRatesList"]} >
            <h1 className={s["InterestRatesList-Title"]}>Interest Rates by States</h1>

            <div className={s["InterestRatesList-Body"]}>
                <ul className={s["InterestRatesList-List"]}>
                    {loaderIsActive &&
                        <Preloader size="100" position="left" />
                    }
                    {interestRates.length > 0 && interestRates.map((interestRate: InterestRateType) => {
                        return (
                            <li key={interestRate.id} className={s["InterestRatesList-Item"]}>
                                <NavLink to={`/update-interest-rate?${interestRate.id}`}>{interestRate.state.name}</NavLink>
                            </li>
                        )
                    })}
                </ul>
                {interestRates.length === 0 && !loaderIsActive &&
                    <h2>None exist Interest Rate</h2>
                }

                <div className={s["InterestRatesList-AddBtn"]}>
                    <NavLink to="/create-new-interest-rate">
                        <AddBtn text="Add a set of interest rates" />
                    </NavLink>
                </div>
            </div>

        </Container>
    )
}
