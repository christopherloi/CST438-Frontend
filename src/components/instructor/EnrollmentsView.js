import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TextField } from '@mui/material';
import { SERVER_URL } from '../../Constants';

// instructor view list of students enrolled in a section 
// use location to get section no passed from InstructorSectionsView
// fetch the enrollments using URL /sections/{secNo}/enrollments
// display table with columns
//   'enrollment id', 'student id', 'name', 'email', 'grade'
//  grade column is an input field
//  hint:  <input type="text" name="grade" value={e.grade} onChange={onGradeChange} />

const EnrollmentsView = () => {
    const location = useLocation();
    const { secNo } = location.state;

    const [enrollments, setEnrollments] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/sections/${secNo}/enrollments`);
                if (response.ok) {
                    const data = await response.json();
                    setEnrollments(data);
                } else {
                    const json = await response.json();
                    setMessage("response error: " + json.message);
                }
            } catch (err) {
                setMessage("network error: " + err);
            }
        };
        fetchEnrollments();
    }, [secNo]);

    const handleGradeChange = (e, enrollmentId) => {
        const { value } = e.target;
        setEnrollments(enrollments.map(en => en.enrollmentId === enrollmentId ? { ...en, grade: value } : en));
    };

    return (
        <div>
            <h4>{message}</h4>
            <table className="Center">
                <thead>
                <tr>
                    <th>Enrollment ID</th>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Grade</th>
                </tr>
                </thead>
                <tbody>
                {enrollments.map(e => (
                    <tr key={e.enrollmentId}>
                        <td>{e.enrollmentId}</td>
                        <td>{e.studentId}</td>
                        <td>{e.name}</td>
                        <td>{e.email}</td>
                        <td>
                            <TextField
                                type="text"
                                name="grade"
                                value={e.grade}
                                onChange={(ev) => handleGradeChange(ev, e.enrollmentId)}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default EnrollmentsView;
