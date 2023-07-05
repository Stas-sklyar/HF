import { URL_FOR_API } from "../constants/constants"
import actionsWithApi from "./actionsWithApi"

export default async function getStates() {
    try {
        let response = await actionsWithApi("GET", URL_FOR_API + "/api/v1/AdminState")
        return response.data
    }
    catch (error) {
        console.log(error.message)
    }
}