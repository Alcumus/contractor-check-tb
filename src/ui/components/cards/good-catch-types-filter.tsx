import { IconProp } from '@fortawesome/fontawesome-svg-core'
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
import { GoodCatchType } from '../../../types/good-catch-type'
import stateContext from '../../../context/state-context'

export type DD = {
    _id: string
    goodCatchType: string
}

type SubmitType = {
    label: string
    icon?: IconProp
    callBack: () => void
}

type Props = {
    values: GoodCatchType[]
    dismissed: () => void
    accept: (goodCatches: GoodCatchType[]) => void
}

export const FilterGoodCatchTypesCard = (props: Props): JSX.Element => {
    const { accept, dismissed, values = [] } = props
    const [filter, setFilter] = useState('')
    const safeInsets = useSafeAreaInsets()
    const map: Record<string, boolean> = {}

    values.forEach((goodcatch: GoodCatchType) => {
        map[goodcatch._id] = true
    })

    const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>(map || {})

    const stringKey = 'goodCatchType'
    const label = 'What type of good catch is this?'
    const keyExtactor = (item: GoodCatchType) => item._id

    const { goodCatchTypes } = useContext(stateContext).state

    const handleDismiss = () => {
        setSelectedIds({})
        dismissed()
    }

    const handleAccept = () => {
        const goodCatches = goodCatchTypes.reduce((acc: GoodCatchType[], goodCatch: GoodCatchType) => {
            if (goodCatch._id && selectedIds[goodCatch._id] && selectedIds[goodCatch._id] === true) {
                acc.push(goodCatch)
            }
            return acc
        }, [])
        accept(goodCatches)
    }

    const renderItem = ({ item }: { item: DD }) => {
        const { _id, goodCatchType } = item
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
        const value = selectedIds[_id] && selectedIds[_id] === true ? true : false
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
                    <Text style={styles.answerText}>{goodCatchType}</Text>
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
                content={goodCatchTypes}
                filter={filter}
                render={(filteredContent: DD[]) => {
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
