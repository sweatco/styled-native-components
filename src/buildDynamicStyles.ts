import { isParser } from './parsers'
import { UnknownProps, UnknownStyles } from './types'
import { isFunction } from './utils'

export function buildDynamicStyles(
  props: UnknownProps,
  styles: UnknownStyles,
  dynamicStyles: UnknownStyles = {},
) {
  for (const key in styles) {
    const value = styles[key]
    if (isFunction(value)) {
      if (isParser(value)) {
        value(props, dynamicStyles)
      } else {
        let resultOrFn = value(props)
        while(isFunction(resultOrFn)) {
          resultOrFn = resultOrFn(props)
        }
        dynamicStyles[key] = resultOrFn
      }
    } else {
      dynamicStyles[key] = value
    }
  }
  
  return dynamicStyles
}
