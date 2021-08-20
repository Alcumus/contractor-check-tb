import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import { globalStyles } from '../styles/base-styles'
import { GetScaledFactorX } from '../utils/dimensions-helper'

type Props = {
    value: string
    label: string
    defaultLabel: string
    callBackText: (string: string) => void
}

export const AdditionalNotes = (props: Props): JSX.Element => {
    const { callBackText, label = '', defaultLabel = '', value } = props
    // todo pull these in from a string file
    const whLabel = label
    const whdLabel = defaultLabel
    const [userInput, setUserInput] = useState<string>(value || '')

    const onChangeText = (input: string) => {
        setUserInput(input)
    }

    useEffect(() => {
        callBackText(userInput)
    }, [callBackText, userInput])

    return (
        <View style={styles.container}>
            <View
                style={{
                    ...globalStyles.marginHorizontalM,
                    ...globalStyles.marginTopM,
                    ...globalStyles.marginBottomM,
                }}
            >
                <Text style={styles.whLabel}>{whLabel}</Text>
            </View>
            <View style={styles.outlined}>
                <TextInput
                    value={userInput}
                    onSubmitEditing={() => null}
                    scrollEnabled={true}
                    placeholder={whdLabel}
                    style={styles.answerText}
                    autoCapitalize={'sentences'}
                    multiline
                    onChangeText={onChangeText}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    answerText: {
        ...globalStyles.sizeXsText,
        ...globalStyles.capitalize,
        ...globalStyles.darkText,
        ...globalStyles.sizeXsText,
        ...globalStyles.marginHorizontalS,
        height: GetScaledFactorX(104),
    },
    container: {
        ...globalStyles.marginTopS,
        backgroundColor: 'white',
        height: GetScaledFactorX(180),
    },
    outlined: {
        ...globalStyles.marginHorizontalM,
        ...globalStyles.radiusM,
        ...globalStyles.marginBottomM,
        borderColor: '#2632381A',
        borderWidth: 2,
    },
    whLabel: {
        ...globalStyles.capitalize,
        ...globalStyles.semiboldText,
        ...globalStyles.sizeMText,
    },
})
