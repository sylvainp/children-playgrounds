module.exports = {
  collectCoverageFrom: ["./src/**"],
  coverageDirectory: "<rootDir>/__tests__/coverage",
  injectGlobals: true,
  moduleFileExtensions: ["ts", "js", "json", "node"],
  preset: "react-native",
  rootDir: "../.",
  setupFiles: ["<rootDir>/__tests__/jest.setup.ts"],
  testEnvironment: "node",
  testMatch: ["<rootDir>/__tests__/**/*.test.ts?(x)"],
  testPathIgnorePatterns: [
    "<rootDir/__tests__/jest.setup.ts",
    "<rootDir>/__tests__/mocks/*",
  ],
};
