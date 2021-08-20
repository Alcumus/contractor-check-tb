type AssignTo = {
    _id: string
    firstName: string
    lastName: string
    email: string
    position: {
        role: string
    }
}

export type GoodCatchType = {
    _id: string
    description: string
    goodCatchType: string
    status: string | boolean
}

type Roll = {
    roll: string // ????
}

export type TaskId = {
    _id: string
    severityLevel: string
}

export type CorrectiveActionType = {
    _id: string
    description: string
    correctiveActionType: string
}

export type CorrectiveAction = {
    _id: string
    description: string
    status: string | boolean
    correctiveActionType: string
}

type SubmittedById = {
    _id: string
    firstName: string
    lastName: string
    email: string
    role: Roll
}

export type GoodCatch = {
    _id: string
    description: string
    attachments: string[] // ???
    visibilityGroup: boolean
    actionRequired: boolean
    additionalDetails: string
    assignTo: AssignTo
    submittedByEmail: string
    assignTo_uid: string
    types: GoodCatchType[]
    types_uid: string
    typeCount: number
    taskId: TaskId
    totalCorrectiveActionsNeeded: number
    totalAssignedTo: number
    correctiveActions: CorrectiveAction[]
    submitter: string
    submittedOnSite: boolean
    submittedDate: string
    submittedById_uid: string
    submittedById: SubmittedById
}
