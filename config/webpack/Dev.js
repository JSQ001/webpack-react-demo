'use strict';

/**
 * Default dev server configuration.
 */
const path = require('path');
const webpack = require('webpack');
const WebpackBaseConfig = require('./Base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

class WebpackDevConfig extends WebpackBaseConfig {

  constructor() {
    super();

    this.config={  //调用了父类的setConfig方法
      devtool: 'cheap-module-eval-source-map',
      entry: [
        'webpack-dev-server/client?http://localhost:8000/',
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        `${this.srcPathAbsolute}/client.js`
      ],
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
        new webpack.HotModuleReplacementPlugin(),

        new ExtractTextPlugin("bundle.css"), //将**目录下必须的css模块打包到style.css文件中
      ]
    }
  }

  get env(){
    return 'dev'
  }
}

module.exports = WebpackDevConfig;
