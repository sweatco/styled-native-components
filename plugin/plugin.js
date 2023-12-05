const {
    isCallExpression,
    isIdentifier,
    isMemberExpression,
} = require('@babel/types')
const postcss = require('postcss')
const { getStylesForProperty } = require('css-to-react-native')

const STYLED = 'styled'
const CSS = 'css'
const MAGIC_NUMBER = 123456789
const REGEX = new RegExp(`(.*)(\\d+\\.${MAGIC_NUMBER})(.*)`)

const isCSSCallExpression = (node) => isIdentifier(node) && node.name === CSS
const isStyledCallExpression = (node) => {
    if (!isCallExpression(node)) {
        return false
    }
    if (isMemberExpression(node.callee)) {
        if (isMemberExpression(node.callee.object)) { // styled.View.attrs(...)`...`
            return node.callee.object.object.name === STYLED
        }
        if (isCallExpression(node.callee.object)) { // styled(View).attrs(...)`...`
            return node.callee.object.callee.name === STYLED
        }
        return node.callee.object.name === STYLED
    }

    if (isIdentifier(node.callee)) { // styled(View)`...`
        return node.callee.name === STYLED
    }
    
    return false
}
const isStyledMemberExpression = (node) => {
    if (!isMemberExpression(node)) {
        return false
    }
    if (isIdentifier(node.object)) { // styled.View`...`
        return node.object.name === STYLED
    }
    
    return false
}


module.exports = function plugin(babel) {
    const { types: t } = babel
    return {
        visitor: {
            TaggedTemplateExpression(path) {
                const { node: { tag } } = path
                const isStyled = isStyledCallExpression(tag) || isStyledMemberExpression(tag) || isCSSCallExpression(tag)
                if (!isStyled) {
                    return
                }

                const css = path.get("quasi").node
                const { cssText, substitutionMap } = extractSubstitutionMap(css)
                const styles = parseCss(cssText, substitutionMap)
                const buildCss = buildCssObject(t, substitutionMap)
                const cssObject = buildCss(styles)

                path.replaceWith(t.callExpression(tag, [cssObject]))
            }
        }
    }
}

function extractSubstitutionMap({
  quasis,
  expressions,
}) {
    const quasiValue = (quasi) => quasi.value.cooked
    const substitutionNames = expressions.map(
        (_, index) => `${index}.${MAGIC_NUMBER}`
    )

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
    const lines = cssText.split('\n')
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim()
        if (line.endsWith(';')) {
            line = line.substring(0, line.length - 1)
        }
        if (substitutionMap[line]) { // mixin
            line = `${line}:${line};`
            lines[i] = line
        }
    }
    cssText = lines.join('')
    let styles = []
    const { nodes } = postcss.parse(cssText)
    for (const node of nodes) {
        if (node.type === 'decl') {
            const styleObject = getStylesForProperty(node.prop, node.value)
            styles = styles.concat(Object.entries(styleObject))
        }
    }
    

    return styles
}

function buildCssObject(t, substitutions) {
    function wrapper(args) {
        return t.callExpression(
            t.memberExpression(
                t.identifier(STYLED),
                t.identifier('wrapper')
            ),
            args
        )
    }
    function caller(args) {
        return t.arrowFunctionExpression([t.restElement(t.identifier('args'))], args)
    }

    function splitSubstitution(str) {  
        return str.match(REGEX)?.slice(1) ?? []
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
                    const matches = splitSubstitution(value)
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
                    return inject(substitutions[value])
                }
                return t.numericLiteral(value)
            },
            object(values) {   
                if (Array.isArray(values)) {
                    return t.arrayExpression(values.map(mapper))
                }

                return t.objectExpression(Object.keys(values).map((key) => {
                    return t.objectProperty(
                        t.identifier(key),
                        mapper(values[key]),
                    )
                }))
            },
        }
        function mapper(value) {
            const expression = literals[typeof value]
            return expression(value)
        }
        
        return mapper
    }

    return (node) => {
        const values = []
        for (const [key, value] of node) {
            const args = []
            const mapper = travers(args)
            let expression = mapper(value)
            if (args.length) {
                expression = wrapper([caller(expression)].concat(args))
            }
            values.push(t.arrayExpression([t.stringLiteral(key), expression]))
        }

        return t.arrayExpression(values)
    }
}
