module.exports = {
    presets: ['module:metro-react-native-babel-preset',
     
    ],
    plugins: [['./babel-plugin', { imports: [ '../styled' ] }]]
 }