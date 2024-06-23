import { parse } from 'postcss'

import { UnknownStyles } from './types'
import { getRuntimeStyles } from './getRuntimeStyles'

function kebabToCamel(str: string) {
  return str.replace(/-./g, (match) => match.charAt(1).toUpperCase())
}

export const stringToStyles = (cssText: string): UnknownStyles => {
  const { nodes } = parse(cssText)
  const styles: UnknownStyles = {}
  for (const node of nodes) {
    if (node.type === 'decl') {
      const key = kebabToCamel((node as { prop: string }).prop)
      Object.assign(styles, getRuntimeStyles(key, node.value))
    }
  }

  return styles
}
