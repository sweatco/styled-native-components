import { Parser, Queue } from './parsers'
import { UnknownStyles } from './types'

/**
 * We call it outside of the Components to separate fixed styles and build a queue of dynamically parsed styles
 * that will be invoked during the rendering phase.
 */
export function splitStyles(parsers: Parser[]) {
    const styles: UnknownStyles = {}
    const dynamic: Queue = []

    for (const parser of parsers) {
        parser(styles, dynamic, {})
    }

    return { styles, dynamic }
}
