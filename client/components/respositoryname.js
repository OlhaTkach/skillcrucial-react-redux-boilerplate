import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from "react-markdown"
import axios from 'axios'
import Header from './header'


const Repositoryname = () => {
  const [description, setDescription] = useState('')
  const [username, setUsername] = useState('')
  const { repositoryName } = useParams()
  const { userName } = useParams()
  
  useEffect(() => {
    axios.get (`https://raw.githubusercontent.com/${userName}/${repositoryName}/master/README.md`).then(it=>{
      setDescription(it.data)
})
setUsername(`${ userName }`)
  return () => {}
}, [])

return <div>
  <Header username = {username} />
  <div id  = "description" > <ReactMarkdown source={description}/> </div>
</div>
}



Repositoryname.propTypes = {}

export default React.memo(Repositoryname)
