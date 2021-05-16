import React, { createRef } from 'react'
import axios from 'axios'
import { NavBar, Toast } from 'antd-mobile'
import { List, AutoSizer } from 'react-virtualized'
import { getCurrentCity } from '../../utils/index'
import './index.scss'

// 索引
const indexHeight = 36
// 城市
const cityHeight = 47
let flag = true

// 格式化城市列表数据
const formatCityList = (list) => {
  const cityList = {}
  const cityIndex = []

  // 遍历，格式化城市列表
  list.forEach(city => {
      const cap = city.pinyin.slice(0, 1)
      if (cityList[cap]) {
        cityList[cap].push(city)
      } else {
        cityList[cap] = [city]
        cityIndex.push(cap)
      }
  });
  cityIndex.sort()

  return {
    cityList,
    cityIndex
  }
}

// 格式化城市索引
const formatCityIndex = (index) => {
  switch (index) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'
    default:
      return index.toUpperCase()
  }
}

// 有房源的城市
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

export default class CityList extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      cityList: {},
      cityIndex: [],
      activeIndex: 0, // 指定右侧索引列表高亮的索引号
    }

    // Ref
    this.cityListComponent = createRef()
  }

  async componentDidMount() {
    await this.getCityList()
    // 调用measureAllRows方法提前计算list中每一行高度
    // 调用时要保证list组件中已经有数据了
    this.cityListComponent.current.measureAllRows()
  }

  // 获取城市列表数据
  async getCityList() {
    // 城市列表数据
    const res = await axios.get('http://localhost:8009/area/city?level=1')
    const { cityList, cityIndex } = formatCityList(res.data.body)
    // 热门城市数据
    const hotRes = await axios.get('http://localhost:8009/area/hot')
    cityList['hot'] = hotRes.data.body
    cityIndex.unshift('hot')
    // 获取当前定位城市
    const currentCity = await getCurrentCity()
    cityList['#'] = [currentCity]
    cityIndex.unshift('#')
    // 更新
    this.setState({
      cityList,
      cityIndex
    })
  }

  // 选择城市（切换城市）
  changeCity({ label, value }) {
    // 判断是否有房源信息
    if (HOUSE_CITY.indexOf(label) !== -1) {
      // 有房源
      localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
      this.props.history.go(-1)
    } else {
      // 无房源
      Toast.info('当前城市无房源', 1, null, false) // false用于取消遮罩层
    }
  }

  // 渲染列表每一行数据
  rowRenderer = ({
    key, // 唯一key
    index, // 索引
    isScrolling, // 当前项是否滚动
    isVisible, // 当前项是否可见
    style, // 重点：一定要给每一行数据添加style，用于指定每一行位置
  }) => {
    const { cityIndex, cityList } = this.state
    const letter = cityIndex[index]

    return (
      <div key={key} style={style} className="city">
        <div className="title">{ formatCityIndex(letter) }</div>
        {cityList[letter].map(city => (
          <div className="name" key={city.value} onClick={() => this.changeCity(city)}>
            {city.label}
          </div>
        ))}
      </div>
    );
  }
  // 动态计算列表每一行高度
  rowHeight = ({index}) => {
    const { cityList, cityIndex } = this.state
    const letter = cityIndex[index]
    const rowHeight = (cityList[letter].length * cityHeight) + indexHeight
    return rowHeight
  }

  // 渲染右侧索引
  renderCityIndex = () => {
    // 获取到cityindex并遍历渲染
    const { activeIndex, cityIndex } = this.state
    return cityIndex.map((item, index) => (
      <li className="city-index-item" key={item} onClick={() => {
        // 点击索引跳转至对应位置
        this.cityListComponent.current.scrollToRow(index)
      }}>
        <span className={ activeIndex === index ? 'index-active': '' }>
          {item==='hot' ? '热' : item.toUpperCase()}
        </span>
      </li>
    ))
  }

  // 滚动城市列表让对应索引高亮
  onRowsRendered = ({startIndex}) => {
    if (!flag) return
    flag = false
    setTimeout(() => {
      if (startIndex !== this.state.activeIndex) {
        this.setState({
          activeIndex: startIndex
        })
      }
      flag = true
    },20)
  }

  
  render() {
    return (
      <div className="citylist">
        {/* navbar */}
        <NavBar
          className="navbar"
          mode="light"
          icon={ <i className="iconfont icon-back" /> }
          onLeftClick={() => this.props.history.go(-1)}
        >城市选择</NavBar>
        {/* List */}
        <AutoSizer>
          {({height, width}) => (
            <List
              ref={this.cityListComponent}
              scrollToAlignment="start"
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.rowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
            />
          )}
        </AutoSizer>
        <ul className="city-index">
          {this.renderCityIndex()}
        </ul>
      </div>
    )
  }
}