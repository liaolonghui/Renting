import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

export default class FilterPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.defaultValue, // 选中项
    }
  }

  render() {
    const {onCancel, onSave, data, cols, type} = this.props
    const {value} = this.state

    return (
      <>
        {/* 选择器组件 data数据源 cols列数 */}
        <PickerView
          data={data}
          value={value}
          cols={cols}
          onChange={val => {
            this.setState({
              value: val
            })
          }}
        />

        {/* 底部按钮 */}
        {/* ok时把value，type传过去 */}
        <FilterFooter onCancel={() => onCancel(type)} onOk={() => onSave(value, type)} />
      </>
    )
  }
}