const path = require('path')
const webpack = require('webpack')

const CompressionPlugin = require('compression-webpack-plugin')

const resolve = function (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  assetsDir: 'static',
  outputDir: '../'+process.env.VUE_APP_NAME,
  // 是否开启eslint保存检测
  lintOnSave: false,
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          //gzip压缩             
          new CompressionPlugin({
            test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
            threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
            deleteOriginalAssets: false // 是否删除原文件
          })
        ]
      };
    }
  },
  chainWebpack: config => {
    //可视化分析项目结构 打包后执行
    if (process.env.NODE_ENV === 'production') {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }

    //路径重命名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('views', resolve('src/views'))

    config.optimization.runtimeChunk('single')

    //加载quill模块
    config.plugin('provide').use(webpack.ProvidePlugin, [{
      'window.Quill': 'quill'
    }])


    const svgRule = config.module.rule('svg')
    // 清除已有的所有 loader。
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear()
    config.module
      .rule('svg2')
      .test(/\.svg$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
  },

  devServer: {
    host: 'localhost',
    port: '8080',
    hot: true,
    open: false,
    overlay: {
      warning: false,
      error: true
    },
    proxy: {
      '/yunzhu': {
        target: process.env.VUE_APP_BASE_API,  // 接口域名
        secure: false,  // 如果是https接口，需要配置这个参数
        logLevel: 'debug',
        changeOrigin: true,
      }
    }
  }
}