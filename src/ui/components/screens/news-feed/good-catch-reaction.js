import React, { useContext } from 'react'
import { Box, ListItemBox } from '../../styles/BoxTheme'
import Emoji from 'react-native-emoji'
import { Pressable, StyleSheet } from 'react-native'
import StateContext from '../../../../context/state-context'
import Config from '../../../../config/config'

import { gql, useMutation } from '@apollo/react-hooks'
import { noop } from '../ChoiceMenu'
import { useClosePanel } from '../../navigation/tab-navigation'
import { addGoodCatchQuery, goodCatchQueries } from '../../../../lib/good-catch-queries'

const { theme } = Config

const styles = StyleSheet.create({
    holder: {
        borderRadius: 300,
        margin: 10,
        padding: 8,
    },
    reaction: {
        fontSize: 70,
    },
    selected: {
        backgroundColor: `${theme.alcBrand002}30`,
    },
})

const reactions = {
    goodCatch: {
        like: gql`
            mutation upsert($parent: WfGoodCatchUid!, $id: ReactionUid!) {
                upsertReactionOnWfGoodCatchAsLike(_parentId: $parent, _id: $id, record: {}, commit: true) {
                    ok
                }
            }
        `,
        look: gql`
            mutation upsert($parent: WfGoodCatchUid!, $id: ReactionUid!) {
                upsertReactionOnWfGoodCatchAsLook(_parentId: $parent, _id: $id, record: {}, commit: true) {
                    ok
                }
            }
        `,
        strong: gql`
            mutation upsert($parent: WfGoodCatchUid!, $id: ReactionUid!) {
                upsertReactionOnWfGoodCatchAsStrong(_parentId: $parent, _id: $id, record: {}, commit: true) {
                    ok
                }
            }
        `,
    },
    highFive: {
        like: gql`
            mutation upsert($parent: WfHighFiveUid!, $id: ReactionUid!) {
                upsertReactionOnWfHighFiveAsLike(_parentId: $parent, _id: $id, record: {}, commit: true) {
                    ok
                }
            }
        `,
        look: gql`
            mutation upsert($parent: WfHighFiveUid!, $id: ReactionUid!) {
                upsertReactionOnWfHighFiveAsLook(_parentId: $parent, _id: $id, record: {}, commit: true) {
                    ok
                }
            }
        `,
        strong: gql`
            mutation upsert($parent: WfHighFiveUid!, $id: ReactionUid!) {
                upsertReactionOnWfHighFiveAsStrong(_parentId: $parent, _id: $id, record: {}, commit: true) {
                    ok
                }
            }
        `,
    },
    resolution: {
        like: gql`
            mutation upsert($parent: WfGoodCatchResolutionUid!, $id: ReactionUid!) {
                upsertReactionOnWfGoodCatchResolutionAsLike(_parentId: $parent, _id: $id, record: {}, commit: true) {
                    ok
                }
            }
        `,
        look: gql`
            mutation upsert($parent: WfGoodCatchResolutionUid!, $id: ReactionUid!) {
                upsertReactionOnWfGoodCatchResolutionAsLook(_parentId: $parent, _id: $id, record: {}, commit: true) {
                    ok
                }
            }
        `,
        strong: gql`
            mutation upsert($parent: WfGoodCatchResolutionUid!, $id: ReactionUid!) {
                upsertReactionOnWfGoodCatchResolutionAsStrong(_parentId: $parent, _id: $id, record: {}, commit: true) {
                    ok
                }
            }
        `,
    },
}

const remove = gql`
    mutation delete($id: ReactionUid!) {
        deleteReaction(_id: $id) {
            ok
        }
    }
`

export function GoodCatchResolutionReaction({ item, onChange = noop }) {
    const {
        state: { user },
    } = useContext(StateContext)
    const baseKey = `${user._id.split(':')[0]}-${item._id.split(':')[0]}`
    const [removeReaction] = useMutation(remove)
    const [upsertLike, data1] = useMutation(reactions.resolution.like)
    const [upsertLook, data2] = useMutation(reactions.resolution.look)
    const [upsertStrong, data3] = useMutation(reactions.resolution.strong)
    const upserts = {
        like: upsertLike,
        look: upsertLook,
        strong: upsertStrong,
    }
    const liked = item.like_uid?.some((k) => k.startsWith(key('like')))
    const look = item.look_uid?.some((k) => k.startsWith(key('look')))
    const strong = item.strong_uid?.some((k) => k.startsWith(key('strong')))
    const close = useClosePanel()
    return (
        <ListItemBox>
            <Box flex={1} />
            <Box width="25%" alignItems="center" style={[styles.holder, liked && styles.selected]}>
                <Pressable onPress={toggle('like')}>
                    <Emoji name="open_mouth" style={styles.reaction} />
                </Pressable>
            </Box>
            <Box width="25%" alignItems="center" style={[styles.holder, look && styles.selected]}>
                <Pressable onPress={toggle('look')}>
                    <Emoji name="eyes" style={styles.reaction} />
                </Pressable>
            </Box>
            <Box width="25%" alignItems="center" style={[styles.holder, strong && styles.selected]}>
                <Pressable onPress={toggle('strong')}>
                    <Emoji name="muscle" style={styles.reaction} />
                </Pressable>
            </Box>
            <Box flex={1} />
        </ListItemBox>
    )

    function toggle(type) {
        return function () {
            if (item[`${type}_uid`]?.some((h) => h.startsWith(key(type)))) {
                removeReaction({ variables: { id: key(type) } })
                item[`${type}_uid`] = item[`${type}_uid`].filter((f) => !f.startsWith(key(type)))
                onChange(item)
            } else {
                console.log({ parent: item._id, id: key(type) })
                upserts[type]({ variables: { parent: item._id, id: key(type) } })
                item[`${type}_uid`] = [...(item[`${type}_uid`] || []), key(type)]
                onChange(item)
            }
            setTimeout(close, 100)
        }
    }

    function key(value) {
        return `${baseKey}-${value}`
    }
}

