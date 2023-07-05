import { convertFileToBase64 } from './toBase64'
import actionsWithApi from '../customHooks/actionsWithApi'
import { URL_FOR_API } from "../constants/constants"

export const uploadDocument = async (files: any, contractId: number, documentType: number) => {
    const file = files[0]

    const fileInBase64 = await convertFileToBase64(file)
    let uploadDocumentData = {
        type: documentType,
        mimeType: file.type,
        fileName: file.name,
        documentBase64String: fileInBase64
    }

    try {
        let response = await actionsWithApi("POST", URL_FOR_API + `/api/v1/Contract/${contractId}/uploadDocument`, uploadDocumentData)
        return true
    }
    catch (error) {
        console.log(error.message)
        return false
    }
}