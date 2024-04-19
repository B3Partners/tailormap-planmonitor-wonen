const path = require('path');
const { getInvalidImportsRule } = require("../../.eslint-custom-rules");

module.exports = {
  "extends": path.resolve(__dirname, "../../.eslintrc.json"),
  "ignorePatterns": [
    "!**/*",
  ],
  "overrides": [
    {
      "files": [
        "*.ts"
      ],
      "parserOptions": {
        "project": [
          "tsconfig.lib.json",
          "tsconfig.spec.json"
        ],
        "createDefaultProgram": true,
        "tsconfigRootDir": __dirname
      },
      "rules": {
        "no-restricted-imports": ["error", getInvalidImportsRule("@b3p/planmonitor-wonen")],
        "@typescript-eslint/naming-convention": [
          "error",
          {
            "selector": "variable",
            "format": [
              "camelCase",
              "UPPER_CASE"
            ]
          },
          {
            "selector": [
              "objectLiteralProperty",
              "classProperty"
            ],
            "format": null,
            "leadingUnderscore": "allowSingleOrDouble"
          }
        ],
      }
    },
    {
      "files": [
        "*.html"
      ],
      "rules": {}
    }
  ]
}
