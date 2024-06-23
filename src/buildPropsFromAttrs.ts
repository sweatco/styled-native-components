import { AnyTheme, BaseObject, InnerAttrs, Themed, UnknownProps } from './types'

/**
 * Combines passed props and props from attrs
 * @param props passed props
 * @param attrs array of props
 *
 * Example:
 * props - { overriddenNumber: 0 }
 * attrs - [
 *  { number: 1, overriddenNumber: 1},
 *  (props) => { number: props.number + 1, overriddenNumber: props.overriddenNumber + 1 }
 * ]
 * result - { overriddenNumber: 2, number: 2 }
 */
export function buildPropsFromAttrs<Theme extends BaseObject = AnyTheme>(
  props: Themed<UnknownProps, Theme>,
  attrs: InnerAttrs[]
): Themed<UnknownProps, Theme> {
  for (const attr of attrs) {
    props = Object.assign(props, typeof attr === 'function' ? attr(props) : attr)
  }
  return props
}
