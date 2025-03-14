const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: {
            type: 'worker',
            options: {
              inline: true
            }
          }
        }
      ]
    }
  }
})