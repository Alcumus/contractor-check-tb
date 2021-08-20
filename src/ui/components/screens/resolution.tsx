import React from 'react'

import { Button, SafeAreaView, Text, View } from 'react-native'
import { Card, Title } from 'react-native-paper'

import { gql, useQuery } from '@apollo/react-hooks'

import { addGoodCatchQuery } from '../../../lib/good-catch-queries'

addGoodCatchQuery('getGoodCatch2')

const getGoodCatch = gql`
    query getGoodCatch2($id: WfGoodCatchUid!) {
        wfGoodCatch(_id: $id) {
            description
            visibilityGroup
            actionRequired
            additionalDetails
            assignTo {
                _id
                firstName
                lastName
            }
            submittedByEmail
            assignTo_uid
            types {
                _id
                goodCatchType
            }
            types_uid
            typeCount
            totalCorrectiveActionsNeeded
            totalAssignedTo
            taskId
            submitter

            submittedOnSite_uid
            submittedDate
            submittedById_uid
            submittedById {
                firstName
                lastName
            }
        }
    }
`
export const Resolution = ({ navigation, route }) => {
    const { task } = route.params
    const { loading, error, data } = useQuery(getGoodCatch, {
        variables: { id: task.goodCatchId },
    })
    if (loading)
        return (
            <View>
                <Text>Loading</Text>
            </View>
        )
    if (error)
        return (
            <SafeAreaView>
                <Text>{JSON.stringify(error)}</Text>
            </SafeAreaView>
        )
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Title>{task.goodCatchId}</Title>
            <Card style={{ padding: 8 }}>
                <Title>Task Data </Title>
                <Text>{JSON.stringify(task)}</Text>
            </Card>
            <Card style={{ padding: 8 }}>
                <Title>Good Catch Data </Title>
                <Text>{JSON.stringify(data)}</Text>
            </Card>
            <Button onPress={() => navigation.goBack()} title="Dismiss" />
        </SafeAreaView>
    )
}
