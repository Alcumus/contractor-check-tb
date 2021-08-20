import React, { useContext, useState } from 'react'
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native'
import { globalStyles } from '../styles/base-styles'
import Config from '../../../config/config'
import { Header } from '../header/header'
import { burgerMenu } from './burger-menu'
import { Card, Switch } from 'react-native-paper'
import { useQuery } from '@apollo/react-hooks'
const { theme } = Config

import { combinedPersonPicker } from './tempApi'
import { UserAvatar } from '../user/UserAvatar'
import { User } from '../user/profile'
import { Search } from '../search/search'
import intersectionBy from 'lodash-es/intersectionBy'
import { find } from 'lodash'
import StateContext from '../../../context/state-context'
import { uniqBy } from 'lodash-es'

type UserCardProps = {
    callback: (isSelectedUser: boolean, user: User) => void
    isSelected: boolean
    item: User
}

const UserCard = (props: UserCardProps) => {
    const { firstName, lastName, position, email } = props.item
    const { callback, isSelected = false } = props

    const switchiOS = (
        <View style={globalStyles.paddingRightM}>
            <Switch
                onValueChange={(flag) => {
                    console.log('LOG>>>', JSON.stringify(flag))
                    callback(flag, props.item)
                }}
                color="black"
                value={isSelected === true ? true : false}
            />
        </View>
    )

    return (
        <Pressable onPress={() => callback(!isSelected, props.item)}>
            <Card.Title
                title={`${firstName} ${lastName}`}
                titleStyle={globalStyles.sizeSText}
                subTitleStyle={globalStyles.sizeXXsText}
                subtitle={position?.role}
                left={(props) => <UserAvatar email={email} {...props} />}
                right={() => switchiOS}
            />
        </Pressable>
    )
}

type Props = {
    filter?: string
    selectedUsers?: User[]
    callbackWithAllSelectedUsers: (users: User[]) => void
}

export const UserSelect = (props: Props): JSX.Element => {
    const { callbackWithAllSelectedUsers, selectedUsers = [], filter = '' } = props
    const ids: Record<string, boolean> = {}
    const [userTeam, userPeers, userSiteMates] = useUserSelector()
    const commonFolkAllAndPeers = intersectionBy(userSiteMates?.data, userPeers?.data, '_id')
    const commonFolkTeamAndPeers = intersectionBy(userTeam?.data, userPeers?.data, '_id')

    // Do we need Team and All ???

    const teamUsers = userTeam
    const siteUsers = userSiteMates
    const peerUsers = userPeers

    if (commonFolkAllAndPeers.length) {
        siteUsers.data = userSiteMates?.data?.filter(
            (user: User) => !commonFolkAllAndPeers.find((cp: User) => cp._id === user._id)
        )
    }
    if (commonFolkTeamAndPeers.length) {
        peerUsers.data = userPeers.data.filter(
            (user: User) => !commonFolkTeamAndPeers.find((cp: User) => cp._id === user._id)
        )
    }

    const allUsers = [userTeam, peerUsers].filter(Boolean)

    selectedUsers.forEach((user: User) => {
        ids[user._id] = true
    })

    const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>(ids)

    const callbackUser = (isSelected: boolean, user: User) => {
        const newIds = { ...selectedIds }
        if (isSelected === false) {
            if (newIds[user._id]) {
                delete newIds[user._id]
            }
        } else {
            newIds[user._id] = isSelected
        }

        setSelectedIds(newIds)

        const selectedUsers: User[] = [
            ...allUsers
                .map((group) => group.data.filter((fUser: User) => newIds[fUser._id] && newIds[fUser._id] === true))
                .flat(Infinity),
        ]
        callbackWithAllSelectedUsers(uniqBy(selectedUsers, '_id'))
    }

    const filterUsers = (content: any, keyString: string, filter: string) => {
        if (!content[0].data) {
            return []
        }
        const lowerCase = filter.toLocaleLowerCase().trim()
        const searchTerms = lowerCase.split(' ')

        const filteredData = []
        content.forEach((section) => {
            const sectionData = section.data.reduce((acc: User[], item: User): User[] => {
                const searchFilter = (term: string) => {
                    if (
                        item[keyString] &&
                        typeof item[keyString] === 'string' &&
                        (item[keyString] as string).toLowerCase().indexOf(term) > -1
                    ) {
                        acc.push(item)
                    }
                }
                searchTerms.forEach((term: string) => searchFilter(term))
                return acc
            }, [])
            filteredData.push({ data: [...sectionData], title: section.title })
        })
        return filteredData
    }

    return (
        <Search
            keyString={'firstName'}
            content={allUsers}
            filter={filter}
            fn={filterUsers}
            render={(filteredContent: User[]) => {
                return (
                    <SectionList
                        sections={userTeam.data ? filteredContent : []}
                        style={{ ...globalStyles.marginTopM }}
                        stickySectionHeadersEnabled={true}
                        keyExtractor={(user, index) => user.firstName + index}
                        renderItem={(row) => {
                            const { _id }: { _id: string } = row.item
                            const isSelected = selectedIds[_id]
                            return <UserCard item={row.item} callback={callbackUser} isSelected={isSelected} />
                        }}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text
                                style={{
                                    ...globalStyles.sizeXsText,
                                    ...globalStyles.uppercase,
                                    color: '#263238CC',
                                    backgroundColor: '#F2F2F2',
                                }}
                            >
                                {title}
                            </Text>
                        )}
                    />
                )
            }}
        />
    )
}

export const useUserSelector = (): any => {
    const {
        state: { user: currentUser },
    } = useContext(StateContext)
    const { loading, error, data } = useQuery(combinedPersonPicker, {
        variables: { site: currentUser.primarySite_uid, user: currentUser._id },
    })

    if (loading === true || data === undefined) {
        return [[], [], []]
    }

    const { userSite, user } = data
    const { usersAtSite } = userSite
    const peers = user.supervisor?.peers
    const subordinates = user.subordinates

    const userTeam = {
        title: 'Your Team',
        data: subordinates?.edges?.map(({ node }) => ({ ...node })) ?? [],
    }
    const userPeers = {
        title: 'Your Peers',
        data: peers?.edges?.map(({ node }) => ({ ...node })) ?? [],
    }
    const userSiteMates = {
        title: 'All on this site',
        data: usersAtSite?.edges?.map(({ node }) => ({ ...node })) ?? [],
    }

    return [
        !!userTeam.data.length && userTeam,
        !!userPeers.data.length && userPeers,
        !!userSiteMates.data.length && userSiteMates,
    ].filter(Boolean)
}

export const Insights = () => {
    return (
        <View style={styles.root}>
            <Header label="Insights" startAdornment={burgerMenu} style={globalStyles.marginHorizontalS} />
            <View style={[globalStyles.marginHorizontalM, globalStyles.fullHeight, { backgroundColor: '#F2F2F2' }]}>
                <UserSelect callbackWithAllSelectedUsers={(users) => console.log(users)} selectedUsers={[]} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        ...globalStyles.full100,
        backgroundColor: theme.alcBrand001,
    },
})
