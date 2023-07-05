import { useEffect } from "react"
import { history } from "../../../App"
import getCookie from "../../scripts/getCookie"

export default function Home() {
    let currentUserId: string | undefined = getCookie("currentUserId")

    useEffect(() => {
        history.push(`/user-profile?${currentUserId}`)
    }, [])
    return (
        <div></div>
    )
}
