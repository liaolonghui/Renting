import React from 'react'
import axios from 'axios'
// 导入封装好的NavHeader
import NavHeader from '../../components/NavHeader'
// 样式
import styles from './index.module.css'

const AMap = window.AMap
// 覆盖物样式
const labelStyle = {
  width: '70px',
  height: '70px',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: '#fff',
  textAlign: 'center'
}

export default class Map extends React.Component {
  componentDidMount() {
    const map = new AMap.Map("container", {
      resizeEnable: true,
    });
    //获取用户当前定位城市
    const {label, value} = JSON.parse(localStorage.getItem('hkzf_city'))
    
    AMap.plugin(['AMap.Geocoder', 'AMap.Marker', 'AMap.Scale', 'AMap.ToolBar', 'AMap.Pixel'], function() {
      const geocoder = new AMap.Geocoder({
        city: "全国", // 默认搜索范围：“全国”
      })
      const marker = new AMap.Marker()
      // 根据定位城市获取对应坐标
      geocoder.getLocation(label, async function(status, result) {
        if (status === 'complete'&&result.geocodes.length) {
          const lnglat = result.geocodes[0].location
          marker.setPosition(lnglat);

          // 添加控件
          map.addControl(new AMap.ToolBar())
          map.addControl(new AMap.Scale())

          // map.add(marker); 添加覆盖物
          const res = await axios.get(`http://localhost:8009/area/map?id=${value}`)
          res.data.body.forEach(item => {
            // 为每一条数据创建覆盖物
            const mk = new AMap.Text({
              position: [item.coord.longitude, item.coord.latitude],
              offset: new AMap.Pixel(0,0),
              text: `<div class="${styles.bubble}"><p class="${styles.name}">${item.label}</p><p>${item.count}套</p></div>`
            })
            // 唯一标识
            mk.id = item.value
            mk.setStyle(labelStyle)
            mk.on('click', () => {
              console.log("我的id是"+mk.id)
              // 放大地图，以当前点击的覆盖物为中心。并且清除覆盖物。
              map.setFitView(mk)
              map.setZoom(13)
              // map.clearMap()清除所有覆盖物
              map.clearMap()
            })
            map.add(mk)
          })

          // 展示map
          map.setFitView(marker)
          map.setZoom(11)
        }else{
          console.error('根据地址查询位置失败');
        }
      })
    })
  }

  render() {
    return (
      <div className={styles.map}>
        {/* NavHeader */}
        <NavHeader>
          地图找房
        </NavHeader>
        {/* 地图容器 */}
        <div id="container" className={styles.container} />
      </div>
    )
  }
}