import React, { useContext, useRef, useState } from 'react'

import { DeviceEventEmitter, Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Transition, Transitioning, TransitioningView } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { useMutation } from '@apollo/react-hooks'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import StateContext from '../../../context/state-context'
import { goodCatchQueries } from '../../../lib/good-catch-queries'
import { HighFiveType } from '../../../reducers/app-store'
import { StdButton } from '../buttons/std-button'
import { FilterHighFiveTypesCard } from '../cards/high-five-types-filter'
import { FilterPeopleCard } from '../cards/people-filter'
import { Selector } from '../cards/selector'
import { WhatHappened } from '../cards/what-happened'
import { WhoShouldSeeThis } from '../cards/who-should-see-this'
import { Header } from '../header/header'
import { Slider, ToSide } from '../slider/slider'
import { globalStyles } from '../styles/base-styles'
import { User } from '../user/profile'
import { GetScaledFactorX, GetScreenHeight } from '../utils/dimensions-helper'
import { createHighFive } from './tempApi'

enum STAGE {
    WHO_ARE_GETTING_HIGH_FIVES = 1,
    WHAT_DID_THEY_DO,
    WHAT_TYPE_OF_HIGH_FIVE_IS_THIS,
    WHO_SHOULD_SEE_THIS,
    SUBMITTABLE,
}

type HighFive = {
    receivingUsers: User[]
    whatDidTheyDo: string
    typeOfHighFive: HighFiveType[]
    visibilityGroup: boolean
}

type Props = {
    highFive?: HighFive
}

