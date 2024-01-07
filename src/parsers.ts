import { getStylesForProperty } from 'css-to-react-native'
import { UnknownProps, UnknownStyles } from './types'

const isFunction = (fn: any): fn is Function => typeof fn === 'function'

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
      const fnArgs = ([] as unknown[]).concat(args)
      for (const index of indexes) {
        const dynamicStyle = fnArgs[index] as Function
        fnArgs[index] = dynamicStyle(props)
      }
      return fn(fnArgs)
    }
  }

  return fn(args)
}

export const maybeDynamic = (value: unknown) => {
  if (isFunction(value)) {
    return (props: UnknownProps, style: UnknownStyles, key: string) => {
      style[key] = value(props)
    }
  }

  return value
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
export const runtime = (id: string, key: string, value: unknown) => {
  if (isFunction(value)) {
      return {
          [id]: (props: UnknownProps, style: UnknownStyles) => {
            Object.assign(style, getRuntimeStyles(key, value(props)))
          }
      }
  }

  return getRuntimeStyles(key, value)
}

export const mixin = (id: string, value: UnknownProps) => {
  if (isFunction(value)) {
      return {
          [id]: (props: UnknownProps, style: UnknownStyles) => {
            Object.assign(style, value(props))
          }
      }
  }

  return value
}
