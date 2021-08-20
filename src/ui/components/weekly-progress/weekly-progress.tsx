import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { GetScaledFactorX, GetScaledFactorY } from '../utils/dimensions-helper'
import { globalStyles } from '../styles/base-styles'
import { ProgressBar } from '../progress-bar/progress-bar'
import Sugar from 'sugar'

type Props = {
    tasksToComplete: number
    totalTasks: number
    allDone: number
}

export const WeeklyProgress = (props: Props): JSX.Element => {
    const { tasksToComplete, totalTasks, allDone } = props
    // pass this in to make pure
    const today = new Date()
    const date = Sugar.Date.beginningOfWeek(new Date())
    const dateNext = Sugar.Date.endOfWeek(new Date())
    const month = date.toLocaleString('default', { month: 'short' })
    const day = parseInt(date.toLocaleString('default', { day: '2-digit' }))
    const currentDay = parseInt(today.toLocaleString('default', { day: '2-digit' }))
    const currentMonth = today.toLocaleString('default', { month: 'short' })
    const monthNext = dateNext.toLocaleString('default', { month: 'short' })
    const dayNext = parseInt(dateNext.toLocaleString('default', { day: '2-digit' }))
    const otherTasks = allDone - tasksToComplete

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.weeklyProgresslabel}>Your Weekly Progress</Text>
                <View style={styles.infoContainer}>
                    <View style={styles.dateFlip}>
                        <View
                            style={{
                                height: '50%',
                                width: '100%',
                                backgroundColor: '#c96a33',
                                ...globalStyles.flexCenter,
                            }}
                        >
                            <Text style={styles.month}>{currentMonth}</Text>
                        </View>
                        <View
                            style={{
                                height: '50%',
                                width: '100%',
                                backgroundColor: 'white',
                                ...globalStyles.flexCenter,
                            }}
                        >
                            <Text style={styles.day}>{currentDay}</Text>
                        </View>
                    </View>
                    <View style={styles.tasksInfoContainer}>
                        <Text style={styles.weekOfText}>{`Week of ${month} ${day} - ${monthNext} ${dayNext}`}</Text>
                        <Text style={styles.completedTasks}>{`You've completed ${tasksToComplete} task${
                            tasksToComplete !== 1 ? 's' : ''
                        } scheduled for this week ${
                            otherTasks > 0 ? `and ${otherTasks} overdue task${otherTasks !== 1 ? 's' : ''}` : ''
                        }.`}</Text>
                        <ProgressBar completed={tasksToComplete} total={totalTasks} />
                    </View>
                </View>
            </View>
        </View>
    )
}
GetScaledFactorY
const styles = StyleSheet.create({
    completedTasks: {
        ...globalStyles.sizeXsText,
        ...globalStyles.marginBottomXXS,
        color: '#767677',
    },
    container: {
        ...globalStyles.marginHorizontalM,
        ...globalStyles.radiusL,
        backgroundColor: '#f8f8f8',
        height: GetScaledFactorX(155),
    },
    dateFlip: {
        ...globalStyles.radiusL,
        ...globalStyles.overFlowHidden,
        height: 60,
        width: 60,
    },
    day: {
        ...globalStyles.sizeSText,
        color: 'black',
    },
    infoContainer: {
        ...globalStyles.flexRow,
        ...globalStyles.alignCentre,
    },
    innerContainer: {
        ...globalStyles.marginHorizontalM,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4.65,
    },
    month: {
        ...globalStyles.sizeXXsText,
        color: 'white',
    },
    tasksInfoContainer: {
        ...globalStyles.flex,
        ...globalStyles.marginLeftM,
    },
    weekOfText: {
        ...globalStyles.sizeXsText,
        ...globalStyles.boldText,
        ...globalStyles.marginBottomS,
    },
    weeklyProgresslabel: {
        ...globalStyles.sizeMText,
        ...globalStyles.semiboldText,
        ...globalStyles.marginTopM, // combine to margin vert
        ...globalStyles.marginBottomM,
        color: 'black',
    },
})
