import React, { Dispatch } from 'react'
import {
    StoreActionOrientation,
    StoreActionShowSpinner,
    StoreActionIsDarkMode,
    StoreActionAddImage,
} from '../reducers/app-store'
import { State } from '../types/state-types'

export type StateContext = {
    state: State
    stateDispatch:
        | Dispatch<StoreActionOrientation>
        | Dispatch<StoreActionShowSpinner>
        | Dispatch<StoreActionIsDarkMode>
        | Dispatch<StoreActionAddImage>
}

export const StateContext = React.createContext({} as StateContext)
export default StateContext
