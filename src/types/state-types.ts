import { CorrectiveActionType, GoodCatchType, HighFiveType, Site, User } from '../reducers/app-store'

export type State = {
    orientation: string
    showSpinner: boolean
    isDarkMode: boolean
    image: string[]
    user: User
    goodCatchTypes: GoodCatchType[]
    highFiveTypes: HighFiveType[]
    users: User[]
    sites: Site[]
    correctiveActionTypes: CorrectiveActionType[]
}
