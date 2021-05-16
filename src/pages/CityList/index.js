import React from 'react'
import axios from 'axios'
import { NavBar } from 'antd-mobile'
import { List, AutoSizer } from 'react-virtualized'
import { getCurrentCity } from '../../utils/index'
import './index.scss'

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

// List data as an array of strings
const list = [
  'Brian Vaughn',
  'Brian Vaughn',
  'Brian Vaughn',
  'Brian Vaughn',
  'Brian Vaughn',
  'Brian Vaughn',
  'Brian Vaughn',
  'Brian Vaughn',
  'Brian Vaughn',
  'Brian Vaughn',
  'Brian Vaughn',
  'Brian Vaughn',
  'Brian Vaughn',
  'Brian Vaughn',
  'Brian Vaughn',
  'Brian Vaughn',
  'Brian Vaughn',
  'Brian Vaughn',
  // And so on...
];
// 渲染列表每一行数据
function rowRenderer({
  key, // 唯一key
  index, // 索引
  isScrolling, // 当前项是否滚动
  isVisible, // 当前项是否可见
  style, // 重点：一定要给每一行数据添加style，用于指定每一行位置
}) {
  return (
    <div key={key} style={style}>
      {list[index]}{index}{isScrolling+''}{isVisible+''}
    </div>
  );
}

export default class CityList extends React.Component {

  componentDidMount() {
    this.getCityList()
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
    console.log(cityList, cityIndex, currentCity)
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
              width={width}
              height={height}
              rowCount={list.length}
              rowHeight={50}
              rowRenderer={rowRenderer}
            />
          )}
        </AutoSizer>
      </div>
    )
  }
}