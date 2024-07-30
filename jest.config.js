/** @type {import('jest').Config} */
const config = {
  coverageProvider: "v8",
  rootDir: "./",
  preset: "ts-jest",
  transform: {
    "^.+\\.(t|j)sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!.*\\.(j|t)sx?$)",
    ".*\\.(css|less|scss|sass)$",
    ".*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$",
  ],
  moduleNameMapper: {
    "^.+\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
    "^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
  },
};

module.exports = config;
