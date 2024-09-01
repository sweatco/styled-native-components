const { isCallExpression, isIdentifier, isMemberExpression, isVariableDeclarator, isObjectProperty } = require('@babel/types')
const postcss = require('postcss')
const { transform } = require('./transform')
const { MIXIN, RUNTIME } = require('./constants')
const { createHash } = require('crypto')
const Path = require('path')

const STYLED = 'styled'
const CSS = 'css'
const MAGIC_NUMBER = 123456789
const FILE_HASH = 'styled-native-components-file-hash'
const NEXT_ID_KEY = 'styled-native-components-next-id'
const SUBSTITUTION_REGEX = new RegExp(`(\\d+\\.${MAGIC_NUMBER})`, 'g')
function kebabToCamel(str) {
  return str.replace(/-./g, (match) => match.charAt(1).toUpperCase())
}

const isCSSCallExpression = (node) => isIdentifier(node) && node.name === CSS
const isStyledCallExpression = (node) => {
  if (!isCallExpression(node)) {
    return false
  }
  if (isMemberExpression(node.callee)) {
    if (isMemberExpression(node.callee.object)) {
      // styled.View.attrs(...)`...`
      return node.callee.object.object.name === STYLED
    }
    if (isCallExpression(node.callee.object)) {
      // styled(View).attrs(...)`...`
      return node.callee.object.callee.name === STYLED
    }
    return node.callee.object.name === STYLED
  }

  if (isIdentifier(node.callee)) {
    // styled(View)`...`
    return node.callee.name === STYLED
  }

  return false
}
const isStyledMemberExpression = (node) => {
  if (!isMemberExpression(node)) {
    return false
  }
  if (isIdentifier(node.object)) {
    // styled.View`...`
    return node.object.name === STYLED
  }

  return false
}

const isStyled = (node) => isStyledCallExpression(node) || isStyledMemberExpression(node) || isCSSCallExpression(node)

module.exports = function plugin(babel, config) {
  const { types: t } = babel
  let hasStyledImport = false
  const styledImports = ['styled-native-components'].concat(config.imports ?? [])
  return {
    visitor: {
      ImportDeclaration: {
        enter({
          node: {
            source: { value: path },
          },
        }) {
          if (styledImports.includes(path)) {
            hasStyledImport = true
          }
        },
      },
      TaggedTemplateExpression(path, state) {
        const {
          node: { tag },
        } = path
        if (!hasStyledImport || !isStyled(tag)) {
          return
        }
        const identifier = isCSSCallExpression(tag) ? CSS : STYLED
        const css = path.get('quasi').node
        const { cssText, substitutionMap } = extractSubstitutionMap(css)
        const styles = parseCss(cssText, substitutionMap)
        const buildCss = buildCssObject(identifier, t, substitutionMap)
        let tagExpression = tag

        if (process.env.NODE_ENV !== 'production' && !isCSSCallExpression(tag)) {
          // Create an AST node for the expression .meta({...})
          const tagWithMetaExpression = t.callExpression(
            t.memberExpression(
              tag,
              t.identifier('meta'),
              false,
            ),
            [createMeta(t, path, state)]
          )
          tagExpression = tagWithMetaExpression // .meta({...})
        }

        path.replaceWith(t.callExpression(tagExpression, [buildCss(styles)]))
      },
    },
  }
}

/**
 * Input:
 * quasis = ['prop1: 1px;\nprop2: ', 'px;\nprop3: ', 'px;\n']
 * expressions = [2, (props) => props.number]
 *
 * Output:
 * cssText = '
 *    prop1: 1px;
 *    prop2: 0.123456789px;
 *    prop3: 1.123456789px;
 * '
 *
 * substitutionMap = {
 *  0.123456789: 2,
 *  1.123456789: (props) => props.number,
 * }
 */
function extractSubstitutionMap({ quasis, expressions }) {
  const quasiValue = (quasi) => quasi.value.cooked
  const substitutionNames = expressions.map((_, index) => `${index}.${MAGIC_NUMBER}`)

  let cssText = quasiValue(quasis[0])

  for (let i = 0; i < substitutionNames.length; i++) {
    const name = substitutionNames[i]
    cssText += name
    cssText += quasiValue(quasis[i + 1])
  }

  const substitutionMap = {}
  substitutionNames.forEach((substitution, index) => {
    substitutionMap[substitution] = expressions[index]
  })

  return { cssText, substitutionMap }
}

