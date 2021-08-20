import { gql } from '@apollo/react-hooks'
import { addGoodCatchQuery } from '../../../../lib/good-catch-queries'

addGoodCatchQuery('getGoodCatch')

export const getGoodCatch = gql`
    query getGoodCatch($id: WfGoodCatchUid!) {
        wfGoodCatch(_id: $id) {
            _id
            __typename
            submittedDate
            actionRequired
            _state
            severityLevel

            assignTo {
                _id
                firstName
                lastName
                email
            }
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
        }
    }
`
