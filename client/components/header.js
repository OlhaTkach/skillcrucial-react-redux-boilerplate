import { Link } from 'react-router-dom'
import React from 'react'

const Header = (props) => {

  return <div>    
  <div id="repository-name"> {props.username}     
   </div>
   <Link to="/" id="go-back">go back </Link>
   <Link to={`/${props.username}`} id="go-repository-list">go repository list</Link>
  </div>   
  }

export default React.memo(Header)
