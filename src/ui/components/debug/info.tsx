import { globalStyles } from '../styles/base-styles'
import { Text, View, StyleSheet } from 'react-native'
import { appURL, currentEnv, isDev, useToken } from '../../../../env'
import React from 'react'
import { List, Title } from 'react-native-paper'
import { UserAvatar } from '../user/UserAvatar'

const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
    },
})

export const DebugInfo = (): JSX.Element => {
    return (
        <View>
            <Title>
                <Text>Debug Info</Text>
            </Title>

            <List.Item title={`${currentEnv}`} description={`Current Env`} />
            <List.Item title={`${JSON.stringify(isDev)}`} description={`isDev`} />
            <List.Item title={`${useToken}`} description={'Using Token'} />
            <List.Item title={`${appURL.split('/')[2]}`} description={'Domain'} />

            <List.Item title={`${appURL.split('/').slice(3).join('/')}`} description={'Path'} />
        </View>
    )
}
