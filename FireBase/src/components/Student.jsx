import React, { useEffect, useState } from 'react';
import { db } from "../config/FireBaseConfig";
import { getDocs, collection } from 'firebase/firestore';

const Student = () => {
    const [students, setStudents] = useState([]);
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

    return (
        <div className='flex flex-col items-center justify-center p-4'>
            <h1 className='text-2xl font-bold mb-4'>Student Information</h1>
            <div className='w-full max-w-lg'>
                {students.map(student => (
                    <div key={student.id} className='border rounded-lg p-4 mb-4 shadow-md'>
                        <h2 className='text-xl font-semibold'>{student.FirstName} {student.LastName}</h2>
                        <p><strong>Age:</strong> {student.Age}</p>
                        <p><strong>CGPA:</strong> {student.CGPA}</p>
                        <p><strong>Fee Defaulter:</strong> {student.isFeeDefaulter ? 'Yes' : 'No'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Student;
