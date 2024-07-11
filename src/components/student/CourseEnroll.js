import React, {useState, useEffect} from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Button from '@mui/material/Button';
import {SERVER_URL} from '../../Constants';

const CourseEnroll = (props) => {
     
    // student adds a course to their schedule

    const [sections, setSections] = useState([]);
    const [message, setMessage] = useState('');

    const fetchSections = async () => {
        // get list of open sections for enrollment
        try {
            const response = await fetch(`${SERVER_URL}/sections/open`);
            if (response.ok) {
                const data = await response.json();
                setSections(data);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error "+err);
        }
    }

    useEffect( () => {
        fetchSections();
    }, []);

    const addSection = async (secNo) => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollments/sections/${secNo}?studentId=3`,
                {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    }, 
                })
            if (response.ok) {
                const data = await response.json();
                setMessage("section added. enrollment id=" + data.enrollmentId);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error "+err);
        }

    }
    
    const onAdd = (e) => {
        const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
        const secNo = sections[row_idx].secNo;
        confirmAlert({
            title: 'Confirm to add',
            message: 'Do you really want to add?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => addSection(secNo)
              },
              {
                label: 'No',
              }
            ]
          });
    }

    const headers = ['section No', 'year', 'semster', 'course Id', 'section', 'title', 'building', 'room', 'times', 'instructor', ''];

    return(
        <div>
            <h4>{message}</h4>
            <h3>Open Sections Available for Enrollment</h3>
            <table className="Center">
                <thead>
                    <tr>
                        {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                    </tr>
                </thead>
                <tbody>
                    {sections.map((s) => (
                            <tr key={s.secNo}>
                                <td>{s.secNo}</td>
                                <td>{s.year}</td>
                                <td>{s.courseId}</td>
                                <td>{s.secId}</td>
                                <td>{s.title}</td>
                                <td>{s.building}</td>
                                <td>{s.room}</td>
                                <td>{s.times}</td>
                                <td>{s.instructorName}</td>
                                <td><Button onClick={onAdd}>Add Course</Button></td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default CourseEnroll;