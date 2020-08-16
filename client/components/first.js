import React, { useState} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from ' redux '
import { history } from 'redux'
import { Link } from 'react-router-dom'
import Head from './head'



const InputField = () => {    
  const [value, setValue] = useState('1')  
  const  onChange = (e) => {    
    setValue(e.target.value)
  }    
  return <div>    
   <input 
    type="text"    
    value={value}    
    onChange ={onChange}     
    />   
    <input type="button" value="search-button" onclick="text"/>
  </div>    
} 


history.listen(location => {
  history.push('../redux');
});
  
ReactDOM.render(<InputUserId />, mountNode)    


const Dummy = () => {
  return (
    <div>
      <Head title="Hello" />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-indigo-800 text-white font-bold rounded-lg border shadow-lg p-10">
          This is dummy component
          <Link to="/dashboard"> Go To Dashboard</Link>
        </div>
      </div>
    </div>
  )
}

Dummy.propTypes = {}

export default React.memo(Dummy)

