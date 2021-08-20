import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { globalStyles } from '../styles/base-styles'
import { GetScaledFactorX } from '../utils/dimensions-helper'
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { theme } from '../standards'

type Props = {
    value: boolean
    callBackAnswer: (action: boolean) => void
}

export const ActionRequired = (props: Props): JSX.Element => {
    const { callBackAnswer, value = false } = props
    // todo pull these in from a string file
    const label = 'Is there any action required?'

    const [actionRequired, setActionRequired] = useState(value)

    const answerChanged = (action: boolean) => {
        setActionRequired(action)
        callBackAnswer(action)
    }

    return (
        <View style={styles.container}>
            <View
                style={{
                    ...globalStyles.marginHorizontalM,
                    ...globalStyles.marginTopM,
                    ...globalStyles.marginBottomM,
                }}
            >
                <Text style={styles.label}>{label}</Text>
            </View>
            <View style={styles.buttonRow}>
                <Pressable
                    hitSlop={20}
                    style={[
                        styles.buttonBackground,
                        actionRequired === false && { backgroundColor: theme.alcBrand001 },
                    ]}
                    onPress={() => answerChanged(false)}
                >
                    <FontAwesomeIcon
                        color={actionRequired === false ? 'white' : 'black'}
                        size={GetScaledFactorX(20)}
                        icon={faTimes}
                    />
                    <Text style={[styles.label, actionRequired === false && { color: 'white' }]}>No</Text>
                </Pressable>
                <Pressable
                    hitSlop={20}
                    style={[
                        styles.buttonBackground,
                        { ...globalStyles.marginLeftS },
                        actionRequired === true && { backgroundColor: theme.alcBrand001 },
                    ]}
                    onPress={() => answerChanged(true)}
                >
                    <FontAwesomeIcon
                        color={actionRequired === true ? 'white' : 'black'}
                        size={GetScaledFactorX(20)}
                        icon={faCheck}
                    />
                    <Text style={[styles.label, actionRequired === true && { color: 'white' }]}>Yes</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonBackground: {
        ...globalStyles.flex,
        ...globalStyles.flexCenter,
        ...globalStyles.radiusS,
        ...globalStyles.flexColumn,
        paddingVertical: GetScaledFactorX(8), // add to styles
        backgroundColor: '#2632381A',
    },
    buttonRow: {
        ...globalStyles.flexRow,
        ...globalStyles.marginHorizontalM,
        ...globalStyles.marginBottomM,
    },
    container: {
        ...globalStyles.marginTopS,
        backgroundColor: 'white',
    },
    label: {
        ...globalStyles.capitalize,
        ...globalStyles.semiboldText,
        ...globalStyles.sizeMText,
    },
})
