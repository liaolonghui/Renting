import React from 'react'
import { Route, Link } from 'react-router-dom'
import News from '../News'

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <h4>Home</h4>
        <Route path="/home/news" component={ News }></Route>
        <Link to="/home/news">新闻</Link>
      </div>
    )
  }
}