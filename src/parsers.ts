import { getStylesForProperty } from 'css-to-react-native'
import { UnknownProps, UnknownStyles } from './types'
import { buildDynamicStyles } from './buildDynamicStyles'
import { isFunction } from './utils'

/**
 * If at least one of args is a function, return a function that will be called with the props passed to the component.
 */
export const substitute = (fn: (fnArgs: unknown[]) => unknown, args: unknown[]) => {
  let isDynamic = false
  let indexes: number[] = []
  for (let i = 0; i < args.length; i++) {
    if (isFunction(args[i])) {
      indexes.push(i)
      isDynamic = true
    }
  }
  if (isDynamic) {
    return (props: UnknownProps) => {
      let fnArgs: unknown[] = []
      fnArgs = fnArgs.concat(args)
      for (const index of indexes) {
        const dynamicStyle = fnArgs[index] as Function
        fnArgs[index] = dynamicStyle(props)
      }
      return fn(fnArgs)
    }
  }

  return fn(args)
}

let currentId = Number.MIN_SAFE_INTEGER
const nextId = () => currentId++
const PARSER = Symbol()

interface Parser {
  (props: UnknownProps, style: UnknownStyles): void
  [PARSER]: true
}

export const isParser = (value: any): value is Parser => value[PARSER] === true

const dynamic = (fn: (props: UnknownProps, style: UnknownStyles) => unknown) => {
  const dynamicValue = fn as Parser
  dynamicValue[PARSER] = true
  return {
    [`__snc_${nextId()}`]: dynamicValue
  }
}

const getRuntimeStyles = (key: string, value: unknown) => {
  try {
    if (typeof value === 'string' || typeof value === 'number') {
      return getStylesForProperty(key, String(value))
    }

    return { [key]: value }
  } catch (error) {
    if (__DEV__) {
      throw error
    }
  }
}

/**
 * Parse style value at runtime.
 * If value is a function, it will be called with the props passed to the component and parsed during render time.
 */
export const runtime = (key: string, value: unknown) => {
  if (isFunction(value)) {
    return dynamic((props, style) => {
      Object.assign(style, getRuntimeStyles(key, value(props)))
    })
  }

  return getRuntimeStyles(key, value)
}

export const mixin = (value: unknown) => {
  if (isFunction(value)) {
    return dynamic((props, style) => {
      const mixinStyles = value(props)
      if (mixinStyles && typeof mixinStyles === 'object') {
        buildDynamicStyles(props, mixinStyles, style)
      }
    })
  }

  if (typeof value === 'object') {
    return value
  }
}
