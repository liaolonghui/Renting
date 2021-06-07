import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import CityList from './pages/CityList'
import Map from './pages/Map'
import Home from './pages/Home'
import HouseDetail from './pages/HouseDetail'
import Login from './pages/Login'
// 登陆访问控制路由
import AuthRoute from './components/AuthRoute'

function App() {
  return (
    <Router>
      <div className="App">
        
        {/* 默认路由 */}
        <Route exact path="/" render={() => <Redirect to="/home" />}></Route>
        {/* 配置路由 */}
        <Route path="/home" component={ Home }></Route>
        <Route path="/citylist" component={ CityList }></Route>
        <Route path="/map" component={ Map }></Route>

        <Route path="/detail/:id" component={ HouseDetail }></Route>

        <Route path="/login" component={ Login }></Route>
      
      </div>
    </Router>
  );
}

export default App;
