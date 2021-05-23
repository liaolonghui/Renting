import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import API from '../../../../utils/api'

import styles from './index.module.css'

// 要高亮的title
const titleSelectedStatus = {
  area:false,
  mode:false,
  price:false,
  more:false
}
// 每一个筛选项选中的值
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    openType: '', // 控制FilterPicker或FilterMore的展示
    filtersData: {}, // 所有筛选数据
    selectedValues, // 保存每一个筛选条件的选中
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

  // 点击title   高亮
  onTitleClick = (type) => {
    const { titleSelectedStatus, selectedValues } = this.state
    // 创建新的标题选中对象
    const newTitleSelectedStatus = {...titleSelectedStatus}
    // 遍历标题选中对象
    Object.keys(titleSelectedStatus).forEach(key => {
      if (key === type) {
        // 当前点击标题
        newTitleSelectedStatus[type] = true
        return
      }
      
      // 非当前点击标题则判断
      const selectedVal = selectedValues[key] // 当前title对应的选中项值
      if (key === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
        // area高亮
        newTitleSelectedStatus[key] = true
      } else if ((key === 'mode' || key === 'price') && selectedVal[0] !== 'null') {
        // mode或者price高亮
        newTitleSelectedStatus[key] = true
      } else if (key === 'more') {
        // 更多
      } else {
        // 不高亮
        newTitleSelectedStatus[key] = false
      }
    })

    this.setState({
      titleSelectedStatus: newTitleSelectedStatus,
      openType: type
    })
  }

  // 取消（隐藏对话框）
  onCancel = () => {
    this.setState({
      openType: ''
    })
  }
  // 确定（隐藏对话框，并且保存选中的筛选项）
  onSave = (value, type) => {
    this.setState((preState) => {
      return {
        // 隐藏对话框
        openType: '',
        // 修改选中的筛选项
        selectedValues: {
          ...preState.selectedValues,
          [type]: value // 只更新当前type
        }
      }
    })
  }

  // 渲染FilterPicker组件
  renderFilterPicker() {
    const {openType, filtersData: {area, subway, rentType, price}, selectedValues} = this.state
    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }
    // 根据openType获取当前筛选条件数据
    let data = []
    let cols = 1
    let defaultValue = selectedValues[openType]
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
    return (
      <FilterPicker
        key={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        type={openType}
        defaultValue={defaultValue}
      />
    )
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