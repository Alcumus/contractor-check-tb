import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { globalStyles } from '../styles/base-styles'
import { ViewWithInsets } from '../utils/view-with-insets'

import { TabBar } from '../navigation/tab-bar'
import { Insights } from '../screens/insights'
import { Today } from '../screens/today'
import { DeviceEventEmitter, Dimensions, Insets } from 'react-native'
import { GetScaledFactorX, GetScreenHeight, GetWindowHeight } from '../utils/dimensions-helper'
import { Slider, ToSide } from '../slider/slider'
import { StandardCard, SubmitButtons, Submitcard } from '../cards/submit-new'
import { NewsFeedScreen } from '../screens/news-feed'
import { raise, useLocalEvent } from '../../../lib/local-events'
import { noop } from '../screens/ChoiceMenu'
import { ToolBox } from '../screens/tool-box'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SimpleSlider } from '../slider/simpleSlider'
import { Transition, Transitioning, TransitioningView } from 'react-native-reanimated'

let insets: Insets

type PanelOptions = {
    wrap?: boolean
    height?: number
    [key: string]: any
    onClose?: () => void
}

export function showPanel(contents: JSX.Element, options: PanelOptions = {}) {
    let height = options.height ?? Dimensions.get('window').height - (insets.top || 0) - (insets.bottom || 0)
    if (height < 1) height = Math.floor(Dimensions.get('window').height * height)
    raise('showPanel', contents, height, options)
}

export function hidePanel() {
    raise('hidePanel')
}

const Tab = createBottomTabNavigator()
export const Tabs = (): JSX.Element => {
    const [showMenu, setShowMenu] = useState(false)
    const [sliderContent, setSliderContent] = useState<React.ReactNode>(null)
    const [sliderPosition, setSliderPosition] = useState<number>(0)
    const [offsetPosition, setOffsetPosition] = useState<number>(0)
    const dockedTop = useRef(false)
    const ref = useRef<TransitioningView | null>()

    useLocalEvent(
        'showMenu',
        (flag: boolean) => {
            if (flag) {
                setSliderPosition(GetWindowHeight() - GetScaledFactorX(420))
                setShowMenu(flag)
            } else {
                if (dockedTop.current) {
                    setSliderPosition(0)
                    setOffsetPosition(-GetScreenHeight())
                }
                setTimeout(() => {
                    if (dockedTop.current) {
                        setSliderPosition(0)
                        setOffsetPosition(0)
                    }
                    dockedTop.current = false
                    setSliderContent(<Submitcard button={SubmitButtons} />)
                }, 400)
                setShowMenu(flag)
            }
        },
        DeviceEventEmitter
    )

    useLocalEvent(
        'showContent',
        (content: JSX.Element) => {
            dockedTop.current = true
            ref.current?.animateNextTransition()
            setSliderContent(content)
            setOffsetPosition(-GetScreenHeight())
        },
        DeviceEventEmitter
    )

    useEffect(() => {
        setSliderContent(<Submitcard button={SubmitButtons} />)
    }, [])

    const transition = (
        <Transition.Sequence>
            <Transition.Together>
                <Transition.Out type="fade" durationMs={200} interpolation="easeIn" />
            </Transition.Together>
        </Transition.Sequence>
    )

    return (
        <ViewWithInsets
            useInsetsFor={{
                top: false,
                left: false,
                bottom: true,
                right: false,
            }}
            style={{
                ...globalStyles.flex,
                ...globalStyles.background,
            }}
        >
            <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
                <Tab.Screen name="Today" component={Today} options={{ tabBarTestID: 'homeScreen' }} />
                <Tab.Screen name="Feed" component={NewsFeedScreen} options={{ tabBarTestID: 'feedScreen' }} />
                <Tab.Screen name="Insights" component={Insights} options={{ tabBarTestID: 'insigtsScreen' }} />
                <Tab.Screen name="ToolBox" component={ToolBox} options={{ tabBarTestID: 'toolBox' }} />
            </Tab.Navigator>
            <Slider
                dismissed={noop}
                margin={sliderPosition}
                showContent={showMenu}
                moveOffset={offsetPosition}
                toSide={ToSide.TOP}
            >
                <Transitioning.View ref={(node) => (ref.current = node)} transition={transition}>
                    {sliderContent}
                </Transitioning.View>
            </Slider>
        </ViewWithInsets>
    )
}

const PanelCloseContext = React.createContext(noop)

export function useClosePanel() {
    return useContext(PanelCloseContext)
}

type Panel = {
    height: number
    content?: React.ReactNode
    show: boolean
    id: number
    options: PanelOptions
}

let panelId = 1

export function PanelSlider() {
    const [panels, setPanels] = useState<Panel[]>([])
    const currentPanels = useRef<Panel[]>([])
    currentPanels.current = panels
    const [, setRefresh] = useState(0)
    insets = useSafeAreaInsets()
    useLocalEvent('showPanel', (contents: JSX.Element, height: number, options: PanelOptions = {}) => {
        const newPanel: Panel = {
            id: panelId++,
            options,
            height: height,
            content:
                options.wrap !== false ? (
                    <StandardCard {...options} onPress={closeTopPanel}>
                        {contents}
                    </StandardCard>
                ) : (
                    contents
                ),
            show: false,
        }
        setPanels((panels) => [...panels, newPanel])
        setTimeout(() => {
            newPanel.show = true
            setRefresh((r) => r + 1)
        }, 150)
    })

    useLocalEvent('hidePanel', closeTopPanel)

    return (
        <PanelCloseContext.Provider value={closeTopPanel}>
            {panels.map((panel, index) => {
                return (
                    <SimpleSlider key={panel.id} visible={panel.show} height={panel.height}>
                        {panel.content}
                    </SimpleSlider>
                )
            })}
        </PanelCloseContext.Provider>
    )

    function closeTopPanel() {
        const close = currentPanels.current[currentPanels.current.length - 1]
        if (close.options.onClose) {
            close.options.onClose()
        }
        close.show = false
        setRefresh((r) => r + 1)
        setTimeout(() => {
            setPanels((panels) => panels.filter((p) => p !== close))
        }, 400)
    }
}
