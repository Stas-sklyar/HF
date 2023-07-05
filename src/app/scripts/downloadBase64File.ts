import { dataURLtoFile } from "./dataURLToFile"

export const downloadBase64File = (mimeType: string, base64Content: string, fileName: string) => {
    let file = dataURLtoFile(`data:${mimeType};base64,${base64Content}`, fileName)
    let blob = file
    let link = document.createElement('a')
    document.body.appendChild(link)
    link.download = fileName
    link.href = window.URL.createObjectURL(blob)
    link.click()
    document.body.removeChild(link)
}