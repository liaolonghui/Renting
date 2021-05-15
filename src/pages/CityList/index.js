import React from 'react'
import axios from 'axios'

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
    const res = await axios.get('http://localhost:8009/area/city?level=1')
    const { cityList, cityIndex } = formatCityList(res.data.body)
    console.log(cityList, cityIndex)
  }

  render() {
    return (
      <div>citylist</div>
    )
  }
}