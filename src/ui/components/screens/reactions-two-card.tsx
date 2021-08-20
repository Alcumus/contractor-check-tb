import React, { useState, useContext, useRef } from 'react'
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, View } from 'react-native'

import { globalStyles } from '../styles/base-styles'

import { GetScaledFactorX } from '../utils/dimensions-helper'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { GoodCatchReaction } from './news-feed/good-catch-reaction'

type Props = {
    item: any
    onDismiss: () => void
}

export const GoodCatchReactions = (props: Props): JSX.Element => {
    const { onDismiss, item } = props

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View
                style={{
                    ...globalStyles.marginHorizontalM,
                    ...globalStyles.marginTopL,
                }}
            >
                <View style={styles.buttonRow}>
                    <Pressable hitSlop={20} onPress={() => onDismiss()}>
                        <FontAwesomeIcon color={'black'} size={GetScaledFactorX(20)} icon={faTimes} />
                    </Pressable>
                    <Text style={styles.submitText}></Text>
                    <Pressable hitSlop={20} onPress={() => onDismiss()}>
                        <FontAwesomeIcon color={'black'} size={GetScaledFactorX(20)} icon={faCheck} />
                    </Pressable>
                </View>
            </View>
            <GoodCatchReaction item={item} />
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.full100,
        ...globalStyles.radiusTopL,
        backgroundColor: 'white',
    },
    buttonRow: {
        ...globalStyles.flexRow,
        ...globalStyles.justifySpaceBetween,
    },
    submitText: {
        ...globalStyles.semiboldText,
        ...globalStyles.sizeMText,
        ...globalStyles.capitalize,
    },
})
function setRefresh(arg0: (r: any) => any): void {
    throw new Error('Function not implemented.')
}
