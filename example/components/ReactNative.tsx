import React from 'react'
import { StyleSheet, View } from 'react-native'
import { COUNT } from '../utils'

export const ReactNative = () => {
  return (
    <View style={styles.container}>
      {new Array(COUNT).fill(0).map((_, i) => (
        <View key={i} style={styles.styledView} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { display: 'flex', flexDirection: 'row' },
  styledView: {
    borderColor: 'red',
    borderWidth: 2,
    padding: 5,
  },
})
