import React, { useContext, useEffect, useReducer, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { PanelSlider, Tabs } from './src/ui/components/navigation/tab-navigation'
import { createStackNavigator } from '@react-navigation/stack'
import Orientation from 'react-native-orientation-locker'

import { ApolloProvider, gql, useQuery, useSubscription } from '@apollo/react-hooks'

import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context'

import StateContext from './src/context/state-context'

import { ActivityIndicator, StatusBar, StyleSheet, useColorScheme, View } from 'react-native'
import { StateReducer } from './src/reducers/app-store'
import { State } from './src/types/state-types'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'

import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { Resolution } from './src/ui/components/screens/resolution'
import { DeepLinkGoodCatch } from './src/ui/components/screens/deep-link-good-catch'
import { DeepLinkHighFive } from './src/ui/components/screens/deep-link-high-five'
import { NoteForm } from './src/ui/components/screens/note-form'

import { createDrawerNavigator } from '@react-navigation/drawer'
import { appURL, subscriptionURL, tokens, useToken } from './env'
import { Box, BoxThemeProvider } from './src/ui/components/styles/BoxTheme'
import { getMetadata } from './src/ui/components/screens/tempApi'
import { UserList } from './UserList'
import { User } from './src/reducers/app-store'
import { theme } from './src/ui/components/standards'
import Toast from 'react-native-toast-message'
import OneSignal from 'react-native-onesignal'
import { split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()

const httpLink = createHttpLink({
    uri: appURL,
})
const token = tokens[useToken]
const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            authorization: token ? `${token}` : '',
        },
    }
})

const wsLink = new WebSocketLink({
    uri: subscriptionURL,
    options: {
        reconnect: true,
        connectionParams: {
            Authorization: token ? `${token}` : '',
        },
    },
})

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query)
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    authLink.concat(httpLink)
)

export const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
})

const highFiveAdded = gql`
    subscription listenForUpdate {
        wfHighFives {
            description
            submittedById {
                _id
                firstName
                lastName
                email
            }
            assignTo {
                firstName
                lastName
            }
        }
    }
`
const Main = () => (
    <View style={StyleSheet.absoluteFillObject}>
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Home" component={Tabs} />
            <Stack.Screen name="Resolution" component={Resolution} />
            <Stack.Screen name="DeepLinkGoodCatch" component={DeepLinkGoodCatch} />
            <Stack.Screen name="DeepLinkHighFive" component={DeepLinkHighFive} />
            <Stack.Screen name="NoteForm" component={NoteForm} />
        </Stack.Navigator>
        <PanelSlider />
    </View>
)

export default function App() {
    const [subState, setSubState] = useState(false)

    useEffect(() => {
        async function initPush() {
            /* O N E S I G N A L   S E T U P */
            OneSignal.setLogLevel(6, 0)
            OneSignal.setAppId('9c24bc2d-404a-458d-b98e-c8f4d2772727')

            OneSignal.promptForPushNotificationsWithUserResponse((response) => {
                console.log('Prompt response:', response)
            })
            OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent) => {
                console.log('OneSignal: notification will show in foreground:', notificationReceivedEvent)
                const notification = notificationReceivedEvent.getNotification()
                console.log('notification: ', notification)
                const data = notification.additionalData
                console.log('additionalData: ', data)
                const button1 = {
                    text: 'Cancel',
                    onPress: () => {
                        notificationReceivedEvent.complete()
                    },
                    style: 'cancel',
                }
                const button2 = {
                    text: 'Complete',
                    onPress: () => {
                        notificationReceivedEvent.complete(notification)
                    },
                }
                //Alert.alert("Complete notification?", "Test", [button1, button2], { cancelable: true });
            })

            OneSignal.setNotificationOpenedHandler((notification) => {
                console.log('OneSignal: notification opened:', notification)
            })
            const deviceState = await OneSignal.getDeviceState()

            setSubState(deviceState.isSubscribed)
        }

        initPush()
    }, [])

    return (
        <BoxThemeProvider>
            <PaperProvider
                theme={{
                    ...DefaultTheme,
                    dark: false,
                    mode: 'exact',
                    roundness: 4,
                    colors: { ...DefaultTheme.colors, primary: theme.alcBrand001, accent: theme.accent },
                }}
            >
                <ApolloProvider client={apolloClient}>
                    <InnerApp />
                    <Toast ref={(ref) => Toast.setRef(ref)} />
                </ApolloProvider>
            </PaperProvider>
        </BoxThemeProvider>
    )
}

