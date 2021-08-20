import React, { useContext, useState } from 'react'
import { AccessibilityInfo, ActivityIndicator, Dimensions, RefreshControl, StyleSheet } from 'react-native'
import { gql, useQuery } from '@apollo/react-hooks'
import StateContext from '../../../context/state-context'
import { Box, ListItemBox, Text } from '../styles/BoxTheme'
import { ChoiceMenu } from './ChoiceMenu'
import { StandardHeader, StandardPageContents, StandardPageView } from '../standards'
import { Card } from 'react-native-paper'
import { UserAvatarAndName } from '../user/UserAvatar'
import Config from '../../../config/config'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { addGoodCatchQuery } from '../../../lib/good-catch-queries'
console.disableYellowBox = true
const { theme } = Config
addGoodCatchQuery('aggregateGoodCatch')
const leaderBoard = gql`
    query aggregateGoodCatch($site: String, $start: Date, $end: Date, $compareStart: Date, $compareEnd: Date) {
        gc: wfGoodCatchesAggregate(
            where: {
                _and: [
                    { submittedOnSite_uid: { eq: $site } }
                    { submittedDate: { gte: $start } }
                    { submittedDate: { lt: $end } }
                ]
            }
            groupBy: submittedByEmail
            measures: { mode: count, name: "Count" }
        ) {
            groups {
                groupValue {
                    value
                }
                result {
                    value
                }
            }
        }
        hf: wfHighFivesAggregate(
            where: {
                _and: [
                    { submittedOnSite_uid: { eq: $site } }
                    { submittedDate: { gte: $start } }
                    { submittedDate: { lt: $end } }
                ]
            }
            groupBy: submittedByEmail
            measures: { mode: count, name: "Count" }
        ) {
            groups {
                groupValue {
                    value
                }
                result {
                    value
                }
            }
        }
        goodCatchTotals: wfGoodCatchesAggregate(
            where: {
                _and: [
                    { submittedOnSite_uid: { eq: $site } }
                    { submittedDate: { gte: $start } }
                    { submittedDate: { lt: $end } }
                ]
            }
            measures: [
                { name: "Created", mode: count, query: { _state: { in: [Done, Unresolved] } } }
                { name: "Resolved", mode: count, query: { _state: { in: [Done] } } }
                { name: "Unresolved", mode: count, query: { _state: { in: [Unresolved] } } }
            ]
        ) {
            totals {
                measureName
                value
            }
        }
        goodCatchTotalsPrev: wfGoodCatchesAggregate(
            where: {
                _and: [
                    { submittedOnSite_uid: { eq: $site } }
                    { submittedDate: { gte: $compareStart } }
                    { submittedDate: { lt: $compareEnd } }
                ]
            }
            measures: [
                { name: "Created", mode: count, query: { _state: { in: [Done, Unresolved] } } }
                { name: "Resolved", mode: count, query: { _state: { in: [Done] } } }
                { name: "Unresolved", mode: count, query: { _state: { in: [Unresolved] } } }
            ]
        ) {
            totals {
                measureName
                value
            }
        }

        highFiveTotals: wfHighFivesAggregate(
            where: {
                _and: [
                    { submittedOnSite_uid: { eq: $site } }
                    { submittedDate: { gte: $start } }
                    { submittedDate: { lt: $end } }
                ]
            }
            measures: [
                { name: "Submitted", mode: count, query: { _state: { in: [Done, Draft] } } }
                { name: "Received", mode: count, query: { _state: { in: [Done] } } }
            ]
        ) {
            totals {
                measureName
                value
            }
        }
        highFiveTotalsPrev: wfHighFivesAggregate(
            where: {
                _and: [
                    { submittedOnSite_uid: { eq: $site } }
                    { submittedDate: { gte: $compareStart } }
                    { submittedDate: { lt: $compareEnd } }
                ]
            }
            measures: [
                { name: "Submitted", mode: count, query: { _state: { in: [Done, Draft] } } }
                { name: "Received", mode: count, query: { _state: { in: [Done] } } }
            ]
        ) {
            totals {
                measureName
                value
            }
        }

        goodCatchTypes: wfGoodCatchesAggregate(
            where: {
                _and: [
                    { submittedOnSite_uid: { eq: $site } }
                    { submittedDate: { gte: $start } }
                    { submittedDate: { lt: $end } }
                    { _state: { in: [Done, Unresolved] } }
                ]
            }
            measures: [{ name: "Count", mode: count }]
            groupByDerived: "{derive(types,goodCatchType)}"
        ) {
            groups {
                groupValue {
                    value
                }
                result {
                    value
                }
            }
        }
    }
`

