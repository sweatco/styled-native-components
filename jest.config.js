module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  modulePathIgnorePatterns: [
    '<rootDir>/example/node_modules',
    '<rootDir>/lib/',
  ],
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
}
