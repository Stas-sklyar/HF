import { Container, Divider } from '@material-ui/core'
import s from './RatingController.module.scss'
import RatingControllerItem from './RatingControllerItem/RatingControllerItem'
import EditRatingWindow from './RatingControllerItem/EditRatingWindow/EditRatingWindow'
import { useEffect, useState } from 'react'
import { ratingItemType } from '../../types/ratingType'
import { setNotificationInfo, toggleNotification } from '../../actions/actions'
import { URL_FOR_API } from '../../constants/constants'
import actionsWithApi from '../../customHooks/actionsWithApi'
import { useDispatch } from 'react-redux'

export default function RatingController() {
    const dispatch = useDispatch()
    const [currentEditingRatingData, setCurrentEditingRatingData] = useState<Array<ratingItemType> | null>(null)
    const [currentEditingRatingTitle, setCurrentEditingRatingTitle] = useState<string>("")
    const [currentEditingRatingExplainer, setCurrentEditingRatingExplainer] = useState<string>("")
    const [ratingType, setRatingType] = useState<string>("")

    const [editRatingWindowIsOpen, setEditRatingWindowIsOpen] = useState<boolean>(false)
    const [ratingUpdated, setRatingUpdated] = useState<boolean>(false)

    const [avgTimetoClose, setAvgTimetoClose] = useState<Array<ratingItemType> | null>()
    const [totalLostCases, setTotalLostCases] = useState<Array<ratingItemType> | null>()
    const [avgCasesLost, setAvgCasesLost] = useState<Array<ratingItemType> | null>()
    const [totalReducedCases, setTotalReducedCases] = useState<Array<ratingItemType> | null>()
    const [percentCaseWithReduction, setPercentCaseWithReduction] = useState<Array<ratingItemType> | null>()
    const [percentReductionPerReducedCase, setPercentReductionPerReducedCase] = useState<Array<ratingItemType> | null>()
    const getRatingControllerData = async () => {
        try {
            await actionsWithApi("GET", URL_FOR_API + "/api/v1/UserRating/getAll/avgDaysClose")
                .then((response) => setAvgTimetoClose(response.data))
            await actionsWithApi("GET", URL_FOR_API + "/api/v1/UserRating/getAll/totalLostCases")
                .then((response) => setTotalLostCases(response.data))
            await actionsWithApi("GET", URL_FOR_API + "/api/v1/UserRating/getAll/avgCasesLost")
                .then((response) => setAvgCasesLost(response.data))
            await actionsWithApi("GET", URL_FOR_API + "/api/v1/UserRating/getAll/totalReducedCases")
                .then((response) => setTotalReducedCases(response.data))
            await actionsWithApi("GET", URL_FOR_API + "/api/v1/UserRating/getAll/percentCaseWithReduction")
                .then((response) => setPercentCaseWithReduction(response.data))
            await actionsWithApi("GET", URL_FOR_API + "/api/v1/UserRating/getAll/percentReductionPerReducedCase")
                .then((response) => setPercentReductionPerReducedCase(response.data))
        }
        catch (error) {
            dispatch(setNotificationInfo({ message: error.message, severity: "error" }))
            dispatch(toggleNotification(true))
        }
    }
    useEffect(() => {
        getRatingControllerData()
    }, [])
    useEffect(() => {
        !editRatingWindowIsOpen && ratingUpdated && getRatingControllerData() && setRatingUpdated(false)
    }, [editRatingWindowIsOpen])

    return (
        <Container maxWidth="lg" className={s["RatingControler"]} >
            <h1 className={s["RatingControler-Title"]}>User Rating Controller</h1>

            {avgTimetoClose &&
                <RatingControllerItem
                    title="Avg Days to Close"
                    explainer="Total days that a case was open for all Closed Cases DIVIDED BY Total Closed Cases"
                    ratingValueInTable="Number of days"
                    ratingData={avgTimetoClose}
                    setCurrentEditingRatingTitle={setCurrentEditingRatingTitle}
                    setCurrentEditingRatingExplainer={setCurrentEditingRatingExplainer}
                    setEditRatingWindowIsOpen={setEditRatingWindowIsOpen}
                    setCurrentEditingRatingData={setCurrentEditingRatingData}
                    ratingType="avgDaysClose"
                    setRatingType={setRatingType}
                />
            }
            <Divider />

            {totalLostCases &&
                <RatingControllerItem
                    title="Total Cases Lost"
                    explainer="Number of cases with status: Closed Case Lost and Closed Not Paid Off"
                    ratingValueInTable="Number of lost cases"
                    ratingData={totalLostCases}
                    setCurrentEditingRatingTitle={setCurrentEditingRatingTitle}
                    setCurrentEditingRatingExplainer={setCurrentEditingRatingExplainer}
                    setEditRatingWindowIsOpen={setEditRatingWindowIsOpen}
                    setCurrentEditingRatingData={setCurrentEditingRatingData}
                    ratingType="totalLostCases"
                    setRatingType={setRatingType}
                />
            }
            <Divider />

            {avgCasesLost &&
                <RatingControllerItem
                    title="% Cases Lost"
                    explainer="Total Cases Lost DIVIDED BY all closed cases"
                    ratingValueInTable="Number of lost cases"
                    ratingData={avgCasesLost}
                    setCurrentEditingRatingTitle={setCurrentEditingRatingTitle}
                    setCurrentEditingRatingExplainer={setCurrentEditingRatingExplainer}
                    setEditRatingWindowIsOpen={setEditRatingWindowIsOpen}
                    setCurrentEditingRatingData={setCurrentEditingRatingData}
                    ratingType="avgCasesLost"
                    setRatingType={setRatingType}
                />
            }
            <Divider />

            {totalReducedCases &&
                <RatingControllerItem
                    title="Total Reduced Cases"
                    explainer="Number of all cases with a Reduced Amount"
                    ratingValueInTable="Number of cases"
                    ratingData={totalReducedCases}
                    setCurrentEditingRatingTitle={setCurrentEditingRatingTitle}
                    setCurrentEditingRatingExplainer={setCurrentEditingRatingExplainer}
                    setEditRatingWindowIsOpen={setEditRatingWindowIsOpen}
                    setCurrentEditingRatingData={setCurrentEditingRatingData}
                    ratingType="totalReducedCases"
                    setRatingType={setRatingType}
                />
            }
            <Divider />

            {percentCaseWithReduction &&
                <RatingControllerItem
                    title="% of Cases with Reduction"
                    explainer="Total number of Reduced Cases DIVIDED BY Total Number of Closed Cases"
                    ratingValueInTable="% of Cases"
                    ratingData={percentCaseWithReduction}
                    setCurrentEditingRatingTitle={setCurrentEditingRatingTitle}
                    setCurrentEditingRatingExplainer={setCurrentEditingRatingExplainer}
                    setEditRatingWindowIsOpen={setEditRatingWindowIsOpen}
                    setCurrentEditingRatingData={setCurrentEditingRatingData}
                    ratingType="percentCaseWithReduction"
                    setRatingType={setRatingType}
                />
            }
            <Divider />

            {percentReductionPerReducedCase &&
                <RatingControllerItem
                    title="% Reduction Per Reduced Case"
                    explainer="((Total Amount Due MINUS AmountReduced) DIVIDED BY Total Amount Due) DIVIDED BY Total Reduced Cases"
                    ratingValueInTable="% of Cases"
                    ratingData={percentReductionPerReducedCase}
                    setCurrentEditingRatingTitle={setCurrentEditingRatingTitle}
                    setCurrentEditingRatingExplainer={setCurrentEditingRatingExplainer}
                    setEditRatingWindowIsOpen={setEditRatingWindowIsOpen}
                    setCurrentEditingRatingData={setCurrentEditingRatingData}
                    ratingType="percentReductionPerReducedCase"
                    setRatingType={setRatingType}
                />
            }


            {currentEditingRatingData &&
                <EditRatingWindow
                    title={currentEditingRatingTitle}
                    explainer={currentEditingRatingExplainer}
                    currentEditingRatingData={currentEditingRatingData}
                    setCurrentEditingRatingData={setCurrentEditingRatingData}
                    windowIsOpen={editRatingWindowIsOpen}
                    setWindowIsOpen={setEditRatingWindowIsOpen}
                    ratingType={ratingType}
                    setRatingUpdated={setRatingUpdated}
                />
            }

        </Container>
    )
}