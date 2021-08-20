import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React, { useEffect, useRef, useState } from 'react'
import {
    Pressable,
    StyleSheet,
    Text,
    View,
    TextInput,
    NativeModules,
    requireNativeComponent,
    LayoutRectangle,
    Image,
} from 'react-native'
import { globalStyles } from '../styles/base-styles'
import { GetScaledFactorX } from '../utils/dimensions-helper'
import {
    faCompass,
    faImages,
    faCameraRetro,
    faVideo,
    faDotCircle,
    faTimes,
    faCrosshairs,
    faDrawPolygon,
    faRulerCombined,
} from '@fortawesome/free-solid-svg-icons'
import ViewShot from 'react-native-view-shot'
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker'

const RNAR = requireNativeComponent('RNARView') as any
const { RNARViewManager } = NativeModules

type Props = {
    value: string
    label: string
    defaultLabel: string
    callBackText: (string: string) => void
    callBackImage?: (string: string) => void
}

export const WhatHappened = (props: Props): JSX.Element => {
    const { callBackText, callBackImage, label = '', defaultLabel = '', value } = props
    // todo pull these in from a string file
    const whLabel = label
    const whdLabel = defaultLabel
    const [userInput, setUserInput] = useState<string>(value || '')
    const [enableVr, setEnableVr] = useState(false)
    const [showCamera, setShowCamera] = useState(false)
    const [capturedImage, setCapturedImage] = useState<string | undefined>(undefined)

    const viewShotRef = useRef<ViewShot | null>()

    const [rootLayout, setRootLayout] = useState({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
    } as LayoutRectangle)

    const capture = async (): Promise<string> => {
        if (viewShotRef.current && viewShotRef.current?.capture) {
            return await viewShotRef.current?.capture()
        }
        return ''
    }

    const onChangeText = (input: string) => {
        if (userInput !== input) {
            setUserInput(input)
        }
    }

    useEffect(() => {
        callBackText(userInput)
    }, [callBackText, userInput])

    useEffect(() => {
        if (callBackImage && capturedImage != null) {
            callBackImage(capturedImage)
        }
    }, [capturedImage])

    useEffect(() => {
        if (enableVr) {
            setTimeout(() => {
                setShowCamera(true)
            }, 100)
            setCapturedImage(undefined)
            RNARViewManager.startAR('true')
        } else {
            setShowCamera(false)
        }
        return () => {
            RNARViewManager.clear('true')
        }
    }, [enableVr])

    return (
        <View
            style={[
                styles.container,
                {
                    height: !enableVr
                        ? !capturedImage
                            ? GetScaledFactorX(244)
                            : GetScaledFactorX(500)
                        : GetScaledFactorX(700),
                },
            ]}
        >
            <View
                style={{
                    ...globalStyles.marginHorizontalM,
                    ...globalStyles.marginTopM,
                    ...globalStyles.marginBottomM,
                }}
            >
                <Text style={styles.whLabel}>{whLabel}</Text>
            </View>
            <View style={styles.outlined}>
                <TextInput
                    value={userInput}
                    onSubmitEditing={() => null}
                    scrollEnabled={true}
                    placeholder={whdLabel}
                    style={styles.answerText}
                    autoCapitalize={'sentences'}
                    multiline
                    onChangeText={onChangeText}
                />
            </View>
            <View style={styles.buttonRow}>
                <Pressable style={styles.buttonBackground} onPress={getImageFromLibrary}>
                    <FontAwesomeIcon color={'black'} size={GetScaledFactorX(20)} icon={faImages} />
                </Pressable>
                <Pressable style={styles.buttonBackground} onPress={getImageFromCamera}>
                    <FontAwesomeIcon color={'black'} size={GetScaledFactorX(20)} icon={faCameraRetro} />
                </Pressable>
                {/*<Pressable style={styles.buttonBackground} onPress={() => console.log('')}>*/}
                {/*    <FontAwesomeIcon color={'black'} size={GetScaledFactorX(20)} icon={faVideo} />*/}
                {/*</Pressable>*/}
                <Pressable style={styles.buttonBackground} onPress={() => setEnableVr(true)}>
                    <FontAwesomeIcon color={'black'} size={GetScaledFactorX(20)} icon={faRulerCombined} />
                </Pressable>
            </View>
            {capturedImage && <Image style={styles.capImage} source={{ uri: capturedImage }} />}
            {enableVr && (
                <View
                    style={{
                        height: GetScaledFactorX(450),
                        ...globalStyles.marginHorizontalM,
                        ...globalStyles.overFlowHidden,
                    }}
                    onLayout={(event) => {
                        setRootLayout(event.nativeEvent.layout)
                    }}
                >
                    <ViewShot
                        style={{ ...globalStyles.full100 }}
                        ref={(node) => (viewShotRef.current = node)}
                        options={{
                            format: 'png',
                            result: 'base64',
                        }}
                    >
                        {showCamera && (
                            <RNAR
                                onChangeSceneInfo={(info) => {
                                    if (info.nativeEvent.positions) {
                                        info.nativeEvent.positions.forEach((element) => {
                                            //FIXME debugging
                                            // try {
                                            //     // setUserInput(userInput + element)
                                            // } catch (e) {
                                            //     console.log(e)
                                            // }
                                        })
                                    }
                                }}
                                style={{
                                    width: rootLayout.width,
                                    height: rootLayout.height,
                                    ...globalStyles.positionAbsolute,
                                }}
                            />
                        )}
                    </ViewShot>
                    <Pressable
                        onPress={() => RNARViewManager.guideline('true')}
                        style={[
                            styles.icon,
                            {
                                left: rootLayout.width - GetScaledFactorX(75),
                            },
                        ]}
                    >
                        <FontAwesomeIcon color={'white'} size={GetScaledFactorX(40)} icon={faCompass} />
                    </Pressable>
                    <Pressable
                        onPress={() => RNARViewManager.closeLoop('true')}
                        style={[
                            styles.icon,
                            {
                                left: GetScaledFactorX(75) - GetScaledFactorX(60),
                            },
                        ]}
                    >
                        <FontAwesomeIcon color={'white'} size={GetScaledFactorX(40)} icon={faDrawPolygon} />
                    </Pressable>
                    <Pressable
                        onPress={() => RNARViewManager.addPoint('true')}
                        style={[
                            styles.icon,
                            {
                                top: rootLayout.height - GetScaledFactorX(75),
                                left: rootLayout.width - GetScaledFactorX(75),
                            },
                        ]}
                    >
                        <FontAwesomeIcon color={'white'} size={GetScaledFactorX(40)} icon={faDotCircle} />
                    </Pressable>
                    <Pressable
                        hitSlop={20}
                        onPress={() => RNARViewManager.clear('true')}
                        style={[
                            styles.icon,
                            {
                                top: rootLayout.height - GetScaledFactorX(75),
                                left: GetScaledFactorX(75) - GetScaledFactorX(60),
                            },
                        ]}
                    >
                        <FontAwesomeIcon color={'white'} size={GetScaledFactorX(40)} icon={faTimes} />
                    </Pressable>
                    <Pressable
                        hitSlop={20}
                        onPress={() =>
                            capture().then((result) => {
                                setCapturedImage('data:image/png;base64,' + result)
                                // stateDispatch({ type: 'STORE_ACTION_ADD_IMAGE', image: result })
                                setEnableVr(false)
                            })
                        }
                        style={[
                            styles.icon,
                            {
                                top: rootLayout.height - GetScaledFactorX(75),
                                left: rootLayout.width / 2 - GetScaledFactorX(30),
                            },
                        ]}
                    >
                        <FontAwesomeIcon color={'white'} size={GetScaledFactorX(25)} icon={faCameraRetro} />
                    </Pressable>
                    <FontAwesomeIcon
                        color={'white'}
                        size={GetScaledFactorX(40)}
                        icon={faCrosshairs}
                        style={[
                            styles.icon,
                            {
                                top: rootLayout.height / 2 - GetScaledFactorX(20),
                                left: rootLayout.width / 2 - GetScaledFactorX(20),
                                backgroundColor: 'transparent',
                            },
                        ]}
                    />
                </View>
            )}
        </View>
    )

    function getImageFromLibrary() {
        launchImageLibrary({ maxWidth: 1000, quality: 0.7, includeBase64: true, mediaType: 'photo' }, gotImage)
    }

    function getImageFromCamera() {
        launchCamera({ maxWidth: 1000, quality: 0.7, includeBase64: true, mediaType: 'photo' }, gotImage)
    }

    function gotImage(response: ImagePickerResponse) {
        if (response.didCancel) {
            return
        }
        if (callBackImage && response.base64) {
            setCapturedImage(`data:${response.type};base64,${response.base64}`)
        }
    }
}

