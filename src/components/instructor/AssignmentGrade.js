import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { SERVER_URL } from '../../Constants';

// instructor enters students' grades for an assignment
// fetch the grades using the URL /assignment/{id}/grades
// REST api returns a list of GradeDTO objects
// display the list as a table with columns 'gradeId', 'student name', 'student email', 'score' 
// score column is an input field 
//  <input type="text" name="score" value={g.score} onChange={onChange} />


const AssignmentGrade = ({ assignment }) => {
    const [grades, setGrades] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/assignments/${assignment.id}/grades`);
                if (response.ok) {
                    const data = await response.json();
                    setGrades(data);
                } else {
                    const json = await response.json();
                    setMessage("response error: " + json.message);
                }
            } catch (err) {
                setMessage("network error: " + err);
            }
        };
        fetchGrades();
    }, [assignment.id]);

    const handleChange = (e, gradeId) => {
        const { value } = e.target;
        setGrades(grades.map(g => g.gradeId === gradeId ? { ...g, score: value } : g));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/grades`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(grades),
            });
            if (response.ok) {
                setMessage("Grades updated successfully");
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
                    <th>Grade ID</th>
                    <th>Student Name</th>
                    <th>Student Email</th>
                    <th>Score</th>
                </tr>
                </thead>
                <tbody>
                {grades.map(g => (
                    <tr key={g.gradeId}>
                        <td>{g.gradeId}</td>
                        <td>{g.studentName}</td>
                        <td>{g.studentEmail}</td>
                        <td>
                            <TextField
                                type="text"
                                name="score"
                                value={g.score}
                                onChange={(e) => handleChange(e, g.gradeId)}
                            />
                            <Button onClick={handleSave}>Grade</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssignmentGrade;