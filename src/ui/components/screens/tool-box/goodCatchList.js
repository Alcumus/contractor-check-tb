import { StandardHeader, StandardPageView, theme } from '../../standards'
import { GoBackButton } from './goBackButton'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Tabs } from '../../tabs/tabs'
import { Box, Text } from '../../styles/BoxTheme'
import { useGraphQuery } from '../../lib/useGraphQuery'
import { gql } from '@apollo/client/core'
import { GoodCatchFilterBar } from './goodCatchFilterBar'
import { FlatList, Pressable, StyleSheet } from 'react-native'
import Sugar from 'sugar'
import { ensureArray } from '../../../../lib/ensure-array'
import StateContext from '../../../../context/state-context'
import { GoodCatchChips } from './goodCatchChips'
import { useNavigation } from '@react-navigation/core'
import { addGoodCatchQuery } from '../../../../lib/good-catch-queries'
import { useLocalEvent } from '../../../../lib/local-events'
import { noop } from '../ChoiceMenu'
import { apolloClient } from '../../../../../App'

addGoodCatchQuery('goodCatchList')

const goodCatchListQuery = gql`
    query goodCatchList($query: WfGoodCatchWhere, $order: [WfGoodCatchSort], $skip: Int) {
        goodCatches: wfGoodCatches(where: $query, order_by: $order, skip: $skip, first: 8) {
            rowCount
            edges {
                node {
                    _id
                    __typename
                    _state
                    dueDate
                    actionRequired
                    submittedDate
                    severityLevel
                    like_uid
                    look_uid
                    strong_uid
                    notes_uid
                    assignTo {
                        _id
                        firstName
                        lastName
                        email
                    }
                    description
                    types_uid
                    submittedById {
                        _id
                        firstName
                        lastName
                        email
                    }
                }
            }
        }
    }
`

export function GoodCatchList() {
    const [refresh, setRefresh] = useState(1)
    const [settings, setSettings] = useState()
    console.log(settings)
    const tabs = useMemo(() => {
        return [
            {
                key: 'submitted',
                buttonText: 'Submitted',
                page: (
                    <Submitted
                        onSetParams={setSettings}
                        settings={settings}
                        parentRefresh={() => {
                            apolloClient.resetStore()
                            setRefresh((r) => r + 1)
                        }}
                        key={refresh}
                    />
                ),
            },
            {
                key: 'drafts',
                buttonText: 'Drafts',
                page: <Drafts />,
            },
        ]
    }, [refresh, JSON.stringify(settings)])
    useLocalEvent('refetch-goodcatch', () => setRefresh((r) => r + 1))

    return (
        <StandardPageView>
            <StandardHeader startAdornment={<GoBackButton />} label="Good Catches" />

            <Tabs
                key={refresh}
                defaultTab={0}
                content={tabs}
                style={{ color: 'white', flex: 1 }}
                containerStyle={{ color: 'white' }}
                tabButtonStyle={{ color: 'white' }}
                tabsContainerStyle={{ backgroundColor: theme.alcBrand001 }}
                underLineColor={'white'}
            />
        </StandardPageView>
    )
}

