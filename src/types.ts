import { ComponentType, ComponentPropsWithRef, ForwardRefExoticComponent } from 'react'
import { StyleProp } from 'react-native'

export type AnyComponent<P extends object = any> = ComponentType<P>

export interface BaseObject {}

type FastOmit<T extends object, U extends string | number | symbol> = {
  [K in keyof T as K extends U ? never : K]: T[K]
}

type Substitute<A extends object, B extends object> = FastOmit<A, keyof B> & B

export type AnyTheme = BaseObject

export interface StyledObject<Props extends object = BaseObject> {
  [key: string]: StyledObject<Props> | string | number | StyleFunction<Props> | Array<Interpolation<Props>> | undefined
}

/**
 * Use this type to disambiguate between a styled-component instance
 * and a StyleFunction or any other type of function.
 */
export type StyledComponentBrand<Props extends object> = { styles: StyledObject<Props>; readonly _sc: symbol }

export type Interpolation<Props extends object> =
  | StyledComponentBrand<Props>
  | StyleFunction<Props>
  | StyledObject<Props>
  | TemplateStringsArray
  | string
  | number
  | false
  | undefined
  | null
  | Array<Interpolation<Props>>

export type Styles<Props extends object> = TemplateStringsArray | Interpolation<Props>

type StyleFunction<Props extends object> = (props: Props) => Interpolation<Props>

type PickProps<OwnProps, NewA> = {
  [P in keyof NewA]: P extends keyof OwnProps ? OwnProps[P] & NewA[P] : never
}

export type Themed<Props, Theme extends AnyTheme> = Props & {
  theme: Theme
}

export type AsComponentProps = { as?: React.ComponentType }

export interface Styled<
  C extends AnyComponent,
  Theme extends AnyTheme = BaseObject,
  OwnProps extends BaseObject = ComponentPropsWithRef<C>,
> {
  <Props extends object = OwnProps>(
    styles: Styles<Themed<OwnProps & Props, Theme>>,
    ...interpolations: Array<Interpolation<Themed<OwnProps & Props, Theme>>>
  ): ForwardRefExoticComponent<Substitute<OwnProps, Props & AsComponentProps>> & StyledComponentBrand<OwnProps & Props>
  attrs<Props extends BaseObject, R extends BaseObject = Props>(
    attrs: ((props: Themed<Props & OwnProps, Theme>) => PickProps<OwnProps, R>) | PickProps<OwnProps, R>
  ): Styled<C, Theme, FastOmit<OwnProps, keyof R> & Props & Partial<R>>
}

export type UnknownProps = Record<string, unknown>
export type UnknownStyles = Record<string, any>
export type AttrsFn = (props: Themed<UnknownProps, AnyTheme>) => UnknownProps
export type InnerAttrs = AttrsFn | UnknownProps

export interface AnyStyleProps {
  style?: StyleProp<UnknownStyles>
}

export type StyledComponent = React.ForwardRefExoticComponent<Omit<React.PropsWithChildren<UnknownProps & AnyStyleProps & AsComponentProps>, "ref"> & React.RefAttributes<unknown>> & {
  isStyled?: boolean
  styles: StyledObject
  attrs: InnerAttrs[]
  origin: AnyComponent
}
