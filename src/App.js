import { BrowserRouter as Router, Route } from 'react-router-dom'
import CityList from './pages/CityList'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <div className="App">
        
        {/* 配置路由 */}
        <Route path="/home" component={ Home }></Route>
        <Route path="/citylist" component={ CityList }></Route>
      
      </div>
    </Router>
  );
}

export default App;
