import { StyledComponent } from './types'

export const isFunction = (fn: any): fn is Function => typeof fn === 'function'

export const isStyledComponent = (component: any): component is StyledComponent =>
  !!(component as StyledComponent)?.isStyled
