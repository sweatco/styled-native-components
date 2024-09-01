import { View } from 'react-native'
import styled from 'styled-native-components'
import { COUNT } from '../utils'

export const StyledNativeComponent = () => {
  return (
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      {new Array(COUNT).fill(0).map((_, i) => (
        <Item key={i} />
      ))}
    </View>
  ) 
}

const Item = styled.View`
  border-color: red;
  border-width: 2px;
  padding: 5px;
`
