import { gql } from '@apollo/react-hooks'
import { addGoodCatchQuery } from '../../../lib/good-catch-queries'

export const getMetadata = gql`
    query getMetadata {
        sites: wfSites {
            edges {
                node {
                    _id
                    siteName
                    status
                }
            }
        }
        users: wfUsers(order_by: { lastName: asc }) {
            edges {
                node {
                    _id
                    firstName
                    lastName
                    email
                    position: role {
                        role
                    }
                    primarySite_uid
                    primarySite {
                        siteName
                    }
                }
            }
        }
        goodCatchTypes: wfGoodCatchTypes {
            edges {
                node {
                    _id
                    goodCatchType
                    description
                }
            }
        }
        highFiveTypes: wfHighFiveTypes {
            edges {
                node {
                    _id
                    highFiveType
                    description
                }
            }
        }
        correctiveActions: wfCorrectiveActionTypes(first: 100, order_by: { correctiveActionType: asc }) {
            edges {
                node {
                    description
                    correctiveActionType
                    _id
                }
            }
        }
    }
`

export const getAllSites = gql`
    query getAllSites {
        wfSites {
            edges {
                node {
                    _id
                    siteName
                    status
                }
            }
        }
    }
`

export const getUsersAtUserSite = gql`
    query getMySite {
        wfSite(_id: HwpNHIOoMZ) {
            _id
            siteName
            status
            wfUsersJoinedOnPrimarySite(order_by: { lastName: asc }) {
                edges {
                    node {
                        firstName
                        lastName
                        primarySite_uid
                        primarySite {
                            siteName
                        }
                    }
                }
            }
        }
    }
`

export const combinedPersonPicker = gql`
    query combinedPersonPicker($site: WfSiteUid!, $user: WfUserUid!) {
        userSite: wfSite(_id: $site) {
            _id
            siteName
            usersAtSite: wfUsersJoinedOnPrimarySite(order_by: { lastName: asc }) {
                edges {
                    node {
                        _id
                        firstName
                        lastName
                        email
                        position: role {
                            role
                        }
                    }
                }
            }
        }
        user: wfUser(_id: $user) {
            _id
            firstName
            lastName
            email
            position: role {
                role
            }
            _id
            supervisor {
                peers: wfUsersJoinedOnSupervisor(order_by: { lastName: asc }) {
                    edges {
                        node {
                            _id
                            firstName
                            lastName
                            email
                            position: role {
                                role
                            }
                        }
                    }
                }
            }
            subordinates: wfUsersJoinedOnSupervisor {
                edges {
                    node {
                        _id
                        firstName
                        lastName
                        email
                        position: role {
                            role
                        }
                    }
                }
            }
        }
    }
`

export const getAllUsers = gql`
    query getAllUsers {
        wfUsers(order_by: { lastName: asc }) {
            edges {
                node {
                    _id
                    firstName
                    lastName
                    email
                    position: role {
                        role
                    }
                    primarySite_uid
                    primarySite {
                        siteName
                    }
                }
            }
        }
    }
`

addGoodCatchQuery('getGoodCatch')

