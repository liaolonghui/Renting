import React from 'react'
import { Carousel, Flex, Grid } from 'antd-mobile'

import axios from 'axios'

import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

// 导入样式
import './index.scss'

// 导航菜单数据用于渲染导航菜单
const navs = [
  {
    id: 1,
    img: Nav1,
    title: '整租',
    path: '/home/list'
  },{
    id: 2,
    img: Nav2,
    title: '合租',
    path: '/home/list'
  },{
    id: 3,
    img: Nav3,
    title: '地图找房',
    path: '/map'
  },{
    id: 4,
    img: Nav4,
    title: '去出租',
    path: '/rent'
  },
]

export default class Index extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      swipers: [], // 轮播图数据
      isSwiperLoaded: false, // 轮播图数据是否加载完
      groups: [], // 租房小组数据
    }
  }

  // 获取租房小组数据
  async getGroups() {
    const res = await axios.get('http://localhost:8009/home/groups', {
      params: {
        area: 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    this.setState({
      groups: res.data.body
    })
  }

  // 获取轮播图数据
  async getSwipers() {
    const res = await axios.get('http://localhost:8009/home/swiper')
    this.setState(() => {
      return {
        swipers: res.data.body,
        isSwiperLoaded: true
      }
    })
  }

  componentDidMount() {
    this.getSwipers()
    this.getGroups()
  }

  // 渲染轮播图
  renderSwipers() {
    return (
      this.state.swipers.map(item => (
        <a
          key={item.id}
          href="http://itcast.cn"
          style={{ display: 'inline-block', width: '100%', height: '212px' }}
        >
          <img
            src={`http://localhost:8009${item.imgSrc}`}
            alt=""
            style={{ width: '100%', verticalAlign: 'top' }}
          />
        </a>
      ))
    )
  }

  // 渲染导航菜单
  renderNavs() {
    return (
      navs.map(nav => {
        return (
          <Flex.Item key={nav.id} onClick={() => this.props.history.push(nav.path)}>
            <img src={nav.img} alt="" />
            <h2>{nav.title}</h2>
          </Flex.Item>
        )
      })
    )
  }

  render() {
    return (
      <div className="index">
        {/* 轮播图 */}
        <div className="swiper">
          {
            this.state.isSwiperLoaded ? (
              <Carousel
                autoplay={true}
                autoplayInterval="2000"
                infinite
              >
                {this.renderSwipers()}
              </Carousel>
              ) : ''
          }
        </div>
        {/* 导航菜单 */}
        <Flex className="nav">
          {this.renderNavs()}
        </Flex>
        {/* 租房小组 */}
        <div className="group">
          <h3 className="title">
            租房小组<span className="more">更多</span>
          </h3>
          <Grid
            data={this.state.groups}
            activeStyle={true}
            square={false}
            hasLine={false}
            columnNum={2}
            renderItem={(item) => (
              <Flex className="group-item" justify="aroud">
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={`http://localhost:8009${item.imgSrc}`} alt={item.title}></img>
              </Flex>
            )}
          />
        </div>
      </div>
    )
  }
}