import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import API from '../../../utils/api'

import styles from './index.module.css'
import _ from 'lodash'

const getCity = () => {
  return JSON.parse(localStorage.getItem('hkzf_city'))
}

export default class Search extends Component {
  // 当前城市id
  cityId = getCity().value

  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }
  // 将异步请求的代码封装到searchCommunityList
  async searchCommunityList(val) {
    const res = await API.get('/area/community', {
      params: {
        name: val,
        id: this.cityId
      }
    })
    console.log('搜索的结果是', res)
    this.setState({
      tipsList: res.data.body
    })
  }
  // 防抖动,会返回一个新的函数
  searchCommunityList = _.debounce(this.searchCommunityList, 500)
  // 1.获取搜索关键字
  getSearchKeys = async (val) => {
    console.log('关键字', val)
    this.setState({
      searchTxt: val
    })
    // 1.2 如果搜索关键字为空,那么展示列表数组也应该为空
    if (val.trim() === '') return this.setState({
      tipsList: []
    })

    this.searchCommunityList(val)
    // 移除上一个延时器
    // clearTimeout(this.timerId)
    // 什么是防抖,我们输入一定的值,当值不再变化的时候,500毫秒之后再发送请求,
    // 1.1根据搜索关键字,发送请求,获取对应的小区
    // 添加延时器
    // this.timerId = setTimeout(async () => {

    // }, 2000)
  }
  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li onClick={() => this.props.history.replace('/rent/add', {
        name: item.communityName,
        id: item.community
      })} key={item.community} className={styles.tip}>
        {item.communityName}
      </li>
    ))
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}                             // 搜索框的当前值
          showCancelButton={true}                       // 是否一直显示取消按钮
          onCancel={() => history.replace('/rent/add')} // 点击取消按钮触发
          onChange={(val) => this.getSearchKeys(val)}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}