import { gql, useQuery } from '@apollo/react-hooks'
import React, { useContext } from 'react'
import StateContext from './src/context/state-context'
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native'
import { List, Title } from 'react-native-paper'
import { UserAvatar } from './src/ui/components/user/UserAvatar'
import { DebugInfo } from './src/ui/components/debug/info'

const getUsers = gql`
    query getAllUsers {
        wfUsers(order_by: { lastName: asc }, first: 100) {
            edges {
                node {
                    _id
                    firstName
                    lastName
                    email
                    primarySite_uid
                    role {
                        role
                    }
                }
            }
        }
    }
`
export const UserList = ({ navigation }) => {
    const { state, stateDispatch } = useContext(StateContext)
    const { user } = state
    const { loading, error, data = [] } = useQuery(getUsers)
    if (loading) return null
    if (error) {
        console.error(error)
    }
    if (error) return null
    const users = data.wfUsers.edges.map(({ node }) => ({ ...node })).filter((item) => item.firstName && item.lastName)
    const setUser = (user) => {
        stateDispatch({ type: 'CHANGE_USER', user })
        navigation.closeDrawer()
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{ padding: 16 }}>
                    <Title>
                        <Text>Users</Text>
                    </Title>

                    {users.map((item) => (
                        <Pressable key={item._id} onPress={() => setUser(item)}>
                            <List.Item
                                style={{ backgroundColor: item._id === user._id ? '#EDEDED' : 'white' }}
                                key={item._id}
                                title={`${item.firstName} ${item.lastName}`}
                                description={`${item.role.role}`}
                                left={(props) => <UserAvatar email={item.email} {...props} />}
                            />
                        </Pressable>
                    ))}
                </View>
                <View style={{ padding: 16 }}>
                    <DebugInfo />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
