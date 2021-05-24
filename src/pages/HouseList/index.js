import React from 'react'
import { Flex } from 'antd-mobile'
import { List } from 'react-virtualized'
import SearchHeader from '../../components/SearchHeader'
// HouseItem
import HouseItem from '../../components/HouseItem'
import Filter from './components/Filter'

import styles from './index.module.css'
import API from '../../utils/api'
import {BASE_URL} from '../../utils/url'

export default class HouseList extends React.Component {

  state = {
    cityName: JSON.parse(localStorage.getItem('hkzf_city')).label, // 当前城市信息
    list: [], // 列表数据
    count: 0, // 总条数
  }

  // 初始化filters
  filters = []

  componentDidMount() {
    this.searchHouseList()
  }

  // 获取房屋列表数据
  async searchHouseList() {
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get('/houses', {
      params: {
        cityId: value,
        ...this.filters,
        start: 1,
        end: 20
      }
    })
    const { list, count } = res.data.body
    this.setState({
      list,
      count
    })
  }

  // 接收Filter发送过来的筛选条件
  onFilter = (filters) => {
    this.filters = filters
    this.searchHouseList()
  }


  // 渲染列表项的每一行
  renderHouseList = ({key, index, style}) => {
    // 根据索引获取当前这一行的数据
    const { list } = this.state
    const house = list[index]
    return (
      <HouseItem
        key={key}
        style={style}
        src={BASE_URL + house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
      ></HouseItem>
    )
  }

  render() {
    return (
      <div className="houseList">
        {/* 顶部搜索导航 */}
        <Flex className={styles.header}>
          <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)}></i>
          <SearchHeader cityName={this.state.cityName} className={styles.searchHeader} />
        </Flex>

        {/* 条件筛选栏 */}
        <Filter onFilter={this.onFilter}></Filter>

        {/* 房屋列表 */}
        <div className={styles.houseItems}>
          <List
            width={300}
            height={300}
            rowCount={this.state.count} // 条数
            rowHeight={120} // 每行高度
            rowRenderer={this.renderHouseList}
          />
        </div>
      </div>
    )
  }
}