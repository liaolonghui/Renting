import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

// antd-mobile的样式
import 'antd-mobile/dist/antd-mobile.css'
// react-virtualized的样式
import 'react-virtualized/styles.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 全局样式
import './index.css'

// App组件的导入放后面，防止前面这些样式覆盖组件中的样式
import App from './App'

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
