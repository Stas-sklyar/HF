import axios from 'axios'
import getCookie from '../scripts/getCookie'

const actionsWithApi = async(method, url, data) => {
    let token = getCookie("token")
    let response = await axios({
        method: method,
        url: url,
        data: data && JSON.stringify(data),
        headers: token ? {
            'Authorization': 'Bearer ' + token,
            'Access-Control-Allow-Origin': '*',
            'content-type': 'application/json; charset=utf-8',
        } : { 'Content-Type': 'application/json', 'Accept': '*/* ', 'Access-Control-Allow-Origin': '*' },
        withCredentials: true,
    })

    return response
}

export default actionsWithApi