export function GoodCatchReaction({ item, onChange = noop }) {
    const {
        state: { user },
    } = useContext(StateContext)
    const baseKey = `${user._id.split(':')[0]}-${item._id.split(':')[0]}`
    const [removeReaction] = useMutation(remove, { refetchQueries: goodCatchQueries, awaitRefetchQueries: true })
    const [upsertLike] = useMutation(reactions.goodCatch.like, {
        refetchQueries: goodCatchQueries,
        awaitRefetchQueries: true,
    })
    const [upsertLook] = useMutation(reactions.goodCatch.look, {
        refetchQueries: goodCatchQueries,
        awaitRefetchQueries: true,
    })
    const [upsertStrong] = useMutation(reactions.goodCatch.strong, {
        refetchQueries: goodCatchQueries,
        awaitRefetchQueries: true,
    })
    const upserts = {
        like: upsertLike,
        look: upsertLook,
        strong: upsertStrong,
    }
    const liked = item.like_uid?.some((k) => k.startsWith(key('like')))
    const look = item.look_uid?.some((k) => k.startsWith(key('look')))
    const strong = item.strong_uid?.some((k) => k.startsWith(key('strong')))
    const close = useClosePanel()

    return (
        <ListItemBox>
            <Box flex={1} />
            <Box width="25%" alignItems="center" style={[styles.holder, liked && styles.selected]}>
                <Pressable onPress={toggle('like')}>
                    <Emoji name="open_mouth" style={styles.reaction} />
                </Pressable>
            </Box>
            <Box width="25%" alignItems="center" style={[styles.holder, look && styles.selected]}>
                <Pressable onPress={toggle('look')}>
                    <Emoji name="eyes" style={styles.reaction} />
                </Pressable>
            </Box>
            <Box width="25%" alignItems="center" style={[styles.holder, strong && styles.selected]}>
                <Pressable onPress={toggle('strong')}>
                    <Emoji name="muscle" style={styles.reaction} />
                </Pressable>
            </Box>
            <Box flex={1} />
        </ListItemBox>
    )

    function toggle(type) {
        return async function () {
            setTimeout(close, 10)
            if (item[`${type}_uid`]?.some((h) => h.startsWith(key(type)))) {
                item[`${type}_uid`] = item[`${type}_uid`].filter((f) => !f.startsWith(key(type)))
                await removeReaction({ variables: { id: key(type) } })
                onChange(item)
            } else {
                item[`${type}_uid`] = [...(item[`${type}_uid`] || []), key(type)]
                await upserts[type]({ variables: { parent: item._id, id: key(type) } })
                onChange(item)
            }
        }
    }

    function key(value) {
        return `${baseKey}-${value}`
    }
}

export function HighFiveReaction({ item, onChange = noop }) {
    const {
        state: { user },
    } = useContext(StateContext)
    const baseKey = `${user._id.split(':')[0]}-${item._id.split(':')[0]}`
    const [removeReaction] = useMutation(remove)
    const [upsertLike] = useMutation(reactions.highFive.like)
    const [upsertLook] = useMutation(reactions.highFive.look)
    const [upsertStrong] = useMutation(reactions.highFive.strong)
    const upserts = {
        like: upsertLike,
        look: upsertLook,
        strong: upsertStrong,
    }
    const liked = item.like_uid?.some((k) => k.startsWith(key('like')))
    const look = item.look_uid?.some((k) => k.startsWith(key('look')))
    const strong = item.strong_uid?.some((k) => k.startsWith(key('strong')))
    const close = useClosePanel()
    return (
        <ListItemBox>
            <Box flex={1} />
            <Box width="25%" alignItems="center" style={[styles.holder, liked && styles.selected]}>
                <Pressable onPress={toggle('like')}>
                    <Emoji name="open_mouth" style={styles.reaction} />
                </Pressable>
            </Box>
            <Box width="25%" alignItems="center" style={[styles.holder, look && styles.selected]}>
                <Pressable onPress={toggle('look')}>
                    <Emoji name="eyes" style={styles.reaction} />
                </Pressable>
            </Box>
            <Box width="25%" alignItems="center" style={[styles.holder, strong && styles.selected]}>
                <Pressable onPress={toggle('strong')}>
                    <Emoji name="muscle" style={styles.reaction} />
                </Pressable>
            </Box>
            <Box flex={1} />
        </ListItemBox>
    )

    function toggle(type) {
        return function () {
            if (item[`${type}_uid`]?.some((h) => h.startsWith(key(type)))) {
                removeReaction({ variables: { id: key(type) } })
                item[`${type}_uid`] = item[`${type}_uid`].filter((f) => !f.startsWith(key(type)))
                onChange(item)
            } else {
                console.log({ parent: item._id, id: key(type) })
                upserts[type]({ variables: { parent: item._id, id: key(type) } })
                item[`${type}_uid`] = [...(item[`${type}_uid`] || []), key(type)]
                onChange(item)
            }
            setTimeout(close, 100)
        }
    }

    function key(value) {
        return `${baseKey}-${value}`
    }
}
