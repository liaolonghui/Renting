import React from 'react'
import { Carousel } from 'antd-mobile'

import axios from 'axios'

export default class Index extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      swipers: [], // 轮播图数据
    }
  }

  // 获取轮播图数据
  async getSwipers() {
    const res = await axios.get('http://localhost:8009/home/swiper')
    this.setState(() => {
      return {
        swipers: res.data.body
      }
    })
  }

  componentDidMount() {
    this.getSwipers()
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

  render() {
    return (
      <div className="index">
        <Carousel
          autoplay={true}
          autoplayInterval="2000"
          infinite
        >
          {this.renderSwipers()}
        </Carousel>
      </div>
    )
  }
}