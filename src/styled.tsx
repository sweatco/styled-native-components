import React, { PropsWithChildren, createElement, useContext } from 'react'
import {
  Button,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  SectionList,
  StyleProp,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  VirtualizedList,
} from 'react-native'
import {
  AnyComponent,
  AnyTheme,
  BaseObject,
  InnerAttrs,
  Interpolation,
  Styled,
  Styles,
  Themed,
  UnknownProps,
  AsComponentProps,
  Css,
  UnknownStyles,
} from './types'
import { buildPropsFromAttrs } from './buildPropsFromAttrs'
import { Parser, maybeDynamic, runtime, style, mixin, Queue } from './parsers'
import { createTheme } from './theme'
import { splitStyles } from './splitStyles'
import { splitAttrs } from './splitAttrs'

export function buildDynamicStyles(
  props: Themed<UnknownProps, AnyTheme>,
  queue: Queue,
  styles: UnknownStyles = {}
) {
  const initial: Queue = []
  queue = initial.concat(queue)
  for (const parser of queue) {
    parser(styles, queue, props)
  }
  return styles
}

interface AnyStyleProps {
  style?: StyleProp<UnknownStyles>
}

type StyledComponent = React.ForwardRefExoticComponent<Omit<React.PropsWithChildren<UnknownProps & AnyStyleProps & AsComponentProps>, "ref"> & React.RefAttributes<unknown>> & {
  isStyled?: boolean
  parsers: Parser[]
  attrs: InnerAttrs[]
  origin: AnyComponent
}

const isStyledComponent = (component: AnyComponent): component is StyledComponent => !!(component as StyledComponent)?.isStyled

const methods = {
  style,
  maybeDynamic,
  runtime,
  mixin,
}

export function createStyled<Theme extends AnyTheme>() {
  const { ThemeContext, ThemeProvider } = createTheme<Theme>()

  function styled<C extends AnyComponent>(Component: C): Styled<C, Theme> {
    function innerStyled(parsers: Parser[], attrs: InnerAttrs[] = []) {
      if (process.env.NODE_ENV !== 'production') {
        if (!Array.isArray(parsers)) {
          throw new Error('It seems you forgot to add babel plugin.')
        }
      }
      parsers = isStyledComponent(Component) ? [...Component.parsers, ...parsers] : parsers
      attrs = isStyledComponent(Component) ? [...Component.attrs, ...attrs] : attrs
      const { styles: fixedStyle, dynamic: dynamicStyles } = splitStyles(parsers)
      const { fixedProps, dynamicAttrs } = splitAttrs(attrs)
      const origin = isStyledComponent(Component) ? Component.origin : Component
      const hasDynamicStyles = dynamicStyles.length > 0
      const isDynamic = dynamicAttrs.length > 0 || dynamicStyles.length > 0

      // Component
      type ThemedProps = Themed<UnknownProps, Theme>
      const StyledComponent = React.forwardRef((props: PropsWithChildren<ThemedProps & AnyStyleProps & AsComponentProps>, ref) => {
        const theme = useContext(ThemeContext)
        const CastedComponent = (props.as ?? origin) as AnyComponent
        const hasCustomStyle = fixedStyle !== props.style
        // We add fixed props and styles to defaultProps. Thanks to this, we don't need to copy the props object.
        // We copy the props object in the following cases:
        // 1. ref is not null, meaning the parent has set a ref for the component.
        // 2. There are dynamic props that depend on the component's props.
        // 3. There are dynamic attributes that depend on the component's props.
        const shouldCopyProps = isDynamic || ref || hasCustomStyle
        let propsForElement = shouldCopyProps ? Object.assign({}, props, { theme, ref }) : props
        let style: StyleProp<UnknownStyles> = fixedStyle

        if (dynamicAttrs.length > 0) {
          propsForElement = buildPropsFromAttrs(propsForElement, dynamicAttrs)
        }
        if (hasDynamicStyles || hasCustomStyle) {
          style = Object.assign({}, fixedStyle)
        }
        if (hasDynamicStyles) {
          style = buildDynamicStyles(propsForElement, dynamicStyles, style)
        }
        if (hasCustomStyle) {
          style = [style, props.style]
        }
        propsForElement.style = style
        if (shouldCopyProps) {
          propsForElement.theme = props.theme
        }
        return createElement(CastedComponent, propsForElement)
      }) as StyledComponent

      StyledComponent.displayName = 'StyledComponent'
      StyledComponent.isStyled = true
      StyledComponent.parsers = parsers
      StyledComponent.attrs = attrs
      StyledComponent.defaultProps = Object.assign({ style: fixedStyle }, fixedProps)
      StyledComponent.origin = origin
      return StyledComponent
    }
    const attrs = (styled: typeof innerStyled) =>
      (attrsOrAttrsFn: InnerAttrs) => {
        const styledWithAttrs = (styles: Parser[], attrs: InnerAttrs[] = []) => styled(styles, [attrsOrAttrsFn].concat(attrs))
        // @ts-expect-error
        styledWithAttrs.attrs = attrs(styledWithAttrs)

        return styledWithAttrs
    }
    innerStyled.attrs = attrs(innerStyled)
    // We use as unknown as Type constraction here becasue
    // it is expected that argument so the styled function is transformed to an Array<Array> type during Babel transpilation.
    return innerStyled as unknown as Styled<C, Theme>
  }

  styled.Button = styled(Button)
  styled.FlatList = styled(FlatList)
  styled.Image = styled(Image)
  styled.KeyboardAvoidingView = styled(KeyboardAvoidingView)
  styled.Modal = styled(Modal)
  styled.Pressable = styled(Pressable)
  styled.RefreshControl = styled(RefreshControl)
  styled.SafeAreaView = styled(SafeAreaView)
  styled.ScrollView = styled(ScrollView)
  styled.SectionList = styled(SectionList)
  styled.Text = styled(Text)
  styled.TextInput = styled(TextInput)
  styled.TouchableHighlight = styled(TouchableHighlight)
  styled.TouchableOpacity = styled(TouchableOpacity)
  styled.VirtualizedList = styled(VirtualizedList)
  styled.View = styled(View)
  styled.TouchableWithoutFeedback = styled(TouchableWithoutFeedback)
  styled.ImageBackground = styled(ImageBackground)

  // It is expected that _styles and _interpolations are transformed to an Array<Function> type during Babel transpilation.
  function css<Props extends object = BaseObject>(
    _styles: Styles<Themed<Props, Theme>> | Parser[],
    ..._interpolations: Array<Interpolation<Themed<Props, Theme>>>
  ) {
    // eslint-disable-next-line prefer-rest-params
    return new Css(arguments[0])
  }

  const keys = Object.keys(methods) as Array<keyof typeof methods>
  for (const method of keys) {
    // @ts-expect-error
    styled[method] = methods[method]
    // @ts-expect-error
    css[method] = methods[method]
  }

  return { styled, ThemeProvider, ThemeContext, css }
}
