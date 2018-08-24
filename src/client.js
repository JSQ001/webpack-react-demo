import _ from 'lodash'; // lodash 是由当前 script 脚本 import 导入进来的
import 'styles/common.scss';
import Main from 'containers/main.js'
import BG from 'images/BG.jpg';

const component=()=>{
    const element = document.createElement('div');
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');
    element.id = 'root';

    // 将图像添加到我们现有的 div。
    const myIcon = new Image();
    myIcon.src = BG;
    myIcon.id='image';
    element.appendChild(myIcon);

    return element;
};


document.body.appendChild(component());
