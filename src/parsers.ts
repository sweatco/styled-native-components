import { getStylesForProperty } from 'css-to-react-native'
import { Css, UnknownProps, UnknownStyles } from './types'
import { Falsy } from 'react-native'

const functionKey = 'function'

const isFunction = (fn: any): fn is Function => typeof fn === functionKey

export type Parser = (styles: UnknownStyles, queue: Queue, props: UnknownProps) => void
export type Queue = Array<Parser>

const parser = <T>(callback: (value: T, styles: UnknownStyles, queue: Queue, props: UnknownProps) => void) =>
  (value: unknown): Parser =>
    (styles, queue, props) => {
      if (isFunction(value)) {
        queue.push((styles, queue, props) => callback(value(props) as T, styles, queue, props))
      } else {
        callback(value as T, styles, queue, props)
      }
    }

export const maybeDynamic = (fn: (fnArgs: unknown[]) => unknown, args: unknown[]) => {
  const isDynamic = args.some(isFunction)
  if (isDynamic) {
    return (props: UnknownProps) => {
      const fnArgs = args.map((arg) => isFunction(arg) ? arg(props) : arg)
      return fn(fnArgs)
    }
  }

  return fn(args)
}

// parsers

export const runtime = (key: string, value: unknown) => parser((value, styles) => {
  if (typeof value === 'string') {
    Object.assign(styles, getStylesForProperty(key, value))
  } else {
    styles[key] = value
  }
})(value)

/**
 * `height: 1px` -> style('height', 1)
 * `height: ${(props) => props.size}px` -> style('height', (props) => props.size)
 */
export const style = (key: string, value: unknown) => parser((value, styles) => {
    styles[key] = value
})(value)


/**
 * `${sharedStyle}` -> mixin(sharedStyle)
 */
export const mixin = (value: unknown) => parser<Css | Falsy>((value, styles, queue, props) => {
  if (value instanceof Css) {
    for (const parser of value.parsers) {
      parser(styles, queue, props)
    }
  }
})(value)
