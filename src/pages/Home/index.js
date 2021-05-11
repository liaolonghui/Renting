import React from 'react'
import { Route } from 'react-router-dom'
import Index from '../Index'
import HouseList from '../HouseList'
import News from '../News'
import Profile from '../Profile'
// tabbar
import { TabBar } from 'antd-mobile'
// 导入组件样式
import './index.css'


// TabBar的数据
const tabItems = [
  {
    title: '首页',
    icon: 'icon-index',
    path: '/home'
  },
  {
    title: '找房',
    icon: 'icon-search',
    path: '/home/list'
  },
  {
    title: '资讯',
    icon: 'icon-icon_fuben',
    path: '/home/news'
  },
  {
    title: '我的',
    icon: 'icon-my',
    path: '/home/profile'
  }
]


export default class Home extends React.Component {

  state = {
    selectedTab: this.props.location.pathname, // 默认选中的tab菜单
  }

  // 渲染TabBarItem
  renderTabBarItem() {
    return tabItems.map(item => {
      return (<TabBar.Item
        title={ item.title }
        key={ item.title }
        icon={ <i className={`iconfont ${item.icon}`}></i> }
        selectedIcon={ <i className={`iconfont ${item.icon}`}></i> }
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          this.setState({
            selectedTab: item.path,
          })
          // 路由切换
          this.props.history.push(item.path)
        }}
      />)
    })
  }

  render() {
    return (
      <div className="home">
        {/* 路由配置 */}
        <Route exact path="/home" component={ Index }></Route>
        <Route path="/home/list" component={ HouseList }></Route>
        <Route path="/home/news" component={ News }></Route>
        <Route path="/home/profile" component={ Profile }></Route>
        
        {/* tabbar */}
        <TabBar tintColor="#21b97a" barTintColor="white" noRenderContent>
          { this.renderTabBarItem() }
        </TabBar>
      </div>
    )
  }
}