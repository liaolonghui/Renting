import React, { Component } from 'react'

import { Carousel, Flex, Modal, Toast } from 'antd-mobile'

import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'
import HousePackage from '../../components/HousePackage'

import { BASE_URL } from '../../utils/url'
import API from '../../utils/api'

import styles from './index.module.css'

const isLogin = () => {
  return !!localStorage.getItem('hkzf_token')
}

// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    src: BASE_URL+'/img/message/1.png',
    desc: '72.32㎡/南 北/低楼层',
    title: '安贞西里 3室1厅',
    price: 4500,
    tags: ['随时看房']
  },
  {
    id: 2,
    src: BASE_URL+'/img/message/2.png',
    desc: '83㎡/南/高楼层',
    title: '天居园 2室1厅',
    price: 7200,
    tags: ['近地铁']
  },
  {
    id: 3,
    src: BASE_URL+'/img/message/3.png',
    desc: '52㎡/西南/低楼层',
    title: '角门甲4号院 1室1厅',
    price: 4300,
    tags: ['集中供暖']
  }
]

// 百度地图
const AMap = window.AMap
// 覆盖物的样式
const labelStyle = {
  position: 'absolute',
  zIndex: -7982820,
  backgroundColor: 'rgb(238, 93, 91)',
  color: 'rgb(255, 255, 255)',
  height: 25,
  padding: '5px 10px',
  lineHeight: '14px',
  borderRadius: 3,
  boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
  whiteSpace: 'nowrap',
  fontSize: 12,
  userSelect: 'none'
}
const alert = Modal.alert
export default class HouseDetail extends Component {
  state = {
    isLoaded: false,   // 是否加载完成
    isFavorite: false, // 是否收藏
    houseInfo: {
      // 房屋图片
      houseImg: [],
      // 标题
      title: '',
      // 标签
      tags: [],
      // 租金
      price: 0,
      // 房型
      roomType: '两室一厅',
      // 房屋面积
      size: 89,
      // 装修类型
      renovation: '精装',
      // 朝向
      oriented: [],
      // 楼层
      floor: '',
      // 小区名称
      community: '',
      // 地理位置
      coord: {
        latitude: '39.928033',
        longitude: '116.529466'
      },
      // 房屋配套
      supporting: [],
      // 房屋标识
      houseCode: '',
      // 房屋描述
      description: ''
    }
  }

  // ------------------操作数据----------------
  // 1.进入页面,判断是否收藏了
  async checkFavorite() {
    // 1.1 先判断有没有登录,未登录直接return,登录了发送请求,判断是否收藏过
    if (!isLogin()) return
    const { id } = this.props.match.params
    const res = await API.get(`/user/favorites/${id}`)
    this.setState({
      isFavorite: res.data.body.isFavorite
    })
  }
  // 2.点击处理收藏
  // 点击的时候,判断有没有登录,如果没有登录去登录,登录的话,判断是否收藏了
  handleFavorite = async () => {
    if (!isLogin()) {
      // 没有登录,弹出确定框
      alert('提示', '你尚未登录,请先去登录', [
        { text: '取消' },
        {
          text: '去登录', onPress: () => {
            this.props.history.push('/login')
          }
        }
      ])
    } else {
      // 如果登录的话,判断是否收藏了
      if(!this.state.isFavorite) {
        // 未收藏,发送请求,添加收藏
        const {id} = this.props.match.params
        const res = await API.post(`/user/favorites/${id}`)
        if (res.data.status === 200) {
          this.setState({
            isFavorite: true
          })
          Toast.success('收藏成功', 1.5)
        } else {
          Toast.error('登录超时，请重新登录', 1.5)
        }
      } else {
        // 收藏了,发送请求,删除收藏
        const { id } = this.props.match.params
        const res = await API.delete(`/user/favorites/${id}`) 
        if(res.data.status === 200) {
          this.setState({
            isFavorite: false
          })
          Toast.success('删除收藏成功', 1.5)
        } else {
          Toast.error('登录超时，请重新登录', 1.5)
        }
      }
    }
  }

