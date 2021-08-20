import { gql, useQuery } from '@apollo/react-hooks'
import { Avatar, Chip } from 'react-native-paper'
import React from 'react'
import { Box } from '../styles/BoxTheme'
import { StyleSheet, Text, View } from 'react-native'

export const getUserProfile = gql`
    query getUserProfile($email: String!) {
        getUserByEmail(email: $email) {
            name
            picture
            phone
        }
    }
`

function makeInitialsFrom(email) {
    if (!email) return ''
    const mail = email.split('@')[0].replace(/\W+/g, ' ')
    return (mail.split(' ')[0][0] + mail.split(' ').slice(-1)[0][0]).toUpperCase()
}

export const UserAvatar = ({ email, ...props }) => {
    const { loading, error, data = {} } = useQuery(getUserProfile, { variables: { email } })
    if (loading || !email) {
        return <Text style={{ color: 'white', fontSize: 22 }}>{makeInitialsFrom(email)}</Text>
    }
    if (error) {
        console.error('ERROR>>>', error, email)
        return null
    }
    return <Avatar.Image size={48} {...props} source={{ uri: data.getUserByEmail?.picture }} />
}

export const UserAvatarAndName = ({ email, nameStyle, avatarSize = 48, meta, ...props }) => {
    const { loading, error, data = {} } = useQuery(getUserProfile, { variables: { email } })
    if (loading) return null

    return (
        <Box flexDirection="row" alignItems="center">
            <Box mr="s">
                <Avatar.Image size={avatarSize} {...props} source={{ uri: data.getUserByEmail?.picture }} />
            </Box>
            <Box mr="s">
                <Text style={nameStyle}>{data.getUserByEmail?.name}</Text>
                {meta && typeof meta === 'function' ? meta() : meta}
            </Box>
        </Box>
    )
}

export const UserAvatarAndNameChip = ({ email, person, avatarSize = 48, meta, ...props }) => {
    const { loading, error, data = {} } = useQuery(getUserProfile, { variables: { email: person.email } })

    if (loading) return null
    if (error) return null

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Chip style={chipStyles.chip}>
                <View style={{ marginRight: 8, alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Avatar.Image
                        style={{ marginTop: 4 }}
                        size={avatarSize}
                        source={{ uri: data.getUserByEmail.picture }}
                    />
                </View>
                <View>
                    <Text style={chipStyles.chipText}>
                        {person.firstName} {person.lastName}
                    </Text>
                </View>
            </Chip>
        </View>
    )
}

const chipStyles = StyleSheet.create({
    chip: {
        backgroundColor: '#CCECF7',
        height: 32,
    },
    chipText: {
        fontSize: 14,
        color: '#444',
    },
})
