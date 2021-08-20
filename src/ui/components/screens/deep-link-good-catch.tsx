import React, { useState } from 'react'

import format from 'date-fns/format'
import toDate from 'date-fns/toDate'
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Card, Subheading } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { gql, useQuery } from '@apollo/react-hooks'

import { ensureArray } from '../../../lib/ensure-array'
import { addGoodCatchQuery } from '../../../lib/good-catch-queries'
import { useLocalEvent } from '../../../lib/local-events'
import { ReactAddNoteResolve } from '../cards/react-add-note-resolve'
import { Header } from '../header/header'
import { showPanel } from '../navigation/tab-navigation'
import { Slider, ToSide } from '../slider/slider'
import { globalStyles } from '../styles/base-styles'
import { Tabs } from '../tabs/tabs'
import { GetScaledFactorX, GetScreenHeight } from '../utils/dimensions-helper'
import { StandardAvatarRow, StandardDivider, StandardInfoRow, ThingAndCountAndChipArray } from './detail-components'
import { EditButton } from './edit-button'
import { GoodCatch } from './good-catch'
import { relativePath } from './news-feed/feed-cards'
import { GoodCatchReaction } from './news-feed/good-catch-reaction'
import { Reactions } from './news-feed/reactions'
import { NotesPage } from './notes.js'
import { ResolveGoodCatch } from './resolve-good-catch'
import { getGoodCatch } from './tempApi'
import { GoBackButton } from './tool-box/goBackButton'
import { GoodCatchChips } from './tool-box/goodCatchChips'
import CachedImage from 'react-native-image-cache-wrapper'

