import React from 'react'
import { StandardHeader, StandardPageContents, StandardPageView, theme } from '../../standards'
import { Card, Chip } from 'react-native-paper'
import { Box, ListItemBox, Text } from '../../styles/BoxTheme'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBaseballBall } from '@fortawesome/free-solid-svg-icons'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { gql } from '@apollo/client'
import { createStackNavigator } from '@react-navigation/stack'
import { GoodCatchList } from './goodCatchList'
import { useGraphQuery } from '../../lib/useGraphQuery'

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        color: theme.iconColor,
    },
    overdue: {
        color: theme.error,
    },
})

const toolboxQuery = gql`
    query goodCatch {
        wfGoodCatches(
            where: { _and: [{ dueDate: { lt: "today" } }, { dueDate: { ne: null } }], _state: { eq: Unresolved } }
        ) {
            rowCount
        }
    }
`

export const toolboxNavigator = createStackNavigator()

export function ToolBox() {
    return (
        <toolboxNavigator.Navigator headerMode="none">
            <toolboxNavigator.Screen name="Home" component={ToolBoxHome} />
            <toolboxNavigator.Screen name="Good Catches" component={GoodCatchList} />
        </toolboxNavigator.Navigator>
    )
}

function ToolBoxHome({ navigation }) {
    const [overdue] = useGraphQuery(toolboxQuery, { map: ({ wfGoodCatches: { rowCount } }) => rowCount })
    return (
        <StandardPageView>
            <StandardHeader label="ToolBox" />
            <StandardPageContents>
                <TouchableOpacity onPress={gotoGoodCatches}>
                    <Card>
                        <Card.Content>
                            <ListItemBox>
                                <Box mr="m">
                                    <FontAwesomeIcon color={theme.iconColor} icon={faBaseballBall} size={32} />
                                </Box>
                                <Box>
                                    <Text style={styles.label}>Good Catch</Text>
                                </Box>
                                <Box flex={1} />
                                {overdue > 0 && (
                                    <Box>
                                        <Chip>
                                            <Text style={[styles.overdue]}>{overdue} overdue</Text>
                                        </Chip>
                                    </Box>
                                )}
                            </ListItemBox>
                        </Card.Content>
                    </Card>
                </TouchableOpacity>
            </StandardPageContents>
        </StandardPageView>
    )

    function gotoGoodCatches() {
        navigation.navigate('Good Catches')
    }
}
