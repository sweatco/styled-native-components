import React, { PropsWithChildren, createElement, useContext } from 'react'
import {
  ActivityIndicator,
  Button,
  DrawerLayoutAndroid,
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
  Switch,
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
  StyledObject,
  StyledComponent,
  AnyStyleProps,
} from './types'
import { buildPropsFromAttrs } from './buildPropsFromAttrs'
import { substitute, runtime, mixin } from './parsers'
import { createTheme } from './theme'
import { buildDynamicStyles } from './buildDynamicStyles'
import { isFunction, isStyledComponent } from './utils'

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
      initialStyles = isStyledComponent(Component) ? { ...Component.styles, ...initialStyles } : initialStyles
      attrs = isStyledComponent(Component) ? [...Component.attrs, ...attrs] : attrs
      const hasDynamicStyles = Object.keys(initialStyles).some((key) => isFunction(initialStyles[key]))
      const fixedStyle = hasDynamicStyles ? undefined : initialStyles
      const origin = isStyledComponent(Component) ? Component.origin : Component

      // Component
      type ThemedProps = Themed<UnknownProps, Theme>
      const StyledComponent = React.forwardRef((props: PropsWithChildren<ThemedProps & AnyStyleProps & AsComponentProps>, ref) => {
        const theme = useContext(ThemeContext)
        const CastedComponent = (props.as ?? origin) as AnyComponent
        let propsForElement: ThemedProps = Object.assign({}, props, { theme, ref })
        let style: StyleProp<UnknownStyles> = fixedStyle

        if (attrs.length > 0) {
          propsForElement = buildPropsFromAttrs(propsForElement, attrs)
        }
        if (hasDynamicStyles) {
          style = buildDynamicStyles(propsForElement, initialStyles)
        }

        const styleFromProps = props.style
        if (styleFromProps) {
          style = ([style] as Array<StyleProp<UnknownStyles>>).concat(styleFromProps)
        }
        propsForElement.style = style
        propsForElement.theme = props.theme

        return createElement(CastedComponent, propsForElement)
      }) as StyledComponent

      StyledComponent.displayName = 'StyledComponent'
      StyledComponent.isStyled = true
      StyledComponent.styles = initialStyles
      StyledComponent.attrs = attrs
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
    return innerStyled as unknown as Styled<C, Theme>
  }

  styled.ActivityIndicator = styled(ActivityIndicator)
  styled.Button = styled(Button)
  styled.DrawerLayoutAndroid = styled(DrawerLayoutAndroid)
  styled.FlatList = styled(FlatList)
  styled.Image = styled(Image)
  styled.KeyboardAvoidingView = styled(KeyboardAvoidingView)
  styled.Modal = styled(Modal)
  styled.Pressable = styled(Pressable)
  styled.RefreshControl = styled(RefreshControl)
  styled.SafeAreaView = styled(SafeAreaView)
  styled.ScrollView = styled(ScrollView)
  styled.SectionList = styled(SectionList)
  styled.Switch = styled(Switch)
  styled.Text = styled(Text)
  styled.TextInput = styled(TextInput)
  styled.TouchableHighlight = styled(TouchableHighlight)
  styled.TouchableOpacity = styled(TouchableOpacity)
  styled.VirtualizedList = styled(VirtualizedList)
  styled.View = styled(View)
  styled.TouchableWithoutFeedback = styled(TouchableWithoutFeedback)
  styled.ImageBackground = styled(ImageBackground)

  function css<Props extends object = BaseObject>(
    _styles: Styles<Themed<Props, Theme>>,
    ..._interpolations: Array<Interpolation<Themed<Props, Theme>>>
  ) {
    return _styles as StyledObject<Props>
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
