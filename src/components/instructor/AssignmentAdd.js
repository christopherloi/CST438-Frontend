import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { SERVER_URL } from '../../Constants';

const AssignmentAdd = ({ secNo, open, handleClose }) => {
    const [assignment, setAssignment] = useState({ title: '', dueDate: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAssignment({ ...assignment, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...assignment, secNo }),
            });
            if (response.ok) {
                handleClose(true);
            } else {
                const json = await response.json();
                setError("Response error: " + json.message);
            }
        } catch (err) {
            setError("Network error: " + err.message);
        }
    };

    return (
        <Dialog open={open} onClose={() => handleClose(false)}>
            <DialogTitle>Add Assignment</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Title"
                    type="text"
                    name="title"
                    fullWidth
                    value={assignment.title}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Due Date"
                    type="date"
                    name="dueDate"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={assignment.dueDate}
                    onChange={handleChange}
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose(false)}>Cancel</Button>
                <Button onClick={handleSubmit}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignmentAdd;
