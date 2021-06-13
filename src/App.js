import React, { Suspense } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

// 登陆访问控制路由
import AuthRoute from './components/AuthRoute'

import Home from './pages/Home'
const CityList = React.lazy(() => import('./pages/CityList'))
const Map = React.lazy(() => import('./pages/Map'))
const HouseDetail = React.lazy(() => import('./pages/HouseDetail'))
const Login = React.lazy(() => import('./pages/Login'))
const Favorate = React.lazy(() => import('./pages/Favorate'))
const Rent = React.lazy(() => import('./pages/Rent'))
const RentAdd = React.lazy(() => import('./pages/Rent/Add'))
const RentSearch = React.lazy(() => import('./pages/Rent/Search'))


function App() {
  return (
    <Router>
      <Suspense fallback={<div className="route-loading">loading</div>}>
        <div className="App">
          
          {/* 默认路由 */}
          <Route exact path="/" render={() => <Redirect to="/home" />}></Route>
          {/* 配置路由 */}
          <Route path="/home" component={ Home }></Route>
          <Route path="/citylist" component={ CityList }></Route>
          <Route path="/map" component={ Map }></Route>
          <AuthRoute path="/favorate" component={ Favorate }></AuthRoute>
          {/* 房屋详情 */}
          <Route path="/detail/:id" component={ HouseDetail }></Route>
          {/* 登录 */}
          <Route path="/login" component={ Login }></Route>

          {/* Rent */}
          <AuthRoute path="/rent" exact component={ Rent }></AuthRoute>
          <AuthRoute path="/rent/add" component={ RentAdd }></AuthRoute>
          <AuthRoute path="/rent/search" component={ RentSearch }></AuthRoute>
        
        </div>
      </Suspense>
    </Router>
  );
}

export default App;
