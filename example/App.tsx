import React, { useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

import { StyledNativeComponent } from './components/StyledNativeComponent'
import TimedRender from './TimedRender'
import { ReactNative } from './components/ReactNative'
import { StyledNativeComponentDynamic } from './components/StyledNativeComponentDynamic'
import { StyledComponent } from './components/StyledComponent'

export default function App() {
  const [styleType, setStyleType] = useState<string>()

  const onStyleTypePress = (curry: string) => () => {
    setStyleType(curry)
  }

  const renderStyleLibrary = () => {
    switch (styleType) {
      case 'react-native':
        return <ReactNative />
      case 'styled-native-components':
        return <StyledNativeComponent />
      case 'styled-native-components-dynamic':
        return <StyledNativeComponentDynamic />
      case 'styled-components':
        return <StyledComponent />
      default:
        return null
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tap a style library to start rendering</Text>
      <View style={styles.buttons}>
        <Button title="react-native" onPress={onStyleTypePress('react-native')} />
        <Button title="styled-native-components" onPress={onStyleTypePress('styled-native-components')} />
        <Button
          title="styled-native-components (dynamic styles)"
          onPress={onStyleTypePress('styled-native-components-dynamic')}
        />
        <Button title="styled-components" onPress={onStyleTypePress('styled-components')} />
      </View>
      {styleType ? (
        <TimedRender key={styleType}>
          <Text style={styles.text}>
            Rendering with <Text style={styles.bold}>{styleType}</Text>
          </Text>
        </TimedRender>
      ) : null}
      {renderStyleLibrary()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    marginVertical: 12,
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttons: {
    gap: 12,
  },
})