addGoodCatchQuery('getGoodCatchNotes')
export const getGoodCatchNotes = gql`
    query getGoodCatchNotes($id: WfGoodCatchUid!) {
        wfGoodCatch(_id: $id) {
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

const TabA = ({ item, data }) => {
    const { wfGoodCatch } = data
    const images = wfGoodCatch?.attachments
    const width = Dimensions.get('window').width

    const result = format(toDate(new Date(wfGoodCatch?.submittedDate ?? Date.now())), 'MMM dd yyyy, p')
    return (
        <ScrollView style={{ flex: 1, marginBottom: 95 }}>
            <Card style={{ padding: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                    {images?.length > 0 && (
                        <FlatList
                            horizontal={true}
                            data={images}
                            keyExtractor={(_, ix) => ix}
                            style={{ height: 200 }}
                            renderItem={({ item, index }) => (
                                <CachedImage
                                    key={item.id}
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

                <View style={{ padding: 8 }}>
                    <Subheading>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#263836' }}>Details</Text>
                    </Subheading>

                    <View
                        style={{
                            marginTop: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            marginBottom: 8,
                        }}
                    >
                        <GoodCatchChips item={wfGoodCatch} />
                    </View>
                    <View
                        style={{
                            marginTop: 8,
                            marginBottom: 8,
                        }}
                    >
                        <Text style={{ color: 'black', fontFamily: 'Roboto' }}>{wfGoodCatch.description}</Text>
                    </View>
                    <StandardDivider />
                    {wfGoodCatch?.types?.length && (
                        <ThingAndCountAndChipArray label={'Type'} thingsForChipArray={wfGoodCatch.types} />
                    )}

                    <StandardDivider />
                    <StandardInfoRow label={'Submitted on'} value={result} />
                    <StandardDivider />
                    <StandardAvatarRow
                        label={'Submitted by'}
                        email={wfGoodCatch.submittedById?.email}
                        role={wfGoodCatch.submittedById?.role?.role}
                    />
                    <StandardDivider />

                    {ensureArray(wfGoodCatch.assignTo).map((person, index) => (
                        <StandardAvatarRow
                            key={person._id}
                            label={index === 0 ? 'Assigned to' : ''}
                            email={person.email}
                            role={person.position.role}
                        />
                    ))}

                    <StandardDivider />

                    {ensureArray(wfGoodCatch.resolvedById).map((person, index) => (
                        <StandardAvatarRow
                            key={`resolved-${person._id}`}
                            label={index === 0 ? 'Resolved by' : ''}
                            email={person.email}
                            role={person.position.role}
                        />
                    ))}

                    <StandardDivider />

                    <ThingAndCountAndChipArray
                        label={'Action Required'}
                        thingsForChipArray={wfGoodCatch?.correctiveActions}
                        keyProp={'correctiveActionType'}
                    />

                    <StandardDivider />

                    <Subheading>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: 14,
                                color: '#263238CC',
                            }}
                        >
                            Additional Details
                        </Text>
                    </Subheading>

                    <View
                        style={{
                            marginTop: 8,
                            marginBottom: 8,
                        }}
                    >
                        <Text style={{ color: 'black', fontFamily: 'Roboto' }}>{wfGoodCatch.additionalDetails}</Text>
                    </View>

                    <StandardDivider />

                    <Reactions item={wfGoodCatch} />
                </View>
            </Card>
        </ScrollView>
    )
}

const TabC = ({ item, data }) => {
    return <Text>There is an audit plugin in framework, looked pretty nice</Text>
}

export const DeepLinkGoodCatch = ({ navigation, route }) => {
    const safeInsets = useSafeAreaInsets()
    const [refresh, setRefresh] = useState(0)
    const { item } = route.params
    const [editing, setEditing] = React.useState(false)
    const [showResolveGoodCatchContent, setShowResolveGoodCatchContent] = useState(false)
    const { loading, error, data, refetch } = useQuery(getGoodCatch, {
        variables: { id: item?.__typeName === 'TaskTodayScreen' ? item?.goodCatchId : item?._id },
    })

    useLocalEvent('refetch-tasks', refetch)
    if (loading) {
        return (
            <View>
                <Text>Loading</Text>
            </View>
        )
    }
    if (error) {
        console.error(error)
        return null
    }

    const tabBarStyle = StyleSheet.flatten([{ ...globalStyles.marginHorizontalM }])

    const DummyTabs: Tab[] = [
        {
            key: 'TabA',
            buttonText: 'Details',
            page: <TabA key={refresh} item={item} data={data} />,
        },
        {
            key: 'TabB',
            buttonText: `Notes (${data.wfGoodCatch?.notes_uid?.length || '0'})`,

            page: (
                <NotesPage item={item} parent={data.wfGoodCatch} query={getGoodCatchNotes} queryKey={'wfGoodCatch'} />
            ),
        },
        // {
        //     key: 'TabC',
        //     buttonText: 'Timeline',
        //     page: <TabC label={'Upcoming'} item={item} data={data} />,
        // },
    ]

    const toggleEdit = () => {
        // navigation.navigate('EditScreen')
        setEditing(!editing)
    }

    return (
        <>
            {!editing ? (
                <>
                    <View style={styles.container}>
                        <Header
                            label="Good Catch"
                            startAdornment={<GoBackButton />}
                            endAdornment={!editing ? <EditButton onPress={toggleEdit} /> : null}
                        />
                        <Tabs
                            defaultTab={0}
                            content={DummyTabs}
                            style={{ flex: 1 }}
                            containerStyle={{ color: 'white' }}
                            tabButtonStyle={{ color: 'white' }}
                            tabsContainerStyle={{ backgroundColor: '#13599A' }}
                            underLineColor={'white'}
                        />
                    </View>
                    <ReactAddNoteResolve
                        toggle={false}
                        done={data?.wfGoodCatch?._state === 'Done'}
                        buttonStateCallback={(buttonStates) => {
                            // going to go on forever with this if if if off
                            if (buttonStates.resolveButtonState) {
                                setShowResolveGoodCatchContent(true)
                            } else if (buttonStates.reactButtonState) {
                                showPanel(
                                    <GoodCatchReaction
                                        onChange={() => setRefresh((r) => r + 1)}
                                        item={data.wfGoodCatch}
                                    />,
                                    {
                                        height: 250,
                                        title: 'Reaction',
                                    }
                                )
                            } else if (buttonStates.addNoteButtonState) {
                                navigation.navigate('NoteForm', { parentItem: data.wfGoodCatch })
                            }
                        }}
                    />
                    <Slider
                        dismissed={() => console.log('dismissed')}
                        margin={GetScaledFactorX(safeInsets.top)}
                        initialPosition={GetScreenHeight()}
                        showContent={showResolveGoodCatchContent}
                        toSide={ToSide.TOP}
                    >
                        <ResolveGoodCatch
                            goodCatch={data?.wfGoodCatch}
                            onDismiss={() => setShowResolveGoodCatchContent(false)}
                        />
                    </Slider>
                </>
            ) : (
                <GoodCatch goodCatch={data.wfGoodCatch} setEditing={setEditing} />
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.full100,
    },
})
