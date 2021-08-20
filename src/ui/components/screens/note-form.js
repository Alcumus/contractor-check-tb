import React, { useContext, useState } from 'react'

import { nanoid } from 'nanoid/non-secure'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { gql, useMutation } from '@apollo/react-hooks'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import StateContext from '../../../context/state-context'
import { StdButton } from '../buttons/std-button'
import { Header } from '../header/header'
import { globalStyles } from '../styles/base-styles'
import { GetScaledFactorX } from '../utils/dimensions-helper'
import { GoBackButton } from './tool-box/goBackButton'

export function ensureArray(item) {
    if (Array.isArray(item)) return item
    return item === null || item === undefined ? [] : [item]
}

const upsertGoodCatchNoteQuery = gql`
    mutation upsertGoodCatchNote($id: NoteUid!, $parent: WfGoodCatchUid!, $record: NoteInput!, $asUser: String) {
        upsertNoteOnWfGoodCatchAsNotes(_id: $id, _parentId: $parent, record: $record, commit: true, asUser: $asUser) {
            _id
            error
            fieldErrors {
                field
                error
            }
        }
    }
`

const upsertHighFiveNoteQuery = gql`
    mutation upsertHighFiveNote($id: NoteUid!, $parent: WfHighFiveUid!, $record: NoteInput!, $asUser: String) {
        upsertNoteOnWfHighFiveAsNotes(_id: $id, _parentId: $parent, record: $record, commit: true, asUser: $asUser) {
            _id
            error
            fieldErrors {
                field
                error
            }
        }
    }
`

export const NoteForm = ({ navigation, route, parentItem: paramParent, note: paramNote }) => {
    const editingNote = route?.params?.note || paramNote
    const parentItem = route?.params?.parentItem || paramParent

    const { note, _parent_uid, _id } = editingNote || {}
    const parentId = _parent_uid || parentItem?._id
    const typeName = parentItem?.__typename || editingNote?._parent?.__typename

    // console.log('LOG>>>', JSON.stringify(editingNote))
    // console.log('LOG>>>', JSON.stringify(parentItem))

    const query = typeName === 'WfGoodCatch' ? upsertGoodCatchNoteQuery : upsertHighFiveNoteQuery

    const [upsertNote] = useMutation(query)

    const [userInput, setUserInput] = useState(note || '')
    const { state } = useContext(StateContext)
    const { user } = state

    const onChangeText = (input) => {
        if (userInput !== input) {
            setUserInput(input)
        }
    }

    const saveNote = async () => {
        try {
            const __result = await upsertNote({
                variables: {
                    id: _id || nanoid(14),
                    parent: parentId,
                    record: { note: userInput, submittedByUser_uid: user._id, _parent_uid: parentId },
                    asUser: user.email,
                },
                refetchQueries:
                    typeName === 'WfGoodCatch'
                        ? ['getGoodCatchNotes', 'getGoodCatch']
                        : ['getHighFiveNotes', 'getHighFive'],
            })
            // console.log('CREATED>>>', JSON.stringify(result))
            navigation.goBack()
        } catch (e) {
            console.log('ERROR>>>', e)
            alert(JSON.stringify(e))
        }
    }

    return (
        <ScrollView>
            <Header
                label={`${note ? 'Edit' : 'Add'} note`}
                startAdornment={<GoBackButton icon={faTimes} />}
                style={[globalStyles.marginLeftS, globalStyles.marginRightS]}
            />

            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <View style={styles.container}>
                    <View
                        style={{
                            ...globalStyles.marginHorizontalM,
                            ...globalStyles.marginTopM,
                            ...globalStyles.marginBottomM,
                        }}
                    >
                        <Text style={textStyles.whLabel}>Note</Text>
                    </View>
                    <View style={textStyles.outlined}>
                        <TextInput
                            onSubmitEditing={() => null}
                            scrollEnabled={true}
                            placeholder={'Enter your note here'}
                            style={textStyles.answerText}
                            autoCapitalize={'sentences'}
                            multiline
                            value={userInput}
                            onChangeText={onChangeText}
                        />
                    </View>
                </View>

                <StdButton
                    backgroundStyle={{
                        backgroundColor: '#13599A',
                        marginLeft: 8,
                        marginRight: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    labelColor={'white'}
                    label={`${note ? 'Save' : 'Create'} note`}
                    callBack={saveNote}
                />
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        ...globalStyles.full100,
        backgroundColor: '#F1F3F3',
        flex: 1,
    },
})

const textStyles = StyleSheet.create({
    answerText: {
        ...globalStyles.sizeXsText,
        ...globalStyles.capitalize,
        ...globalStyles.darkText,
        ...globalStyles.sizeXsText,
        ...globalStyles.marginHorizontalS,
        height: GetScaledFactorX(104),
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
