export const roots = ["<rootDir>/src"];
export const testMatch = [
  "**/__tests__/**/*.+(ts|tsx|js)",
  "**/?(*.)+(spec|test).+(ts|tsx|js)",
];
export const transform = {
  "^.+\\.(ts|tsx)$": "ts-jest",
};
