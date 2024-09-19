import React from 'react'
import Auth from './components/Auth'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Student from './components/Student';

const App = () => {
  return (
    <>
    <ToastContainer/>
    <Auth/>
    <Student/>
    </>
  )
}

export default App
