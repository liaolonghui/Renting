import React, { Component } from 'react'
import styles from './index.module.css'
import {BASE_URL} from '../../utils/url'

export default class index extends Component {
  static defaultProps = {
    children: '没有找到房源，请您换个搜索条件吧~'
  }
  render() {
    return (
      <div className={styles['no-house']}>
        <img className="img" src={BASE_URL+'/img/not-found.png'} alt="暂无数据" />
        <p className="msg">{this.props.children}</p>
      </div>
    )
  }
}