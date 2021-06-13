import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

// antd-mobile的样式 （已开启按需加载，所以不用全部导入了）
// import 'antd-mobile/dist/antd-mobile.css'

// react-virtualized的样式
import 'react-virtualized/styles.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

// App组件的导入放后面，防止前面这些样式覆盖组件中的样式
import App from './App'

// 全局样式 （放后面，防止样式覆盖）
import './index.css'

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
