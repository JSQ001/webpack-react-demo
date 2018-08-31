'use strict';  // eslint-disable-line

/**
 * Webpack configuration base class
 */
const fs = require('fs');
const path = require('path');
const npmBase = path.join(__dirname, '../../node_modules');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

class WebpackBaseConfig {

  constructor() {
    this._config = {};
  }

  /**
   * Get the list of included packages
   * @return {Array} List of included packages
   */
  get includedPackages() {
    return [].map((pkg) => fs.realpathSync(path.join(npmBase, pkg)));
  }

  //noinspection JSAnnotator
  /**
   * Set the config data.
   * This will always return a new config
   * @param {Object} data Keys to assign
   * @return {Object}
   */
  set config(data) {
    console.log({'data':data})
    this._config = { ...this.defaultSettings, ...data};
    return this._config;
  }

  /**
   * Get the global config
   * @return {Object} config Final webpack config
   */
  get config() {
    return this._config;
  }

  /**
   * Get the environment name
   * @return {String} The current environment
   */
  get env() {
    return 'dev';
  }

  set env(env){
    this.env = env
  }

  /**
   * Get the absolute path to src directory
   * @return {String}
   */
  get srcPathAbsolute() {
    return path.resolve('src');
  }

  /**
   * Get the absolute path to tests directory
   * @return {String}
   */
  get testPathAbsolute() {
    return path.resolve('./test');
  }

  /**
   * Get the default settings
   * @return {Object}
   */
  get defaultSettings() {
    const cssModulesQuery = {
      modules: true,
      importLoaders: 1,
      localIdentName: '[name]-[local]-[hash:base64:5]'
    };

    return {
      //context: this.srcPathAbsolute,
      entry: {
        app: `${this.srcPathAbsolute}/client.js`,
      },
      output: {
        path: path.resolve('dist'),
        filename: 'bundle.js',  //[name].[chunkhash].js
        publicPath:'/webpack-react-demo/dist/',  //浏览器访问资源的url： publicPath: /assets/ =》 http:server/assets/
        chunkFilename: '[name].[chunkhash:5].chunk.js'  //被 chunk 的 name 替换（或者，在 chunk 没有 name 时使用 id 替换）,被 chunk 的 hash 替换。
      },

      devtool: 'eval',
      mode: 'development',  //production: 压缩文件，删除未使用代码(dead code)

      devServer: {   //提供一个简单的web服务器，不会生成打包文件，只会存在内存
        contentBase: path.resolve('test')+'/',   //（打包后资源存放虚拟目录，实际上存在内存,类似于output.path）资源目录,不配置则是项目下，推荐使用绝对路径
        compress: false, //资源目录下的文件是否压缩
        port: 8899,
        publicPath: '/webpack-react-demo/dist',  //此路径下的打包文件可在浏览器中访问,类似于(与其保持一致,或者二者配一个)output.publicPath
        //host: '192.168.1.1',
        //lazy: true,
        inline: true, //当刷新页面的时候，一个小型的客户端被添加到webpack.config.js的入口文件中
        overlay: {
          warnings: true,
          errors: true
        },
        index: 'index.html',
        open: 'Google Chrome',    //自动打开页面
        hot: true, //热部署
        headers: {  //在所有响应中添加首部内容
          "X-Custom-Headers": "jsq-test"
        },
        historyApiFallback: {  //如果为true，则是index.html
          disableDotRule: true,
          rewrites: [//当发生404时，给定替换的规则，
            { from: /^\/$/, to: path.resolve('dist','test/views/landing.html')},
            { from: /^\/subpage/, to: path.resolve('dist', 'test/views/subpage.html')},
            { from: /./, to: path.resolve('dist', 'test/views/404.html' )}
          ]
        },
        filename: 'bundle.js', //只在懒加载模式有效，每个请求结果都会产生全新的编译。使用 filename，可以只在某个文件被请求时编译。
        /*https: {  //设置签名证书
            key: fs.readFileSync(path.resolve('src','static/keys/jsq.key')),
            cert: fs.readFileSync(path.resolve('src','static/keys/jsq.crt')),
            ca: fs.readFileSync(path.resolve('src','static/keys/jsq.pem')),
        }*/
      },

      plugins: [],

      module: {
        rules: [
          {
            enforce: 'pre',
            test: /\.js?$/,
            include: [
              this.srcPathAbsolute
            ],
            loader: 'babel-loader',
            query: {
              presets: ['es2015', 'stage-0']
            }
          },
          {
            test: /^.((?!cssmodule).)*\.css$/,
            loaders: [
              { loader: 'style-loader' },
              { loader: 'css-loader' }
            ]
          },
          {
            test: /\.(png|jpg|gif|mp4|ogg|svg|woff|woff2)$/,
            loader: 'file-loader',
            query: {
              limit: 10000,
              name: '[hash].[ext]',
              outputPath: 'images',
              publicPath: '/assets/'
            },
          },
          {
            test: /^.((?!cssmodule).)*\.(sass|scss)$/,
            use: ExtractTextPlugin.extract({  //提取css单独打包
              fallback: 'style-loader',
              use: ['css-loader', 'sass-loader']
            })
          },
          {
            test: /^.((?!cssmodule).)*\.less$/,
            loaders: [
              { loader: 'style-loader' },
              { loader: 'css-loader' },
              { loader: 'less-loader' }
            ]
          },
          {
            test: /^.((?!cssmodule).)*\.styl$/,
            loaders: [
              { loader: 'style-loader' },
              { loader: 'css-loader' },
              { loader: 'stylus-loader' }
            ]
          },
          {
            test: /\.json$/,
            loader: 'json-loader'
          },
          {
            test: /\.(js|jsx)$/,
            include: [].concat(
              this.includedPackages,
              [this.srcPathAbsolute]
            ),
            loaders: [
              // Note: Moved this to .babelrc
              { loader: 'babel-loader' }
            ]
          },
          {
            test: /\.cssmodule\.css$/,
            loaders: [
              { loader: 'style-loader' },
              {
                loader: 'css-loader',
                query: cssModulesQuery
              }
            ]
          },
          {
            test: /\.cssmodule\.less$/,
            loaders: [
              { loader: 'style-loader' },
              {
                loader: 'css-loader',
                query: cssModulesQuery
              },
              { loader: 'less-loader' }
            ]
          },
          {
            test: /\.cssmodule\.styl$/,
            loaders: [
              { loader: 'style-loader' },
              {
                loader: 'css-loader',
                query: cssModulesQuery
              },
              { loader: 'stylus-loader' }
            ]
          },
          {
            test: /\.xml$/,
            use: {
              loader: 'xml-loader',
              options: {
                outputPath: 'static/data'
              }
            }
          }
        ]
      },

      resolve: {
        alias: {
          share: `${this.srcPathAbsolute}/share/`,
          actions: `${this.srcPathAbsolute}/actions/`,
          components: `${this.srcPathAbsolute}/components/`,
          config: `${this.srcPathAbsolute}/config/${this.env}.js`,
          images: `${this.srcPathAbsolute}/images/`,
          stores: `${this.srcPathAbsolute}/stores/`,
          styles: `${this.srcPathAbsolute}/styles/`,
          routes: `${this.srcPathAbsolute}/routes/`,
          service: `${this.srcPathAbsolute}/service/`
        },
        extensions: ['.js', '.jsx'],
        modules: [
          this.srcPathAbsolute,
          'node_modules'
        ]
      }
    };
  }
}

module.exports = WebpackBaseConfig;
