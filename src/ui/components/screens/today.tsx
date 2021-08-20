import React, { useContext, useState } from 'react'
import { FlatList, Image, LayoutRectangle, StyleSheet, Text, View } from 'react-native'
import { gql, useQuery } from '@apollo/react-hooks'
import { Card, IconButton } from 'react-native-paper'
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'
import { GoodCatchChips } from './tool-box/goodCatchChips'
import differenceInDays from 'date-fns/differenceInDays'
import Config from '../../../config/config'
import { Header } from '../header/header'
import { globalStyles } from '../styles/base-styles'
import { Profile } from '../user/profile'
import { WeatherInfo } from '../weather/weather'
import { WeeklyProgress } from '../weekly-progress/weekly-progress'
import { GetScaledFactorX, GetWindowHeight } from '../utils/dimensions-helper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Tab, Tabs } from '../tabs/tabs'
import { PanGestureHandler } from 'react-native-gesture-handler'
import { GET_TASKS } from './tempApi'
import { burgerMenu } from './burger-menu'
import StateContext from '../../../context/state-context'
import { Box } from '../styles/BoxTheme'
import { useLocalEvent } from '../../../lib/local-events'
import { addGoodCatchQuery } from '../../../lib/good-catch-queries'
import OneSignal from 'react-native-onesignal'

const { header, theme } = Config

enum DOCKED {
    TOP = 1,
    BOTTOM,
}
addGoodCatchQuery('thisWeek')

