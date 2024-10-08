import React, { useEffect, useState } from 'react';
import { db, auth } from "../config/FireBaseConfig";
import { getDocs, collection, addDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Student = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Age: '',
    CGPA: '',
    isFeeDefaulter: false,
   
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const studentCollectionRef = collection(db, "student");

  const getStudent = async () => {
    try {
      const data = await getDocs(studentCollectionRef);
      const filteredData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setStudents(filteredData);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching students");
    }
  };
  useEffect(() => {
    if (auth?.currentUser?.uid) {
      getStudent(); 
    } else {
      toast.error("Please log in to view students.");
    }
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
    setLoading(true);
  
    try {
      if (editId) {
        const studentDoc = doc(db, "student", editId);
        await updateDoc(studentDoc, formData);
        toast.success("Student Updated Successfully");
      } else {
        await addDoc(studentCollectionRef, {
          ...formData,
          userId: auth.currentUser.uid
        });
        toast.success("Student Added Successfully");
      }
  
      setFormData({
        FirstName: '',
        LastName: '',
        Age: '',
        CGPA: '',
        isFeeDefaulter: false
      });
      setEditId(null);
  
      await getStudent();
  
    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      const studentDoc = doc(db, "student", id);
      await deleteDoc(studentDoc);
      toast.success("Student Deleted Successfully");
  
      await getStudent(); 
  
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };
  
  const handleEdit = (student) => {
    setFormData({
      FirstName: student.FirstName,
      LastName: student.LastName,
      Age: student.Age,
      CGPA: student.CGPA,
      isFeeDefaulter: student.isFeeDefaulter
    });
    setEditId(student.id);
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
      navigate('/');
    } catch (err) {
      toast.error("Error logging out: " + err.message);
    }
  };

  return (
    <div className='flex flex-col items-center p-4'>
      <div className='flex justify-between items-center w-full mb-8'>
        {auth?.currentUser && (
          <>
            <h2 className='text-2xl font-bold'>Welcome, {auth.currentUser.email}</h2>
            <button
              onClick={handleLogout}
              className='bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600'>
              Logout
            </button>
          </>
        )}
      </div>
      <div className='flex flex-col md:flex-row md:justify-between w-full mb-8'>
        <div className='w-full md:w-1/2 p-4'>
          <h1 className='text-2xl font-bold mb-4 text-center'>Student Information</h1>
          <div className='w-full max-w-lg mx-auto'>
            {students.map(student => (
              <div key={student.id} className='border rounded-lg p-4 mb-4 shadow-lg'>
                <h2 className='text-xl font-semibold'>{student.FirstName} {student.LastName}</h2>
                <p><strong>Age:</strong> {student.Age}</p>
                <p><strong>CGPA:</strong> {student.CGPA}</p>
                <p className='font-semibold' style={{ color: student.isFeeDefaulter ? 'red' : 'green' }}>
                  {student.isFeeDefaulter ? 'Fee Defaulter' : 'Fee Cleared'}
                </p>
                <div className='mt-4 flex justify-between'>
                  <button
                    onClick={() => handleEdit(student)}
                    className='bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600'>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className='bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600'>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='w-full md:w-1/2 p-4'>
          <h2 className='text-3xl font-bold mb-4 text-center'>{editId ? 'Edit Student' : 'Add New Student'}</h2>
          <form onSubmit={handleSubmit} className='w-full max-w-lg mx-auto'>
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
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 w-full'>
              {editId ? 'Update Student' : loading? 'Adding...' : 'Add Student'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Student;
