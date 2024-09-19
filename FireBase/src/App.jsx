import React from 'react'
import Auth from './components/Auth'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
    <ToastContainer/>
    <Auth/>
    </>
  )
}

export default App
