import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useLocation } from 'react-router-dom';
import { SERVER_URL } from '../../Constants';
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentGrade from './AssignmentGrade';
import AssignmentAdd from './AssignmentAdd';

const AssignmentsView = () => {
    const headers = ['ID', 'Title', 'Due Date', '', '', ''];
    const location = useLocation();
    const { secNo } = location.state;

    const [message, setMessage] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [editAssignment, setEditAssignment] = useState(null);
    const [showGradeDialog, setShowGradeDialog] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);

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

    const gradeAssignment = (assignment) => {
        setSelectedAssignment(assignment);
        setShowGradeDialog(true);
    };

    const onDelete = async (assignmentId) => {
        if (window.confirm('Do you really want to delete?')) {
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
        }
    };

    const onEdit = (assignment) => {
        setEditAssignment(assignment);
        setShowUpdateDialog(true);
    };

    const closeEditDialog = (updated) => {
        setEditAssignment(null);
        setShowUpdateDialog(false);
        if (updated) {
            fetchAssignments(); // Refresh assignments if updated
        }
    };

    const handleCloseGradeDialog = () => {
        setShowGradeDialog(false);
        setSelectedAssignment(null);
    };

    const onAdd = () => {
        setShowAddDialog(true);
    };

    const closeAddDialog = (updated) => {
        setShowAddDialog(false);
        if (updated) {
            fetchAssignments(); // Refresh assignments if a new assignment was added
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
                        <td>
                            <Button onClick={() => gradeAssignment(a)}>Grade</Button>
                        </td>
                        <td>
                            <Button onClick={() => onEdit(a)}>Edit</Button>
                        </td>
                        <td>
                            <Button onClick={() => onDelete(a.id)}>DELETE</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div>
                <Button onClick={onAdd}>ADD ASSIGNMENT</Button>
            </div>

            {editAssignment && (
                <AssignmentUpdate
                    assignment={editAssignment}
                    open={showUpdateDialog}
                    handleClose={closeEditDialog}
                />
            )}

            {showGradeDialog && selectedAssignment && (
                <AssignmentGrade
                    assignment={selectedAssignment}
                    onClose={handleCloseGradeDialog}
                />
            )}

            {showAddDialog && (
                <AssignmentAdd
                    secNo={secNo}
                    open={showAddDialog}
                    handleClose={closeAddDialog}
                />
            )}
        </div>
    );
};

export default AssignmentsView;
