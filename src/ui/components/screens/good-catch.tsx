import React, { useContext, useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    DeviceEventEmitter,
    Keyboard,
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'

import { globalStyles } from '../styles/base-styles'

import { WhatHappened } from '../cards/what-happened'
import { Header } from '../header/header'
import { StdButton } from '../buttons/std-button'
import { Selector } from '../cards/selector'
import { GetScaledFactorX, GetScreenHeight } from '../utils/dimensions-helper'
import { Slider, ToSide } from '../slider/slider'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { ActionRequired } from '../cards/action-required'
import { FilterPeopleCard } from '../cards/people-filter'
import { FilterActionResolveCard } from '../cards/resolve-actions-filter'
import { SeverityLevelCard } from '../cards/severity-level'
import { AdditionalNotes } from '../cards/additional-notes'
import { WhoShouldSeeThis } from '../cards/who-should-see-this'
import { Transition, Transitioning, TransitioningView } from 'react-native-reanimated'
import { CorrectiveAction, GoodCatch as GoodCatchT, GoodCatchType } from '../../../types/good-catch-type'
import { FilterGoodCatchTypesCard } from '../cards/good-catch-types-filter'
import { User } from '../user/profile'
import StateContext from '../../../context/state-context'
import { useMutation } from '@apollo/react-hooks'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { DueDateCard } from './due-date-card'
import Toast from 'react-native-toast-message'
import { useNavigation } from '@react-navigation/core'
import { Box } from '../styles/BoxTheme'
import { goodCatchQueries } from '../../../lib/good-catch-queries'
import { raise } from '../../../lib/local-events'
import { createGoodCatch, setGoodCatchState, updateGoodCatch } from './good-catch-queries'

enum STAGE {
    WHATHAPPENED = 1,
    TYPEOFCATCH,
    ACTIOREQUIRED,
    WHOSHOULDRESOLVE,
    HOWTORESOLVE,
    SEVERITYLEVEL,
    DUEDATE,
    ADDITIONALNOTES,
    WHOSHOULDSEETHIS,
    SUBMITTABLE,
}

type Props = {
    goodCatch?: GoodCatchT
    setEditing?: (flag: boolean) => void
}

export const GoodCatch = (props: Props): JSX.Element => {
    const stageCanAdvance: Record<number, () => boolean> = {
        [STAGE.WHATHAPPENED]: () => whatHappenString?.length > 2,
        [STAGE.TYPEOFCATCH]: () => goodCatches?.length > 0,
        [STAGE.WHOSHOULDRESOLVE]: () => selectedUsers?.length > 0,
        [STAGE.HOWTORESOLVE]: () => correctiveActions?.length > 0,
    }

    const { goodCatch, setEditing } = props
    const navigation = useNavigation()

    const { state, stateDispatch } = useContext(StateContext)
    const { user } = state

    const safeInsets = useSafeAreaInsets()
    const [currentStage, setCurrentStage] = useState(goodCatch ? STAGE.SUBMITTABLE : STAGE.WHATHAPPENED)
    const [canAdvance, setCanAdvance] = useState(goodCatch ? true : false)
    const [whatHappenString, setWhatHappenString] = useState(goodCatch ? goodCatch.description : '')
    const [additionalNotes, setAdditionalNotes] = useState(goodCatch ? goodCatch.additionalDetails : '')
    const [goodCatches, setGoodCatches] = useState<GoodCatchType[]>(goodCatch ? goodCatch.types : [])

    const [selectedUsers, setSelectedUser] = useState<User[]>(goodCatch?.assignTo ? goodCatch.assignTo : [])

    const [actionRequired, setActionRequired] = useState(goodCatch ? goodCatch?.actionRequired : true)
    const [dueDate, setDueDate] = useState(goodCatch?.dueDate ? new Date(goodCatch.dueDate) : new Date())

    const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>(
        goodCatch ? goodCatch.correctiveActions : []
    )
    const [severity, setSeverity] = useState<any>(
        goodCatch?.severityLevel ? goodCatch.severityLevel.toLowerCase() : 'critical'
    )
    const [visibilityGroup, setVisibilityGroup] = useState(goodCatch ? goodCatch.visibilityGroup : true)

    const [attachments, setAttachments] = useState(goodCatch?.attachments ? goodCatch.attachments : [])

    const [showFilter, setShowFilter] = useState(false)
    const [sliderCard, setSliderCard] = useState<React.ReactNode>(null)
    const ref = useRef<TransitioningView | null>()
    const scrollViewRef = useRef<ScrollView | undefined>()

    const goodCatchMutation = goodCatch ? updateGoodCatch : createGoodCatch
    const [setState] = useMutation(setGoodCatchState, { refetchQueries: goodCatchQueries })
    const [doGoodCatchMutation, { loading: submitting }] = useMutation(goodCatchMutation, {
        refetchQueries: goodCatchQueries,
        awaitRefetchQueries: true,
        onCompleted: async (data) => {
            console.log('Completed')
            const _id = data?.createWfGoodCatch?._id
            if (_id) {
                const {
                    data: {
                        setWfGoodCatch: { ok },
                    },
                } = await setState({ variables: { id: _id, state: 'Unresolved', submittedByEmail: user.email } })
                if (ok) {
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: 'Your good catch was submitted',
                        topOffset: 60,
                    })
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: 'State not updated',
                    })
                }
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Your good catch was updated',
                    topOffset: 60,
                })
            }
        },
    })

    const handleActionRequired = (actionRequired: boolean) => {
        if (ref.current) {
            ref.current.animateNextTransition()
        }
        if (!actionRequired) {
            setCurrentStage(STAGE.SEVERITYLEVEL)
        }
        setActionRequired(actionRequired)
    }

    const buttonCallback = async () => {
        console.log('Pressed')
        Keyboard.dismiss()
        if (ref.current) {
            ref.current.animateNextTransition()
        }
        if (currentStage >= STAGE.ADDITIONALNOTES) {
            setTimeout(async () => {
                console.log('Submitting')
                DeviceEventEmitter.emit('showMenu', false)

                const correctiveActionsMap = correctiveActions.map((action) => action._id)
                const typesMap = goodCatches.map((type) => type._id)

                let result

                DeviceEventEmitter.emit('showMenu', false)

                try {
                    let values = {
                        actionRequired,
                        additionalDetails: additionalNotes,
                        urls: attachments,
                        assignTo_uid: selectedUsers.map((u) => u._id),
                        correctiveActions_uid: actionRequired ? correctiveActionsMap : undefined,
                        description: whatHappenString,
                        isPublic: visibilityGroup ? 'true' : 'false',
                        severityLevel: actionRequired ? severity : undefined,
                        submittedByEmail: user.email,
                        submittedById_uid: user._id,
                        submittedDate: goodCatch ? undefined : new Date().toISOString(),
                        types_uid: typesMap,
                        dueDate: actionRequired ? new Date(dueDate).toISOString() : undefined,
                        visibilityGroup: visibilityGroup ? 'public' : 'private',
                    }
                    if (goodCatch) {
                        values = { ...values, id: goodCatch._id }
                    } else {
                        values = { ...values, submittedOnSite: user.primarySite_uid }
                    }
                    console.log('VARIABLES>>>', JSON.stringify(values))
                    console.log('Submit')
                    result = await doGoodCatchMutation({
                        variables: values,
                    })
                    console.log('Completed')
                    raise('refetch-goodcatch')
                    if (goodCatch) {
                        navigation.goBack()
                    } else {
                        clearDown()
                    }
                    // console.log('RESULT>>>', JSON.stringify(result))
                } catch (e) {
                    alert(e)
                }
            }, 100)
        } else {
            setCurrentStage(currentStage + 1)
        }
    }

    const handleSetDueDate = (dueDate: Date) => setDueDate(dueDate)

    const handleSeverity = (level: string) => setSeverity(level?.toLowerCase())

    const getGoodCachesChips = () => {
        return goodCatches.reduce((acc: string[], goodCatch) => {
            acc.push(goodCatch.goodCatchType)
            return acc
        }, [])
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

    const goodCatchTypesCard = (
        <FilterGoodCatchTypesCard
            values={goodCatches}
            accept={(goodCatches: GoodCatchType[]) => {
                setGoodCatches(goodCatches)
                setShowFilter(false)
            }}
            dismissed={() => {
                setGoodCatches([])
                setShowFilter(false)
            }}
        />
    )

    const personCard = (
        <FilterPeopleCard
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
                <Transition.Out type="fade" durationMs={300} interpolation="easeIn" />
            </Transition.Together>
        </Transition.Sequence>
    )

    const clearDown = () => {
        Keyboard.dismiss()
        if (setEditing) {
            setEditing(false)
        }
        DeviceEventEmitter.emit('showMenu', false)
    }

    const closeButton = (
        <Pressable
            hitSlop={20}
            style={{
                height: GetScaledFactorX(30),
                width: GetScaledFactorX(30),
                ...globalStyles.marginLeftM,
            }}
            onPress={clearDown}
        >
            <FontAwesomeIcon color={'white'} size={GetScaledFactorX(30)} icon={faTimes} />
        </Pressable>
    )

    useEffect(() => {
        return () => {
            if (setEditing) {
                setEditing(false)
            }
        }
    }, [])

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View style={styles.container}>
                <Header startAdornment={() => closeButton} label="Good Catch" />
                <ScrollView
                    ref={(node) => (scrollViewRef.current = node)}
                    automaticallyAdjustContentInsets
                    contentContainerStyle={{ paddingBottom: GetScaledFactorX(48) + GetScaledFactorX(16) }}
                    onContentSizeChange={() => {
                        if (!setEditing) {
                            setTimeout(() => scrollViewRef.current?.scrollToEnd(), 300)
                        }
                    }}
                >
                    {submitting ? (
                        <Box mt="l">
                            <ActivityIndicator size="large" />
                        </Box>
                    ) : (
                        <Transitioning.View ref={(node) => (ref.current = node)} transition={transition}>
                            <WhatHappened
                                value={whatHappenString}
                                label="What happened?"
                                defaultLabel="Describe what happened…"
                                callBackImage={(base64: string) => {
                                    setAttachments([...attachments, base64])
                                }}
                                callBackText={(string: string) => {
                                    if (typeof string === 'string') {
                                        setWhatHappenString(string)
                                    }
                                }}
                            />
                            {/*{attachments.map((image) => (*/}
                            {/*    <Text>{image.slice(0, 20)}</Text>*/}
                            {/*))}*/}
                            {currentStage >= STAGE.TYPEOFCATCH && (
                                <Selector
                                    tipLabel="Tip: You can select more than one type."
                                    key="type"
                                    defaultLabel="Enter hazard types"
                                    label="What type of good catch is this?"
                                    chips={getGoodCachesChips()}
                                    callbackOpenFilter={(flag) => {
                                        setSliderCard(goodCatchTypesCard)
                                        setShowFilter(flag)
                                    }}
                                />
                            )}
                            {currentStage >= STAGE.ACTIOREQUIRED && (
                                <ActionRequired callBackAnswer={handleActionRequired} value={actionRequired} />
                            )}
                            {currentStage >= STAGE.WHOSHOULDRESOLVE && actionRequired && (
                                <Selector
                                    tipLabel="Tip: You can select more than one person."
                                    defaultLabel="Enter name"
                                    label="Who should resolve it?"
                                    chips={getNameChips()}
                                    callbackOpenFilter={(flag) => {
                                        setSliderCard(personCard)
                                        setShowFilter(flag)
                                    }}
                                />
                            )}
                            {currentStage >= STAGE.HOWTORESOLVE && actionRequired && selectedUsers?.length > 0 && (
                                <Selector
                                    tipLabel="Tip: You can select more than one action."
                                    defaultLabel="Enter action needed"
                                    label="How should it be resolved?"
                                    chips={getCorrectiveActionChips()}
                                    callbackOpenFilter={(flag) => {
                                        setSliderCard(filterActionResolveCard)
                                        setShowFilter(flag)
                                    }}
                                />
                            )}
                            {currentStage >= STAGE.SEVERITYLEVEL &&
                                actionRequired &&
                                selectedUsers?.length > 0 &&
                                correctiveActions?.length > 0 && (
                                    <SeverityLevelCard value={severity} callbackSeveritySelected={handleSeverity} />
                                )}
                            {currentStage >= STAGE.DUEDATE &&
                                actionRequired &&
                                selectedUsers?.length > 0 &&
                                correctiveActions?.length > 0 && (
                                    // severity && (
                                    <DueDateCard
                                        label="By when should the action be completed?"
                                        value={dueDate}
                                        onSetDueDate={handleSetDueDate}
                                    />
                                )}

                            {currentStage >= STAGE.ADDITIONALNOTES && (
                                <>
                                    <AdditionalNotes
                                        value={additionalNotes}
                                        label="Any additional details? (Optional)"
                                        defaultLabel="Add Notes"
                                        callBackText={(notes: string) => setAdditionalNotes(notes)}
                                    />
                                    <WhoShouldSeeThis
                                        visibility={visibilityGroup}
                                        callback={(visibilityGroup: boolean) => setVisibilityGroup(visibilityGroup)}
                                    />
                                </>
                            )}
                        </Transitioning.View>
                    )}
                </ScrollView>
                <View style={styles.advanceButton}>
                    <StdButton
                        backgroundStyle={styles.buttonBackGround}
                        labelColor={'white'}
                        label={currentStage >= STAGE.ADDITIONALNOTES ? 'Submit' : 'Next'}
                        callBack={buttonCallback}
                        disabled={!checkAdvance()}
                        labelStyle={[globalStyles.sizeLText, globalStyles.boldText]}
                    />
                </View>
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

    function checkAdvance() {
        return !stageCanAdvance[currentStage] || stageCanAdvance[currentStage]()
    }
}

const styles = StyleSheet.create({
    advanceButton: {
        ...globalStyles.flex,
        ...globalStyles.flexColumnReverse,
        ...globalStyles.marginBottomM,
    },
    buttonBackGround: { backgroundColor: '#0A599A', ...globalStyles.flexCenter },
    container: {
        ...globalStyles.full100,
        backgroundColor: '#F1F3F3',
    },
})
