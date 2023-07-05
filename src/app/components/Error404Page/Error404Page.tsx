import { Button, Container } from '@material-ui/core'
import { NavLink } from 'react-router-dom'
import WarningIcon from '@material-ui/icons/Warning'
import getCookie from "../../scripts/getCookie";

export default function Error404Page() {
    let currentUserId: string | undefined = getCookie("currentUserId")

    return (
        <Container maxWidth="lg" style={{textAlign: "center", padding: "70px 0"}} >
            <WarningIcon fontSize="large" className="PrimaryIcon" />

            <h1 style={{textAlign: "center", marginBottom: "50px"}} >It looks like the page doesn't exist</h1>

            <NavLink to={`/user-profile?${currentUserId}`} style={{textDecoration: "none"}}>
                <Button variant="contained" color="primary">Go To Homepage</Button>
            </NavLink>
        </Container>
    )
}
