import { combineReducers } from 'redux'
import { createContractAttorneyReducer } from './createContractAttorneyReducer'
import { registrationReducer } from './registrationReducer'
import { loginReducer } from './loginReducer'
import { editUserReducer } from './editUserReducer'
import { editContractReducer } from './editContractReducer'
import { generalNotificationReducer } from './generalNotificationReducer'
import { informationPageReducer } from './informationPageReducer'
import { createUserReducer } from './createUserReducer'
import { createPlaintiffReducer } from './createPlaintiffReducer'
import { createAttorneyReducer } from './createAttorneyReducer'
import { statesReducer } from './statesReducer'

export const rootReducer = combineReducers({
    registration: registrationReducer,
    login: loginReducer,
    createUser: createUserReducer,
    createContractAttorney: createContractAttorneyReducer,
    createdPlaintiffData: createPlaintiffReducer,
    createdAttorneyfData: createAttorneyReducer,
    editUserPage: editUserReducer,
    editContract: editContractReducer,
    notification: generalNotificationReducer,
    infoPage: informationPageReducer,
    states: statesReducer
})

export type RootState = ReturnType<typeof rootReducer>