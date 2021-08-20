import Events from './events'
import { useEffect } from 'react'
import { ensureArray } from './ensure-array'

export const events = new Events()

function eventName(n) {
    return n
}

function processParameters(params) {
    let pattern = []
    let source = events
    let handler
    for (let i = 0; i < params.length; i++) {
        let param = params[i]
        if (typeof param === 'string') {
            pattern.push(param)
        } else if (Array.isArray(param)) {
            pattern.push(...param)
        } else if (typeof param === 'function') {
            handler = param
            source = params[i + 1] || events
            break
        }
    }
    const eventWrapper = (...innerParams) => {
        ;(handler || pattern)(...innerParams)
    }

    return { pattern, source, handler, eventWrapper }
}

export function useLocalEvent(...params) {
    const fn = useEvent
    const { pattern, source, handler, eventWrapper } = processParameters(params)
    if (!handler && typeof pattern === 'function') {
        return fn(source, eventName(pattern.name), eventWrapper)
    }

    fn(source, pattern, eventWrapper)
}

export function useStableLocalEvent(...params) {
    const { pattern, source, handler, eventWrapper } = processParameters(params)

    if (!handler && typeof pattern === 'function') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useEvent(
            source,
            eventName(pattern.name),
            eventWrapper,
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useStable(),
        )
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEvent(source, pattern, eventWrapper)
}

export function useDependentLocalEvent(deps, ...params) {
    const { pattern, source, handler, eventWrapper } = processParameters(params)

    if (!handler && typeof pattern === 'function') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useEvent(
            source,
            eventName(pattern.name),
            eventWrapper,
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useStable(deps),
        )
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEvent(source, pattern, eventWrapper, useStable(deps))
}

function useStable(deps = []) {
    return function (fn) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useEffect(fn, [fn, ...deps])
    }
}

export function useEvent(emitter, patterns, handler, method = useEffect) {
    if (!handler) {
        ;[emitter, patterns, handler] = [events, emitter, patterns]
    }
    method(() => {
        for (let pattern of ensureArray(patterns)) {
            if (emitter) {
                if (emitter.on) {
                    emitter.on(eventName(pattern), runner)
                } else if (emitter.addEventListener) {
                    emitter.addEventListener(eventName(pattern), runner)
                } else {
                    emitter.addListener(eventName(pattern), runner)
                }
            }
        }
        return () => {
            for (let pattern of ensureArray(patterns)) {
                if (emitter.off) {
                    emitter.off(eventName(pattern), runner)
                } else if (emitter.removeEventListener) {
                    emitter.removeEventListener(eventName(pattern), runner)
                } else {
                    emitter.removeListener(eventName(pattern), runner)
                }
            }
        }
    })

    function runner(...params) {
        handler(...params)
    }
}

export function handle(type, fn) {
    let pairs = []
    let result = () => {
        pairs.forEach(handler => events.off(...handler))
    }
    const handler = function (...params) {
        return fn.call(this, ...params)
    }
    type = eventName(type)
    pairs.push([type, handler])
    events.on(type, handler)
    return result
}

export function once(pattern, handler) {
    const process = (...params) => {
        ;(handler || pattern)(...params)
    }
    if (!handler && typeof pattern === 'function') {
        return events.once(eventName(pattern.name), process)
    }
    events.once(pattern, process)
}

export function raise(event, ...params) {
    events.emit(eventName(event), ...params)
    return params[0]
}

export function raiseLater(event, ...params) {
    setTimeout(() => {
        events.emit(eventName(event), ...params)
    })
}

const running = new Map()

export function raiseOnce(event, ...params) {
    if (running.get(event)) {
        return
    }
    // clearTimeout(running.get(event))
    running.set(
        event,
        setTimeout(() => {
            running.delete(event)
            events.emit(eventName(event), ...params)
        }, 20),
    )
}

export function byId(q) {
    return q?.id
}

export function byName(q) {
    return q?.name
}

export function raiseOnceDedupe(event, keyFn, ...params) {
    const key = `${event}:${JSON.stringify(keyFn(...params))}`
    if (running.get(key)) {
        return
    }
    // clearTimeout(running.get(key))
    running.set(
        key,
        setTimeout(() => {
            running.delete(key)
            events.emit(eventName(event), ...params)
        }, 20),
    )
}

export function willRaise(event, ...params) {
    return function () {
        raise(event, ...params)
    }
}

export async function raiseAsync(event, ...params) {
    await events.emitAsync(eventName(event), ...params)
    return params[0]
}

export function declare(event) {
    return (...params) => raise(event, ...params)
}

export function declareAsync(event) {
    return (...params) => raiseAsync(event, ...params)
}
