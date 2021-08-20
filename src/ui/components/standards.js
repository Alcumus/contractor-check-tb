import { ScrollView, StyleSheet, View } from 'react-native'
import { globalStyles } from './styles/base-styles'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Header } from './header/header'
import { burgerMenu } from './screens/burger-menu'
import Config from '../../config/config'

const { header, theme } = Config
export { theme, header }

export function StandardPageContents({ children, ...props }) {
    return (
        <ScrollView
            {...props}
            style={[
                globalStyles.paddingLeftM,
                globalStyles.paddingRightM,
                globalStyles.paddingTopM,
                globalStyles.paddingBottomL,
                { backgroundColor: theme.background, height: '100%' },
                props.style,
            ]}
        >
            {children}
        </ScrollView>
    )
}

export function StandardPageView({ children, ...props }) {
    return <View style={[styles.root, props.style]}>{children}</View>
}

export function StandardHeader({ label, startAdornment, ...props }) {
    const navigation = useNavigation()
    const drawer = () => navigation.openDrawer()
    return (
        <Header
            label={label}
            startAdornment={startAdornment ?? burgerMenu({ onPress: drawer })}
            style={[globalStyles.marginLeftS, globalStyles.marginRightS, { flex: 0, flexGrow: 0 }]}
            {...props}
        />
    )
}

const styles = StyleSheet.create({
    root: {
        ...globalStyles.full100,
        backgroundColor: theme.alcBrand001,
    },
})
const filterBarStyles = StyleSheet.create({
    filterBar: {
        width: '100%',
        zIndex: 1,
        padding: 4,
        backgroundColor: theme.background,
        minHeight: 32,
        shadowRadius: 6,
        shadowOpacity: 1,
        shadowColor: '#4444',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 0,
    },
})

export function StandardFilterBar({ children }) {
    return <View style={[filterBarStyles.filterBar]}>{children}</View>
}
