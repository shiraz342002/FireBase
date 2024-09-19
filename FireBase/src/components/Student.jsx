import React, { useEffect, useState } from 'react';
import { db } from "../config/FireBaseConfig";
import { getDocs, collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const Student = () => {
  const [students, setStudents] = useState([]); // State to store the list of students
  const [formData, setFormData] = useState({ // State to store form data for adding or editing students
    FirstName: '',
    LastName: '',
    Age: '',
    CGPA: '',
    isFeeDefaulter: false
  });
  const [editId, setEditId] = useState(null); // State to store the ID of the student being edited

  const studentCollectionRef = collection(db, "student"); // Reference to the Firestore collection

  useEffect(() => {
    // Function to fetch students from Firestore
    const getStudent = async () => {
      try {
        const data = await getDocs(studentCollectionRef); // Get documents from Firestore
        console.log(data);
        
        const filteredData = data.docs.map(doc => ({ ...doc.data(), id: doc.id })); // Map document data to include IDs
        setStudents(filteredData); // Update state with fetched data
      } catch (err) {
        console.log(err); // Log errors if any
      }
    };
    getStudent(); // Call the function to fetch students
  }, []);

  const handleChange = (e) => {
    // Function to handle form input changes
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value // Update form data based on input type
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      if (editId) {
        // If editing an existing student, update the student document in Firestore
        const studentDoc = doc(db, "student", editId);
        await updateDoc(studentDoc, formData);
        toast.success("Student Updated Successfully");
      } else {
        // If adding a new student, add a new document to Firestore
        await addDoc(studentCollectionRef, formData);
        toast.success("Student Added Successfully");
      }
      setFormData({ // Reset form data after submission
        FirstName: '',
        LastName: '',
        Age: '',
        CGPA: '',
        isFeeDefaulter: false
      });
      setEditId(null); // Clear edit ID
      // Fetch updated students list
      const data = await getDocs(studentCollectionRef);
      const filteredData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setStudents(filteredData); // Update state with updated data
    } catch (err) {
      toast.error("Error: " + err.message); // Show error toast if submission fails
    }
  };

  const handleEdit = (student) => {
    // Function to set form data for editing
    setFormData({
      FirstName: student.FirstName,
      LastName: student.LastName,
      Age: student.Age,
      CGPA: student.CGPA,
      isFeeDefaulter: student.isFeeDefaulter
    });
    setEditId(student.id); // Set the ID of the student being edited
  };

  const handleDelete = async (id) => {
    // Function to delete a student from Firestore
    try {
      const studentDoc = doc(db, "student", id);
      await deleteDoc(studentDoc);
      toast.success("Student Deleted Successfully");
      // Fetch updated students list after deletion
      const data = await getDocs(studentCollectionRef);
      const filteredData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setStudents(filteredData); // Update state with updated data
    } catch (err) {
      toast.error("Error: " + err.message); // Show error toast if deletion fails
    }
  };

  return (
    <div className='flex flex-col items-center p-4'>
      <div className='flex flex-col md:flex-row md:justify-between w-full max-w-5xl mb-8'>
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
                    className='bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600'>
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
          <h2 className='text-xl font-bold mb-4 text-center'>{editId ? 'Edit Student' : 'Add New Student'}</h2>
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
              {editId ? 'Update Student' : 'Add Student'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Student;
