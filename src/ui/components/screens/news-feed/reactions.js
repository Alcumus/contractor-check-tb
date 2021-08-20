import { Pressable, StyleSheet, Text } from 'react-native'
import { Box } from '../../styles/BoxTheme'
import Emoji from 'react-native-emoji'
import React, { useState } from 'react'
import { showPanel } from '../../navigation/tab-navigation'
import { GoodCatchReaction } from './good-catch-reaction'

const reactionStyles = StyleSheet.create({
    label: {
        color: '#666',
        fontSize: 12,
        marginTop: 4,
    },
    mini: {
        fontSize: 16,
    },
})

export function Reactions({ item }) {
    const [, setRefresh] = useState(0)
    return (
        <Box mt="s" flexDirection="row" width="100%">
            {!!item.like_uid?.length && (
                <Pressable onPress={showReactions}>
                    <Box alignItems="center" mr="m">
                        <Emoji name={'open_mouth'} style={reactionStyles.mini} />
                        <Text style={reactionStyles.label}>{item.like_uid.length}</Text>
                    </Box>
                </Pressable>
            )}
            {!!item.look_uid?.length && (
                <Pressable onPress={showReactions}>
                    <Box alignItems="center" mr="m">
                        <Emoji name={'eyes'} style={reactionStyles.mini} />
                        <Text style={reactionStyles.label}>{item.look_uid.length}</Text>
                    </Box>
                </Pressable>
            )}
            {!!item.strong_uid?.length && (
                <Pressable onPress={showReactions}>
                    <Box alignItems="center">
                        <Emoji name={'muscle'} style={reactionStyles.mini} />
                        <Text style={reactionStyles.label}>{item.strong_uid.length}</Text>
                    </Box>
                </Pressable>
            )}
            <Box flex={1} />
            {!!item.notes_uid?.length && (
                <Box alignItems="center">
                    <Emoji name={'memo'} style={reactionStyles.mini} />
                    <Text style={reactionStyles.label}>{item.notes_uid.length}</Text>
                </Box>
            )}
        </Box>
    )

    function showReactions() {
        showPanel(<GoodCatchReaction onChange={() => setRefresh((r) => r + 1)} item={item} />, {
            height: 250,
            title: 'Reaction',
        })
    }
}
