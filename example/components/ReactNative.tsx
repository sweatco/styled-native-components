import { StyleSheet, View } from 'react-native'
import { COUNT } from '../utils'

export const ReactNative = () => {
  return (
    <View style={{ display: "flex", flexDirection: "row" }}>
      {new Array(COUNT).fill(0).map((_, i) => (
        <View key={i} style={styles.styledView} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  styledView: {
    borderColor: "red",
    borderWidth: 2,
    padding: 5,
  },
})
