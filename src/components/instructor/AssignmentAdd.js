import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { SERVER_URL } from '../../Constants';

// complete the code.  
// instructor adds an assignment to a section
// use mui Dialog with assignment fields Title and DueDate
// issue a POST using URL /assignments to add the assignment

const AssignmentAdd = ({ secNo, open, handleClose }) => {
    const [assignment, setAssignment] = useState({ title: '', dueDate: '' });

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
                console.error("response error: " + json.message);
            }
        } catch (err) {
            console.error("network error: " + err);
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
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose(false)}>Cancel</Button>
                <Button onClick={handleSubmit}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignmentAdd;