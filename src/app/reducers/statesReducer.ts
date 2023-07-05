import { ActionsTypes } from "../actions/actions"
import { StatesType } from "../types/stateType"


const initialState: Array<StatesType> = []

export const statesReducer = (state = initialState, action: ActionsTypes): Array<StatesType> => {
    switch (action.type) {
        case 'SET_ALL_STATES_TO_STORE':
            return [...initialState, ...action.payload]
        default:
            return state;
    }
};
