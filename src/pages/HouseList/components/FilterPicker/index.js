import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

const province = []

export default class FilterPicker extends Component {
  render() {
    return (
      <>
        {/* 选择器组件： */}
        <PickerView data={[province]} value={null} cols={3} />

        {/* 底部按钮 */}
        <FilterFooter />
      </>
    )
  }
}