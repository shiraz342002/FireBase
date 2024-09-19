import React, { useEffect, useState } from 'react';
import { db } from "../config/FireBaseConfig";
import { getDocs, collection, addDoc } from 'firebase/firestore';

const Student = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Age: '',
    CGPA: '',
    isFeeDefaulter: false
  });

  const studentCollectionRef = collection(db, "student");

  useEffect(() => {
    const getStudent = async () => {
      try {
        const data = await getDocs(studentCollectionRef);
        const filteredData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        console.log(filteredData);
        setStudents(filteredData);
      } catch (err) {
        console.log(err);
      }
    };
    getStudent();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(studentCollectionRef, formData);
      setFormData({
        FirstName: '',
        LastName: '',
        Age: '',
        CGPA: '',
        isFeeDefaulter: false
      });
      // Fetch updated students list
      const data = await getDocs(studentCollectionRef);
      const filteredData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setStudents(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className='flex flex-col items-center justify-center p-4'>
        <h1 className='text-2xl font-bold mb-4'>Student Information</h1>
        <div className='w-full max-w-lg'>
          {students.map(student => (
            <div key={student.id} className='border rounded-lg p-4 mb-4 shadow-md'>
              <h2 className='text-xl font-semibold'>{student.FirstName} {student.LastName}</h2>
              <p><strong>Age:</strong> {student.Age}</p>
              <p><strong>CGPA:</strong> {student.CGPA}</p>
              <p className='font-semibold' style={{ color: student.isFeeDefaulter ? 'red' : 'green' }}>
                {student.isFeeDefaulter ? 'Fee Defaulter' : 'Fee Cleared'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-col items-center justify-center p-4'>
        <h2 className='text-xl font-bold mb-4'>Add New Student</h2>
        <form onSubmit={handleSubmit} className='w-full max-w-lg'>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>First Name</label>
            <input
              type='text'
              name='FirstName'
              value={formData.FirstName}
              onChange={handleChange}
              className='border rounded-lg w-full p-2'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>Last Name</label>
            <input
              type='text'
              name='LastName'
              value={formData.LastName}
              onChange={handleChange}
              className='border rounded-lg w-full p-2'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>Age</label>
            <input
              type='number'
              name='Age'
              value={formData.Age}
              onChange={handleChange}
              className='border rounded-lg w-full p-2'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium mb-1'>CGPA</label>
            <input
              type='number'
              step='0.1'
              name='CGPA'
              value={formData.CGPA}
              onChange={handleChange}
              className='border rounded-lg w-full p-2'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='inline-flex items-center'>
              <input
                type='checkbox'
                name='isFeeDefaulter'
                checked={formData.isFeeDefaulter}
                onChange={handleChange}
                className='form-checkbox'
              />
              <span className='ml-2'>Fee Defaulter</span>
            </label>
          </div>
          <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded-lg'>
            Add Student
          </button>
        </form>
      </div>
    </>
  );
};

export default Student;
