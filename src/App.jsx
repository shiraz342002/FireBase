import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom';
import Auth from './Auth/Auth';
import Student from './components/Student';
import Storage from './components/Storage';
import Products from './components/Products';

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Auth />} />
        <Route path='/student' element={<Student/>} />
        <Route path='/storage' element={<Storage/>} />
        <Route path='/products' element={<Products/>} />
        
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