function parseCss(cssText, substitutionMap) {
  function removeComments(str) {
    return str
      .replace(/\/\*[\s\S]*?\*\//g, '') // remove /* */ comments
      .replace(/\/\/.*(?=\n|$)/g, '') // remove // comments
  }
  const pattern = new RegExp(`^\\d+\\.${MAGIC_NUMBER}`)
  function startsWithSubstitution(line) {
    return pattern.test(line)
  }

  cssText = removeComments(cssText)
  const SEPARATOR = ';'
  const lines = cssText.split('\n').reduce((acc, line) => acc.concat(line.split(SEPARATOR)), [])
  const processedLines = []
  let styles = []
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim()
    if (startsWithSubstitution(line) && substitutionMap[line]) {
      line = `${MIXIN}:${line}`
    }
    if (line) {
      processedLines.push(line)
    }
  }
  cssText = processedLines.join(SEPARATOR)
  const { nodes } = postcss.parse(cssText)
  for (const node of nodes) {
    if (node.type === 'decl') {
      const key = kebabToCamel(node.prop)
      styles = styles.concat(transform(key, node.value))
    }
  }

  return styles
}

function buildCssObject(identifier, t, substitutions) {
  function substitute(value, args) {
    return t.callExpression(t.memberExpression(t.identifier(identifier), t.identifier('substitute')), [
      value,
      t.arrayExpression(args),
    ])
  }
  function runtime(key, value) {
    return t.callExpression(t.memberExpression(t.identifier(identifier), t.identifier('runtime')), [key, value])
  }
  function mixin(value) {
    return t.callExpression(t.memberExpression(t.identifier(identifier), t.identifier('mixin')), [value])
  }
  function caller(args) {
    return t.functionExpression(null, [t.identifier('args')], t.blockStatement([t.returnStatement(args)]))
  }

  function isSubstitution(value) {
    return String(value).includes(MAGIC_NUMBER)
  }

  function travers(context) {
    function inject(substitution) {
      context.push(substitution)
      return t.memberExpression(t.identifier('args'), t.numericLiteral(context.length - 1), true)
    }
    const literals = {
      string(value) {
        if (isSubstitution(value)) {
          const elements = []
          const expressions = []
          if (substitutions[value]) {
            return inject(substitutions[value])
          }

          const matches = value.split(SUBSTITUTION_REGEX)
          for (const match of matches) {
            const substitution = substitutions[match]
            if (substitution) {
              expressions.push(inject(substitution))
            } else {
              elements.push(t.templateElement({ raw: match }))
            }
          }
          return t.templateLiteral(elements, expressions)
        }
        return t.stringLiteral(value)
      },
      number(value) {
        if (isSubstitution(value)) {
          const injection = inject(substitutions[Math.abs(value)])

          return value < 0 ? t.unaryExpression('-', injection, true) : injection
        }
        return t.numericLiteral(value)
      },
      undefined() {
        return t.identifier('undefined')
      },
      object(values) {
        if (Array.isArray(values)) {
          return t.arrayExpression(values.map(mapper))
        }

        return t.objectExpression(
          Object.keys(values).map((key) => {
            return t.objectProperty(t.identifier(key), mapper(values[key]))
          })
        )
      },
    }
    function mapper(value) {
      const expression = literals[typeof value]
      return expression(value)
    }

    return mapper
  }

  return (node) => {
    const properties = []
    const buildExpression = (value, args) => {
      const mapper = travers(args)
      const expression = mapper(value)

      return args.length ? substitute(caller(expression), args) : expression
    }
    for (let [key, value] of node) {
      const args = []
      if (key === RUNTIME) {
        const expression = buildExpression(value[1], args)
        properties.push(t.spreadElement(runtime(t.stringLiteral(value[0]), expression))) // {...runtime()}
      } else if (key === MIXIN) {
        const expression = buildExpression(value, args)
        properties.push(t.spreadElement(mixin(expression))) // {...mixin()}
      } else {
        let expression = buildExpression(value, args)

        properties.push(t.objectProperty(t.identifier(key), expression))
      }
    }

    return t.objectExpression(properties)
  }
}

function createMeta(t, path, state) {
  const nullIndentifier = t.identifier('null')
  const displayName = getDisplayName(t, path, state)
  const reciverFrames = t.arrowFunctionExpression(
    [], // No parameters
    t.newExpression(
      t.identifier('Error'), // new Error
      [] // No arguments passed to Error
    )
  )
  const meta = [
    t.objectProperty(t.identifier('displayName'), t.stringLiteral(displayName)),
    t.objectProperty(t.identifier('reciverFrames'), reciverFrames),
  ]

  return t.objectExpression(meta)
}

function getDisplayName(t, path, state) {
  const componentPath = Path
        .relative(state.cwd, state.filename)
        .replace(/\\/g, '/')
  const line = path?.node?.loc?.start.line
  const pathToComponent = `${componentPath}:${line}`
  const parentNode = path?.parentPath?.node
  let name = 'Styled'

  if (isVariableDeclarator(parentNode)) {
    name = parentNode.id.name
  } else if (isObjectProperty(parentNode)) {
    name = parentNode.key.name
  }

  return `Styled(${name})`
}