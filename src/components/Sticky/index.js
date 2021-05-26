import React, {Component ,createRef} from 'react'

import styles from './index.module.css'

class Sticky extends Component {
  // 创建两个ref对象
  placeholder = createRef()
  content = createRef()

  handleScroll = () => {
    const placeholderEl = this.placeholder.current
    const contentEl = this.content.current

    const {top} = placeholderEl.getBoundingClientRect()
    const {height} = contentEl.getBoundingClientRect()
    if (top < 0) {
      contentEl.classList.add(styles.fixed)
      placeholderEl.style.height = height+'px'
    } else {
      contentEl.classList.remove(styles.fixed)
      placeholderEl.style.height = '0'
    }
  }

  // scroll
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    return (
      <div>
        {/* 占位元素 */}
        <div ref={this.placeholder} />
        {/* 内容元素 */}
        <div ref={this.content}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Sticky
