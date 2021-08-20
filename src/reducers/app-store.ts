import { State } from '../types/state-types'
import { act } from 'react-test-renderer'
import { CorrectiveActionType, GoodCatchType } from '../types/good-catch-type'

export type StoreActionOrientation = {
    type: 'STORE_ORIENTATION'
    orientation: string
}

export type StoreActionShowSpinner = {
    type: 'STORE_ACTION_SHOW_SPINNER'
    showSpinner: boolean
}

export type StoreActionIsDarkMode = {
    type: 'STORE_ACTION_IS_DARK_MODE'
    isDarkMode: boolean
}

export type StoreActionAddImage = {
    type: 'STORE_ACTION_ADD_IMAGE'
    image: string
}
export type StoreActionChangeUser = {
    type: 'CHANGE_USER'
    user: User
}

// export type GoodCatchType = {
//     _id: string
//     description: string
//     goodCatchType: string
// }

export type HighFiveType = {
    _id: string
    description: string
    highFiveType: string
}

export type Site = {
    _id: string
    status: string
    siteName: string
}

export type User = {
    _id: string
    firstName: string
    lastName: string
    email: string
    primarySite?: Site | null
    primarySite_uid?: string | null
    supervisor?: User | null
    supervisor_uid?: string | null
    position?: { role: string }
}

// export type CorrectiveActionType = {
//     _id: string
//     description: string
//     correctiveActionType: string
// }

export type StoreMetadata = {
    type: 'STORE_METADATA'
    goodCatchTypes: GoodCatchType[]
    highFiveTypes: HighFiveType[]
    users: User[]
    sites: Site[]
    correctiveActionTypes: CorrectiveActionType[]
}

export const StateReducer = (
    state: State,
    action:
        | StoreActionOrientation
        | StoreActionShowSpinner
        | StoreActionIsDarkMode
        | StoreActionAddImage
        | StoreActionChangeUser
        | StoreMetadata
): State => {
    switch (action.type) {
        case 'STORE_ORIENTATION': {
            return {
                ...state,
                orientation: action.orientation,
            }
        }
        case 'STORE_ACTION_SHOW_SPINNER': {
            return {
                ...state,
                showSpinner: action.showSpinner,
            }
        }
        case 'STORE_ACTION_IS_DARK_MODE': {
            return {
                ...state,
                isDarkMode: action.isDarkMode,
            }
        }
        case 'STORE_ACTION_ADD_IMAGE': {
            const images = [...state.image]
            images.push(action.image)
            return {
                ...state,
                image: images,
            }
        }
        case 'CHANGE_USER': {
            return {
                ...state,
                user: action.user,
            }
        }
        case 'STORE_METADATA': {
            return {
                ...state,
                goodCatchTypes: action.goodCatchTypes,
                highFiveTypes: action.highFiveTypes,
                users: action.users,
                sites: action.sites,
                correctiveActionTypes: action.correctiveActionTypes,
            }
        }
        default:
            return state
    }
}
