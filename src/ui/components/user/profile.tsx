import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Config from '../../../config/config'
import { GetScaledFactorX } from '../utils/dimensions-helper'
import { globalStyles } from '../styles/base-styles'
import { UserAvatar } from './UserAvatar'

// todo do we what to ative and use thing like Vibrancy views for ios and material for android,
// we wont wrap this in a inset view so that in goes under knotch displays

const { theme, profileGreeting } = Config

export type User = {
    firstName: string
    lastName: string
    email: string
    _id: string
    profileImage: string
    position?: {
        role: string
    }
}

type Props = {
    user: User
}

export const Profile = (props: Props): JSX.Element => {
    const { user } = props
    const now = new Date().getHours()

    const greeting = now < 12 ? profileGreeting.morning : now < 18 ? profileGreeting.afternoon : profileGreeting.evening

    return (
        <View style={styles.container}>
            <View style={styles.profileRow}>
                <View>
                    <Text style={styles.greetingLabel}>{greeting}</Text>
                    <Text style={styles.nameLabel}>{`${user.firstName} ${user.lastName}!`}</Text>
                </View>
                <View style={styles.profilePicture}>
                    <UserAvatar email={user.email} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.fullWidth,
        ...globalStyles.justifyCentre,
        ...globalStyles.marginBottomM,
        height: GetScaledFactorX(48),
    },
    greetingLabel: {
        ...globalStyles.sizeSText,
        ...globalStyles.regularText,
        color: theme.greeting,
    },
    nameLabel: {
        ...globalStyles.sizeLText,
        ...globalStyles.regularText,
        ...globalStyles.capitalize,
        color: 'white',
    },
    profilePicture: {
        ...globalStyles.flexCenter,
        backgroundColor: theme.alcSys007,
        borderRadius: GetScaledFactorX(23),
        height: GetScaledFactorX(48),
        width: GetScaledFactorX(48),
    },
    profileRow: {
        ...globalStyles.flexRow,
        ...globalStyles.justifySpaceBetween,
        ...globalStyles.marginHorizontalM,
    },
})
