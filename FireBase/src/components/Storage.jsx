import React, { useState } from 'react'
import { storage } from '../config/FireBaseConfig'
const Storage = () => {
    const [fileUpload,setFileUpload]=useState(null)
    console.log(fileUpload);
    
    const uploadFile=()=>{
        if(!fileUpload){
            return
        }
        else{
            
        }

    }
  return (
    <div>
      <input type="file" onChange={(e)=>setFileUpload(event.target.files[0])} />
      <button onClick={uploadFile}>Upload File</button>
    </div>
  )
}

export default Storage
