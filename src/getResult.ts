import { UnknownProps } from './types'

export const getResult = (props: UnknownProps, fnOrResult: unknown) => {
    return typeof fnOrResult === 'function' ? fnOrResult(props) : fnOrResult
}
