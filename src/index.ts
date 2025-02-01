import { createStyled } from './styled'
import { Styled } from './types'

export { createStyled }

/**
 * Override DefaultTheme to get accurate typings for your project.
 *
 * ```
 * // create styled-native-components.d.ts in your project source
 * // if it isn't being picked up, check tsconfig compilerOptions.types
 * import '@sweatco/styled'
 * import Theme from './theme'
 *
 * type ThemeType = typeof Theme;
 *
 * declare module "@sweatco/styled" {
 *  export interface DefaultTheme extends ThemeType {}
 * }
 * ```
 */
export interface DefaultTheme {
  [key: string]: any
}

export const { styled, css, ThemeProvider, ThemeContext } = createStyled<DefaultTheme>()

export default styled

export type { Styled }
