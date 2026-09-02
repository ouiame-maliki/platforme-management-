module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/src"],
  setupFiles: ["<rootDir>/src/__tests__/setup.ts"],
  testEnvironment: "node",
  testRegex: ".*\\.test\\.ts$",
};