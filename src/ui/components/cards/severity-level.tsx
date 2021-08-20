import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { globalStyles } from '../styles/base-styles'
import { TaskId } from '../../../types/good-catch-type'
import { Picker } from '@react-native-picker/picker'

const DummyData: TaskId[] = [
    { _id: 'a', label: 'Low', value: 'low', tipString: 'An issue that doesn’t need to be resolved immediately.' },
    { _id: 'b', label: 'Moderate', value: 'moderate', tipString: 'An issue that can wait to be resolved.' },
    { _id: 'c', label: 'Serious', value: 'serious', tipString: 'An issue that must be resolved as soon as possible.' },
    { _id: 'd', label: 'Critical', value: 'critical', tipString: 'An issue that must be resolved immediately.' },
]

type Props = {
    value?: TaskId
    label?: string
    callbackSeveritySelected: (level: string) => void
}

export const SeverityLevelCard = (props: Props): JSX.Element => {
    const { callbackSeveritySelected, value, label = 'Whats the severity level?' } = props

    const [level, setLevel] = useState<string>(value || 'low')
    const [tip, setTip] = useState<string>(DummyData[0].tipString)

    return (
        <View style={styles.container}>
            <View
                style={{
                    ...globalStyles.marginHorizontalM,
                    ...globalStyles.flexRow,
                    ...globalStyles.alignCentre,
                    ...globalStyles.marginTopL,
                }}
            >
                {!!label && <Text style={styles.submitText}>{label}</Text>}
            </View>
            <View style={[globalStyles.marginHorizontalM, styles.outlined]}>
                <Picker
                    selectedValue={level}
                    onValueChange={(value) => {
                        callbackSeveritySelected(value)
                        const tip = DummyData.find((item) => value === item.label)?.tipString
                        setTip(tip || '')
                        setLevel(value)
                    }}
                >
                    {DummyData.map((element) => {
                        return <Picker.Item key={element.value} label={element.label} value={element.value} />
                    })}
                </Picker>
            </View>
            <Text style={styles.tipText}>{tip}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.marginTopS,
        backgroundColor: 'white',
    },
    submitText: {
        ...globalStyles.semiboldText,
        ...globalStyles.sizeMText,
        ...globalStyles.capitalize,
        ...globalStyles.marginBottomM,
    },
    outlined: {
        ...globalStyles.radiusM,
        ...globalStyles.marginBottomM,
        borderColor: '#2632381A',
        borderWidth: 2,
    },
    tipText: {
        ...globalStyles.darkText,
        ...globalStyles.sizeXXsText,
        ...globalStyles.marginHorizontalM,
        ...globalStyles.paddingBottomM,
    },
})
