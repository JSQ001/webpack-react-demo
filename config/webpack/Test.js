'use strict';  // eslint-disable-line

/**
 * Webpack configuration base class
 */
const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const npmBase = path.join(__dirname, '../../node_modules');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');
const webpack = require('webpack');

class WebpackTestConfig {

  constructor() {
    this.config = {
      entry: {
         test: path.resolve('src','client.js'),
      },
    /* entry:[  //webpack-hot-middleware
       'webpack/hot/dev-server',
       'webpack-hot-middleware/client',
     ],*/
      output: {
        path: path.resolve('dist','test'),
        filename: 'bundle.js',  //[name].[chunkhash].js
        publicPath:'/webpack-react-demo/dist/test/',  //浏览器访问资源的url： publicPath: /assets/ =》 http:server/assets/
        chunkFilename: '[name].[chunkhash:5].chunk.js'  //被 chunk 的 name 替换（或者，在 chunk 没有 name 时使用 id 替换）,被 chunk 的 hash 替换。
      },

      context: path.resolve('src/'),  //
      mode: 'development',  //production: 压缩文件，删除未使用代码(dead code)
      devtool: 'inline-source-map',  //便于追踪错误和警告。开发环境和生产环境值不一样

      devServer: {   //提供一个简单的web服务器，不会生成打包文件，只会存在内存
          contentBase: path.resolve('test')+'/',   //（打包后资源存放虚拟目录，实际上存在内存,类似于output.path）资源目录,不配置则是项目下，推荐使用绝对路径
          compress: false, //资源目录下的文件是否压缩
          port: 8899,
          publicPath: '/webpack-react-demo/dist/test/',  //此路径下的打包文件可在浏览器中访问,类似于(与其保持一致,或者二者配一个)output.publicPath
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



      plugins: [
        new CleanWebpackPlugin(  //每次构建前，清理dist文件
            [     //相对于root
                'dist/test'
            ],
            {
                root: path.resolve('src','../'),//[webpack.config的地址] 一个根的绝对路径.
                verbose: true,// 将log写到 console.
                dry: false,// 不要删除任何东西，主要用于测试.
                exclude: ["files","to","ignore"]//排除不删除的目录，主要用于避免删除公用的文件
            }
        ),

        new HtmlWebpackPlugin({        //自动生存html文件，并将打包好的js文件用script标签引入
            chunks:['test'], //指定引用哪些js文件，针对多入口（entry）文件，默认会全部引用，
            filename:'index.html',
            inject: true,   //true,body: script标签位于body底部，head：位于head 标签内，false：不自动引入script标签
            favicon: path.resolve('src','images/favicon.png'),    //给生成的 html 文件生成一个 favicon。属性值为 favicon 文件所在的路径名。
            minify:{
                collapseWhitespace:true //折叠空白区域 也就是压缩代码
            },
            hash:true, //hash选项的作用是 给生成的 js 文件一个独特的 hash 值，该hash值是该次 webpack 编译的 hash 值
            title:'test for jsq', //同 favicon 一样，如果在模板文件指定了 title，会忽略该属性。
            showErrors: true, //webpack会将错误信息包裹在一个 pre 标签内，默认值为 true
            chunksSortMode: 'auto', // script引用顺序
            template: path.resolve('src','index.html')
        }),

        new ManifestPlugin({  //在path目录下生成打包路径映射json文件
            filename: 'manifest.json', //默认manifest.json
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
      ],
      module:{   //在module中添加加载器loader, 打包后css写入了js文件，所以不会生成css文件
        rules: [
          { //样式加载器
            test: /\.*[s]?css$/,
            use: [
                'style-loader',
                'css-loader',
                'less-loader'
            ]
          },

          { //图片, 未使用的资源不会打包
            test: /\.(png|svg|jpg|gif)$/,
            use: {
                loader: 'file-loader',
                options: {
                    limit: 1000, //小于1000bytes的图片将直接以base64的形式内联在代码中,否则存在目录下,可以减少一次http请求；
                    outputPath: 'images/',   //path 目录下
                    name: '[name]@[hash:8].[ext]',  //在原图片名前加上8位 hash , 不配置值默认是文件哈希,
                    //publicPath: ""
                }
            }
          },

          {    //字体
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: {
                loader: 'file-loader',
                options: {
                    outputPath: 'font/'
                }
            }
          },

          {
            test: /\.(csv|tsv)$/,
            use: {
                loader: 'csv-loader',
                options: {
                    outputPath: 'static/data'
                }
            }
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
      resolve:{//配置模块如何解析

        alias:{//取别名，方便引用
          styles: path.resolve('src', 'styles/'),
          components: path.resolve('src', 'components/'),
          containers: path.resolve('src', 'containers/'),
          images: path.resolve('src','images/'),
          font: path.resolve('src', 'font/'),
          static: path.resolve('src', 'static/')
        },

        extensions: ['.js', '.jsx','.json','.scss'],  //自动解析确定从扩展
      },
    };
  }
}

module.exports = WebpackTestConfig;
