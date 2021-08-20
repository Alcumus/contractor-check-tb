import React, { useState } from 'react'

import { StyleSheet, View } from 'react-native'

import { apolloClient } from '../../../../../App'
import Config from '../../../../config/config'
import { Header } from '../../header/header'
import { globalStyles } from '../../styles/base-styles'
import { burgerMenu } from '../burger-menu'
import { FeedCards } from './feed-cards'
import { notificationsMenu } from './notifications-icon'

const { theme } = Config

const styles = StyleSheet.create({
    root: {
        ...globalStyles.full100,
        backgroundColor: theme.alcBrand001,
    },
})

export const NewsFeedScreen = ({ navigation }) => {
    const drawer = () => navigation.openDrawer()
    const [refresh, setRefresh] = useState(0)
    return (
        <View style={styles.root}>
            <Header
                label="News Feed"
                startAdornment={burgerMenu({ onPress: drawer })}
                endAdornment={notificationsMenu}
                style={[globalStyles.marginLeftS, globalStyles.marginRightS]}
            />
            <View // Feed container
                style={[
                    globalStyles.paddingLeftM,
                    globalStyles.paddingRightM,
                    { backgroundColor: '#F2F2F2', height: '100%' },
                ]}
            >
                <FeedCards
                    key={refresh}
                    toRefresh={() => {
                        apolloClient.resetStore()
                        setRefresh((r) => r + 1)
                    }}
                />
            </View>
        </View>
    )
}
