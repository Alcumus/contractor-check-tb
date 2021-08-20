import React, { useContext } from 'react'

import format from 'date-fns/format'
import toDate from 'date-fns/toDate'
import { FlatList, Pressable, Text, View } from 'react-native'
import { Card, Paragraph } from 'react-native-paper'

import { useQuery } from '@apollo/react-hooks'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { useNavigation } from '@react-navigation/core'

import StateContext from '../../../context/state-context'
import { StdButton } from '../buttons/std-button'
import { Box } from '../styles/BoxTheme'
import { UserAvatarAndName } from '../user/UserAvatar'
import { GetScaledFactorX } from '../utils/dimensions-helper'
import { Flex } from '../utils/flex'

const JobDescription = ({ role }) => <Text style={{ fontSize: 11, color: '#676F74' }}>{role}</Text>

// Note tile
const NoteCard = ({ note, parentItem }) => {
    const { state } = useContext(StateContext)
    const { user } = state
    const navigation = useNavigation()
    const isVisible = user._id === note.submittedByUser._id
    const handleNavigate = () => {
        if (isVisible) {
            navigation.navigate('NoteForm', { note, parentItem })
        }
    }
    return (
        <Pressable onPress={handleNavigate}>
            <Card>
                <Box m={'m'}>
                    <Flex justifyContent={'space-between'}>
                        <Text style={{ fontSize: 12, color: '#676F74' }}>
                            {format(toDate(new Date(note._created)), 'MMM dd yyyy, p')}
                        </Text>
                        {isVisible && <FontAwesomeIcon color={'gray'} size={GetScaledFactorX(14)} icon={faEllipsisV} />}
                    </Flex>
                    <Box mt={'s'} mb={'s'}>
                        <Paragraph>{note.note}</Paragraph>
                    </Box>
                    <UserAvatarAndName
                        avatarSize={34}
                        email={note.submittedByUser.email}
                        meta={<JobDescription role={note.submittedByUser.role.role} />}
                    />
                </Box>
            </Card>
        </Pressable>
    )
}

const sortByDate = (a, b) => (a._created > b._created ? -1 : a._created > b._created ? 1 : 0)

export const NotesPage = ({ parent, query, queryKey }) => {
    const navigation = useNavigation()
    const { loading, error, data, refetch } = useQuery(query, {
        variables: { id: parent._id },
    })

    if (loading) return null
    if (error) return null

    const { notes = [] } = data?.[queryKey] || {}
    const sortedNotes = notes?.filter(Boolean).sort(sortByDate)

    return (
        <View style={{ flex: 1 }}>
            {sortedNotes?.length > 0 ? (
                <View style={{ flex: 1 }}>
                    <Flex
                        style={{
                            padding: 8,
                            marginLeft: 8,
                            marginRight: 8,
                        }}
                    >
                        <StdButton
                            backgroundStyle={{
                                backgroundColor: '#13599A',
                                width: '100%',
                                marginTop: 8,

                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            labelColor={'white'}
                            label="Add Note"
                            callBack={() => navigation.navigate('NoteForm', { parentItem: parent })} // creates need the parent to bind the notes too
                        />
                    </Flex>
                    <FlatList
                        refreshing={loading}
                        onRefresh={refetch}
                        data={sortedNotes}
                        style={{ marginTop: 8, marginBottom: 100, flex: 1 }}
                        keyExtractor={(item, ix) => {
                            return item._id + ix
                        }}
                        renderItem={({ item }) => <NoteCard note={item} parentItem={parent} />}
                    />
                </View>
            ) : (
                <Flex
                    style={{
                        padding: 8,
                        height: 200,
                    }}
                >
                    <StdButton
                        backgroundStyle={{
                            backgroundColor: '#13599A',
                            width: '50%',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        labelColor={'white'}
                        label="Add Note"
                        callBack={() => navigation.navigate('NoteForm', { parentItem: parent })} // creates need the parent to bind the notes too
                    />
                </Flex>
            )}
        </View>
    )
}