const styles = StyleSheet.create({
    answerText: {
        ...globalStyles.sizeXsText,
        ...globalStyles.capitalize,
        ...globalStyles.darkText,
        ...globalStyles.sizeXsText,
        ...globalStyles.marginHorizontalS,
        height: GetScaledFactorX(104),
    },
    buttonBackground: {
        ...globalStyles.flexCenter,
        ...globalStyles.radiusS,
        ...globalStyles.marginRightS,
        backgroundColor: '#2632381A',
        height: GetScaledFactorX(48),
        width: GetScaledFactorX(48),
    },
    buttonRow: {
        ...globalStyles.flexRow,
        ...globalStyles.marginHorizontalM,
        ...globalStyles.marginBottomM,
    },
    capImage: {
        ...globalStyles.marginHorizontalM,
        ...globalStyles.marginTopM,
        ...globalStyles.radiusM,
        height: GetScaledFactorX(200),
    },
    container: {
        ...globalStyles.overFlowHidden,
        backgroundColor: 'white',
        minHeight: GetScaledFactorX(244),
    },
    icon: {
        ...globalStyles.flexCenter,
        ...globalStyles.positionAbsolute,
        ...globalStyles.opacity50,
        borderRadius: GetScaledFactorX(37.25),
        height: GetScaledFactorX(60),
        width: GetScaledFactorX(60),
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