  // -------------------钩子函数-----------------------
  render() {
    const { isLoaded, isFavorite } = this.state
    const { title, tags, price, description, roomType, oriented, floor, community, supporting, size } = this.state.houseInfo
    return (
      <div className={styles.root}>
        {/* 导航栏 */}
        <NavHeader
          className={styles.navHeader}
          rightContent={[<i key="share" className="iconfont icon-share" />]}
        >
          {community}
        </NavHeader>

        {/* 轮播图 */}
        <div className={styles.slides}>
          {isLoaded ? (
            <Carousel autoplay infinite autoplayInterval={3000}>
              {this.renderSwipers()}
            </Carousel>
          ) : (
              ''
            )}
        </div>

        {/* 房屋基础信息 */}
        <div className={styles.info}>
          <h3 className={styles.infoTitle}>
            {title}
          </h3>
          <Flex className={styles.tags}>
            {tags.map((v, i) => {
              let tagCls = i < 2 ? `tag${i + 1}` : `tag3`
              return <Flex.Item key={i} style={{flex: '0 0 auto'}}>
                <span className={[styles.tag, styles[tagCls]].join(' ')}>
                  {v}
                </span>
              </Flex.Item>
            })}
          </Flex>

          <Flex className={styles.infoPrice}>
            <Flex.Item className={styles.infoPriceItem}>
              <div>
                {price}
                <span className={styles.month}>/月</span>
              </div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{roomType}</div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{size}平米</div>
              <div>面积</div>
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoBasic} align="start">
            <Flex.Item>
              <div>
                <span className={styles.title}>装修：</span>
                精装
              </div>
              <div>
                <span className={styles.title}>楼层：</span>
                {floor}
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
                <span className={styles.title}>朝向：</span>{oriented.join('、')}
              </div>
              <div>
                <span className={styles.title}>类型：</span>普通住宅
              </div>
            </Flex.Item>
          </Flex>
        </div>

        {/* 地图位置 */}
        <div className={styles.map}>
          <div className={styles.mapTitle}>
            小区：
          <span>{community}</span>
          </div>
          <div className={styles.mapContainer} id="map">
            {/* 创建地图实例 */}
            地图
          </div>
        </div>

        {/* 房屋配套 */}
        <div className={styles.about}>
          <div className={styles.houseTitle}>房屋配套</div>
          {supporting.length > 0 ? <HousePackage list={supporting} /> : <div className="title-empty">暂无数据</div>}
          {/* <div className="title-empty">暂无数据</div> */}
        </div>

        {/* 房屋概况 */}
        <div className={styles.set}>
          <div className={styles.houseTitle}>房源概况</div>
          <div>
            <div className={styles.contact}>
              <div className={styles.user}>
                <img src={BASE_URL + '/img/avatar.png'} alt="头像" />
                <div className={styles.useInfo}>
                  <div>王女士</div>
                  <div className={styles.userAuth}>
                    <i className="iconfont icon-auth" />
                    已认证房主
                  </div>
                </div>
              </div>
              <span className={styles.userMsg}>发消息</span>
            </div>

            <div className={styles.descText}>
              {description || '暂无房屋描述'}
            </div>
          </div>
        </div>

        {/* 推荐 */}
        <div className={styles.recommend}>
          <div className={styles.houseTitle}>猜你喜欢</div>
          <div className={styles.items}>
            {recommendHouses.map(item => (
              // 将item展开把里面的每一个属性传递给HouseItem
              <HouseItem {...item} key={item.id} />
            ))}
          </div>
        </div>

        {/* 底部收藏按钮 */}
        <Flex className={styles.fixedBottom} style={{ textAlign: 'center' }}>
          <Flex.Item onClick={this.handleFavorite}>
            <img
              src={BASE_URL + (isFavorite ? '/img/star.png' : '/img/unstar.png')}
              className={styles.favoriteImg}
              alt="收藏"
            />
            <span className={styles.favorite}>{isFavorite ? '已收藏' : '收藏'}</span>
          </Flex.Item>
          <Flex.Item>在线咨询</Flex.Item>
          <Flex.Item>
            <a href="tel:400-618-4000" className={styles.telephone}>
              电话预约
            </a>
          </Flex.Item>
        </Flex>
      </div>
    )
  }
  async componentDidMount() {
    // 一进入页面,根据房源id发送请求,获取房源信息
    const { id } = this.props.match.params
    const res = await API.get(`/houses/${id}`)
    console.log('房源信息:', res.data)
    // 渲染地图是在数据请求回来之后
    const { community, coord } = res.data.body
    this.renderMap(community, coord)
    this.setState({
      houseInfo: res.data.body,
      isLoaded: true
    })
    // 一进入页面,检查是否收藏了
    this.checkFavorite()
  }

  // ----------------------渲染元素----------------------
  // 渲染轮播图结构
  renderSwipers() {
    const {
      houseInfo: { houseImg }
    } = this.state

    return houseImg.map(item => (
      <a
        key={item}
        href="http://itcast.cn"
        style={{
          display: 'inline-block',
          width: '100%',
          height: 250
        }}
      >
        <img
          src={BASE_URL + item}
          alt=""
          style={{ width: '100%', height: 250, verticalAlign: 'top' }}
        />
      </a>
    ))
  }

  // 渲染地图
  renderMap(community, coord) {
    const { latitude, longitude } = coord

    const map = new AMap.Map("map", {
      resizeEnable: true,
    });
    this.map = map
    AMap.plugin(['AMap.Marker', 'AMap.Pixel'], function() {
      // 标记（覆盖物）
      const mk = new AMap.Text({
        position: [longitude, latitude],
        offset: new AMap.Pixel(0, -36),
        text: `
          <span>${community}</span>
          <div class="${styles.mapArrow}"></div>
        `
      })
      mk.setStyle(labelStyle) // 覆盖物样式
      // map
      map.setFitView(mk) // 中心点
      map.setZoom(17)
      map.add(mk)
    })
  }
}