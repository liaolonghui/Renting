import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'
import API from '../../utils/api'


// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{3,5}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  state = {
    username: '',
    password: ''
  }
  // ------------------ 操作数据
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  // 点击登录按钮,发送登录请求
  // submit事件默认是get请求,需要阻止默认行为
  handleSubmit = async e => {
    e.preventDefault()
    const { username, password } = this.state
    const { data: {status, body, description} } = await API.post('/user/login', {username, password})
    console.log(status, body, description)
    if (status === 200) {
      Toast.info(description, 2, null, false)
      localStorage.setItem('hkzf_token', body.token)
      this.props.history.go(-1)
    } else {
      Toast.info(description, 2, null, false)
    }
  }

  // ------------------ 钩子
  render() {
    const { username, password } = this.state
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        {/* 中间留白 */}
        <WhiteSpace size="xl" /> 
        
        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={this.handleSubmit}>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="username"
                placeholder="请输入账号"
                value={username}
                onChange={this.handleChange}
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
                value={password}
                onChange={this.handleChange}
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

export default Login