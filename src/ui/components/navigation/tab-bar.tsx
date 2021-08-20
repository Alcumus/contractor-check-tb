import React from 'react'
import { DeviceEventEmitter, Pressable, StyleSheet, Text, View } from 'react-native'
import Config from '../../../config/config'
import { GetScaledFactorX, GetScreenWidth, GetWindowWidth } from '../utils/dimensions-helper'
import { globalStyles } from '../styles/base-styles'

import {
    faCalendarCheck,
    faChartLine,
    faCross,
    faNewspaper,
    faPlus,
    faToolbox,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

const { theme } = Config

type Props = {
    state: any
    descriptors: any
    navigation: any
}

export const TabBar = ({ state, descriptors, navigation }: Props): JSX.Element => {
    const focusedOptions = descriptors[state.routes[state.index].key].options

    const getIcon = (screenName: string) => {
        switch (screenName) {
            case 'Today': {
                return faCalendarCheck
            }
            case 'Feed': {
                return faNewspaper
            }
            case 'add-task': {
                return faPlus
            }
            case 'Insights': {
                return faChartLine
            }
            case 'ToolBox': {
                return faToolbox
            }
            default:
                return faCross
        }
    }

    return (
        <View style={{ ...globalStyles.flexRow }}>
            {state.routes.map((route: any, index: any) => {
                const { options } = descriptors[route.key]

                const label: string =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name

                const isFocused = state.index === index
                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    })

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name)
                    }
                }

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    })
                }

                // todo fix .... friday code - 30 mins to home time, dont judge :-)
                const getPadding = () => {
                    let margin = {}

                    if (index === 0) {
                        margin = {
                            paddingRight: GetScaledFactorX(20),
                        }
                    } else if (index === 1) {
                        margin = {
                            paddingRight: GetScaledFactorX(50),
                        }
                    } else if (index === 2) {
                        margin = {
                            paddingLeft: GetScaledFactorX(50),
                        }
                    } else if (index === 3) {
                        margin = {
                            paddingLeft: GetScaledFactorX(20),
                        }
                    }
                    return margin
                }

                return (
                    <Pressable
                        key={index}
                        accessibilityRole="button"
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.button}
                    >
                        <View style={{ ...globalStyles.flex, ...globalStyles.flexCenter, ...getPadding() }}>
                            <FontAwesomeIcon
                                color={isFocused ? theme.alcBrand002 : 'black'}
                                size={GetScaledFactorX(20)}
                                icon={getIcon(route.name)}
                                style={{ ...globalStyles.marginBottomXXS }}
                            />
                            <Text
                                style={[
                                    globalStyles.sizeXXsText,
                                    globalStyles.fontLight,
                                    { color: isFocused ? theme.alcBrand002 : theme.alcSys007 },
                                ]}
                            >
                                {route.name}
                            </Text>
                        </View>
                    </Pressable>
                )
            })}
            <Pressable
                onPress={() => DeviceEventEmitter.emit('showMenu', true)}
                style={{
                    ...globalStyles.positionAbsolute,
                    left: GetWindowWidth() / 2 - GetScaledFactorX(40 / 2),
                    top: 0,
                }}
            >
                <View style={styles.buttonHolder}>
                    <View
                        style={[
                            { ...globalStyles.flexCenter },
                            {
                                height: GetScaledFactorX(40),
                                width: GetScaledFactorX(40),
                                backgroundColor: theme.alcSys007,
                                borderRadius: GetScaledFactorX(40 / 2),
                            },
                        ]}
                    >
                        <FontAwesomeIcon color={'white'} size={GetScaledFactorX(20)} icon={faPlus} />
                    </View>
                </View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonHolder: {
        ...globalStyles.paddingTopS,
    },
    button: {
        ...globalStyles.flex,
        ...globalStyles.backgroundWhite,
        height: GetScaledFactorX(60),
    },
})
