import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { globalStyles } from '../styles/base-styles'
import { GetScaledFactorX, GetScreenHeight } from '../utils/dimensions-helper'
import { faTimes, faCheck, faSearch } from '@fortawesome/free-solid-svg-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { User } from '../user/profile'
import { UserSelect } from '../screens/user-chooser'

type SubmitType = {
    label: string
    icon?: IconProp
    callBack: () => void
}

type Props = {
    label?: string
    value: User[]
    dismissed: () => void
    accept: (person: User[]) => void
}

export const FilterPeopleCard = (props: Props): JSX.Element => {
    const { accept, dismissed, value = [], label } = props
    const [filter, setFilter] = useState('')
    const safeInsets = useSafeAreaInsets()
    const [selectedUsers, setSelectedUsers] = useState(value)

    const headerLabel = label !== undefined ? label : 'Who should resolve it?'

    const handleDismiss = () => {
        setSelectedUsers([])
        dismissed()
    }

    const handleAccept = () => {
        accept(selectedUsers)
    }

    const handleSelectedUsers = (users: User[]) => {
        setSelectedUsers(users)
    }

    return (
        <View style={[styles.container, { height: GetScreenHeight() - safeInsets.top - safeInsets.bottom + 30 }]}>
            <View
                style={{
                    ...globalStyles.marginHorizontalM,
                    ...globalStyles.marginTopL,
                    ...globalStyles.marginBottomL,
                }}
            >
                <View style={styles.buttonRow}>
                    <Pressable hitSlop={20} onPress={handleDismiss}>
                        <FontAwesomeIcon color={'black'} size={GetScaledFactorX(20)} icon={faTimes} />
                    </Pressable>
                    <Pressable hitSlop={20} onPress={handleAccept}>
                        <FontAwesomeIcon color={'black'} size={GetScaledFactorX(20)} icon={faCheck} />
                    </Pressable>
                </View>
                {!!headerLabel && <Text style={styles.submitText}>{headerLabel}</Text>}
            </View>
            <View style={styles.buttonRowOutline}>
                <FontAwesomeIcon
                    color={'black'}
                    size={GetScaledFactorX(20)}
                    icon={faSearch}
                    style={{ ...globalStyles.marginHorizontalM }}
                />
                <TextInput
                    style={styles.answerText}
                    placeholder="Search employee"
                    multiline={false}
                    onChangeText={(value) => setFilter(value)}
                />
            </View>
            <View style={{ ...globalStyles.marginHorizontalM, marginBottom: GetScaledFactorX(160) }}>
                <UserSelect selectedUsers={value} filter={filter} callbackWithAllSelectedUsers={handleSelectedUsers} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    answerText: {
        ...globalStyles.capitalize,
        ...globalStyles.darkText,
        ...globalStyles.sizeSText,
        ...globalStyles.marginHorizontalS,
    },
    buttonRow: {
        ...globalStyles.flexRow,
        ...globalStyles.marginBottomM,
        ...globalStyles.justifySpaceBetween,
    },
    buttonRowOutline: {
        ...globalStyles.flexRow,
        ...globalStyles.radiusM,
        ...globalStyles.marginHorizontalM,
        ...globalStyles.alignCentre,
        borderColor: '#2632381A',
        borderWidth: 2,
        height: GetScaledFactorX(48),
    },
    container: {
        ...globalStyles.radiusTopL,
        backgroundColor: 'white',
    },
    submitText: {
        ...globalStyles.semiboldText,
        ...globalStyles.sizeMText,
        ...globalStyles.capitalize,
    },
})
