import React, { useState, useContext, useRef } from 'react'
import {
    ActivityIndicator,
    Button,
    DeviceEventEmitter,
    Keyboard,
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native'

import { globalStyles } from '../styles/base-styles'

import { Selector } from '../cards/selector'
import { GetScaledFactorX, GetScreenHeight } from '../utils/dimensions-helper'
import { Slider, ToSide } from '../slider/slider'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { FilterPeopleCard } from '../cards/people-filter'
import { FilterActionResolveCard } from '../cards/resolve-actions-filter'
import { Transitioning, Transition, TransitioningView } from 'react-native-reanimated'
import { CorrectiveAction } from '../../../types/good-catch-type'
import { User } from '../user/profile'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { WhatHappened } from '../cards/what-happened'
import { gql } from '@apollo/client/core'
import { useMutation } from '@apollo/react-hooks'
import { goodCatchQueries } from '../../../lib/good-catch-queries'
import Toast from 'react-native-toast-message'
import StateContext from '../../../context/state-context'
import uniq from 'lodash-es/uniq'
import { Box } from '../styles/BoxTheme'
import { raise } from '../../../lib/local-events'

type Props = {
    onDismiss: () => void
    goodCatch: { _id: string }
}

const submitResolution = gql`
    mutation createResolution(
        $goodCatchId: WfGoodCatchUid!
        $users: [WfUserUid]
        $attachments: [URL]
        $notes: String
        $user: WfUserUid!
        $site: WfSiteUid!
        $actions: [WfCorrectiveActionTypeUid]
        $date: Date
    ) {
        createWfGoodCatchResolution(
            record: {
                resolvedBy_uid: $users
                resolutionAttachments: $attachments
                submittedOnSite_uid: $site
                submittedById_uid: $user
                resolutionNotes: $notes
                parentGoodCatchId_uid: $goodCatchId
                correctiveActionsTaken_uid: $actions
                resolvedOnDate: $date
            }
            commit: true
        ) {
            _id
        }
    }
`

const updateResolution = gql`
    mutation updateResolution(
        $id: WfGoodCatchResolutionUid!
        $state: WfGoodCatchResolutionState!
        $submittedByEmail: String!
    ) {
        setWfGoodCatchResolution(_id: $id, _state: $state, asUser: $submittedByEmail, commit: true) {
            ok
        }
    }
`

export const ResolveGoodCatch = (props: Props): JSX.Element => {
    const { onDismiss, goodCatch } = props
    const {
        state: { user },
    } = useContext(StateContext)
    const safeInsets = useSafeAreaInsets()
    const [selectedUsers, setSelectedUser] = useState<User[]>([])
    const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>([])
    const [additionalNotes, setAdditionalNotes] = useState('')
    const [showFilter, setShowFilter] = useState(false)
    const [sliderCard, setSliderCard] = useState<React.ReactNode>(null)
    const [attachments, setAttachments] = useState<string[]>([])
    const [setState, { loading: submitState }] = useMutation(updateResolution, {
        refetchQueries: goodCatchQueries,
        awaitRefetchQueries: true,
    })
    const [createResolution, { loading: submitting }] = useMutation(submitResolution)
    const scrollViewRef = useRef<ScrollView | undefined>()
    const ref = useRef<TransitioningView | null>()
    const handleAccept = async () => {
        const resolution = {
            goodCatchId: goodCatch._id,
            users: uniq(selectedUsers.map((u) => u._id)),
            attachments,
            notes: additionalNotes,
            user: user._id,
            site: user.primarySite_uid,
            actions: correctiveActions.map((a) => a._id),
            date: new Date().toISOString(),
        }
        const {
            data: {
                createWfGoodCatchResolution: { _id },
            },
        } = await createResolution({ variables: resolution })
        if (_id) {
            await setState({ variables: { id: _id, state: 'Resolved', submittedByEmail: user.email } })
            console.log('RESOLVED>>', _id, user.email)
            setTimeout(() => {
                raise('refetch-tasks', 1500)
            })
            Toast.show({
                topOffset: 70,
                type: 'success',
                text1: 'Success',
                text2: 'You have resolved a good catch',
            })
            onDismiss()
        } else {
            Toast.show({
                topOffset: 80,
                type: 'error',
                text1: 'Error',
                text2: 'Could not create the resolution',
            })
        }
    }

    const handleDismiss = () => {
        onDismiss()
    }

    const getNameChips = () => {
        return selectedUsers.reduce((acc: string[], user) => {
            acc.push(`${user.firstName} ${user.lastName}`)
            return acc
        }, [])
    }

    const getCorrectiveActionChips = () => {
        return correctiveActions.reduce((acc: string[], correctiveAction) => {
            acc.push(correctiveAction.correctiveActionType)
            return acc
        }, [])
    }

    const personCard = (
        <FilterPeopleCard
            label="Who Resolved It?"
            value={selectedUsers}
            accept={(user: User[]) => {
                setSelectedUser(user)
                setShowFilter(false)
            }}
            dismissed={() => {
                setSelectedUser([])
                setShowFilter(false)
            }}
        />
    )

    const filterActionResolveCard = (
        <FilterActionResolveCard
            values={correctiveActions}
            accept={(actions: CorrectiveAction[]) => {
                setCorrectiveActions(actions)
                setShowFilter(false)
            }}
            dismissed={() => {
                setCorrectiveActions([])
                setShowFilter(false)
            }}
        />
    )

    const transition = (
        <Transition.Sequence>
            <Transition.Together>
                <Transition.In type="fade" durationMs={300} interpolation="easeIn" />
                <Transition.In type="slide-bottom" durationMs={300} interpolation="easeIn" />
                <Transition.Change durationMs={300} interpolation="linear" />
            </Transition.Together>
        </Transition.Sequence>
    )

    const closeButton = (
        <Pressable
            hitSlop={20}
            style={{
                height: GetScaledFactorX(30),
                width: GetScaledFactorX(30),
                ...globalStyles.marginLeftM,
            }}
            onPress={() => {
                Keyboard.dismiss()
                DeviceEventEmitter.emit('showMenu', false)
            }}
        >
            <FontAwesomeIcon color={'white'} size={GetScaledFactorX(30)} icon={faTimes} />
        </Pressable>
    )

    return submitting || submitState ? (
        <Box mt="xl" width="100%">
            <ActivityIndicator size="large" />
        </Box>
    ) : (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View
                style={{
                    ...globalStyles.marginHorizontalM,
                    ...globalStyles.marginTopL,
                }}
            >
                <View style={styles.buttonRow}>
                    <Pressable hitSlop={20} onPress={handleDismiss}>
                        <FontAwesomeIcon color={'black'} size={GetScaledFactorX(20)} icon={faTimes} />
                    </Pressable>
                    <Text style={styles.submitText}>Resolve Good Catch</Text>
                    {!!correctiveActions.length && !!selectedUsers.length ? (
                        <Pressable hitSlop={20} onPress={handleAccept}>
                            <FontAwesomeIcon color={'black'} size={GetScaledFactorX(20)} icon={faCheck} />
                        </Pressable>
                    ) : (
                        <View />
                    )}
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={{ flex: 1 }}
                    ref={(node) => (scrollViewRef.current = node)}
                    automaticallyAdjustContentInsets
                    onContentSizeChange={() => setTimeout(() => scrollViewRef.current?.scrollToEnd(), 300)}
                >
                    <Transitioning.View ref={(node) => (ref.current = node)} transition={transition}>
                        <Selector
                            tipLabel="Tip: You can select more than one person."
                            defaultLabel="Enter name"
                            label="Who resolved it?"
                            chips={getNameChips()}
                            callbackOpenFilter={(flag) => {
                                setSliderCard(personCard)
                                setShowFilter(flag)
                            }}
                        />
                        <Selector
                            tipLabel="Tip: You can select more than one action."
                            defaultLabel="Select actions taken"
                            label="What corrective action was taken?"
                            chips={getCorrectiveActionChips()}
                            callbackOpenFilter={(flag) => {
                                setSliderCard(filterActionResolveCard)
                                setShowFilter(flag)
                            }}
                        />
                        <WhatHappened
                            value={additionalNotes}
                            label="Additional Notes"
                            defaultLabel="Add any additional details about the resolution"
                            callBackImage={(base64: string) => setAttachments([...attachments, base64])}
                            callBackText={(string: string) => {
                                setAdditionalNotes(string)
                            }}
                        />

                        <Box height={200} />
                    </Transitioning.View>
                </ScrollView>
            </View>
            <Slider
                dismissed={() => console.log('dismissed')}
                margin={GetScaledFactorX(safeInsets.top)}
                initialPosition={GetScreenHeight()}
                showContent={showFilter}
                toSide={ToSide.TOP}
            >
                {sliderCard}
            </Slider>
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
