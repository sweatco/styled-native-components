import React from 'react'
import { StyleSheet, View } from 'react-native'
import styled from '@sweatco/styled-native-components'
import { COUNT } from '../utils'

export const StyledNativeComponent = () => {
  return (
    <View style={styles.container}>
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
