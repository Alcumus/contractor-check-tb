import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View, TextInput } from 'react-native'
import { globalStyles } from '../styles/base-styles'
import { GetScaledFactorX } from '../utils/dimensions-helper'
import { faLock, faShare } from '@fortawesome/free-solid-svg-icons'
import { RadioButton } from 'react-native-paper'

type Props = {
    visibility: boolean
    callback: (visibilityGroup: boolean) => void
}
// True public and False private ???
export const WhoShouldSeeThis = (props: Props): JSX.Element => {
    const { callback, visibility } = props
    // todo pull these in from a string file
    const label = 'Who should see this?'
    const [value, setValue] = React.useState(visibility ? 'My Site' : 'Private')

    return (
        <View style={styles.container}>
            <View
                style={{
                    ...globalStyles.marginHorizontalM,
                    ...globalStyles.marginTopM,
                    ...globalStyles.marginBottomM,
                }}
            >
                <Text style={styles.whLabel}>{label}</Text>
            </View>
            <RadioButton.Group onValueChange={(newValue) => setValue(newValue)} value={value}>
                <Pressable
                    onPress={() => {
                        callback(true)
                        setValue('My Site')
                    }}
                    style={{ ...globalStyles.flexRow, ...globalStyles.alignCentre, ...globalStyles.marginHorizontalM }}
                >
                    <FontAwesomeIcon color={'#263836CC'} size={GetScaledFactorX(20)} icon={faShare} />
                    <View style={{ width: '80%' }}>
                        <Text style={styles.label}>My Site</Text>
                        <Text style={styles.smallerLabel}>All teammates on this site can see this</Text>
                    </View>
                    <RadioButton value="My Site" status={value === 'My Site' ? 'checked' : 'unchecked'} />
                </Pressable>
                <Pressable
                    onPress={() => {
                        callback(false)
                        setValue('Private')
                    }}
                    style={{
                        ...globalStyles.flexRow,
                        ...globalStyles.alignCentre,
                        ...globalStyles.marginHorizontalM,
                        ...globalStyles.marginTopM,
                    }}
                >
                    <FontAwesomeIcon color={'#263836CC'} size={GetScaledFactorX(20)} icon={faLock} />
                    <View style={{ width: '80%' }}>
                        <Text style={styles.label}>Private</Text>
                        <Text style={styles.smallerLabel}>
                            Only your supervisor and teammates assigned to this will see it
                        </Text>
                    </View>
                    <RadioButton value="Private" status={value === 'Private' ? 'checked' : 'unchecked'} />
                </Pressable>
            </RadioButton.Group>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.marginTopM,
        backgroundColor: 'white',
        height: GetScaledFactorX(186),
    },
    label: {
        ...globalStyles.marginRightM,
        ...globalStyles.sizeSText,
    },
    smallerLabel: {
        ...globalStyles.marginHorizontalM,
        ...globalStyles.sizeXXsText,
        opacity: 0.5,
    },
    whLabel: {
        ...globalStyles.capitalize,
        ...globalStyles.semiboldText,
        ...globalStyles.sizeMText,
    },
})
