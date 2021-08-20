import { gql } from "@apollo/react-hooks";

export const createGoodCatch = gql`
    mutation createWfGoodCatch(
        $submittedOnSite: WfSiteUid!
        $dueDate: Date
        $actionRequired: YesNoBoolean
        $additionalDetails: String
        $assignTo_uid: [WfUserUid]
        $urls: [URL]
        $correctiveActions_uid: [WfCorrectiveActionTypeUid]
        $description: String
        $isPublic: String
        $severityLevel: String
        $submittedByEmail: String
        $submittedById_uid: WfUserUid
        $submittedDate: Date
        $types_uid: [WfGoodCatchTypeUid]
        $visibilityGroup: String
    ) {
        createWfGoodCatch(
            record: {
                submittedOnSite_uid: $submittedOnSite
                dueDate: $dueDate
                actionRequired: $actionRequired
                additionalDetails: $additionalDetails
                assignTo_uid: $assignTo_uid
                attachments: $urls
                correctiveActions_uid: $correctiveActions_uid
                description: $description
                isPublic: $isPublic
                severityLevel: $severityLevel
                submittedByEmail: $submittedByEmail
                submittedById_uid: $submittedById_uid
                submittedDate: $submittedDate
                types_uid: $types_uid
                visibilityGroup: $visibilityGroup
            }
            commit: true
            asUser: $submittedByEmail
        ) {
            _id
            error
        }
    }
`;
export const setGoodCatchState = gql`
    mutation setGoodCatchState($id: WfGoodCatchUid!, $state: WfGoodCatchState, $submittedByEmail: String) {
        setWfGoodCatch(_id: $id, _state: $state, commit: true, asUser: $submittedByEmail) {
            ok
        }
    }
`;
export const updateGoodCatch = gql`
    mutation updateGoodCatch(
        $id: WfGoodCatchUid!
        $dueDate: Date
        $actionRequired: YesNoBoolean
        $additionalDetails: String
        $assignTo_uid: [WfUserUid]
        $urls: [URL]
        $correctiveActions_uid: [WfCorrectiveActionTypeUid]
        $description: String
        $isPublic: String
        $severityLevel: String
        $submittedByEmail: String
        $submittedById_uid: WfUserUid
        $types_uid: [WfGoodCatchTypeUid]
        $visibilityGroup: String
    ) {
        setWfGoodCatch(
            _id: $id
            record: {
                dueDate: $dueDate
                actionRequired: $actionRequired
                additionalDetails: $additionalDetails
                assignTo_uid: $assignTo_uid
                attachments: $urls
                correctiveActions_uid: $correctiveActions_uid
                description: $description
                isPublic: $isPublic
                severityLevel: $severityLevel
                submittedByEmail: $submittedByEmail
                submittedById_uid: $submittedById_uid
                types_uid: $types_uid
                visibilityGroup: $visibilityGroup
            }
            commit: true
            asUser: $submittedByEmail
        ) {
            ok
            error
            fieldErrors {
                field
                error
            }
        }
    }
`;
