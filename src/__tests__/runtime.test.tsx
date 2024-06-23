import { createStyled } from '../styled'
import { buildDynamicStyles } from '../buildDynamicStyles'

const { css } = createStyled()
const props = { theme: {} }

describe('runtime parser', () => {
  test('Should parse the transform property', () => {
    let styles = css`
      transform: ${() => 'rotate(180deg)'};
    `

    expect(buildDynamicStyles(props, styles)).toStrictEqual({
      transform: [{ rotate: '180deg' }],
    })

    styles = css`
      transform: ${() => `rotate(${true ? 180 : 0}deg)`};
    `

    expect(buildDynamicStyles(props, styles)).toStrictEqual({
      transform: [{ rotate: '180deg' }],
    })

    styles = css<{ rotate?: string }>`
      transform: ${({ rotate = '180deg' }) => `rotate(${rotate})`};
    `

    expect(buildDynamicStyles(props, styles)).toStrictEqual({
      transform: [{ rotate: '180deg' }],
    })

    styles = css<{ rotation?: number }>`
      transform: rotate(${({ rotation = 180 }) => `${rotation}deg`});
    `

    expect(buildDynamicStyles(props, styles)).toStrictEqual({
      transform: [{ rotate: '180deg' }],
    })
  })

  test('Should parse the border property', () => {
    let styles = css`
      border: ${'dashed'};
    `

    expect(buildDynamicStyles(props, styles)).toStrictEqual({
      borderColor: 'black',
      borderStyle: 'dashed',
      borderWidth: 1,
    })

    styles = css`
      border: ${10}px;
    `

    expect(buildDynamicStyles(props, styles)).toStrictEqual({
      borderColor: 'black',
      borderStyle: 'solid',
      borderWidth: 10,
    })

    styles = css`
      border: ${() => 'white'};
    `

    const result = buildDynamicStyles(props, styles)
    expect(result).toStrictEqual({
      borderColor: 'white',
      borderStyle: 'solid',
      borderWidth: 1,
    })
  })
})
