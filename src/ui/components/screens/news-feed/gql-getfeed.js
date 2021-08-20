import { gql } from '@apollo/react-hooks'
import { addGoodCatchQuery } from '../../../../lib/good-catch-queries'

addGoodCatchQuery('getNewsFeed')
export const getFeed = gql`
    query getNewsFeed($skip: Int = 0) {
        wfHighFives(where: { submittedDate: { ne: null } }, order_by: { submittedDate: desc }, first: 8, skip: $skip) {
            rowCount
            edges {
                node {
                    _id
                    __typename
                    submittedDate
                    photos
                    assignTo {
                        _id
                        firstName
                        lastName
                        email
                    }
                    highFiveTypes {
                        _id
                        description
                        highFiveType
                    }
                    description
                    submittedById {
                        _id
                        firstName
                        lastName
                        email
                    }
                    like_uid
                    look_uid
                    strong_uid
                    notes_uid
                }
            }
        }
        wfGoodCatchResolutions(order_by: { resolvedOnDate: desc }, first: 8, skip: $skip) {
            rowCount
            edges {
                node {
                    _id
                    __typename
                    parentGoodCatchId: parentGoodCatchId_uid
                    submittedDate: resolvedOnDate
                    resolutionAttachments
                    resolvedBy {
                        _id
                        firstName
                        lastName
                        email
                    }
                    correctiveActionsTaken {
                        _id
                        description
                        correctiveActionType
                    }
                    description: resolutionNotes
                    submittedById {
                        _id
                        firstName
                        lastName
                        email
                    }
                    like_uid
                    look_uid
                    strong_uid
                    notes_uid
                }
            }
        }

        wfGoodCatches(
            first: 8
            skip: $skip
            order_by: { submittedDate: desc }
            where: { submittedDate: { ne: null }, assignTo_uid: { ne: null } }
        ) {
            rowCount
            edges {
                node {
                    _state
                    _id
                    __typename
                    actionRequired
                    severityLevel
                    submittedDate
                    assignTo {
                        _id
                        firstName
                        lastName
                        email
                    }
                    attachments
                    correctiveActions {
                        _id
                        correctiveActionType
                    }
                    description
                    types_uid
                    types {
                        _id
                        goodCatchType
                    }
                    submittedById {
                        _id
                        firstName
                        lastName
                        email
                    }
                    like_uid
                    look_uid
                    strong_uid
                    notes_uid
                }
            }
        }
    }
`
