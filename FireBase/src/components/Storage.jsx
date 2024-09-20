import React, { useState } from 'react'
import { storage } from '../config/FireBaseConfig'
import { ref, uploadBytes } from 'firebase/storage';
import { toast } from 'react-toastify';
const Storage = () => {
    const [fileUpload,setFileUpload]=useState(null)
    console.log(fileUpload);
    
    const uploadFile=async()=>{
        if(!fileUpload)return
        const fileUploadRef=ref(storage,`Testing/${fileUpload.name}`)    
        try{
            await uploadBytes(fileUploadRef,fileUploadRef)
            toast.success("File uploaded Successfully")
        }catch(err){
            toast.error("Error Occured "+err)
        }
    }
  return (
    <div>
      <input type="file" onChange={(e)=>setFileUpload(e.target.files[0])} />
      <button onClick={uploadFile}>Upload File</button>
    </div>
  )
}

export default Storage
