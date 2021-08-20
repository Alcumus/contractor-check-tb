export function setFromEvent(fn) {
    return function (__, value) {
        return fn(value)
    }
}

export function convertToNumber(fn) {
    return function (value) {
        return fn(0 + +value)
    }
}

export function convertToDate(fn) {
    return function (value) {
        return fn(new Date(0 + +value))
    }
}
