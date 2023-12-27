import { AttrsFn, InnerAttrs, UnknownProps } from "./types"

const isFunction = (fn: any): fn is Function => typeof fn === 'function'

export function splitAttrs(attrs: InnerAttrs[]) {
    let fixedProps: UnknownProps | null = {}
    const dynamicAttrs: AttrsFn[] = []
    let hasDynamicAttrs = false

    for (const attr of attrs) {
        if (isFunction(attr)) {
            hasDynamicAttrs = true
            dynamicAttrs.push(attr)
        } else {
            dynamicAttrs.push(() => attr)
            fixedProps = Object.assign(fixedProps, attr)
        }
    }

    if (hasDynamicAttrs) {
        fixedProps = null
    } else {
        dynamicAttrs.length = 0
    }

    return { fixedProps, dynamicAttrs }
}
