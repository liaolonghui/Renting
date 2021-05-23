import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import API from '../../../../utils/api'

import styles from './index.module.css'

export default class Filter extends Component {
  state = {
    titleSelectedStatus: {area:false, mode:false, price:false, more:false},
    openType: '', // 控制FilterPicker或FilterMore的展示
    filtersData: {}, // 所有筛选数据
  }

  componentDidMount() {
    this.getFilterData()
  }

  // 获取所有筛选条件数据（用一个接口把所有数据获取到，再根据子组件的需要传递不同数据）
  async getFilterData() {
    // 获取当前定位城市id
    const {value} = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get(`/houses/condition?id=${value}`)
    this.setState({
      filtersData: res.data.body
    })
  }

  // 点击title高亮
  onTitleClick = (type) => {
    this.setState((preState) => {
      return {
        titleSelectedStatus: {
          ...preState.titleSelectedStatus,
          [type]: true
        },
        openType: type
      }
    })
  }

  // 取消（隐藏对话框）
  onCancel = () => {
    this.setState({
      openType: ''
    })
  }
  // 确定（隐藏对话框，并且保存选中的筛选项）
  onSave = () => {
    this.setState({
      openType: ''
    })
  }

  // 渲染FilterPicker组件
  renderFilterPicker() {
    const {openType, filtersData: {area, subway, rentType, price}} = this.state
    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }
    // 根据openType获取当前筛选条件数据
    let data = []
    let cols = 1
    switch (openType) {
      case 'area':
        // 区域数据（area和subway）
        data = [area, subway]
        cols = 3 // 三列
        break;
      case 'mode':
        // 方式（rentType）
        data = rentType
        cols = 1 // 一列
        break;
      case 'price':
        // 租金（price）
        data = price
        cols = 1 // 一列
        break;
      default:
        break;
    }
    return <FilterPicker onCancel={this.onCancel} onSave={this.onSave} data={data} cols={cols} />
  }

  render() {
    const { titleSelectedStatus, openType } = this.state

    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {
          (openType === 'area' || openType === 'mode' || openType === 'price')
          ? <div className={styles.mask} onClick={() => this.onCancel()}></div>
          : null
        }

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle onClick={this.onTitleClick} titleSelectedStatus={titleSelectedStatus} />

          {/* 前三个菜单对应的内容 */}
          { this.renderFilterPicker() }

          {/* 最后一个菜单对应的内容 */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}