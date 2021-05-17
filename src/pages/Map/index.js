import React from 'react'
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
    const currentCity = JSON.parse(localStorage.getItem('hkzf_city')).label
    
    AMap.plugin(['AMap.Geocoder', 'AMap.Marker', 'AMap.Scale', 'AMap.ToolBar', 'AMap.Pixel'], function() {
      const geocoder = new AMap.Geocoder({
        city: "全国", // 默认搜索范围：“全国”
      })
      const marker = new AMap.Marker()
      // 根据定位城市获取对应坐标
      geocoder.getLocation(currentCity, function(status, result) {
        if (status === 'complete'&&result.geocodes.length) {
          const lnglat = result.geocodes[0].location
          marker.setPosition(lnglat);

          // 添加控件
          map.addControl(new AMap.ToolBar())
          map.addControl(new AMap.Scale())

          // map.add(marker); 添加覆盖物
          // 覆盖物"121.473701", "31.230416"
          var m1 = new AMap.Text({
            position: ["121.473701", "31.230416"],
            offset: new AMap.Pixel(0, 0),
            text: `<div class="${styles.bubble}"><p class="${styles.name}">蛇皮区</p><p>21套</p></div>`
          })
          m1.setStyle(labelStyle)
          m1.on('click', () => console.log(1))
          map.add(m1)

          // 展示map
          map.setFitView(marker);
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