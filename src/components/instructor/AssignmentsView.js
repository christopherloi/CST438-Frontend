import React, {useState, useEffect} from 'react';
import { confirmAlert } from 'react-confirm-alert';
import Button from '@mui/material/Button';
import {useLocation} from 'react-router-dom'
import {SERVER_URL} from '../../Constants';
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentGrade from './AssignmentGrade'

// instructor views assignments for their section
// use location to get the section value 
// 
// GET assignments using the URL /sections/{secNo}/assignments
// returns a list of AssignmentDTOs
// display a table with columns 
// assignment id, title, dueDate and buttons to grade, edit, delete each assignment

const AssignmentsView = () => {
    const headers = ['ID', 'Title', 'Due Date', '', '', ''];
    const location = useLocation();
    const { secNo } = location.state;

    console.log('secNo:', secNo); // Debugging line to check secNo value

    const [message, setMessage] = useState('');
    const [assignments, setAssignments] = useState([]);

    const fetchAssignments = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sections/${secNo}/assignments`);
            if (response.ok) {
                const data = await response.json();
                setAssignments(data);
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    };

    useEffect(() => {
        if (secNo) {
            fetchAssignments();
        } else {
            setMessage("Section number is undefined");
        }
    }, [secNo]);

    const gradeAssignment = async (assignment) => {
        try {
            const response = await fetch(`${SERVER_URL}/grades`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(assignment),
            });
            if (response.ok) {
                setMessage("Assignment graded");
                fetchAssignments();
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    };

    const saveAssignment = async (assignment) => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(assignment),
            });
            if (response.ok) {
                setMessage("Assignment saved");
                fetchAssignments();
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    };

    const deleteAssignment = async (assignmentId) => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments/${assignmentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setMessage("Assignment deleted");
                fetchAssignments();
            } else {
                const rc = await response.json();
                setMessage("Delete failed " + rc.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    };

    const onDelete = (e) => {
        const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
        const assignmentId = assignments[row_idx].id;
        if (window.confirm('Do you really want to delete?')) {
            deleteAssignment(assignmentId);
        }
    };

    return (
        <div>
            <h4>{message}</h4>
            <table className="Center">
                <thead>
                <tr>
                    {headers.map((h, idx) => (<th key={idx}>{h}</th>))}
                </tr>
                </thead>
                <tbody>
                {assignments.map((a) => (
                    <tr key={a.id}>
                        <td>{a.id}</td>
                        <td>{a.title}</td>
                        <td>{a.dueDate}</td>
                        <td><AssignmentGrade assignment={a} save={gradeAssignment}/></td>
                        <td><Button onClick={onDelete}>DELETE</Button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssignmentsView;