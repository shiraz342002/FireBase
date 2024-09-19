import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import Student from './components/Student';

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Auth />} />
        <Route path='/student' element={<Student />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
