import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import React, {useState, useEffect} from 'react';
import {SERVER_URL} from '../../Constants';
import { useLocation } from 'react-router-dom';
import {Link} from 'react-router-dom';

// instructor views a list of sections they are teaching 
// use the URL /sections?email=dwisneski@csumb.edu&year= &semester=
// the email= will be removed in assignment 7 login security
// The REST api returns a list of SectionDTO objects
// The table of sections contains columns
//   section no, course id, section id, building, room, times and links to assignments and enrollments
// hint:  
// <Link to="/enrollments" state={section}>View Enrollments</Link>
// <Link to="/assignments" state={section}>View Assignments</Link>

const InstructorSectionsView = () => {
    const headers = ['Section Number', 'Course ID', 'Section ID', 'Building', 'Room', 'Times', '', ''];
    const location = useLocation();
    const { year, semester } = location.state;

    const [message, setMessage] = useState('');
    const [sections, setSections] = useState([]);

    const fetchSections = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sections?email=dwisneski@csumb.edu&year=${year}&semester=${semester}`);
            if (response.ok) {
                const data = await response.json();
                setSections(data);
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    };

    useEffect(() => {
        fetchSections();
    }, [year, semester]);

    return (
        <div>
            <h4>{message}</h4>
            <h3>Sections {year} {semester}</h3>
            <table className="Center">
                <thead>
                <tr>
                    {headers.map((h, idx) => (<th key={idx}>{h}</th>))}
                </tr>
                </thead>
                <tbody>
                {sections.map((s) => (
                    <tr key={s.secNo}>
                        <td>{s.secNo}</td>
                        <td>{s.courseId}</td>
                        <td>{s.secId}</td>
                        <td>{s.building}</td>
                        <td>{s.room}</td>
                        <td>{s.times}</td>
                        <td><Link to='/enrollments' state={{ secNo: s.secNo }}>Enrollments</Link></td>
                        <td><Link to='/assignments' state={{ secNo: s.secNo }}>Assignments</Link></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default InstructorSectionsView;