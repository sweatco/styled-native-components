import React from 'react'
import { Button, StyleSheet, View } from 'react-native'
import styled from '@sweatco/styled'
import { COUNT } from '../utils'

export const StyledNativeComponent = () => {
  return (
    <View style={styles.container}>
      <MyButton title="Styled Native Component Button" />
      <SecondButton title="Second Styled Native Component Button" />
      {new Array(COUNT).fill(0).map((_, i) => (
        <Item key={i} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { display: 'flex', flexDirection: 'row' },
})

const Item = styled.View`
  border-color: red;
  border-width: 2px;
  padding: 5px;
`

const MyButton = styled(Button)`
  color: red;
`

const SecondButton = styled.Button`
  color: red;
`
