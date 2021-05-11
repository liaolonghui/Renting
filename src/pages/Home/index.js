import React from 'react'
import { Route } from 'react-router-dom'
import News from '../News'
// tabbar
import { TabBar } from 'antd-mobile'
// 导入组件样式
import './index.css'

export default class Home extends React.Component {

  state = {
    selectedTab: 'blueTab', // 默认选中的tab菜单
  }

  // 渲染tabbarItem的内容的函数
  renderContent(pageText) {
    return (
      <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
        <div style={{ paddingTop: 60 }}>Clicked “{pageText}” tab， show “{pageText}” information</div>
          <a href style={{ display: 'block', marginTop: 40, marginBottom: 20, color: '#108ee9' }}
            onClick={(e) => {
              e.preventDefault();
              this.setState({
                hidden: !this.state.hidden,
              });
            }}
          >
            Click to show/hide tab-bar
          </a>
          <a href style={{ display: 'block', marginBottom: 600, color: '#108ee9' }}
            onClick={(e) => {
              e.preventDefault();
              this.setState({
                fullScreen: !this.state.fullScreen,
              });
            }}
          >
            Click to switch fullscreen
          </a>
        </div>
      );
    }

  render() {
    return (
      <div className="home">
        {/* 路由配置 */}
        <Route path="/home/news" component={ News }></Route>
        
        {/* tabbar */}
        <TabBar
          tintColor="#21b97a"
          barTintColor="white"
        >
          <TabBar.Item
            title="首页"
            key="Life"
            icon={ <i className="iconfont icon-index"></i> }
            selectedIcon={ <i className="iconfont icon-index"></i> }
            selected={this.state.selectedTab === 'blueTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'blueTab',
              });
            }}
            data-seed="logId"
          >
            {this.renderContent('Life')}
          </TabBar.Item>
          <TabBar.Item
            icon={ <i className="iconfont icon-search"></i> }
            selectedIcon={ <i className="iconfont icon-search"></i> }
            title="找房"
            key="Koubei"
            selected={this.state.selectedTab === 'redTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'redTab',
              });
            }}
            data-seed="logId1"
          >
            {this.renderContent('Koubei')}
          </TabBar.Item>
          <TabBar.Item
            icon={ <i className="iconfont icon-icon_fuben"></i> }
            selectedIcon={ <i className="iconfont icon-icon_fuben"></i> }
            title="资讯"
            key="Friend"
            selected={this.state.selectedTab === 'greenTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'greenTab',
              });
            }}
          >
            {this.renderContent('Friend')}
          </TabBar.Item>
          <TabBar.Item
            icon={ <i className="iconfont icon-my"></i> }
            selectedIcon={ <i className="iconfont icon-my"></i> }
            title="我的"
            key="my"
            selected={this.state.selectedTab === 'yellowTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'yellowTab',
              });
            }}
          >
            {this.renderContent('My')}
          </TabBar.Item>
        </TabBar>
      </div>
    )
  }
}