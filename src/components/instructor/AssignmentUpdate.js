import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { SERVER_URL } from '../../Constants';

//  instructor updates assignment title, dueDate 
//  use an mui Dialog
//  issue PUT to URL  /assignments with updated assignment

const AssignmentUpdate = ({ assignment, open, handleClose }) => {
    const [updatedAssignment, setUpdatedAssignment] = useState({ ...assignment });

    useEffect(() => {
        setUpdatedAssignment({ ...assignment });
    }, [assignment]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedAssignment({ ...updatedAssignment, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedAssignment),
            });
            if (response.ok) {
                handleClose(true); // Close dialog on success
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
            <DialogTitle>Update Assignment</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="ID"
                    type="text"
                    name="id"
                    fullWidth
                    value={updatedAssignment.id}
                    onChange={handleChange}
                    InputProps={{ readOnly: true }}
                />
                <TextField
                    margin="dense"
                    label="Title"
                    type="text"
                    name="title"
                    fullWidth
                    value={updatedAssignment.title}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Due Date"
                    type="date"
                    name="dueDate"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={updatedAssignment.dueDate}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose(false)}>Cancel</Button>
                <Button onClick={handleSubmit}>Update</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignmentUpdate;