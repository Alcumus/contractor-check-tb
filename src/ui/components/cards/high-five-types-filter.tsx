import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React, { useContext, useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { globalStyles } from '../styles/base-styles'
import { GetScaledFactorX, GetScreenHeight } from '../utils/dimensions-helper'
import { faTimes, faCheck, faSearch } from '@fortawesome/free-solid-svg-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Search } from '../search/search'
import { FlatList } from 'react-native-gesture-handler'
import { Switch } from 'react-native-paper'
import stateContext from '../../../context/state-context'
import { HighFiveType } from '../../../reducers/app-store'

export type DD = {
    _id: string
    goodCatchType: string
}
type Props = {
    values: HighFiveType[]
    dismissed: () => void
    accept: (highFives: HighFiveType[]) => void
}

export const FilterHighFiveTypesCard = (props: Props): JSX.Element => {
    const { accept, dismissed, values = [] } = props
    const [filter, setFilter] = useState('')
    const safeInsets = useSafeAreaInsets()
    const map: Record<string, boolean> = {}

    values.forEach((highFive: HighFiveType) => {
        map[highFive._id] = true
    })

    const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>(map || {})

    const stringKey = 'highFiveType'
    const label = 'What type of high five is this?'
    const keyExtactor = (item: HighFiveType) => item._id

    const { highFiveTypes } = useContext(stateContext).state

    const handleDismiss = () => {
        setSelectedIds({})
        dismissed()
    }

    const handleAccept = () => {
        const highFives = highFiveTypes.reduce((acc: HighFiveType[], highFive: HighFiveType) => {
            if (highFive._id && selectedIds[highFive._id] && selectedIds[highFive._id] === true) {
                acc.push(highFive)
            }
            return acc
        }, [])
        accept(highFives)
    }

    const renderItem = ({ item }: { item: HighFiveType }) => {
        const { _id, highFiveType } = item
        const value = selectedIds[_id] && selectedIds[_id] === true ? true : false
        const onValueChanged = (flag) => {
            const ids = { ...selectedIds }
            if (flag === false) {
                if (selectedIds[_id]) {
                    delete ids[_id]
                }
            } else {
                ids[_id] = flag
            }
            setSelectedIds(ids)
        }
        return (
            <Pressable onPress={() => onValueChanged(!value)}>
                <View
                    style={{
                        ...globalStyles.flexRow,
                        ...globalStyles.marginHorizontalM,
                        ...globalStyles.justifySpaceBetween,
                        ...globalStyles.marginTopM,
                    }}
                >
                    <Text style={styles.answerText}>{highFiveType}</Text>
                    <Switch onValueChange={onValueChanged} color="black" value={value} />
                </View>
            </Pressable>
        )
    }

    return (
        <View style={[styles.container, { height: GetScreenHeight() - safeInsets.top - safeInsets.bottom }]}>
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
                <Text style={styles.submitText}>{label}</Text>
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
                    placeholder="Search"
                    multiline={false}
                    onChangeText={(value) => setFilter(value)}
                />
            </View>
            <Search
                keyString={stringKey}
                content={highFiveTypes}
                filter={filter}
                render={(filteredContent: HighFiveType[]) => {
                    return (
                        <FlatList
                            contentContainerStyle={styles.list}
                            data={filteredContent}
                            keyExtractor={keyExtactor}
                            style={{ ...globalStyles.flex }}
                            renderItem={renderItem}
                        />
                    )
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    answerText: {
        // ...globalStyles.capitalize,
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
    list: {
        // ...globalStyles.marginHorizontalM,
        // ...globalStyles.full100,
    },
    submitText: {
        ...globalStyles.semiboldText,
        ...globalStyles.sizeMText,
        ...globalStyles.capitalize,
    },
})
