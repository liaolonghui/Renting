import React from 'react'
// 导入封装好的NavHeader
import NavHeader from '../../components/NavHeader'
// 样式
import styles from './index.module.css'

export default class Map extends React.Component {
  componentDidMount() {
    const map = new window.AMap.Map("container", {
      resizeEnable: true,
      zoom: 16
    });
    //获取用户所在城市信息
    window.AMap.plugin('AMap.CitySearch', function() {
        //实例化城市查询类
        const citysearch = new window.AMap.CitySearch();
        //自动获取用户IP，返回当前城市
        citysearch.getLocalCity(function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                if (result && result.city && result.bounds) {
                    const cityinfo = result.city;
                    const citybounds = result.bounds;
                    console.log(cityinfo);
                    console.log(result)
                    //地图显示当前城市
                    map.setBounds(citybounds);
                }
            } else {
                console.log(result.info)
                console.log(result)
            }
        });
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