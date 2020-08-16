import React, { useState } from 'react'

import { history } from '../redux'
import Head from './head'

const Home = () => {
  const [counter, setCounterNew] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const onInputChange = (txt) => {
    setSearchTerm(txt)
  }

  
  return (
    <div>
      <Head title="Hello" />
      <button type="button" onClick={() => setCounterNew(counter + 1)}>
        updateCounter
      </button>
      <div>
        Hello World Dashboard {counter} 
      </div>
      <SearchInput onChange={onInputChange}/>
      <SearchButton searchTerm={searchTerm}/>
    </div>
  )
}
const SearchInput = (props) => {    
  const [value, setValue] = useState('')  
  const  onChange = (e) => {    
    setValue(e.target.value)
    props.onChange(e.target.value)
  }    
  return <div>    
   <input 
    type="text"    
    id="input-field"
    value={value}    
    onChange ={onChange}     
    />
  </div>   
}

const SearchButton = (props) => {
  const buttonClick = () => { 
    history.push(props.searchTerm)

  }
  return <div>  
  <button type ="button" onClick = {buttonClick} id = "search-button"> Search </button>  
  </div>
}



Home.propTypes = {}

export default Home