export const HighFive = (props: Props): JSX.Element => {
    const { highFive } = props
    const safeInsets = useSafeAreaInsets()
    const [currentStage, setCurrentStage] = useState(highFive ? STAGE.SUBMITTABLE : STAGE.WHO_ARE_GETTING_HIGH_FIVES)
    const [canAdvance, setCanAdvance] = useState(highFive ? true : false)
    const [selectedUsers, setSelectedUser] = useState<User[]>([])
    const [whatDidTheyDo, setWhatDidTheyDo] = useState(highFive ? highFive.whatDidTheyDo : '')
    const [highFives, setHighFives] = useState<HighFiveType[]>(highFive ? highFive.typeOfHighFive : [])
    const [visibilityGroup, setVisibilityGroup] = useState(highFive ? highFive.visibilityGroup : true)
    const [showFilter, setShowFilter] = useState(false)
    const [sliderCard, setSliderCard] = useState<React.ReactNode>(null)
    const ref = useRef<TransitioningView | null>()
    const scrollViewRef = useRef<ScrollView | undefined>()
    const { state, stateDispatch } = useContext(StateContext)
    const [photos, setPhotos] = useState(highFive?.photos ? highFive.photos : [])
    const { user } = state
    const [doHighFiveMutation, { loading: submitting }] = useMutation(createHighFive, {
        refetchQueries: goodCatchQueries,
        onCompleted: async (data) => {
            //console.log('Completed')
            const _id = data?.createWfHighFive?._id
            //console.log('LOG>>>', _id)
            if (_id) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Your high five was submitted',
                    topOffset: 60,
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Your high five was not submitted',
                })
            }
        },
    })

    const buttonCallback = async () => {
        Keyboard.dismiss()
        if (ref.current) {
            ref.current.animateNextTransition()
        }
        if (currentStage >= STAGE.WHO_SHOULD_SEE_THIS) {
            // setTimeout(async () => {
            DeviceEventEmitter.emit('showMenu', false)
            try {
                const selectedUsersMap = selectedUsers.map((user) => user._id)
                const highFivesMap = highFives.map((hf) => hf._id)
                let values = {
                    // additionalDetails: additionalNotes,
                    assignTo_uid: selectedUsersMap,
                    // hasMultipleAssignees: selectedUsersMap.length > 1,
                    photos: photos,
                    highFiveTypes: highFivesMap,
                    description: whatDidTheyDo,
                    submittedByEmail: user.email,
                    submittedBy_uid: user._id,
                    selectedVisibilityGroup: visibilityGroup ? 'public' : 'private',
                    isPublic: visibilityGroup ? 'true' : 'false',
                    submittedDate: highFive ? undefined : new Date().toISOString(),
                }
                console.log('LOG>>>VALUES', JSON.stringify(values))
                if (highFive) {
                    values = { ...values, id: highFive._id }
                } else {
                    values = { ...values, submittedOnSite: user.primarySite_uid }
                }
                result = await doHighFiveMutation({
                    variables: values,
                    asUser: user.email,
                })
            } catch (e) {
                console.error(e)
            }
            console.log('RESULT>>>', result)
            console.log('user>>>', user)
            // }, 600)
        } else {
            setCurrentStage(currentStage + 1)
            setCanAdvance(currentStage + 1 >= STAGE.WHO_SHOULD_SEE_THIS ? true : false)
        }
    }

    const getHighFiveTypeChips = () => {
        return highFives.reduce((acc: string[], highFive) => {
            acc.push(highFive.highFiveType)
            return acc
        }, [])
    }

    const getNameChips = () => {
        return selectedUsers.reduce((acc: string[], user) => {
            acc.push(`${user.firstName} ${user.lastName}`)
            return acc
        }, [])
    }

    const filterHighFiveTypesCard = (
        <FilterHighFiveTypesCard
            values={highFives}
            accept={(highFives: HighFiveType[]) => {
                setCanAdvance(highFives.length ? true : false)
                setHighFives(highFives)
                setShowFilter(false)
            }}
            dismissed={() => {
                setCanAdvance(false)
                setHighFives([])
                setShowFilter(false)
            }}
        />
    )

    const userChooser = (
        <FilterPeopleCard
            label={'Who are you High Fiving?'}
            value={selectedUsers}
            accept={(user: User[]) => {
                setCanAdvance(user.length ? true : false)
                setSelectedUser(user)
                setShowFilter(false)
            }}
            dismissed={() => {
                setSelectedUser([])
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

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <View style={styles.container}>
                <Header startAdornment={() => closeButton} label="High Five" />
                <ScrollView
                    ref={(node) => (scrollViewRef.current = node)}
                    automaticallyAdjustContentInsets
                    contentContainerStyle={{ paddingBottom: GetScaledFactorX(48) + GetScaledFactorX(16) }}
                    onContentSizeChange={() => setTimeout(() => scrollViewRef.current?.scrollToEnd(), 300)}
                >
                    <Transitioning.View ref={(node) => (ref.current = node)} transition={transition}>
                        <Selector
                            tipLabel="Tip: You can select more than one person."
                            defaultLabel="Enter names"
                            label="Who are you High Fiving?"
                            chips={getNameChips()}
                            callbackOpenFilter={(flag) => {
                                setSliderCard(userChooser)
                                setShowFilter(flag)
                            }}
                        />
                        {currentStage >= STAGE.WHAT_DID_THEY_DO && (
                            <WhatHappened
                                value={whatDidTheyDo}
                                label="What did they do?"
                                defaultLabel="Describe what happened…"
                                callBackText={(string: string) => {
                                    if (whatDidTheyDo !== string) {
                                        setWhatDidTheyDo(string)
                                        setCanAdvance(string.length ? true : false)
                                    }
                                }}
                                callBackImage={(base64: string) => {
                                    setPhotos([...photos, base64])
                                }}
                            />
                        )}
                        {currentStage >= STAGE.WHAT_TYPE_OF_HIGH_FIVE_IS_THIS && (
                            <Selector
                                tipLabel="Tip: You can select more than one type."
                                key="type"
                                defaultLabel="Enter high five types"
                                label="What type of high five is this?"
                                chips={getHighFiveTypeChips()}
                                callbackOpenFilter={(flag) => {
                                    setSliderCard(filterHighFiveTypesCard)
                                    setShowFilter(flag)
                                }}
                            />
                        )}
                    </Transitioning.View>
                    {currentStage >= STAGE.WHO_SHOULD_SEE_THIS && (
                        <WhoShouldSeeThis
                            visibility={visibilityGroup}
                            callback={(visibilityGroup: boolean) => setVisibilityGroup(visibilityGroup)}
                        />
                    )}
                </ScrollView>
                <View style={styles.advanceButton}>
                    <StdButton
                        backgroundStyle={styles.buttonBackGround}
                        labelColor={'white'}
                        label={currentStage >= STAGE.WHO_SHOULD_SEE_THIS ? 'Submit' : 'Next'}
                        callBack={buttonCallback}
                        disabled={!canAdvance}
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
