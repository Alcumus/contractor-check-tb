import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Chip } from 'react-native-paper'
import { globalStyles } from '../styles/base-styles'

type ChipContent = {
    label: string
    avatar?: React.ReactNode
}

type Props = {
    label: string
    defaultLabel: string
    tipLabel?: string
    callbackOpenFilter?: (flag: boolean) => void
    chips: (string | ChipContent)[]
}

export const Selector = (props: Props): JSX.Element => {
    const { chips = [], callbackOpenFilter, label = '', defaultLabel = '', tipLabel = '' } = props

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
            <View style={{ ...globalStyles.flexRow }}>
                <Pressable onPress={() => callbackOpenFilter && callbackOpenFilter(true)} style={styles.outlined}>
                    {chips.length && chips.indexOf(undefined) === -1 ? (
                        chips.map((chip, ix) => {
                            const label = typeof chip === 'string' ? chip : chip.label
                            const avatar = typeof chip !== 'string' ? chip.avatar : undefined
                            return (
                                <Chip
                                    avatar={avatar}
                                    key={`${chip}${ix}`}
                                    style={{
                                        ...globalStyles.marginHorizontalXS,
                                        ...globalStyles.marginTopXS,
                                        ...globalStyles.marginBottomXS,
                                    }}
                                >
                                    <Text style={styles.answerText}>{label}</Text>
                                </Chip>
                            )
                        })
                    ) : (
                        <View style={{ ...globalStyles.fullWidth }}>
                            <Text style={styles.answerText}>{defaultLabel}</Text>
                        </View>
                    )}
                </Pressable>
            </View>
            {!!tipLabel && <Text style={styles.tipText}>{tipLabel}</Text>}
        </View>
    )
}

export const styles = StyleSheet.create({
    answerText: {
        ...globalStyles.darkText,
        ...globalStyles.sizeSText,
        ...globalStyles.marginLeftM,
        ...globalStyles.marginTopS,
        ...globalStyles.marginBottomS,
    },
    container: {
        backgroundColor: 'white',
        ...globalStyles.marginTopS,
    },
    outlined: {
        ...globalStyles.flex,
        ...globalStyles.marginHorizontalM,
        ...globalStyles.flexRow,
        ...globalStyles.radiusM,
        ...globalStyles.flexWrap,
        borderColor: '#2632381A',
        borderWidth: 2,
    },
    tipText: {
        ...globalStyles.capitalize,
        ...globalStyles.darkText,
        ...globalStyles.sizeXXsText,
        ...globalStyles.marginHorizontalM,
        ...globalStyles.marginTopM,
        ...globalStyles.marginBottomS,
    },
    whLabel: {
        ...globalStyles.capitalize,
        ...globalStyles.semiboldText,
        ...globalStyles.sizeMText,
    },
})
