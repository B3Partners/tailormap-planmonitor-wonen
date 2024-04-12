const path = require('path');

module.exports = {
  "extends": path.resolve(__dirname, "../../.eslintrc.json"),
  "ignorePatterns": [
    "!**/*",
    "**/environment*.ts"
  ],
  "overrides": [
    {
      "files": [
        "*.ts"
      ],
      "parserOptions": {
        "project": [
          "tsconfig.app.json",
          "tsconfig.spec.json"
        ],
        "createDefaultProgram": true,
        "tsconfigRootDir": __dirname
      },
      "rules": {}
    },
    {
      "files": [
        "*.html"
      ],
      "rules": {}
    }
  ]
}
