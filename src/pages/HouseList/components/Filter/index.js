import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

export default class Filter extends Component {
  state = {
    titleSelectedStatus: {area:true, mode:false, price:true, more:false}
  }

  // 点击title高亮
  onTitleClick = (type) => {
    this.setState((preState) => {
      return {
        titleSelectedStatus: {
          ...preState.titleSelectedStatus,
          [type]: true
        }
      }
    })
  }


  render() {
    const { titleSelectedStatus } = this.state

    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {/* <div className={styles.mask}></div> */}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle onClick={this.onTitleClick} titleSelectedStatus={titleSelectedStatus} />
          {/* 前三个菜单对应的内容 */}
          {/* <FilterPicker /> */}
          {/* 最后一个菜单对应的内容 */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}