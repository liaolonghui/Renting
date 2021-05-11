import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import CityList from './pages/CityList'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <div className="App">
        
        {/* 默认路由 */}
        <Route exact path="/" render={() => <Redirect to="/home" />}></Route>
        {/* 配置路由 */}
        <Route path="/home" component={ Home }></Route>
        <Route path="/citylist" component={ CityList }></Route>
      
      </div>
    </Router>
  );
}

export default App;
