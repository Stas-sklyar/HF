import { Redirect, Route } from "react-router-dom"
import { useEffect } from "react"
import getCookie from "../../../scripts/getCookie"
import { useDispatch } from "react-redux"
import { setContentToInfoPage } from "../../../actions/actions"

type PrivateRoutePropsType = {
    children: any
    path: string
    userIsLogined: boolean
}

export default function PrivateRoute(props: PrivateRoutePropsType) {
    const dispatch = useDispatch()
    let userRole = ""
    let itIsAdministrator = getCookie("currentUserRole") === "Administrator"
    const setUserRole = () => {
        userRole = getCookie("currentUserRole") + ""
        itIsAdministrator = userRole === "Administrator"
    }

    useEffect(() => {
        setUserRole()
        if (!itIsAdministrator) {
            dispatch(setContentToInfoPage({
                title: "Limited Access!",
                textDescription: "You do not have access to this part of the platform. If you believe there is an error or need assistance, please contact support.",
                hasInput: false,
                additionalBtn: false,
                contractSupportBtn: true
            }))
        }
    }, [props.userIsLogined])

    return (
        <Route path={props.path}
            render={({ location }) =>
                itIsAdministrator ? (
                    props.children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/information-page",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}