export const getUser = gql`
    query getAllUsers($id: WfUserUid!) {
        wfUser(_id: $id) {
            _id
            firstName
            lastName
            email
            position: role {
                role
            }
            primarySite_uid
            primarySite {
                siteName
            }
        }
    }
`

function InnerApp() {
    const isDarkMode = useColorScheme() === 'dark'
    const stateReducerState: State = {
        goodCatchTypes: [],
        highFiveTypes: [],
        sites: [],
        users: [],
        correctiveActionTypes: [],
        orientation: '',
        isDarkMode: false,
        showSpinner: false,
        user: null,
        image: [],
    }
    useQuery(getUser, { variables: { id: 'H18NqHp_zgtNT_:WF_apps/users' }, onCompleted: setUserOnState })
    const { data: subscription, _loading, _error } = useSubscription(highFiveAdded)
    const toastInPlay = React.useRef(false)
    useEffect(() => {
        if (toastInPlay.current) return

        // console.log('LOG>>>', JSON.stringify(state?.user))
        if (subscription?.wfHighFives?.description && subscription?.wfHighFives?.description !== '') {
            const notification = subscription?.wfHighFives
            // console.log('userId>>>' + state?.user._id)
            // console.log('submittedById>>>', notification?.submittedById?._id)
            if (state?.user._id === notification?.submittedById?._id) return
            toastInPlay.current = true
            const [assignTo] = notification?.assignTo
            Toast.show({
                type: 'success',
                text1: `${notification?.submittedById?.firstName} submitted a High Five!`,
                text2: `To ${assignTo?.firstName} for ${notification?.description}`,
                bottomOffset: 60,
                position: 'bottom',
                visibilityTime: 1500,
            })
        }
        setTimeout(() => {
            toastInPlay.current = false
        }, 1000)
    }, [subscription])
    const [state, stateDispatch] = useReducer(StateReducer, stateReducerState)

    const orientationHandler = (orientation: string) => {
        stateDispatch({ type: 'STORE_ORIENTATION', orientation })
    }

    useEffect(() => {
        Orientation.lockToPortrait()
        stateDispatch({ type: 'STORE_ACTION_IS_DARK_MODE', isDarkMode })

        Orientation.getOrientation((orientation) => stateDispatch({ type: 'STORE_ORIENTATION', orientation }))
        Orientation.addOrientationListener(orientationHandler)
        return () => Orientation.removeOrientationListener(orientationHandler)
    }, [isDarkMode])

    const { loading, error, data } = useQuery(getMetadata)
    useEffect(() => {
        if (loading) return
        if (!data) {
            console.log(error)
            return
        }
        stateDispatch({
            type: 'STORE_METADATA',
            sites: edgesToArray(data.sites),
            highFiveTypes: edgesToArray(data.highFiveTypes),
            users: edgesToArray(data.users),
            correctiveActionTypes: edgesToArray(data.correctiveActions),
            goodCatchTypes: edgesToArray(data.goodCatchTypes),
        })
    }, [loading])
    if (!state.user) {
        return (
            <Box mt="xl" justifyContent="center" height="100%">
                <ActivityIndicator size="large" color="blue" />
            </Box>
        )
    }

    return (
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <StatusBar translucent barStyle="light-content" />
            <StateContext.Provider value={{ state, stateDispatch }}>
                <NavigationContainer>
                    <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <UserList {...props} />}>
                        <Drawer.Screen name="Home" component={Main} />
                    </Drawer.Navigator>
                </NavigationContainer>
            </StateContext.Provider>
        </SafeAreaProvider>
    )

    function setUserOnState({ wfUser }: { wfUser: User }) {
        console.log(wfUser)
        stateDispatch({ type: 'CHANGE_USER', user: wfUser })
    }
}

function edgesToArray(data: any) {
    return data.edges.map((e: any) => {
        return e.node
    })
}
