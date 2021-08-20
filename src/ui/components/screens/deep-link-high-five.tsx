import React, { useState } from 'react'

import format from 'date-fns/format'
import toDate from 'date-fns/toDate'
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Card, Subheading } from 'react-native-paper'

import { gql, useQuery } from '@apollo/react-hooks'

import { ensureArray } from '../../../lib/ensure-array'
import { Header } from '../header/header'
import { globalStyles } from '../styles/base-styles'
import { Tabs } from '../tabs/tabs'
import { UserAvatarAndNameChip } from '../user/UserAvatar'
import { StandardAvatarRow, StandardDivider, StandardInfoRow, ThingAndCountAndChipArray } from './detail-components'
import { relativePath } from './news-feed/feed-cards'
import { Reactions } from './news-feed/reactions'
import { NotesPage } from './notes.js'
import { getHighFive } from './tempApi'
import { GoBackButton } from './tool-box/goBackButton'
import CachedImage from 'react-native-image-cache-wrapper'

export const getHighFiveNotes = gql`
    query getHighFiveNotes($id: WfHighFiveUid!) {
        wfHighFive(_id: $id) {
            __typename
            _id
            notes {
                _id
                _created
                note
                submittedByUser {
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
    }
`

const TabA = ({ item, data = {} }) => {
    const { wfHighFive = {} } = data

    const images = wfHighFive?.photos
    const width = Dimensions.get('window').width

    const result = format(toDate(new Date(wfHighFive?.submittedDate ?? Date.now())), 'MMM dd yyyy, p')
    return (
        <ScrollView style={{ flex: 1, marginBottom: 95 }}>
            <Card style={{ padding: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                    {images?.length > 0 && (
                        <FlatList
                            horizontal={true}
                            data={images}
                            keyExtractor={(item, ix) => item._id + ix}
                            style={{ height: 200 }}
                            renderItem={({ item }) => (
                                <CachedImage
                                    source={{ uri: relativePath(item.dataURI ?? item) }}
                                    style={{
                                        width,
                                        height: 200,
                                        borderColor: '#d35647',
                                        resizeMode: 'contain',
                                    }}
                                />
                            )}
                        />
                    )}
                </View>

                <View style={{ padding: 8, fontFamily: 'Roboto' }}>
                    <Subheading>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#263836' }}>Details</Text>
                    </Subheading>
                    {/*<Text>Hello{JSON.stringify(wfHighFive)}</Text>*/}
                    <View style={{ marginTop: 8 }}>
                        <Subheading>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: 14,
                                    color: '#263238CC',
                                }}
                            >
                                High five to:
                            </Text>
                        </Subheading>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
                        {ensureArray(wfHighFive.assignTo).map((person, index) => (
                            <UserAvatarAndNameChip key={person._id + index} person={person} avatarSize={24} />
                        ))}
                    </View>
                    <StandardDivider />

                    <View
                        style={{
                            marginTop: 8,
                            marginBottom: 8,
                        }}
                    >
                        <Text style={{ color: 'black', fontFamily: 'Roboto' }}>{wfHighFive?.description}</Text>
                    </View>
                    <StandardDivider />
                    {wfHighFive?.highFiveTypes?.length && (
                        <ThingAndCountAndChipArray
                            label={'Type'}
                            thingsForChipArray={wfHighFive?.highFiveTypes}
                            keyProp={'highFiveType'}
                        />
                    )}

                    <StandardDivider />
                    <StandardInfoRow label={'Submitted on'} value={result} />
                    <StandardDivider />
                    <StandardAvatarRow
                        label={'Submitted by'}
                        email={wfHighFive.submittedById.email}
                        role={wfHighFive.submittedById.role.role}
                    />
                    <StandardDivider />

                    <Reactions item={wfHighFive} />
                </View>
            </Card>
        </ScrollView>
    )
}

export const DeepLinkHighFive = ({ navigation, route }) => {
    const { item } = route.params

    const [refresh, setRefresh] = useState(0)
    const [editing, setEditing] = React.useState(false)

    const { loading, error, data, refetch } = useQuery(getHighFive, {
        variables: { id: item?._id },
    })

    // console.log('LOG>>>item', JSON.stringify(item))
    // console.log('LOG>>>data', JSON.stringify(data))

    if (loading) return null
    if (error) return null

    const DummyTabs: Tab[] = [
        {
            key: 'TabA',
            buttonText: 'Details',
            page: <TabA key={refresh} item={item} data={data} />,
        },
        {
            key: 'TabB',
            buttonText: `Notes (${data.wfHighFive?.notes_uid?.length || '0'})`,
            page: <NotesPage item={item} parent={data.wfHighFive} query={getHighFiveNotes} queryKey={'wfHighFive'} />,
        },
    ]

    // const toggleEdit = () => {
    //     setEditing(!editing)
    // }

    return (
        <>
            {
                !editing ? (
                    <>
                        <View style={styles.container}>
                            <Header
                                label="High Five"
                                startAdornment={<GoBackButton />}
                                // endAdornment={!editing ? <EditButton onPress={toggleEdit} /> : null}
                            />
                            <Tabs
                                defaultTab={0}
                                content={DummyTabs}
                                style={{ color: 'white', flex: 1 }}
                                containerStyle={{ color: 'white' }}
                                tabButtonStyle={{ color: 'white' }}
                                tabsContainerStyle={{ backgroundColor: '#13599A' }}
                                underLineColor={'white'}
                            />
                        </View>
                        {/*<ReactAddNoteResolve*/}
                        {/*    toggle={false}*/}
                        {/*    done={data?.wfHighFive?._state === 'Done'}*/}
                        {/*    buttonStateCallback={(buttonStates) => {*/}
                        {/*        if (buttonStates.reactButtonState) {*/}
                        {/*            showPanel(*/}
                        {/*                <GoodCatchReaction*/}
                        {/*                    onChange={() => setRefresh((r) => r + 1)}*/}
                        {/*                    item={data.wfHighFive}*/}
                        {/*                />,*/}
                        {/*                {*/}
                        {/*                    height: 250,*/}
                        {/*                    title: 'Reaction',*/}
                        {/*                }*/}
                        {/*            )*/}
                        {/*        } else if (buttonStates.addNoteButtonState) {*/}
                        {/*            navigation.navigate('NoteForm', { parentItem: data.wfHighFive })*/}
                        {/*        }*/}
                        {/*    }}*/}
                        {/*/>*/}
                    </>
                ) : null // <HighFive highFive={data.wfHighFive} setEditing={setEditing} />
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.full100,
    },
})
