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
import stateContext from '../../../context/state-context'
import { CorrectiveAction } from '../../../types/good-catch-type'
import uniqBy from 'lodash-es/uniqBy'

export type ResolveAction = {
    _id: string
    correctiveActionType: string
}

type SubmitType = {
    label: string
    icon?: IconProp
    callBack: () => void
}

type Props = {
    values: CorrectiveAction[]
    dismissed: () => void
    accept: (CorrectiveAction: CorrectiveAction[]) => void
}

export const FilterActionResolveCard = (props: Props): JSX.Element => {
    const { accept, dismissed, values = [] } = props
    const [filter, setFilter] = useState('')
    const safeInsets = useSafeAreaInsets()
    const map: Record<string, boolean> = {}

    values.forEach((correctionType: CorrectiveAction) => {
        map[correctionType._id] = true
    })

    let { correctiveActionTypes } = useContext(stateContext).state

    correctiveActionTypes = uniqBy(correctiveActionTypes, (a) => a.correctiveActionType.toLowerCase())

    values.forEach((correctiveAction) => {
        map[correctiveAction._id] = true
    })

    const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>(map || {})

    const stringKey = 'correctiveActionType'
    const label = 'How should it be resolved?'
    const keyExtactor = (item: ResolveAction) => item._id as string

    const handleDismiss = () => {
        setSelectedIds({})
        dismissed()
    }

    const handleAccept = () => {
        const correctionTypes = correctiveActionTypes.reduce(
            (acc: CorrectiveAction[], correction: CorrectiveAction) => {
                if (correction._id && selectedIds[correction._id] && selectedIds[correction._id] === true) {
                    acc.push(correction)
                }
                return acc
            },
            []
        )
        accept(correctionTypes)
    }

    const renderItem = ({ item }: { item: CorrectiveAction }) => {
        const { _id, correctiveActionType } = item

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
                        ...globalStyles.flexRow,
                    }}
                >
                    <View style={{ width: '80%' }}>
                        <Text style={styles.answerText}>{correctiveActionType}</Text>
                    </View>

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
                    placeholder="Search actions"
                    multiline={false}
                    onChangeText={(value) => setFilter(value)}
                />
            </View>
            <Search
                keyString={stringKey}
                content={correctiveActionTypes}
                filter={filter}
                render={(filteredContent: ResolveAction[]) => {
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
    submitText: {
        ...globalStyles.semiboldText,
        ...globalStyles.sizeMText,
        ...globalStyles.capitalize,
    },
    list: {
        // ...globalStyles.marginHorizontalM,
        // ...globalStyles.full100,
    },
})
