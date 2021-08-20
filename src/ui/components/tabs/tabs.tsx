import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import Config from '../../../config/config'
import { globalStyles } from '../styles/base-styles'
import { GetScaledFactorX } from '../utils/dimensions-helper'
import { TabButton } from './tab-button'

// todo get colours from config
const { theme } = Config

export type Tab = {
    buttonText: React.ReactNode | string
    key: string
    page?: () => JSX.Element
}

type Props = {
    content: Tab[]
    defaultTab: number
    style?: ViewStyle
    tabBarSize?: string
    tabButtonStyle?: any
    containerStyle?: any
    tabsContainerStyle?: any
    underLineColor?: any
}
export const Tabs = (props: Props): JSX.Element => {
    const {
        content,
        defaultTab,
        style = {},
        tabBarSize = '100%',
        containerStyle = {},
        tabButtonStyle = {},
        tabsContainerStyle = {},
        underLineColor,
    } = props
    const [currentContent, setCurrentContent] = useState(content[defaultTab].page)

    const [tabNumber, setTabNumber] = useState(defaultTab)

    const containerStyleLocal = StyleSheet.flatten([
        containerStyle,
        { flex: 1, flexGrow: 1, flexShrink: 1, width: tabBarSize ? tabBarSize : '100%' },
    ])

    const onPress = (idx: number) => {
        setTabNumber(idx)
    }

    useEffect(() => {
        setCurrentContent(content[tabNumber].page)
    }, [tabNumber, content])

    const buttons: JSX.Element[] = content.reduce((acc: JSX.Element[], tabData: Tab, idx: number) => {
        const { buttonText, key, page } = tabData
        acc.push(
            <TabButton
                key={key}
                active={tabNumber}
                idx={idx}
                label={buttonText}
                onPress={() => onPress(idx)}
                disabled={page === undefined}
                style={tabButtonStyle}
                underlineColor={underLineColor}
            />
        )
        return acc
    }, [])

    const buttowRowStyle = StyleSheet.flatten([styles.buttonRow, style])
    const tabsContainer = StyleSheet.flatten([styles.tabsContainer, tabsContainerStyle])

    return (
        <View style={containerStyleLocal}>
            <View style={tabsContainer}>
                <View style={buttowRowStyle}>{buttons}</View>
            </View>
            {currentContent}
        </View>
    )
}

const styles = StyleSheet.create({
    tabsContainer: {
        ...globalStyles.fullWidth,
        ...globalStyles.alignCentre,
        height: GetScaledFactorX(30),
        flex: 0,
    },
    buttonRow: {
        ...globalStyles.flex,
        ...globalStyles.flexRow,
    },
})
