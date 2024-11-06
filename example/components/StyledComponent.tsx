import React from 'react'
import { StyleSheet, View } from 'react-native'
import styled from 'styled-components/native'
import { COUNT } from '../utils'

export const StyledComponent = () => (
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
  border-width: 2px;
  padding: 5px;
`
