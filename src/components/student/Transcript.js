import React, {useState, useEffect} from 'react';
import {SERVER_URL} from '../../Constants';

// students gets a list of all courses taken and grades
// use the URL /transcript?studentId=
// the REST api returns a list of EnrollmentDTO objects 
// the table should have columns for 
//  Year, Semester, CourseId, SectionId, Title, Credits, Grade

const Transcript = (props) => {
    const headers = ['Year', 'Semester', 'CourseId', 'SectionId', 'Title', 'Credits', 'Grade'];

    const [transcript, setTranscript] = useState([]);
    const [message, setMessage] = useState('');

    const fetchTranscript = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/transcript?studentId=3`);
            if (response.ok) {
                const data = await response.json();
                setTranscript(data);
            } else {
                const json = await response.json();
                setMessage("response error: " + json.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    }

    useEffect(() => {
        fetchTranscript();
    }, []);

    return (
        <div>
            <h3>Transcript</h3>
            <h4>{message}</h4>
            <table className="Center">
                <thead>
                <tr>
                    {headers.map((header, idx) => (<th key={idx}>{header}</th>))}
                </tr>
                </thead>
                <tbody>
                {transcript.map((t) => (
                    <tr key={t.secNo}>
                        <td>{t.year}</td>
                        <td>{t.semester}</td>
                        <td>{t.courseId}</td>
                        <td>{t.secNo}</td>
                        <td>{t.title}</td>
                        <td>{t.credits}</td>
                        <td>{t.grade}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Transcript;