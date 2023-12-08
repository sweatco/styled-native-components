import { DynamicStyleFn, UnknownProps } from './types'

const DynamicSymbol = Symbol('dynamic')
export const dynamic = (fn: DynamicStyleFn) => ({ type: DynamicSymbol, fn })
export const isDynamic = (obj: any): obj is ReturnType<typeof dynamic> => obj?.type === DynamicSymbol

/**
 *  fixed props:
 *  left: ${1}
 *  -> left: styled.maybeDynamic((...args) => args[0], 1) (after babel transpilation)
 *  -> left: 0 (in runtime)
 *  
 *  dynamic props:
 *  left: ${(props) => props.left}
 *  -> left: styled.maybeDynamic((...args) => args[0], (props) => props.left) (after babel transpilation)
 *  -> left: dynamic(fn) (in runtime)
 */
export function maybeDynamic(fn: (...fnArgs: unknown[]) => unknown, ...args: unknown[]): DynamicStyleFn | unknown {
    const isDynamic = args.some((arg) => typeof arg === 'function')
    if (isDynamic) {
      return dynamic((props: UnknownProps): unknown => {
        const fnArgs = args.map((arg) => {
          if (typeof arg === 'function') {
            return arg(props)
          }
  
          return arg
        })
        return fn(...fnArgs)
      })
    }
    return fn(...args)
  }
