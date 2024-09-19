import React, { useEffect, useState } from 'react'
import {db} from "../config/FireBaseConfig"
import { getDocs,collection } from 'firebase/firestore'

const Student = () => {
    const [student,setStudents]=useState([])
    const studentCollectionRef = collection(db,"student")

    useEffect(() => {
        const getStudent=async()=>{
        try{
            const data = await getDocs(studentCollectionRef)
            console.log(data);
            
        }catch(err){
            console.log(err);
            
        }
        }
        getStudent();      
    }, [])
    
  return (
    <div>
      
    </div>
  )
}

export default Student
