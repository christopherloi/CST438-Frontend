import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
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

    console.log('secNo:', secNo); // Debugging line to check secNo value

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

        if (secNo) {
            fetchEnrollments();
        } else {
            setMessage("Section number is undefined");
        }
    }, [secNo]);

    const handleGradeChange = (e, enrollmentId) => {
        const { value } = e.target;
        setEnrollments(enrollments.map(en => en.enrollmentId === enrollmentId ? { ...en, grade: value } : en));
    };

    const handleSaveGrades = async () => {
        const grades = enrollments.map(en => ({
            gradeId: en.gradeId, // assuming you have a gradeId
            score: en.grade // ensure this is a string
        }));

        try {
            const response = await fetch(`${SERVER_URL}/grades`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(grades),
            });

            if (response.ok) {
                setMessage("Grades saved successfully");
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
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
            <Button variant="contained" color="primary" onClick={handleSaveGrades}>
                Save Grades
            </Button>
        </div>
    );
};

export default EnrollmentsView;