const useLeaderBoards = (site, [start, end, compareStart, compareEnd] = []) => {
    console.log('Load for ', site)
    const { loading: loadingGoodCatch, data, error, refetch } = useQuery(leaderBoard, {
        variables: {
            site,
            start,
            end,
            compareStart,
            compareEnd,
        },
    })
    // console.log('VARS>>>', JSON.stringify({ site, start, end, compareStart, compareEnd }))
    if (error) {
        console.log('Error>>>', error)
    }
    if (loadingGoodCatch || !site || !data) return [[], {}]

    const users = {}
    process(data.gc, users)
    process(data.hf, users)

    return [
        Object.entries(users)
            .map(([email, count]) => ({ email, count }))
            .sortBy('count', true),
        compareGoodCatch(data.goodCatchTotals, data.goodCatchTotalsPrev),
        processTypes(data.goodCatchTypes),
        compareHighFive(data.highFiveTotals, data.highFiveTotalsPrev),
        loadingGoodCatch,
        refetch,
    ]

    function processTypes({ groups }) {
        return groups
            .map(({ groupValue: [{ value: type }], result: [{ value: count }] }) => {
                return { type, count }
            })
            .sortBy('count', true)
    }

    function process({ groups }, users) {
        for (let {
            groupValue: [{ value: email }],
            result: [{ value: count }],
        } of groups) {
            if (!email) continue
            users[email] = users[email] || 0
            users[email] += count
        }
    }

    function compareHighFive(
        { totals: [{ value: submitted }, { value: received }] },
        { totals: [{ value: prevSubmitted }, { value: prevReceived }] }
    ) {
        prevSubmitted = prevSubmitted || Infinity
        prevReceived = prevReceived || Infinity
        return {
            submitted: { value: submitted, lift: convert(submitted / prevSubmitted) },
            received: { value: received, lift: convert(received / prevReceived) },
        }
    }

    function compareGoodCatch(
        { totals: [{ value: created }, { value: resolved }, { value: unresolved }] },
        { totals: [{ value: prevCreated }, { value: prevResolved }, { value: prevUnresolved }] }
    ) {
        prevCreated = prevCreated || Infinity
        prevResolved = prevResolved || Infinity
        prevUnresolved = prevUnresolved || Infinity
        return {
            created: { value: created, lift: convert(created / prevCreated) },
            resolved: { value: resolved, lift: convert(resolved / prevResolved) },
            unresolved: { value: unresolved, lift: convert(unresolved / prevUnresolved) },
        }
    }
}

function convert(frac) {
    return Math.round((frac - 1) * 100)
}

const styles = StyleSheet.create({
    count: {
        color: '#555',
        fontSize: 14,
        fontWeight: '400',
        textAlign: 'right',
    },
    first: {
        color: theme.alcBrand002,
        fontWeight: '600',
    },
    gold: {
        backgroundColor: '#e7e28aA0',
        borderRadius: 4,
    },
    position: {
        color: '#555',
        fontSize: 14,
        fontWeight: '200',
        textAlign: 'center',
    },
})

