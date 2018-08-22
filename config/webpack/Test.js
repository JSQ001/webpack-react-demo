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


class WebpackTestConfig {

  constructor() {
    this.config = {
      entry: {
         test: path.resolve('src','client.js')
      },
      output: {
        path: path.resolve('dist','test'),
        filename: 'bundle.js',
        publicPath: '/webpack-react-demo/dist/test/',  //浏览器访问资源的url： publicPath: /assets/ =》 http:server/assets/
        chunkFilename: '[name].[chunkhash:5].chunk.js'  //被 chunk 的 name 替换（或者，在 chunk 没有 name 时使用 id 替换）,被 chunk 的 hash 替换。
      },
      mode: 'development',
      plugins: [
        new CleanWebpackPlugin(  //每次构建前，清理dist文件
            [     //相对于root
                'dist'
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
            favicon: '',    //给生成的 html 文件生成一个 favicon。属性值为 favicon 文件所在的路径名。
            minify:{
                collapseWhitespace:true //折叠空白区域 也就是压缩代码
            },
            hash:true, //hash选项的作用是 给生成的 js 文件一个独特的 hash 值，该hash值是该次 webpack 编译的 hash 值
            title:'test for jsq', //同 favicon 一样，如果在模板文件指定了 title，会忽略该属性。
            showErrors: true, //webpack会将错误信息包裹在一个 pre 标签内，默认值为 true
            chunksSortMode: 'auto', // script引用顺序
            template: path.resolve('src','index.html')
        })
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

          { //图片
            test: /\.(png|svg|jpg|gif)$/,
            use: {
                loader: 'file-loader',
                options: {
                    outputPath: 'images/'
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
          images: path.resolve('src','images/')
        },

        //extensions: ['.js', '.jsx','.json','.scss'],  //自动解析确定从扩展
      }
    };
  }
}

module.exports = WebpackTestConfig;
