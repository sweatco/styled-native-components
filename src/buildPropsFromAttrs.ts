import { AnyTheme, AttrsFn, BaseObject, Themed, UnknownProps } from './types'

/**
 * Combines passed props and props from attrs
 * @param props passed props
 * @param attrs array of props
 * 
 * Example:
 * props - { overriddenNumber: 0 }
 * attrs - [
 *  () => { number: 1, overriddenNumber: 1},
 *  (props) => { number: props.number + 1, overriddenNumber: props.overriddenNumber + 1 }
 * ]
 * result - { overriddenNumber: 2, number: 2 }
 */
export function buildPropsFromAttrs<Theme extends BaseObject = AnyTheme>(props: Themed<UnknownProps, Theme>, attrs: AttrsFn[]): Themed<UnknownProps, Theme> {
  for (const attr of attrs) {
    props = Object.assign(props, attr(props))
  }
  return props
}
