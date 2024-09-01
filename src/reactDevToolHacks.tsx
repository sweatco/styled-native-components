/**
 * React DevTools calls a React functional component without the Fiber context, which causes an error.
 * The error is then caught, and the stack trace is extracted to find the source URL and line number.
 * Reference: https://github.com/facebook/react/blob/4f604941569d2e8947ce1460a0b2997e835f37b9/packages/react-devtools-shared/src/backend/shared/DevToolsComponentStackFrame.js#L54
 * 
 * For styled components, it returns the path of the inner generic styled component.
 * The idea is to generate an error at the place where the styled component is called,
 * and then extract the stack trace to find the correct source URL and line number.
 */
export const injectReciverPathToStack = (e: unknown, reciverFrames?: () => Error) => {
    const error = e as Error
    const frames = reciverFrames?.().stack?.split('\n')
    if (!frames) {
        return
    }
    frames?.shift() // message
    const reciverFrame = frames?.shift()

    if (!reciverFrame) {
        return
    }

    if (!error.stack?.includes('useContext')) { // useContext(Theme)
        return
    }

    const stack = error.stack?.split('\n') ?? []
    const message = stack.shift() // message
    stack.shift() // useContext(Theme)
    stack.shift() // inner StyledComponent
    stack.unshift(reciverFrame)
    message && stack.unshift(message)
    error.stack = stack.join('\n')
}
