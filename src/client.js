import _ from 'lodash'; // lodash 是由当前 script 脚本 import 导入进来的
import 'styles/common.scss';
import Main from 'containers/main.js'
import printMe from 'containers/print.js'
import BG from 'images/BG.jpg';


if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}


const component=()=>{
    const element = document.createElement('div');
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');
    element.id = 'root';
    console.log(element)
    // 将图像添加到我们现有的 div。
    const myIcon = new Image();
    myIcon.src = BG;
    myIcon.id='image';
    //element.appendChild(myIcon);
    return element;
};

let element = component(); // 当 print.js 改变导致页面重新渲染时，重新获取渲染的元素
document.body.appendChild(element);

if (module.hot) {
  module.hot.accept('containers/print.js', function() {
    console.log('Accepting the updated printMe module!');
    document.body.removeChild(element);
    element = component(); // 重新渲染页面后，component 更新 click 事件处理
    document.body.appendChild(element);
  })
}