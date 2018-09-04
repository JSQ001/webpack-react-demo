import _ from 'lodash'; // lodash 是由当前 script 脚本 import 导入进来的
import 'styles/common.scss';
import React from 'react';
import ReactDOM from 'react-dom';
/**
 *          ___   ___       ________
 *         /  /  /  /      /__   __/
 *        /  /  /  /         /  /
 *       /  /__/  /         /  /
 *      /  ___   /         /  /
 *     /  /  /  /         /  /
 *    /  /  /  /      __ /  /__
 *   /__/  /__/      /________/
 *
 * -------------------------------------------------------------------------
 *
 *                         webpack-react-demo项目入口
 */
ReactDOM.render(  //将第一个参数的元素挂载到第二个参数到节点上
    <div>
      demo
    </div>,

    document.getElementById('app')
)



if (module.hot) {
  module.hot.accept('containers/print.js', function() {
    console.log('Accepting the updated printMe module!');
  })
}

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}