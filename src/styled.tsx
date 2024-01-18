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
  UnknownStyles,
} from './types'
import { buildPropsFromAttrs } from './buildPropsFromAttrs'
import { substitute, runtime, mixin } from './parsers'
import { createTheme } from './theme'
import { splitAttrs } from './splitAttrs'
import { buildDynamicStyles } from './buildDynamicStyles'
import { isFunction } from './utils'

interface AnyStyleProps {
  style?: StyleProp<UnknownStyles>
}

type StyledComponent = React.ForwardRefExoticComponent<Omit<React.PropsWithChildren<UnknownProps & AnyStyleProps & AsComponentProps>, "ref"> & React.RefAttributes<unknown>> & {
  isStyled?: boolean
  initialStyles: UnknownStyles
  attrs: InnerAttrs[]
  origin: AnyComponent
}

const isStyledComponent = (component: AnyComponent): component is StyledComponent => !!(component as StyledComponent)?.isStyled

const methods = {
  substitute,
  runtime,
  mixin,
}

export function createStyled<Theme extends AnyTheme>() {
  const { ThemeContext, ThemeProvider } = createTheme<Theme>()

  function styled<C extends AnyComponent>(Component: C): Styled<C, Theme> {
    function innerStyled(initialStyles: UnknownStyles, attrs: InnerAttrs[] = []) {
      if (process.env.NODE_ENV !== 'production') {
        if (typeof initialStyles !== 'object') {
          throw new Error('It seems you forgot to add babel plugin.')
        }
      }
      initialStyles = isStyledComponent(Component) ? { ...Component.initialStyles, ...initialStyles } : initialStyles
      attrs = isStyledComponent(Component) ? [...Component.attrs, ...attrs] : attrs
      const hasDynamicStyles = Object.keys(initialStyles).some((key) => isFunction(initialStyles[key]))
      const fixedStyle = hasDynamicStyles ? undefined : initialStyles
      const { fixedProps, dynamicAttrs } = splitAttrs(attrs)
      const origin = isStyledComponent(Component) ? Component.origin : Component
      const isDynamic = dynamicAttrs.length > 0 || hasDynamicStyles

      // Component
      type ThemedProps = Themed<UnknownProps, Theme>
      const StyledComponent = React.forwardRef((props: PropsWithChildren<ThemedProps & AnyStyleProps & AsComponentProps>, ref) => {
        const theme = useContext(ThemeContext)
        const CastedComponent = (props.as ?? origin) as AnyComponent
        const styleFromProps = props.style
        const hasCustomStyle = styleFromProps && fixedStyle !== styleFromProps
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
        if (hasDynamicStyles) {
          style = buildDynamicStyles(propsForElement, initialStyles)
        }
        if (hasCustomStyle) {
          style = [style, styleFromProps]
        }
        propsForElement.style = style
        if (shouldCopyProps) {
          propsForElement.theme = props.theme
        }
        return createElement(CastedComponent, propsForElement)
      }) as StyledComponent

      StyledComponent.displayName = 'StyledComponent'
      StyledComponent.isStyled = true
      StyledComponent.initialStyles = initialStyles
      StyledComponent.attrs = attrs
      StyledComponent.defaultProps = Object.assign({ style: fixedStyle }, fixedProps)
      StyledComponent.origin = origin
      return StyledComponent
    }
    const attrs = (styled: typeof innerStyled) =>
      (attrsOrAttrsFn: InnerAttrs) => {
        const styledWithAttrs = (styles: UnknownStyles, attrs: InnerAttrs[] = []) => styled(styles, [attrsOrAttrsFn].concat(attrs))
        // @ts-expect-error
        styledWithAttrs.attrs = attrs(styledWithAttrs)

        return styledWithAttrs
    }
    innerStyled.attrs = attrs(innerStyled)
    // We use as unknown as Type constraction here becasue
    // it is expected that argument so the styled function is transformed to an Array<Array> type during Babel transpilation.
    return innerStyled as Styled<C, Theme>
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
    _styles: Styles<Themed<Props, Theme>>,
    ..._interpolations: Array<Interpolation<Themed<Props, Theme>>>
  ) {
    return _styles as UnknownStyles
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
