import React from 'react'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'
import API from '../../utils/api'

import { getCurrentCity } from '../../utils/index'

import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

// 导入BASE_URL
import { BASE_URL } from '../../utils/url'

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

// H5获取地理定位
// navigator.geolocation.getCurrentPosition(position => {
//   console.log(position)
// })

export default class Index extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      swipers: [], // 轮播图数据
      isSwiperLoaded: false, // 轮播图数据是否加载完
      groups: [], // 租房小组数据
      news: [], // 资讯
      cityName: '上海', // 当前城市名称(默认上海)
    }
  }

  // 获取资讯数据
  async getNews() {
    const res = await API.get('/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
    this.setState({
      news: res.data.body
    })
  }

  // 获取租房小组数据
  async getGroups() {
    const res = await API.get('/home/groups', {
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
    const res = await API.get('/home/swiper')
    this.setState(() => {
      return {
        swipers: res.data.body,
        isSwiperLoaded: true
      }
    })
  }

  // 定位
  async getCity() {
    const currentCity = await getCurrentCity()
    this.setState({
      cityName: currentCity.label
    })
  }
 
  componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getNews()
    // IP定位
    this.getCity()
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
            src={BASE_URL + item.imgSrc}
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

  // 渲染资讯
  renderNews() {
    return (
      this.state.news.map(item => (
        <Flex className="news-item" key={item.id}>
          <img src={BASE_URL + item.imgSrc} alt={item.title}></img>
          <div className="desc">
            <h3>{item.title}</h3>
            <span>{item.date}</span>
            <span>{item.from}</span>
          </div>
        </Flex>
      ))
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
          {/* 搜索框 */}
          <Flex className="search-box">
            {/* 左侧白色区域 */}
            <Flex className="search">
              {/* 位置 */}
              <div className="location" onClick={() => this.props.history.push('/citylist')}>
                <span className="name">{ this.state.cityName }</span>
                <i className="iconfont icon-arrow"></i>
              </div>
              {/* 搜索表单 */}
              <div className="form" onClick={() => this.props.history.push('/search')}>
                <i className="iconfont icon-search"></i>
                <span className="text">请输入小区或地址</span>
              </div>
            </Flex>
            {/* 右侧地图图标 */}
            <i className="iconfont icon-map" onClick={() => this.props.history.push('/map')}></i>
          </Flex>
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
              <Flex className="group-item" justify="aroud" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={BASE_URL + item.imgSrc} alt={item.title}></img>
              </Flex>
            )}
          />
        </div>
        {/* 新闻资讯 */}
        <div className="news">
          <h3 className="title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    )
  }
}