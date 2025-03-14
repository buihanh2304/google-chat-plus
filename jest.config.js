/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  moduleDirectories: ["node_modules", "<rootDir>/assets"],
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/__mocks__/styleMock.js"
  }
};
