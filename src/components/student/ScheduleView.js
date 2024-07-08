import React, {useState, useEffect} from 'react';
import {SERVER_URL} from '../../Constants';
import Button from '@mui/material/Button';

// student can view schedule of sections 
// use the URL /enrollment?studentId=3&year= &semester=
// The REST api returns a list of EnrollmentDTO objects
// studentId=3 will be removed in assignment 7

// to drop a course 
// issue a DELETE with URL /enrollment/{enrollmentId}

const ScheduleView = () => {
    const [schedule, setSchedule] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollment?studentId=3&year=&semester=`);
            if (response.ok) {
                const data = await response.json();
                setSchedule(data);
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    };

    const dropCourse = async (enrollmentId) => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollment/${enrollmentId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setMessage("Course dropped successfully");
                fetchSchedule(); // Refresh schedule after dropping course
            } else {
                const json = await response.json();
                setMessage("Failed to drop course: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    };

    return (
        <div>
            <h3>Schedule</h3>
            <h4>{message}</h4>
            <table className="Center">
                <thead>
                <tr>
                    <th>Year</th>
                    <th>Semester</th>
                    <th>Course ID</th>
                    <th>Section ID</th>
                    <th>Title</th>
                    <th>Credits</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {schedule.map((s) => (
                    <tr key={s.secNo}> //Todo check if this is right, not confident
                        <td>{s.year}</td>
                        <td>{s.semester}</td>
                        <td>{s.courseId}</td>
                        <td>{s.secNo}</td>
                        <td>{s.title}</td>
                        <td>{s.credits}</td>
                        <td>
                            <Button onClick={() => dropCourse(s.secNo)}>Drop Course</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScheduleView;