import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'
import { withFormik } from 'formik'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'
import API from '../../utils/api'


// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{3,5}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  render() {
    // 通过props获取高阶组件传递过来的属性
    const { values, handleChange, handleSubmit } = this.props

    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        {/* 中间留白 */}
        <WhiteSpace size="xl" /> 
        
        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={handleSubmit}>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="username"
                placeholder="请输入账号"
                value={values.username}
                onChange={handleChange}
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
                value={values.password}
                onChange={handleChange}
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

Login = withFormik({
  // 状态
  mapPropsToValues: () => ({ username: '', password: '' }),
  // 表单提交事件
  handleSubmit: async (values, {props}) => {
    const { username, password } = values
    const { data: {status, body, description} } = await API.post('/user/login', {username, password})
    if (status === 200) {
      Toast.info(description, 2, null, false)
      localStorage.setItem('hkzf_token', body.token)
      props.history.go(-1) // 无法直接用this获取到props，此处使用传入的第二个参数获取
    } else {
      Toast.info(description, 2, null, false)
    }
  }
})(Login) // 返回高阶组件包装后的组件

export default Login