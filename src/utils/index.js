import axios from 'axios'

// 封装获取当前定位城市的函数
export const getCurrentCity = () => {
  const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
  
  if (!localCity) {
    // 没有则去获取  返回一个Promise
    return new Promise((resolve, reject) => {
      window.AMap.plugin('AMap.CitySearch', function() {
        const citysearch = new window.AMap.CitySearch()
        citysearch.getLocalCity(async function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
              if (result && result.city && result.bounds) {
                  try {
                    const res = await axios.get(`http://localhost:8009/area/info?name=${result.city}`)
                    // 获取到城市信息 res.data.body
                    localStorage.setItem('hkzf_city', JSON.stringify(res.data.body))
                    // 返回该城市数据
                    resolve(res.data.body)
                  } catch (error) {
                    reject(error)
                  }
              }
          } else {
              console.log(result.info)
          }
        })
      })
    })
  }

  return Promise.resolve(localCity)

}