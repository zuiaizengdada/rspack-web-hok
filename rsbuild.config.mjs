import { defineConfig } from '@rsbuild/core'
import { pluginVue2 } from '@rsbuild/plugin-vue2'
import { pluginSass } from '@rsbuild/plugin-sass'
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill'
import path from 'path'
import dotenv from 'dotenv'

function resolve(dir) {
  return path.join(__dirname, dir)
}

// 根据环境加载对应的环境变量文件
const envMode = process.env.NODE_ENV || 'development'
console.log(envMode, 'envMode')
const envFiles = {
  dev: '.env.development',
  test: '.env.test',
  beta: '.env.beta',
  production: '.env.production'
}

// 加载环境变量
dotenv.config({
  path: path.resolve(__dirname, envFiles[envMode] || '.env')
})

export default defineConfig({
  mode: envMode,
  plugins: [pluginVue2(), pluginSass(), pluginNodePolyfill()],
  html: {
    template: './public/index.html',
    title: '伏羲云系统'
  },
  source: {
    entry: {
      index: './src/main.js'
    },
    alias: {
      '@': resolve('src')
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(envMode)
    }
  },
  tools: {
    sass: {
      implementation: require('sass'),
      additionalData: `
        @import "@/styles/variables.scss";
        @import "@/styles/element-variables.scss";
      `,
      sourceMap: true
    },
    rspack: {
      module: {
        rules: [
          {
            test: /\.worker\.(js|ts)$|pdf\.worker\.js$/,
            type: 'asset/resource',
            generator: {
              filename: 'workers/[name][ext]'
            }
          }
        ]
      }
    },
    postcss: {
      postcssOptions: {
        plugins: [require('autoprefixer')]
      }
    },
    vue: {
      runtimeCompiler: true
    }
  },
  server: {
    port: 9528,
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
        target: 'http://localhost:5000',
        changeOrigin: true,
        pathRewrite: {
          '^/mock': ''
        }
      },
      '/baidu': {
        target: 'https://haokan.baidu.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/baidu': ''
        }
      },
      '/bibili': {
        target: 'https://api.bilibili.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/bibili': ''
        }
      },
      '/whosecard': {
        target: 'https://api.whosecard.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/whosecard': ''
        }
      }
    }
  }
  // dev: {
  //   server: {
  //     port: 9528,
  //     middlewares: [
  //       (req, res, next) => {
  //         if (req.url.startsWith('/api/mock')) {
  //           req.url = req.url.replace('/api/mock', '')
  //         }
  //         next()
  //       }
  //     ]
  //   },
  //   proxy: {
  //     '/api/mock': {
  //       target: 'http://localhost:3000',
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api/mock': ''
  //       }
  //     },
  //     '/api': {
  //       target: 'https://beta.cloud.hokkj.cn/cloud/admin',
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': ''
  //       }
  //     },
  //     '/newApi': {
  //       target: 'https://beta.cloud.hokkj.cn',
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/newApi': ''
  //       }
  //     },
  //     '/mock': {
  //       target: 'http://localhost:5000',
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/mock': ''
  //       }
  //     },
  //     '/baidu': {
  //       target: 'https://haokan.baidu.com',
  //       ws: true,
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/baidu': ''
  //       }
  //     },
  //     '/bibili': {
  //       target: 'https://api.bilibili.com',
  //       ws: true,
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/bibili': ''
  //       }
  //     },
  //     '/whosecard': {
  //       target: 'https://api.whosecard.com',
  //       ws: true,
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/whosecard': ''
  //       }
  //     }
  //   }
  // }
})
