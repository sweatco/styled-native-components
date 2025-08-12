const path = require('path')
const { getDefaultConfig } = require('@react-native/metro-config')

const root = path.resolve(__dirname, '..')

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
module.exports = (async () => {
  const { withMetroConfig } = await import('react-native-monorepo-config')
  const baseConfig = getDefaultConfig(__dirname)
  
  return withMetroConfig(baseConfig, {
    root,
    dirname: __dirname,
  })
})()
