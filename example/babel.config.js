const path = require('path');
const pak = require('../package.json');

const styledNativeComponents = path.join(__dirname, '..', pak.source)

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['../babel-plugin', { imports: [styledNativeComponents] }],
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          [pak.name]: styledNativeComponents,
        },
      },
    ],
  ],
};
