import { TouchableOpacity } from 'react-native'
import { createStyled } from '../styled'

describe('displayName', () => {
  test('Should return wrapped name of const', () => {
    const { styled } = createStyled()
    const ButtonContainer = styled(TouchableOpacity).attrs({ activeOpacity: 0.8 })<{ opacity: number }>`
      opacity: ${(props) => props.opacity};
    `

    expect(ButtonContainer.displayName).toBe('Styled(ButtonContainer)')
  })

  test('Should return wrapped name of object property', () => {
    const { styled } = createStyled()
    const Containers = {
      Button1: styled(TouchableOpacity).attrs({ activeOpacity: 0.8 })<{ opacity: number }>`
        opacity: ${(props) => props.opacity};
      `,
      Button2: styled(TouchableOpacity)``,
    }

    expect(Containers.Button1.displayName).toBe('Styled(Button1)')
    expect(Containers.Button2.displayName).toBe('Styled(Button2)')
  })
})
