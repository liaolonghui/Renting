import React from 'react'
import { Toast } from 'antd-mobile'
import { List, WindowScroller, AutoSizer } from 'react-virtualized'
import NavHeader from '../../components/NavHeader'
// HouseItem
import HouseItem from '../../components/HouseItem'
import NoHouse from '../../components/NoHouse'

import styles from './index.module.css'
import API from '../../utils/api'
import {BASE_URL} from '../../utils/url'

export default class HouseList extends React.Component {

  state = {
    list: [], // 列表数据
    count: 0, // 总条数
    isLoading: true, // 数据是否加载中
  }

  componentDidMount() {
    this.searchHouseList()
  }

  // 获取房屋列表数据
  async searchHouseList() {
    // loading
    Toast.loading('加载中...', 0, null, false)
    this.setState({
      isLoading: true
    })
    const res = await API.get('/user/favorites')
    // 关loading
    Toast.hide()
    const list = res.data.body
    const count = res.data.body.length
    // 提示
    if (count > 0) {
      Toast.info(`共收藏${count}套房源`, 2, null, false)
    }
    this.setState({
      list,
      count,
      isLoading: false
    })
  }

  // 渲染列表项的每一行
  renderHouseList = ({key, index, style}) => {
    // 根据索引获取当前这一行的数据
    const { list } = this.state
    const house = list[index]
    // house存在才渲染，不存在则先渲染loading元素占位
    if (!house) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading}></p>
        </div>
      )
    }
    return (
      <HouseItem
        key={key}
        onClick={() => this.props.history.push(`/detail/${house.houseCode}`)}
        style={style}
        src={BASE_URL + house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
      ></HouseItem>
    )
  }

  // 渲染列表
  renderList() {
    const {count, isLoading} = this.state
    if (count === 0 && !isLoading) {
      return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>
    }
    return (
      <WindowScroller>
        {({ height, isScrolling, scrollTop }) => (
          <AutoSizer>
            {({ width }) => (
              <List
                width={width}
                height={height}
                autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
                isScrolling={isScrolling}
                scrollTop={scrollTop}
                rowCount={count} // 条数
                rowHeight={120} // 每行高度
                rowRenderer={this.renderHouseList}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    )
  }

  render() {
    return (
      <div className="favorate">
        <NavHeader>我的收藏</NavHeader>
        {/* 房屋列表 */}
        <div>
          {this.renderList()}
        </div>
      </div>
    )
  }
}