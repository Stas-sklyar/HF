export default function dateFormatting(srcDate: any) {
    const divider = "-"

    srcDate = srcDate + ""
    if(srcDate.length < 1 || !srcDate) {
        return ""
    }

    srcDate = srcDate + ""
    let cutDate = srcDate.split("").splice(0, 10).join("") + ""
    let year = cutDate.slice(0, 4)
    let month = cutDate.slice(5, 7)
    let dt = cutDate.slice(8, 10)
    return month + divider + dt + divider + year
}