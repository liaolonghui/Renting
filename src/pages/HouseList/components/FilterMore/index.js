import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {
  state = {
    selectedValues: this.props.defaultValue
  }

  // 点击tag
  onTagClick(value) {
    const {selectedValues} = this.state
    const newSelectedValues = [...selectedValues]
    const idx = selectedValues.indexOf(value)  // findIndex()也行,但这个是数组元素全部执行一遍找出符合条件的。（空数组则不会执行...）
    if (idx !== -1) {
      // 有
      newSelectedValues.splice(idx, 1)
    } else {
      // 无
      newSelectedValues.push(value)
    }
    // 更新状态
    this.setState({
      selectedValues: newSelectedValues
    })
  }

  // 渲染标签
  renderFilters(data) {
    // 高亮类名：styles.tagActive
    return data.map(item => {
      const { selectedValues } = this.state
      const isSelected = selectedValues.findIndex(v => v===item.value) !== -1

      return (
        <span
          key={item.value}
          className={[styles.tag, isSelected ? styles.tagActive : ''].join(' ')}
          onClick={() => this.onTagClick(item.value)}
        >
          { item.label }
        </span>
      )
    })
  }

  // 清除
  onCancel = () => {
    this.setState({
      selectedValues: []
    })
  }

  // 确认
  onOk = () => {
    const { type, onSave } = this.props
    // 调用父组件的onSave把数据发送过去
    onSave(this.state.selectedValues, type)
  }

  render() {
    const {roomType, oriented, floor, characteristic} = this.props.data
    // 这个是父组件传过来用于关闭对话框的onCancel
    const { onCancel, type } = this.props

    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={() => onCancel(type)} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter cancelText="清除" className={styles.footer} onCancel={this.onCancel} onOk={this.onOk} />
      </div>
    )
  }
}