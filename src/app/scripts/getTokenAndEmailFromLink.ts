export type TokenAndEmailDataFromURL = {
    token: string
    email: string
}

export function getTokenAndEmailFromURL(searchQueryStr: string): TokenAndEmailDataFromURL {
    let securityDataFromLink = {
        token: "",
        email: ""
    }

    let searchQueriesArr = searchQueryStr.slice(1, searchQueryStr.length).split('&')
    securityDataFromLink = {
        token: searchQueriesArr[0].split("=")[1],
        email: searchQueriesArr[1].split("=")[1]
    }

    return securityDataFromLink
}