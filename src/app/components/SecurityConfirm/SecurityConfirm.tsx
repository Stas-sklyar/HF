import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { URL_FOR_API } from "../../constants/constants"
import actionsWithApi from "../../customHooks/actionsWithApi"
import { history } from '../../../App'
import { useDispatch } from "react-redux"
import { setContentToInfoPage } from "../../actions/actions"
import { CircularProgress } from "@material-ui/core"
import { getTokenAndEmailFromURL, TokenAndEmailDataFromURL } from "../../scripts/getTokenAndEmailFromLink"

export default function SecurityConfirm() {
    const dispatch = useDispatch()
    const location = useLocation()

    const confirmEmail = async (securityDataFromLink: TokenAndEmailDataFromURL) => {
        try {
            await actionsWithApi(
                "POST",
                URL_FOR_API + `/api/v1/Account/confirm-email?emailToken=${securityDataFromLink.token}&email=${securityDataFromLink.email}`,
                null
            )

            dispatch(setContentToInfoPage({
                title: "Congratulations!",
                textDescription: "You’ve successfully confirmed your email address. Now you will receive notifications through the HopeFunding platform.",
                hasInput: false,
                additionalBtn: true,
                buttonText: "Sign In",
                btnLink: "/login",
                contractSupportBtn: false
            }))
            history.push('/information-page')

        } catch (error) {
            dispatch(setContentToInfoPage({
                title: "Error!",
                textDescription: "Code was not found or expired!",
                hasInput: false,
                inputPlaceholder: "",
                additionalBtn: true,
                buttonText: "Go to Home page",
                btnLink: "/",
                contractSupportBtn: false
            }))
            history.push('/information-page')
        }
    }

    useEffect(() => {
        confirmEmail(getTokenAndEmailFromURL(location.search))
    }, [location])

    return (
        <div style={{ textAlign: "center", padding: 20 }}>
            <CircularProgress size={100} />
        </div>
    )
}