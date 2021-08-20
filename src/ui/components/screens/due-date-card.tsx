import { StyleSheet, Text, View } from 'react-native'
import { globalStyles } from '../styles/base-styles'
import { GetScaledFactorX } from '../utils/dimensions-helper'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import Sugar from 'sugar'
import { theme } from '../standards'
import { convertToDate, setFromEvent } from '../../../lib/utils'
import React from 'react'

export function DueDateCard({
    value,
    onSetDueDate,
    label,
}: {
    value: Date
    onSetDueDate: (date: Date) => void
    label: string
}) {
    return (
        <View style={dateStyles.container}>
            <View
                style={{
                    ...globalStyles.marginHorizontalM,
                    ...globalStyles.marginTopM,
                    ...globalStyles.marginBottomM,
                }}
            >
                <Text style={dateStyles.whLabel}>{label}</Text>
            </View>
            <View style={dateStyles.outlined}>
                <RNDateTimePicker
                    minimumDate={Sugar.Date.beginningOfDay(Sugar.Date.create())}
                    textColor={theme.textColor}
                    display="spinner"
                    onChange={setFromEvent(convertToDate(onSetDueDate))}
                    value={new Date(value)}
                />
            </View>
        </View>
    )
}

const dateStyles = StyleSheet.create({
    container: {
        ...globalStyles.marginTopS,
        backgroundColor: 'white',
        height: GetScaledFactorX(300),
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