export const Insights = ({ navigation }) => {
    const {
        state: { user },
    } = useContext(StateContext)
    console.log(user)
    const [timePeriod, setTimePeriod] = useState(['last week', 'this week'])
    const [site, setSite] = useState(user.primarySite_uid)
    const [leaderBoard, goodCatch, catchTypes = [], highFives, loading, refetch] = useLeaderBoards(site, timePeriod)
    const topValue = catchTypes[0]?.count
    return (
        <StandardPageView>
            <StandardHeader label="Insights" />
            <ListItemBox backgroundColor="alcBrand001" width={'100%'}>
                <Box flex={1} />
                <ChoiceMenu
                    width={Dimensions.get('window').width * 0.4}
                    value={timePeriod}
                    onChange={setTimePeriod}
                    options={[
                        {
                            label: 'This Week',
                            value: ['last week', 'this week', 'two weeks ago', 'last week'],
                        },
                        {
                            label: 'Last week',
                            value: ['two weeks ago', 'one week ago', 'three weeks ago', 'two weeks ago'],
                        },
                        {
                            label: 'Last Month',
                            value: ['one month ago', 'now', 'two months ago', 'one month ago'],
                        },
                        {
                            label: 'Previous Month',
                            value: ['two months ago', 'one month ago', 'three months ago', 'two months ago'],
                        },
                    ]}
                />
                <Box width={12} />
                <ChoiceMenu
                    width={Dimensions.get('window').width * 0.4}
                    value={site}
                    onChange={setSite}
                    options={[
                        {
                            label: 'My Site',
                            value: user.primarySite_uid,
                        },
                        {
                            label: 'Current Site',
                            value: user.primarySite_uid,
                        },
                    ]}
                />
                <Box flex={1} />
            </ListItemBox>
            <StandardPageContents refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}>
                {!highFives ? (
                    <Text />
                ) : (
                    <>
                        <Box mb="m">
                            <Card>
                                <Card.Title title="Top Contributors" />
                                <Card.Content>
                                    {leaderBoard.map(({ email, count }, index) => {
                                        return (
                                            <ListItemBox
                                                style={user.email === email && styles.gold}
                                                mb="s"
                                                p="xs"
                                                key={index}
                                            >
                                                <Box width={16}>
                                                    <Text style={styles.position}>{index + 1}</Text>
                                                </Box>
                                                <Box ml="s">
                                                    <UserAvatarAndName avatarSize={24} email={email} />
                                                </Box>
                                                <Box flex={1} />
                                                <Box>
                                                    <Text style={[styles.count, index === 0 && styles.first]}>
                                                        {count}
                                                    </Text>
                                                </Box>
                                            </ListItemBox>
                                        )
                                    })}
                                </Card.Content>
                            </Card>
                        </Box>
                        {!!goodCatch.created && (
                            <Box mb="m">
                                <Card>
                                    <Card.Title title="Good Catches" />
                                    <Card.Content>
                                        <ListItemBox>
                                            <Box width="33.3%" p="m">
                                                <Counter value={goodCatch.created} label="Submitted" />
                                            </Box>
                                            <Box width="33.3%" p="m">
                                                <Counter value={goodCatch.unresolved} label="Unresolved" />
                                            </Box>
                                            <Box width="33.3%" p="m">
                                                <Counter value={goodCatch.resolved} label="Resolved" />
                                            </Box>
                                        </ListItemBox>
                                    </Card.Content>
                                </Card>
                            </Box>
                        )}
                        {!!catchTypes && (
                            <Box mb="m">
                                <Card>
                                    <Card.Title title="Good Catch Types" />
                                    <Card.Content>
                                        {catchTypes.map((type, index) => {
                                            return (
                                                <Box key={index} width="100%">
                                                    <Box>
                                                        <Text>{type.type}</Text>
                                                    </Box>
                                                    <ListItemBox width="100%" mb="m" mt="xs">
                                                        <Box
                                                            width={`${Math.floor((type.count / topValue) * 90)}%`}
                                                            height={12}
                                                            borderRadius="m"
                                                            backgroundColor="alcBrand001"
                                                        />
                                                        <Box flex={1} />
                                                        <Box>
                                                            <Text>{type.count}</Text>
                                                        </Box>
                                                    </ListItemBox>
                                                </Box>
                                            )
                                        })}
                                    </Card.Content>
                                </Card>
                            </Box>
                        )}
                        {!!highFives?.submitted && (
                            <Box mb="m">
                                <Card>
                                    <Card.Title title="High Fives" />
                                    <Card.Content>
                                        <ListItemBox>
                                            <Box width="50%" p="m">
                                                <Counter value={highFives.submitted} label="Submitted" />
                                            </Box>
                                            <Box width="50%" p="m">
                                                <Counter value={highFives.received} label="Received" />
                                            </Box>
                                        </ListItemBox>
                                    </Card.Content>
                                </Card>
                            </Box>
                        )}
                        <Box height={32} />
                    </>
                )}
            </StandardPageContents>
        </StandardPageView>
    )
}

const counterStyles = StyleSheet.create({
    counterLabel: {
        fontSize: 15,
        fontWeight: '200',
    },
    counterLiftDown: {
        backgroundColor: '#f002',
        borderRadius: 14,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
    },
    counterLiftUp: {
        backgroundColor: '#0f02',
        borderRadius: 14,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
    },
    counterValue: {
        color: '#444',
        fontSize: 32,
        fontWeight: '600',
    },
})

function Counter({ value, label }) {
    return (
        <Box width="100%" alignItems="center">
            <Box mb="s">
                <Text style={counterStyles.counterValue}>{value.value}</Text>
            </Box>
            <Box mb="s">
                <Text style={counterStyles.counterLabel}>{label}</Text>
            </Box>
            {value.lift >= 0 && (
                <Box style={counterStyles.counterLiftUp} flexDirection="row" alignItems="center">
                    <Box mr="s">
                        <FontAwesomeIcon icon={faArrowUp} size={12} color="green" />
                    </Box>
                    <Text>{value.lift} %</Text>
                </Box>
            )}
            {value.lift < 0 && (
                <Box style={counterStyles.counterLiftDown} flexDirection="row" alignItems="center">
                    <Box mr="s">
                        <FontAwesomeIcon icon={faArrowDown} size={12} color="red" />
                    </Box>
                    <Text>{Math.abs(value.lift)} %</Text>
                </Box>
            )}
        </Box>
    )
}
