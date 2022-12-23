module.exports = {
  "roots": [
    "<rootDir>/packages"
  ],
  "testMatch": [
    "**/src/tests/**/*test.ts",
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "coverageThreshold": {
    "global": {
      "branches": 69,
      "functions": 91,
      "lines": 94,
      "statements": 93
    }
  }
}