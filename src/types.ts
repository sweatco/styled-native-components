import React, { ComponentPropsWithRef, ForwardRefExoticComponent } from 'react'
import { Parser } from './parsers'

export type AnyComponent<P extends object = any> = React.ComponentType<P>

export interface BaseObject {}

type FastOmit<T extends object, U extends string | number | symbol> = {
  [K in keyof T as K extends U ? never : K]: T[K]
}

type Substitute<A extends object, B extends object> = FastOmit<A, keyof B> & B

export type AnyTheme = BaseObject

type RuleSet<Props extends object = BaseObject> = Array<Interpolation<Props>>

interface StyledObject<Props extends object = BaseObject> {
  [key: string]: StyledObject<Props> | string | number | StyleFunction<Props> | RuleSet<any> | undefined
}

export type StylePair = [string, unknown]

export type Interpolation<Props extends object> =
  | StyleFunction<Props>
  | StyledObject<Props>
  | TemplateStringsArray
  | string
  | number
  | false
  | undefined
  | null
  | RuleSet<Props>
  | Array<Interpolation<Props>>
  | Css
  | Parser

export type Styles<Props extends object> = TemplateStringsArray | Interpolation<Props>

type StyleFunction<Props extends object> = (props: Props) => Interpolation<Props>

type PropsWithRef<C extends AnyComponent> = ComponentPropsWithRef<C>

type PickProps<NewA, OwnProps> = {
  [P in keyof NewA]: P extends keyof OwnProps ? (NewA[P] extends OwnProps[P] ? NewA[P] : never) : never
}

export type Themed<Props, Theme extends AnyTheme> = Props & {
  theme: Theme
}

export type AsComponentProps = { as?: React.ComponentType }

export interface Styled<
  C extends AnyComponent,
  Theme extends AnyTheme = BaseObject,
  OwnProps extends BaseObject = PropsWithRef<C>
> {
  <Props extends object = OwnProps>(
    styles: Styles<Themed<OwnProps & Props, Theme>>,
    ...interpolations: Array<Interpolation<Themed<OwnProps & Props, Theme>>>
  ): ForwardRefExoticComponent<Substitute<OwnProps, Props & AsComponentProps>>
  attrs<Props extends object, R extends object = Props>(
    attrs: ((props: Themed<Props & OwnProps, Theme>) => PickProps<R, OwnProps>) | PickProps<R, OwnProps>
  ): Styled<C, Theme, FastOmit<OwnProps, keyof R> & Props & Partial<R>>
}

export type DynamicStyleFn = (props: Themed<UnknownProps, AnyTheme>) => unknown

export class Css {
  constructor(public parsers: Parser[]) {}
}

export type UnknownProps = Record<string, unknown>
export type UnknownStyles = Record<string, unknown>
export type InnerAttrs = (props: Themed<UnknownProps, AnyTheme>) => UnknownProps
