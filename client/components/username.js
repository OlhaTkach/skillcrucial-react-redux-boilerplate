import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import Header from './header'


const Username = () => {
  const [repos, setRepos] = useState([])
  const [username, setUsername] = useState('')
  const { userName } = useParams()
  

  useEffect(() => {
    axios.get (`https://api.github.com/users/${userName}/repos`).then(it=>{
      setRepos(it.data)
    })
    setUsername(`${ userName }`)   
    return () => {}
  }, [])

  
  return <div>    
  <Header username = {username} />
  {repos.map(repo => {  
    return <Link key={repo.id} to={`/${repo.full_name}`}>{repo.name}</Link>
    
  
  })}  
</div>
}

Username.propTypes = {}

export default React.memo(Username)