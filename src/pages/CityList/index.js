import React from 'react'
import axios from 'axios'
import { getCurrentCity } from '../../utils/index'

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
    console.log(cityList, cityIndex)
    // 获取当前定位城市
    const currentCity = await getCurrentCity()
    console.log(currentCity)
  }

  render() {
    return (
      <div>citylist</div>
    )
  }
}