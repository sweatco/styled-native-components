import React from 'react'
import { StyleSheet, View } from 'react-native'
import styled from '@sweatco/styled'
import { COUNT } from '../utils'

export const StyledNativeComponentDynamic = () => (
  <View style={styles.container}>
    {new Array(COUNT).fill(0).map((_, i) => (
      <StyledView key={i} />
    ))}
  </View>
)

const styles = StyleSheet.create({
  container: { display: 'flex', flexDirection: 'row' },
})

const StyledView = styled.View`
  border-color: red;
  border-width: ${() => 2}px;
  padding: ${() => 5}px;
`
