import { Toast } from 'antd-mobile'
import React from 'react'
import { Redirect, Route } from 'react-router-dom'

export default function AuthRoute({ component: Component, ...rest }) {
  return <Route {...rest} render={props => {
    const isLogin = !!localStorage.getItem('hkzf_token')
    if (isLogin) {
      return <Component {...props} />
    } else {
      Toast.info('请在登陆后访问该网页', 2, null, false)
      return <Redirect to={{
        pathname: '/login',
        state: {
          from: props.location
        }
      }} />
    }
  }}></Route>
}