function EventEntry() {
    this.children = {}
    this.handlers = []
    this.allBelow = []
}

EventEntry.prototype.getChild = function getChild(key) {
    const child = this.children[key]
    if (!child) {
        let result = new EventEntry()
        this.children[key] = result
        return result
    }
    return child
}

EventEntry.prototype.getExisting = function getExisting(key) {
    return this.children[key]
}

EventEntry.prototype.getAll = function getAll() {
    return (this._all = this._all || new EventEntry())
}

/**
 * @callback HandlePreparer
 *
 * @param {Array<Function>} handlers - the handlers being used
 * @return an updated array or the original array sorted
 */

/**
 * @interface ConstructorParams
 * @property {string} [delimiter=.] - a character which delimits parts of an event pattern
 * @property {string} [wildcard=*] - a wildcard indicator used to handle any parts of a pattern
 * @property {string} [separator=,] - a character to separate multiple events in the same pattern
 * @property {HandlePreparer} [prepareHandlers=v=>v] - a function to modify the handlers just before raising,
 * this is the combined set of all of the handlers that will be raised.
 * @property {HandlePreparer} [storeHandlers=v=>v] - a function to modify or sort the handlers before storing,

 */

/**
 * Event emitter with wild card support and delimited entries.
 */
class Events {
    /**
     * Constructs an event emitter
     * @param {ConstructorParams} [props] - parameters to configure the emitter
     */
    constructor({ delimiter = '.', wildcard = '*', storeHandlers } = {}) {
        this.delimiter = delimiter
        this.wildcard = wildcard = wildcard === true ? '*' : wildcard
        this.cache = new Map()
        this.doubleWild = `${wildcard}${wildcard}`
        this._events = new EventEntry()
        this.storeHandlers = storeHandlers
    }

    /**
     * Adds an event listener with wildcards etc
     * @instance
     * @memberOf Events
     * @param {string|Array<string>} name - the event pattern to handle
     * @param {Function} handler - the handler for the pattern
     */
    on(name, handler) {
        if (!handler) {
            return
        }
        const parts = name.split(this.delimiter)
        let scan = this._events

        for (let i = 0, l = parts.length; i < l; i++) {
            const part = parts[i]
            if (part === this.wildcard) {
                scan = scan.getAll()
            } else if (part === this.doubleWild) {
                scan.allBelow.push(handler)
                scan.allBelow = this.storeHandlers
                    ? this.storeHandlers(scan.allBelow)
                    : scan.allBelow
            } else {
                scan = scan.getChild(part)
            }
        }
        scan.handlers.push(handler)
        scan.handlers = this.storeHandlers
            ? this.storeHandlers(scan.handlers)
            : scan.handlers
    }

    /**
     * Add an event listener that will fire only once, if multiple
     * patterns are provided it will only fire on the first one
     * @param {string|Array<string>} name - the event pattern to listen for
     * @param {Function} handler - the function to invoke
     */
    once(name, handler) {
        const self = this
        self.on(name, process)

        function process(...params) {
            self.off(name, process)
            handler(...params)
        }
    }

    removeAllListeners() {
        this._events = new EventEntry()
    }

    /**
     * Removes a listener from a pattern
     * @param {string|Array<string>} name- the pattern of the handler to remove
     * @param {Function} [handler] - the handler to remove, or all handlers
     */
    off(name, handler) {
        const parts = name.split(this.delimiter)
        let scan = this._events
        for (let i = 0, l = parts.length; scan && i < l; i++) {
            const part = parts[i]
            switch (part) {
                case this.wildcard:
                    scan = scan.getAll()
                    break
                case this.doubleWild: {
                    if (handler === undefined) {
                        scan.allBelow = []
                        return
                    }
                    const idx = scan.allBelow.indexOf(handler)
                    if (idx === -1) {
                        return
                    }
                    scan.allBelow.splice(idx, 1)
                    return
                }
                default:
                    scan = scan.getExisting(part)
                    break
            }
        }
        if (!scan) {
            return
        }
        if (handler !== undefined) {
            const idx = scan.handlers.indexOf(handler)
            if (idx === -1) {
                return
            }
            scan.handlers[idx] = null
        } else {
            scan.handlers.length = 0
        }
    }

    /**
     * Emits an event synchronously
     * @param {string} event - the event to emit
     * @param {...params} params - the parameters to call the event with
     * @returns {Array<any>} - an array of the parameters the event was called with
     */
    emit(event, ...params) {
        this.event = event
        const parts = event.split(this.delimiter)
        _emit(this._events, parts, 0, null, fn => {
            fn.apply(this, params)
        })
        return params
    }

    /**
     * Emits events asynchronously, in order, sequentially
     * @param {string} event - the event to emit
     * @param {...params} params - the parameters to call the event with
     * @returns {Array<any>} - an array of the parameters the event was called with
     */
    async emitAsyncSequential(event, ...params) {
        const handlers = []
        this.event = event
        const parts = event.split(this.delimiter)
        _emit(this._events, parts, 0, handlers)
        for (const handler of handlers) {
            await handler.apply(this, params)
        }
        return params
    }

    /**
     * Emits events asynchronously, in parallel
     * @param {string} event - the event to emit
     * @param {...params} params - the parameters to call the event with
     * @returns {Array<any>} - an array of the parameters the event was called with
     */
    async emitAsync(event, ...params) {
        const handlers = []
        this.event = event
        const parts = event.split(this.delimiter)
        const self = this
        _emit(this._events, parts, 0, null, fn => {
            handlers.push(call(fn))
        })
        await Promise.all(handlers)
        return params

        async function call(fn) {
            await fn.apply(self, params)
        }
    }
}

function _emit(scan, parts, index, handlers, call) {
    for (; scan && index < parts.length; index++) {
        let i = scan.allBelow.length
        if (call) {
            for (--i; i >= 0; i--) {
                let handler = scan.allBelow[i]
                if (handler) {
                    call(handler)
                }
            }
            if (scan._all) {
                _emit(scan.getAll(), parts, index + 1, handlers, call)
            }
            scan = scan.getExisting(parts[index])
        } else {
            i && Array.prototype.push.apply(handlers, scan.allBelow)
            if (scan._all) {
                _emit(scan.getAll(), parts, index + 1, handlers, call)
            }
            scan = scan.getExisting(parts[index])
        }
    }
    if (scan) {
        if (call) {
            for (let i = 0, l = scan.handlers.length; i < l; i++) {
                let handler = scan.handlers[i]
                if (handler) {
                    call(handler)
                }
                if (!scan.handlers[i]) {
                    scan.handlers.splice(i, 1)
                    i--
                    l--
                }
            }
        } else {
            for (let i = 0, l = scan.handlers.length; i < l; i++) {
                if (!scan.handlers[i]) {
                    scan.handlers.splice(i, 1)
                    i--
                    l--
                } else {
                    handlers.push(scan.handlers[i])
                }
            }
        }
    }
}

Events.prototype.addEventListener = Events.prototype.on
Events.prototype.removeEventListener = Events.prototype.off
Events.prototype.addListener = Events.prototype.on
Events.prototype.removeListener = Events.prototype.off

export default Events
export { Events }
