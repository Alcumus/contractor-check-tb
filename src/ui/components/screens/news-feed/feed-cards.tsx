import React, { useCallback, useRef, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { ActivityIndicator, FlatList, Text, ViewToken } from 'react-native'
import { Card, Chip } from 'react-native-paper'
import { Flex } from '../../utils/flex'
import { useNavigation } from '@react-navigation/native'
import { showPanel } from '../../navigation/tab-navigation'
import { GoodCatchReaction, GoodCatchResolutionReaction, HighFiveReaction } from './good-catch-reaction'
import { Box } from '../../styles/BoxTheme'
import { StandardFeedCard } from './standard-feed-card'
import { noop } from '../ChoiceMenu'
import { getFeed } from './gql-getfeed'
import { getGoodCatch } from './gql-get-good-catch'
import { GoodCatchChips } from '../tool-box/goodCatchChips'
import { getToken, isDev } from '../../../../../env'
import { ensureArray } from '../../../../lib/ensure-array'

const cardTypes: Record<string, (props: any) => JSX.Element | null> = {
    WfGoodCatch: GoodCatchFeedCard,
    WfHighFive: HighFiveFeedCard,
    WfGoodCatchResolution: GoodCatchResolutionCard,
}

export function relativePath(path: string): string {
    if (!path || !path.startsWith('/')) return path
    const baseURL = isDev ? 'http://127.0.0.1:3001' : 'https://phoenix.theatworknetwork.com'
    return `${baseURL}${path}?authorization=${getToken()}`
}

function GoodCatchForItem({ id }: { id: string }) {
    const { data } = useQuery(getGoodCatch, { variables: { id } })
    return data?.wfGoodCatch ? <GoodCatchFeedCard hideReactions={true} item={data.wfGoodCatch} /> : null
}

function GoodCatchResolutionCard({ item }: { item?: any }) {
    const navigation = useNavigation()
    const [, setRefresh] = useState(0)
    return (
        <StandardFeedCard
            title={`${item.submittedById?.firstName} ${item.submittedById?.lastName} resolved a Good Catch`}
            avatarEmail={item.submittedById?.email}
            item={item}
            topArea={
                !!item.description && (
                    <Box p="m" key="description">
                        <Text>{item.description}</Text>
                    </Box>
                )
            }
            onPressMore={noop}
            onAddReaction={addReaction(item)}
            onAddNote={() => {
                navigation.navigate('NoteForm', { parentItem: item })
            }}
            image={
                item.resolutionAttachments?.[0]
                    ? { uri: relativePath(item.resolutionAttachments?.[0]?.dataURI ?? item.resolutionAttachments?.[0]) }
                    : null
            }
        >
            <Card.Content>
                <Flex alignItems={'flex-start'} justifyContent={'flex-start'} flexWrap={'wrap'} mb={1}>
                    {item.correctiveActionsTaken?.map(
                        ({ correctiveActionType }: { correctiveActionType: string }, ix: number) => {
                            return (
                                <Chip
                                    key={ix}
                                    style={{ marginRight: 8, height: 24, alignItems: 'center', marginBottom: 4 }}
                                    textStyle={{ fontSize: 12 }}
                                >
                                    {correctiveActionType}
                                </Chip>
                            )
                        }
                    )}
                </Flex>
                <Box p="s">{item.parentGoodCatchId && <GoodCatchForItem id={item.parentGoodCatchId} />}</Box>
            </Card.Content>
        </StandardFeedCard>
    )

    function addReaction(item: any) {
        return () =>
            showPanel(<GoodCatchResolutionReaction onChange={() => setRefresh((r) => r + 1)} item={item} />, {
                height: 250,
                title: 'Reaction',
            })
    }
}

function HighFiveFeedCard({ item }: { item?: any }) {
    const assignedTo = item.assignTo ? item?.assignTo[0] : null
    const navigation = useNavigation()
    const [, setRefresh] = useState(0)
    if (!assignedTo) return null
    return (
        <StandardFeedCard
            title={`${assignedTo?.firstName} ${assignedTo?.lastName} received a "High Five" from ${item?.submittedById?.firstName} ${item?.submittedById?.lastName}`}
            avatarEmail={item.submittedById?.email}
            item={item}
            description={item.description}
            onPressMore={() => {
                navigation.navigate('DeepLinkHighFive', { item })
            }}
            onAddReaction={addReaction(item)}
            onAddNote={() => {
                navigation.navigate('NoteForm', { parentItem: item })
            }}
            image={
                item.photos?.[0]
                    ? {
                          uri: relativePath(item.photos?.[0]?.dataURI ?? item.photos?.[0]),
                      }
                    : require('../../../../assets/images/celb3.jpg')
            }
        >
            <Flex alignItems={'flex-start'} justifyContent={'flex-start'} flexWrap={'wrap'} mb={1}>
                {item.highFiveTypes?.map(({ highFiveType }: { highFiveType: string }, ix: number) => {
                    return (
                        <Chip
                            key={ix}
                            style={{ marginRight: 8, height: 24, alignItems: 'center', marginBottom: 4 }}
                            textStyle={{ fontSize: 12 }}
                        >
                            {highFiveType}
                        </Chip>
                    )
                })}
            </Flex>
        </StandardFeedCard>
    )

    function addReaction(item: any) {
        return () =>
            showPanel(<HighFiveReaction onChange={() => setRefresh((r) => r + 1)} item={item} />, {
                height: 250,
                title: 'Reaction',
            })
    }
}

function GoodCatchFeedCard({ item, hideReactions }: { item?: any; hideReactions?: boolean }) {
    const navigation = useNavigation()
    const [, setRefresh] = useState(0)
    if (!item?.submittedById) return null
    const attachments = ensureArray(item.attachments).filter(
        (f) =>
            !!f &&
            ((typeof f === 'string' && (f.startsWith('/') || !f.includes('text/'))) ||
                (!!f.dataURI && (f.dataURI.startsWith('/') || !f.dataURI.includes('text/'))))
    )
    return (
        <StandardFeedCard
            topArea={
                <>
                    <Box ml="m">
                        <GoodCatchChips item={item} />
                    </Box>
                    {!!item.description && (
                        <Box p="m">
                            <Text>{item.description}</Text>
                        </Box>
                    )}
                </>
            }
            hideReactions={hideReactions}
            title={`${item?.submittedById?.firstName} ${item?.submittedById?.lastName} submitted a Good Catch`}
            avatarEmail={item.submittedById?.email}
            item={item}
            onPressMore={() => {
                navigation.navigate('DeepLinkGoodCatch', { item })
            }}
            onAddReaction={addReaction(item)}
            onAddNote={() => {
                navigation.navigate('NoteForm', { parentItem: item })
            }}
            image={attachments?.[0] ? { uri: relativePath(attachments?.[0]?.dataURI ?? item.attachments?.[0]) } : null}
        />
    )

    function addReaction(item: any) {
        return () =>
            showPanel(<GoodCatchReaction onChange={() => setRefresh((r) => r + 1)} item={item} />, {
                height: 250,
                title: 'Reaction',
            })
    }
}

const FeedCard = (props: any) => {
    const FeedItem = cardTypes[props.item.__typename]
    if (!FeedItem) return null
    return <FeedItem {...props} />
}

interface PageInfo {
    startCursor: string
    endCursor: string
}

interface Connection {
    rowCount: number
    edges: Node[]
    pageInfo: PageInfo
}

interface Node {
    node: Record<string, any>
}

interface FeedResponse {
    wfGoodCatches: Connection
    wfHighFives: Connection
    wfGoodCatchResolutions: Connection
}

function getEdgesFrom(data: Connection) {
    return data.edges.map(({ node }) => ({ ...node })).filter((item) => item.submittedDate)
}

function dateRanges(source: Connection) {
    const dates = getEdgesFrom(source).map((n) => n.submittedDate)
    if (dates.length === 0) {
        return [0, Infinity]
    }
    return [dates[dates.length - 1], dates[0]]
}

export function FeedCards({ toRefresh = noop, ...params }): JSX.Element {
    const [page, setPage] = useState(0)
    const checkPage = useCallback(_checkPage, [])
    const lastPage = useRef(-1)
    const canLoad = useRef(true)
    const done = useRef(false)
    const lastRow = useRef(0)
    const { loading, error } = useQuery(getFeed, { variables: { skip: page * 8 }, onCompleted: addData })
    const [feed, setFeed] = useState<Record<string, any>[]>([])

    if (loading && !feed.length)
        return (
            <Box mt="xl">
                <ActivityIndicator size="large" />
            </Box>
        )
    if (error) {
        console.log('GQL ERROR>>>', JSON.stringify(error))
    }
    // console.log('LOG>>>', JSON.stringify(feed))
    return (
        <>
            <FlatList
                refreshing={loading && !feed.length}
                onRefresh={toRefresh}
                keyExtractor={(_, ix) => `${ix}`}
                style={{ marginBottom: 100, paddingTop: 10 }}
                data={feed}
                initialNumToRender={10}
                onViewableItemsChanged={checkPage}
                renderItem={({ item }) => <FeedCard item={item} {...params} />}
            />
        </>
    )

    function _checkPage({ viewableItems: items }: { viewableItems: ViewToken[] }) {
        const lastItem = items[items.length - 1] || { index: -1 }
        if ((lastItem.index || -1) > lastRow.current + 6) {
            lastRow.current = (page + 1) * 8
            if (!done.current && canLoad.current) {
                canLoad.current = false
                setPage((page) => page + 1)
            }
        }
    }

    function addData(data: FeedResponse) {
        if (lastPage.current === page) return
        const list = [
            ...getEdgesFrom(data.wfGoodCatches),
            ...getEdgesFrom(data.wfHighFives),
            ...getEdgesFrom(data.wfGoodCatchResolutions),
        ]
        if (!list.length) {
            done.current = true
            return
        }
        lastPage.current = page
        // const feed = [...highFives, ...wfGoodCatches].sort((a, b) => {
        const newFeed = [...feed, ...list].sort((a, b) => {
            const first = a.submittedDate
            const second = b.submittedDate
            return first > second ? -1 : first === second ? 0 : 1
        })
        canLoad.current = true
        setFeed(newFeed)
    }
}
