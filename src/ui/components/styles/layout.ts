import { StyleSheet } from 'react-native'

const layoutStyles = StyleSheet.create({
    alignCentre: {
        alignItems: 'center',
    },
    alignEnd: {
        alignItems: 'flex-end',
    },
    clearMarginsPaddings: {
        margin: 0,
        padding: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
    },
    flex: {
        flex: 1,
    },
    flex0: {
        flex: 0,
    },
    flexCenter: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    flexColumn: {
        flexDirection: 'column',
    },
    flexColumnReverse: {
        flexDirection: 'column-reverse',
    },
    flexRow: {
        flexDirection: 'row',
    },
    flexRowReverse: {
        flexDirection: 'row-reverse',
    },
    flexWrap: {
        flexWrap: 'wrap',
    },
    flexWrapReverse: {
        flexWrap: 'wrap-reverse',
    },
    full100: {
        height: '100%',
        width: '100%',
    },
    fullHeight: {
        height: '100%',
    },
    fullWidth: {
        width: '100%',
    },
    justifyCentre: {
        justifyContent: 'center',
    },
    justifyFlexEnd: {
        justifyContent: 'flex-end',
    },
    justifySpaceAround: {
        justifyContent: 'space-around',
    },
    justifySpaceBetween: {
        justifyContent: 'space-between',
    },
    justifySpaceEvenly: {
        justifyContent: 'space-evenly',
    },
    overFlowHidden: {
        overflow: 'hidden',
    },
    positionAbsolute: {
        position: 'absolute',
    },
})

export default layoutStyles
