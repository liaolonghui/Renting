import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'
import { withFormik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'
import API from '../../utils/api'


// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  render() {
    // 通过props获取高阶组件传递过来的属性    touched必须处理blur事件才能生效handleBlur
    // const { values, handleChange, handleSubmit, handleBlur, errors, touched } = this.props

    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        {/* 中间留白 */}
        <WhiteSpace size="xl" /> 
        
        {/* 登录表单 */}
        <WingBlank>
          <Form>
            <div className={styles.formItem}>
              <Field 
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            <ErrorMessage className={styles.error} name="username" component="div" />

            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            <ErrorMessage className={styles.error} name="password" component="div" />

            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>
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
  // 表单校验规则
  validationSchema: Yup.object().shape({
    username: Yup.string().required('账号为必填项').matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线'),
    password: Yup.string().required('密码为必填项').matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线')
  }),
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