export const Today = ({ navigation }): JSX.Element => {
    const { state } = useContext(StateContext)
    const { user } = state

    if (user) {
        const externalUserId = user._id.split(':')[0]
        console.log({ setExternalUserId: externalUserId })

        // Setting External User Id with Callback Available in SDK Version 3.7.0+
        OneSignal.setExternalUserId(externalUserId, (results) => {
            // The results will contain push and email success statuses
            console.log('Results of setting external user id')
            console.log(results)

            // Push can be expected in almost every situation with a success status, but
            // as a pre-caution its good to verify it exists
            if (results.push && results.push.success) {
                console.log('Results of setting external user id push status:')
                console.log(results.push.success)
            }

            // Verify the email is set or check that the results have an email success status
            if (results.email && results.email.success) {
                console.log('Results of setting external user id email status:')
                console.log(results.email.success)
            }
        })
    }

    const { loading, error, data = [], refetch } = useQuery(GET_TASKS, { variables: { user: user._id } })
    const thisWeek = data ?? {}
    const [, setCurrentDockedPosition] = useState(DOCKED.BOTTOM)
    const DockTopPosition = GetScaledFactorX(header.height)
    const DockBottomPosition = GetWindowHeight() * 0.5
    useLocalEvent('refetch-tasks', refetch)
    const insets = useSafeAreaInsets()

    const [rootLayout, setRootLayout] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    } as LayoutRectangle)

    const translateY = useSharedValue(DockBottomPosition)

    const clampWorklet = (value: number, min: number, max: number) => {
        'worklet'
        return Math.min(Math.max(min, value), max)
    }

    const setDockedTop = () => setCurrentDockedPosition(DOCKED.TOP)
    const setDockedBottom = () => setCurrentDockedPosition(DOCKED.BOTTOM)

    const onGestureEvent = useAnimatedGestureHandler({
        onStart: (_, ctx: { startY: number }) => {
            ctx.startY = translateY.value
        },
        onActive: (event, ctx) => {
            translateY.value = clampWorklet(
                ctx.startY + event.translationY,
                DockTopPosition + insets.top,
                DockBottomPosition
            )
        },
        onEnd: (event, ctx) => {
            if (event.absoluteY < ctx.startY) {
                translateY.value = withTiming(DockTopPosition + insets.top, undefined, (flag) => {
                    if (flag) {
                        runOnJS(setDockedTop)()
                    }
                })
            } else {
                translateY.value = withTiming(DockBottomPosition, undefined, (flag) => {
                    if (flag) {
                        runOnJS(setDockedBottom)()
                    }
                })
            }
        },
    })

    const bottomSpacing = GetScaledFactorX(16)
    const bottomSpacing2 = GetScaledFactorX(64)
    const bottomSpacing3 = GetScaledFactorX(180)

    const profileAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                translateY.value,
                [DockTopPosition + insets.top, DockBottomPosition],
                [0, 1],
                Extrapolate.CLAMP
            ),
            transform: [
                {
                    translateY: interpolate(
                        translateY.value,
                        [0, DockBottomPosition - bottomSpacing3],
                        [-50, 0],
                        Extrapolate.CLAMP
                    ),
                },
            ],
        }
    })
    const weatherAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                translateY.value,
                [DockTopPosition + insets.top, DockBottomPosition],
                [0, 1],
                Extrapolate.CLAMP
            ),
            transform: [
                {
                    translateY: interpolate(
                        translateY.value,
                        [0, DockBottomPosition - bottomSpacing2],
                        [-75, 0],
                        Extrapolate.CLAMP
                    ),
                },
            ],
        }
    })
    const weeklyProgressAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                translateY.value,
                [DockTopPosition + insets.top, DockBottomPosition],
                [0, 1],
                Extrapolate.CLAMP
            ),
            transform: [
                {
                    translateY: interpolate(
                        translateY.value,
                        [DockTopPosition + insets.top, DockBottomPosition - bottomSpacing],
                        [-100, 0],
                        Extrapolate.CLAMP
                    ),
                },
            ],
        }
    })

    const CounterTab = ({ label, count }) => (
        <View
            style={{
                ...globalStyles.full100,
                ...globalStyles.flexRow,
                ...globalStyles.justifySpaceBetween,
                ...globalStyles.flexCenter,
            }}
        >
            <Text
                style={{
                    ...globalStyles.semiboldText,
                    ...globalStyles.sizeSText,
                    ...globalStyles.capitalize,
                }}
            >
                {label}
            </Text>
            <View style={{ padding: 3, backgroundColor: '#DDDDDD', marginLeft: 10 }}>
                <Text
                    style={{
                        ...globalStyles.sizeXXsText,
                    }}
                >
                    {count}
                </Text>
            </View>
        </View>
    )

    const getTasks = (obj) => [
        obj?.edges?.map(({ node }) => ({ ...node })).filter((item) => item) || [],
        obj?.rowCount || 0,
    ]

    const [overdueTasks, overdueCount] = getTasks(data.overdueTasks)
    const [dueTodayTasks, dueTodayCount] = getTasks(data.dueTodayTasks)
    const [upcomingTasks, upcomingCount] = getTasks(data.upcomingTasks)
    // console.log('LOG>>>> rendering', overdueCount, dueTodayCount, upcomingCount, JSON.stringify(data.dueTodayTasks))

    const RenderTask = ({ item: task, label, index }) => {
        if (!task) return null
        const dayDifference = differenceInDays(new Date(task.dueDate), new Date())
        const numberOfDays = Math.abs(dayDifference)
        return (
            <Card
                style={{
                    backgroundColor: 'white',
                    marginBottom: 8,
                    flex: 1,
                }}
                onPress={() => {
                    navigation.navigate('DeepLinkGoodCatch', { item: task })
                }}
            >
                <Card.Content>
                    <Text
                        style={{
                            fontSize: 12,
                            color: dayDifference === 0 ? 'orange' : dayDifference < 0 ? 'red' : 'darkgreen',
                            marginBottom: index === 0 ? 0 : -8,
                        }}
                    >
                        {`${label} ${
                            numberOfDays
                                ? `${dayDifference > 0 ? 'in' : 'by'} ${numberOfDays} day${
                                      numberOfDays !== 1 ? 's' : ''
                                  }`
                                : ''
                        }`}
                    </Text>
                </Card.Content>
                <Card.Title
                    style={{ marginTop: -8 }}
                    title={<Text>{`${task.actionText}`}</Text>}
                    titleStyle={{ fontSize: 16 }}
                    subtitle={`${task.taskDescription}`}
                    subtitleStyle={{ marginTop: -8 }}
                    right={(props) => (
                        <View
                            style={{
                                borderRadius: 50,
                                backgroundColor: '#ededed',
                                marginRight: 16,
                                marginBottom: 24,
                            }}
                        >
                            <IconButton {...props} size={26} color={'gray'} icon="clipboard-text-outline" />
                        </View>
                    )}
                />
                {!!task.severityLevel && (
                    <Card.Content>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <GoodCatchChips item={task} />
                        </View>
                    </Card.Content>
                )}
            </Card>
        )
    }

    const RenderTasks = ({
        tasks = [],
        label,
        loading,
        refetch,
    }: {
        label: string
        loading: boolean
        refetch: () => void
        tasks: any[]
    }) => {
        if (tasks.length === 0) {
            return (
                <Box alignItems="center" mt="l">
                    <Image source={require('../../../assets/images/done.png')} />
                    <Box mt="l">
                        <Text>You do not have any {label.toLowerCase()} tasks</Text>
                    </Box>
                </Box>
            )
        }
        return (
            <View style={{ ...globalStyles.marginTopL, ...globalStyles.marginHorizontalM, flex: 1 }}>
                <FlatList
                    refreshing={loading}
                    onRefresh={refetch}
                    data={tasks}
                    keyExtractor={(item, ix) => item._id + ix}
                    renderItem={({ item, ...params }) => <RenderTask item={item} label={label} {...params} />}
                />
            </View>
        )
    }

    const DummyTabs: Tab[] = [
        {
            key: 'Overdue',
            buttonText: <CounterTab label={'Overdue'} count={overdueCount} />,
            page: <RenderTasks loading={loading} refetch={refetch} tasks={overdueTasks} label={'Overdue'} />,
        },
        {
            key: 'duetoday',
            buttonText: <CounterTab label={'Due Today'} count={dueTodayCount} />,
            page: <RenderTasks loading={loading} refetch={refetch} tasks={dueTodayTasks} label={'Due today'} />,
        },
        {
            key: 'todo',
            buttonText: <CounterTab label={'Upcoming'} count={upcomingCount} />,
            page: <RenderTasks loading={loading} refetch={refetch} tasks={upcomingTasks} label={'Upcoming'} />,
        },
    ]

    const taskListAnimatedStyle = useAnimatedStyle(() => {
        return {
            height: rootLayout.height - translateY.value,
            transform: [
                {
                    translateY: translateY.value,
                },
            ],
        }
    })
    const tabBarStyle = StyleSheet.flatten([{ ...globalStyles.marginHorizontalM }])
    const drawer = () => navigation.openDrawer()
    return (
        <View style={styles.root} onLayout={(event) => setRootLayout(event.nativeEvent.layout)}>
            {/*<Header label="Acme Construction" />*/}

            <Header
                label="Acme Construction"
                startAdornment={burgerMenu({ onPress: drawer })}
                // endAdornment={notificationsMenu}
                style={[globalStyles.marginLeftS, globalStyles.marginRightS]}
            />

            <Animated.View style={profileAnimatedStyle}>
                <Profile user={user} />
            </Animated.View>
            <Animated.View style={weatherAnimatedStyle}>
                <WeatherInfo cityId={2172349} />
            </Animated.View>
            <Animated.View style={weeklyProgressAnimatedStyle}>
                <WeeklyProgress
                    key={user._id}
                    allDone={thisWeek?.all?.rowCount || 0}
                    tasksToComplete={thisWeek?.done?.rowCount || 0}
                    totalTasks={thisWeek?.due?.rowCount || 0}
                />
            </Animated.View>
            <PanGestureHandler {...{ onGestureEvent }}>
                <Animated.View style={[styles.contentContainer, taskListAnimatedStyle]}>
                    <View style={styles.content}>
                        <Text style={styles.yourTasksLabel}>your tasks</Text>
                        <Tabs defaultTab={0} content={DummyTabs} style={tabBarStyle} />
                        <View style={{ overflow: 'visible' }}>
                            <View style={styles.spacer} />
                        </View>
                    </View>
                </Animated.View>
            </PanGestureHandler>
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        ...globalStyles.flex,
    },
    spacer: {
        position: 'absolute',
        backgroundColor: '#EFF4F8',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: 500,
    },
    contentContainer: {
        ...globalStyles.positionAbsolute,
        ...globalStyles.fullWidth,
        ...globalStyles.radiusTopM,
        backgroundColor: '#EFF4F8',
    },
    root: {
        ...globalStyles.full100,
        backgroundColor: theme.alcBrand001,
    },
    yourTasksLabel: {
        ...globalStyles.regularText,
        ...globalStyles.sizeSText,
        ...globalStyles.capitalize,
        ...globalStyles.marginHorizontalM,
        ...globalStyles.marginTopM,
        ...globalStyles.semiboldText,
        ...globalStyles.marginBottomM,
    },
})