function Submitted({ parentRefresh, onSetParams = noop, settings = { filter: {} } }) {
    const [page, setPage] = useState(0)
    const [, setRefresh] = useState(0)
    const id = useRef(0)
    const currentPage = useRef(-1)
    const lastRow = useRef(-1)
    const done = useRef(false)
    const checkPage = useCallback(_checkPage, [])
    const [localSettings, setSettings] = useState(settings)
    const { filter, sort } = localSettings
    useEffect(() => {
        console.log('Set', localSettings)
        onSetParams(localSettings)
        refresh()
    }, [sort, JSON.stringify(filter)])
    const order = { [sort]: sort === 'dueDate' ? 'asc' : 'desc' }
    const list = useRef([])
    const [, { loading }] = useGraphQuery(goodCatchListQuery, {
        page,
        variables: {
            skip: page * 8,
            query: {
                submittedDate: { ne: null },
                dueDate: sort === 'dueDate' ? { ne: null } : undefined,
                submittedById_uid: filter.submittedBy ? { in: filter.submittedBy.map('_id') } : undefined,
                assignTo_uid: filter.assignedTo ? { in: filter.assignedTo.map('_id') } : undefined,
                types_uid: filter.goodCatchTypes ? { in: filter.goodCatchTypes.map('_id') } : undefined,
                severityLevel: {
                    in: [
                        filter.critical !== false && 'critical',
                        filter.high !== false && 'serious',
                        filter.low !== false && 'low',
                        filter.moderate !== false && 'moderate',
                    ].filter(Boolean),
                },
                _state: {
                    in: [filter.unresolved !== false && 'Unresolved', filter.resolved !== false && 'Done'].filter(
                        Boolean
                    ),
                },
            },
            order,
        },
        onCompleted: (result, { page }) => {
            list.current.length = Math.max(list.current.length, page * 8)
            done.current = result.goodCatches.edges.length === 0
            let i = 0
            for (let item of result.goodCatches.edges.map('node')) {
                list.current[page * 8 + i++] = item
            }
            setRefresh((r) => r + 1)
        },
    })
    return (
        <Box width="100%" flex={1}>
            <GoodCatchFilterBar settings={settings} onChange={setSettings} />
            <Box backgroundColor={'background'} flexGrow={200}>
                <FlatList
                    key={id.current}
                    refreshing={loading && !list.current.length}
                    onRefresh={parentRefresh}
                    keyExtractor={(_, ix) => `${ix}`}
                    style={{ flex: 1, paddingTop: 10 }}
                    data={list.current}
                    initialNumToRender={8}
                    onViewableItemsChanged={checkPage}
                    renderItem={({ item }) => <GoodCatchCard item={item} />}
                />
            </Box>
        </Box>
    )

    function refresh() {
        list.current.length = 0
        lastRow.current = 0
        done.current = false
        currentPage.current = -1
        id.current++
        setPage(0)
        setRefresh((r) => r + 1)
    }

    function _checkPage({ viewableItems: items }) {
        if (!items.length) return
        const lastItem = items[items.length - 1] || { index: -1 }
        if ((lastItem.index || -1) > lastRow.current + 6) {
            lastRow.current = (page + 1) * 8
            if (!done.current) {
                console.log('Next page')
                done.current = true
                setPage((page) => page + 1)
            }
        }
    }
}

const styles = StyleSheet.create({
    description: {
        fontWeight: '500',
    },
    card: {
        borderBottomColor: theme.background,
        borderBottomWidth: 1,
    },
    overdue: {
        color: 'red',
        fontSize: 12,
    },
    today: {
        color: 'darkorange',
        fontSize: 12,
    },
    future: {
        color: 'darkgreen',
        fontSize: 12,
    },
    extra: {
        fontSize: 12,
        color: '#666',
    },
})

function GoodCatchCard({ item }) {
    const today = new Date()
    const {
        state: { user },
    } = useContext(StateContext)
    const navigation = useNavigation()
    if (!item) return null
    const hasDate = !!item.dueDate
    const due = Sugar.Date.create(item.dueDate)
    const dueToday = Sugar.Date.beginningOfDay(today) < due && Sugar.Date.endOfDay(today) > due
    const overdue = Sugar.Date.beginningOfDay(today) > due
    const assignList =
        ensureArray(item.assignTo)
            .map((person) => {
                if (person._id === user._id) {
                    return 'You'
                }
                return `${person.firstName} ${person.lastName}`
            })
            .join(', ') || 'Not Assigned'
    const timing = dueToday
        ? 'Due Today'
        : overdue
        ? `Overdue ${Sugar.Date.daysAgo(due)} days`
        : `Due ${Sugar.Date.format(due, '{short}')}`

    return (
        <Pressable onPress={() => navigation.navigate('DeepLinkGoodCatch', { item })}>
            <Box style={styles.card} backgroundColor="cardBackground" p="m">
                {item._state !== 'Done' && (
                    <>
                        {hasDate ? (
                            <Box mb="s">
                                <Text style={overdue ? styles.overdue : dueToday ? styles.today : styles.future}>
                                    {timing}
                                </Text>
                            </Box>
                        ) : (
                            <Box mb="s">
                                <Text style={overdue ? styles.overdue : dueToday ? styles.today : styles.future}>
                                    No Due Date
                                </Text>
                            </Box>
                        )}
                    </>
                )}
                <Box mb="m">
                    <Text style={styles.description}>{item.description}</Text>
                </Box>
                <Box mb="s">
                    <Text style={styles.extra}>
                        Submitted on: {Sugar.Date.format(new Date(item.submittedDate), '{long}')}
                    </Text>
                </Box>

                <Box>
                    <Text style={styles.extra}>Assigned to: {assignList}</Text>
                </Box>
                <GoodCatchChips item={item} />
            </Box>
        </Pressable>
    )
}

function Drafts() {
    return null
}
