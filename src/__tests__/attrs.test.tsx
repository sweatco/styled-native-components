import { TouchableOpacity } from "react-native"
import { createStyled } from "../styled"

describe('attrs', () => {
    test('', () => {
        const { styled } = createStyled()
        const ButtonContainer = styled(TouchableOpacity).attrs({ activeOpacity: 0.8 })<{ opacity: number }>`
            opacity: ${(props) => props.opacity};
        `

        expect(ButtonContainer).toBeTruthy()
    })
})
