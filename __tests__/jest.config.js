module.exports = {
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  injectGlobals: true,
  testEnvironment: "node",
  setupFiles: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["<rootDir/jest.setup.ts", "<rootDir>/mocks/*"],
  testMatch: ["<rootDir>/**/*.test.ts?(x)"],
};
