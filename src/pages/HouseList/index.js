import React from 'react'
import { Flex, Toast } from 'antd-mobile'
import { List, WindowScroller, AutoSizer, InfiniteLoader } from 'react-virtualized'
import SearchHeader from '../../components/SearchHeader'
// HouseItem
import HouseItem from '../../components/HouseItem'
import Filter from './components/Filter'
// Sticky
import Sticky from '../../components/Sticky'
import NoHouse from '../../components/NoHouse'

import styles from './index.module.css'
import API from '../../utils/api'
import {BASE_URL} from '../../utils/url'

export default class HouseList extends React.Component {

  state = {
    cityName: JSON.parse(localStorage.getItem('hkzf_city')).label, // 当前城市信息
    list: [], // 列表数据
    count: 0, // 总条数
    isLoading: true, // 数据是否加载中
  }

  // 初始化filters
  filters = []

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
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get('/houses', {
      params: {
        cityId: value,
        ...this.filters,
        start: 1,
        end: 20
      }
    })
    // 关loading
    Toast.hide()
    const { list, count } = res.data.body
    // 提示
    if (count > 0) {
      Toast.info(`共找到${count}套房源`, 2, null, false)
    }
    this.setState({
      list,
      count,
      isLoading: false
    })
  }

  // 接收Filter发送过来的筛选条件
  onFilter = (filters) => {
    window.scrollTo(0, 0)
    this.filters = filters
    this.searchHouseList()
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
        style={style}
        src={BASE_URL + house.houseImg}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
      ></HouseItem>
    )
  }

  // 判断列表中的每一行是否加载完成
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }
  // 用来获取更多房屋列表数据
  // 注意：该方法的返回值是一个Promise对象，并且这个对象应该在数据加载完调用resolve让Promise对象状态变为已完成
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(resolve => {
      // 数据加载完后调用resolve
      const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
      API.get('/houses', {
        params: {
          cityId: value,
          ...this.filters,
          start: (startIndex+1),
          end: (stopIndex+1)
        }
      }).then(res => {
        this.setState({
          list: [...this.state.list, ...res.data.body.list]
        })
        // 数据加载完  resolve()
        resolve()
      })
    })
  }

  // 渲染列表
  renderList() {
    const {count, isLoading} = this.state
    if (count === 0 && !isLoading) {
      return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>
    }
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
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
        )}
      </InfiniteLoader>
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
        <Sticky>
          <Filter onFilter={this.onFilter}></Filter>
        </Sticky>

        {/* 房屋列表 */}
        <div className={styles.houseItems}>
          {this.renderList()}
        </div>
      </div>
    )
  }
}