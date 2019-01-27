const path = require("path");

module.exports = {
    "roots": [
        "<rootDir>/src"
    ],
    "transform": {
        "^.+\\.tsx?$": "ts-jest",
        "\\.pcss$": path.resolve(__dirname, "test", "CSSModulesProcessor.js"),
    },
    "testRegex": "src/.*\\.spec\\.tsx?$",
    "setupFiles": [
        path.resolve(__dirname, "test", "testSetup.ts"),
    ],
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    "globals": {
        "ts-jest": {
           "diagnostics": false
        }
    },
    "snapshotSerializers": ["enzyme-to-json/serializer"]
}
