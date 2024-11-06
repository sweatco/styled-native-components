const path = require('path')
const { getConfig } = require('react-native-builder-bob/babel-config')
const pkg = require('../package.json')

const root = path.resolve(__dirname, '..')

module.exports = getConfig(
  {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      ['styled-native-components/babel-plugin', { imports: [path.join(root, pkg.source)] }],
    ],
  },
  { root, pkg }
)
