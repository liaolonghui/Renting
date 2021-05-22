import React from 'react'
import { Flex } from 'antd-mobile'
import SearchHeader from '../../components/SearchHeader'
import Filter from './components/Filter'

import styles from './index.module.css'

export default class HouseList extends React.Component {

  state = {
    cityName: JSON.parse(localStorage.getItem('hkzf_city')).label // 当前城市信息
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
        <Filter></Filter>
      </div>
    )
  }
}