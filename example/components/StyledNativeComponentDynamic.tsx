import { View } from 'react-native'
import styled from 'styled-native-components'
import { COUNT } from '../utils'

export const StyledNativeComponentDynamic = () => (
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      {new Array(COUNT).fill(0).map((_, i) => (
        <StyledView key={i} />
      ))}
    </View>
  )

const StyledView = styled.View`
  border-color: red;
  border-width: ${() => 2}px;
  padding: ${() => 5}px;
`;
