import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { Grid, Button, Toast, Modal } from 'antd-mobile'

import { BASE_URL } from '../../utils/url'
import API from '../../utils/api'

import styles from './index.module.css'

// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  {
    id: 4,
    name: '成为房主',
    iconfont: 'icon-identity'
  },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]
const alert = Modal.alert
// 默认头像
const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png'

export default class Profile extends Component {
  state = {
    isLogin: !!localStorage.getItem('hkzf_token'),
    userInfo: {}
  }
  // 1.获取用户信息,判断有没有登录,登录了获取用户信息,没有登录直接return
  async getUserInfo() {
    const { isLogin } = this.state
    if (!isLogin) return
    // 登录状态,发送请求,获取用户信息
    const res = await API.get('/user', {
      headers: {
        authorization: localStorage.getItem('hkzf_token')
      }
    })
    const { status, description, body } = res.data
    console.log(res)
    if (status === 200) {
      this.setState({
        userInfo: body
      })
    } else if (status === 400 && description === 'token异常或者过期') {
      // 如果token失效要怎么办
      // 1. 移除本地的token
      localStorage.removeItem('hkzf_token')
      // 2. 恢复默认值 重新调用render方法,更新视图
      this.setState({
        isLogin: false,
        userInfo: {}
      })
      // 3.提示信息
      Toast.fail('用户登录信息失效,请重新登录', 1.5)
    } else {
      Toast.fail('用户信息获取失败', 1.5)
    }
  }
  // 2.退出登录 弹出确定对话框
  logout = () => {
    alert('温馨提示', '您确定要退出?', [
      { text: '取消' },
      {
        text: '确定', onPress: async () => {
          // 发送退出登录的请求 API.post(url,data,config)
          const res = await API.post('/user/logout', null, {
            headers: {
              authorization: localStorage.getItem('hkzf_token')
            }
          })
          const { status } = res.data
          if (status === 200) {
            // 退出成功,删除本地的token,恢复默认值,提示信息
            localStorage.removeItem('hkzf_token')
            this.setState({ // 重新调用render方法更新视图
              isLogin: false,
              userInfo: {}
            })
            Toast.success('退出成功',1.5)
          } else {
            Toast.fail('退出失败', 1.5)
          }
        }
      }
    ])
  }
  render() {
    const { history } = this.props
    const { isLogin } = this.state
    const { avatar, nickname } = this.state.userInfo
    return (
      <div className={styles.root}>
        {/* 个人信息 */}
        <div className={styles.title}>
          <img
            className={styles.bg}
            src={BASE_URL + '/img/profile/bg.png'}
            alt="背景图"
          />
          <div className={styles.info}>
            <div className={styles.myIcon}>
              <img className={styles.avatar} src={avatar ? BASE_URL + avatar : DEFAULT_AVATAR} alt="icon" />
            </div>
            <div className={styles.user}>
              <div className={styles.name}>{nickname || '游客'}</div>
              {/* 登录后展示： */}
              {isLogin ? <>
                <div className={styles.auth}>
                  <span onClick={this.logout}>退出</span>
                </div>
                <div className={styles.edit}>
                  编辑个人资料
                  <span className={styles.arrow}>
                    <i className="iconfont icon-arrow" />
                  </span>
                </div>
              </> : <div className={styles.edit}>
                  <Button
                    type="primary"
                    size="small"
                    inline
                    onClick={() => history.push('/login')}
                  >
                    去登录
                </Button>
                </div>
              }
            </div>
          </div>
        </div>

        {/* 九宫格菜单 */}
        <Grid
          data={menus}
          columnNum={3} // 每一行展示的列数
          hasLine={false}
          renderItem={item =>
            item.to ? (
              <Link to={item.to}>
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              )
          }
        />

        {/* 加入我们 */}
        <div className={styles.ad}>
          <img src={BASE_URL + '/img/profile/join.png'} alt="" />
        </div>
      </div>
    )
  }
  componentDidMount() {
    this.getUserInfo()
  }
}