export const getGoodCatch = gql`
    query getGoodCatch($id: WfGoodCatchUid!) {
        wfGoodCatch(_id: $id) {
            _id
            _state
            description
            attachments
            visibilityGroup
            actionRequired
            additionalDetails
            assignTo {
                _id
                firstName
                lastName
                email
                position: role {
                    role
                }
            }
            submittedByEmail
            assignTo_uid
            types {
                _id
                goodCatchType
            }
            types_uid
            typeCount
            severityLevel
            dueDate
            taskId {
                _id
                severityLevel
            }
            totalCorrectiveActionsNeeded
            totalAssignedTo
            correctiveActions {
                _id
                correctiveActionType
            }
            submitter
            submittedOnSite_uid
            submittedDate
            submittedById_uid
            like_uid
            look_uid
            strong_uid
            notes_uid
            resolvedById {
                firstName
                lastName
                email
                position: role {
                    role
                }
            }
            submittedById {
                _id
                firstName
                lastName
                email
                role {
                    role
                }
            }
        }
    }
`
addGoodCatchQuery('overdueTodayScreenTasks')
export const GET_TASKS = gql`
    query overdueTodayScreenTasks($user: [String]!) {
        due: taskTodayScreens(
            where: {
                _and: [
                    { assignee_uid: { eq: $user } }
                    { dueDate: { lt: "end of this week" } }
                    { dueDate: { gte: "beginning of this week" } }
                ]
            }
        ) {
            rowCount
        }
        done: taskTodayScreens(
            where: {
                _and: [
                    { _state: { eq: Done } }
                    { assignee_uid: { eq: $user } }
                    { dueDate: { lt: "end of this week" } }
                    { dueDate: { gte: "beginning of this week" } }
                ]
            }
        ) {
            rowCount
        }
        all: taskTodayScreens(
            where: {
                _and: [
                    { _state: { eq: Done } }
                    { assignee_uid: { eq: $user } }
                    { _modified: { gte: "beginning of this week" } }
                    { _modified: { lt: "end of this week" } }
                ]
            }
        ) {
            rowCount
        }

        overdueTasks: taskTodayScreens(
            where: {
                _state: { ne: Done }
                assignee_uid: { eq: $user }
                dueDate: { gte: "Two months ago", lte: "End of yesterday" }
                taskDescription: { ne: "" }
            }
            order_by: { dueDate: asc }
        ) {
            rowCount
            edges {
                node {
                    _id
                    dueDate
                    taskType
                    taskDescription
                    actionText
                    assignee_uid
                    goodCatchId
                    severityLevel
                    __typename
                    actionRequired: _derive(expression: "{goodCatchId.actionRequired}")
                }
            }
        }
        dueTodayTasks: taskTodayScreens(
            where: {
                _state: { ne: Done }
                assignee_uid: { eq: $user }
                dueDate: { gte: "End of yesterday", lte: "End of today" }
            }
            order_by: { dueDate: asc }
        ) {
            rowCount
            edges {
                node {
                    _id
                    dueDate
                    taskType
                    taskDescription
                    actionText
                    assignee_uid
                    goodCatchId
                    severityLevel
                    __typename
                    actionRequired: _derive(expression: "{goodCatchId.actionRequired}")
                }
            }
        }
        upcomingTasks: taskTodayScreens(
            where: {
                _state: { ne: Done }
                assignee_uid: { eq: $user }
                dueDate: { gte: "End of today", lte: "Two weeks from tomorrow" }
            }
            order_by: { dueDate: asc }
        ) {
            rowCount
            edges {
                node {
                    _id
                    dueDate
                    taskType
                    taskDescription
                    actionText
                    assignee_uid
                    goodCatchId
                    severityLevel
                    __typename
                    actionRequired: _derive(expression: "{goodCatchId.actionRequired}")
                }
            }
        }
    }
`

export const goodCatchTypes = gql`
    query goodCatchTypes {
        goodCatchTypes: wfGoodCatchTypes {
            edges {
                node {
                    _id
                    goodCatchType
                    description
                }
            }
        }
    }
`

export const getCorrectiveActions = gql`
    query getCorrectiveActions {
        wfCorrectiveActionTypes(first: 100, order_by: { correctiveActionType: asc }) {
            edges {
                node {
                    description
                    correctiveActionType
                    _id
                }
            }
        }
    }
`
export const createHighFive = gql`
    mutation createWfHighFive(
        $highFiveTypes: [WfHighFiveTypeUid]
        $assignTo_uid: [WfUserUid!]
        $description: String
        $isPublic: String
        $photos: [URL]
        $selectedVisibilityGroup: String
        $submittedByEmail: String
        $submittedBy_uid: WfUserUid
        $submittedDate: Date
        $submittedOnSite_uid: WfSiteUid
    ) {
        createWfHighFive(
            record: {
                highFiveTypes_uid: $highFiveTypes
                assignTo_uid: $assignTo_uid
                description: $description
                isPublic: $isPublic
                photos: $photos
                selectedVisibilityGroup: $selectedVisibilityGroup
                submittedByEmail: $submittedByEmail
                submittedById_uid: $submittedBy_uid
                submittedDate: $submittedDate
                submittedOnSite_uid: $submittedOnSite_uid
            }
            commit: true
            asUser: $submittedByEmail
        ) {
            _id
            error
            fieldErrors {
                field
                error
            }
        }
    }
`

export const getHighFive = gql`
    query getHighFive($id: WfHighFiveUid!) {
        wfHighFive(_id: $id) {
            _id
            description
            photos
            selectedVisibilityGroup
            assignTo {
                _id
                firstName
                lastName
                email
                position: role {
                    role
                }
            }
            submittedByEmail
            assignTo_uid
            highFiveTypes {
                _id
                highFiveType
            }
            highFiveTypes_uid
            typeCount
            totalAssignedTo
            submittedOnSite_uid
            submittedDate
            submittedById_uid
            like_uid
            look_uid
            strong_uid
            notes_uid
            submittedById {
                _id
                firstName
                lastName
                email
                role {
                    role
                }
            }
        }
    }
`
