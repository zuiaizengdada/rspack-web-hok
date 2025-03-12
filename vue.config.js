'use strict'
const path = require('path')
// const version = require('./public/version.json')
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const WebpackBar = require('webpackbar')

const defaultSettings = require('./src/settings.js')

const Timestamp = new Date().getTime()

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || '伏羲云系统' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // before: require('./mock/mock-server.js'),
    disableHostCheck: true,
    // before: require('./mock/mock-server.js')
    proxy: {
      '/api/mock': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api/mock': ''
        }
      },
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/newApi': {
        target: process.env.VUE_APP_BASE_API_NEW,
        changeOrigin: true,
        pathRewrite: {
          '^/newApi': ''
        }
      },
      '/mock': {
        target: `http://localhost:5000`,
        changeOrigin: true,
        pathRewrite: {
          '^/mock': ''
        }
      },
      '/baidu': {
        target: `https://haokan.baidu.com`,
        // target: 'http://39.108.164.101:7001/baidu',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/baidu': ''
        }
      },
      '/bibili': {
        target: `https://api.bilibili.com`,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/bibili': ''
        }
      },
      '/whosecard': {
        target: `https://api.whosecard.com`,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/whosecard': ''
        }
      },
      '/mydy': {
        target: `http://101.42.242.196`,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/mydy': ''
        }
      }
      // '/': {
      //   target: `http://localhost:9000`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/': ''
      //   }
      // }
      // '/api': {
      //   target: `http://test.cloud.hokkj.cn/cloud/admin`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api': 'http://test.cloud.hokkj.cn/cloud/admin'
      //   }
      // }
      // '/': {
      //   target: `http://120.77.12.222:8070/`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^': ''
      //   }
      // }
    }
  },
  css: {
    extract: {
      filename: `static/css/[name].${Timestamp}.css`,
      chunkFilename: `static/css/[name].${Timestamp}.css`
    },
    loaderOptions: {
      sass: {
        sassOptions: {
          outputStyle: 'expanded',
          data: `@import "~@/styles/variables.scss";`
        }
      }
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
      alias: {
        '@': resolve('src')
      }
    }
    // output: {
    //   filename: `static/js/[name].${version.version}.${Timestamp}.js`,
    //   chunkFilename: `static/js/[name].${version.version}.${Timestamp}.js`
    // }
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          // config
          //   .optimization.splitChunks({
          //     chunks: 'all',
          //     cacheGroups: {
          //       libs: {
          //         name: 'chunk-libs',
          //         test: /[\\/]node_modules[\\/]/,
          //         priority: 10,
          //         chunks: 'initial' // only package third parties that are initially dependent
          //       },
          //       elementUI: {
          //         name: 'chunk-elementUI', // split elementUI into a single package
          //         priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          //         test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          //       },
          //       commons: {
          //         name: 'chunk-commons',
          //         test: resolve('src/components'), // can customize your rules
          //         minChunks: 3, //  minimum common number
          //         priority: 5,
          //         reuseExistingChunk: true
          //       }
          //     }
          //   })
          config.plugin('webpackbar').use(WebpackBar, [{}]).end()
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )

    // config
    //   .plugin('speed-measure-webpack-plugin')
    //   .use(SpeedMeasurePlugin)
    //   .end()
  }
}
