import React, {useState, useEffect} from 'react';
import {SERVER_URL} from '../../Constants';

const Transcript = (props) => {

    const [message, setMessage] = useState('');
    const [courses, setCourses] = useState([]);

   // removed hardcoded studentId=3 after login security implemented

    const fetchData = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/transcripts?studentId=3`);
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error "+err);
        }
    }

    useEffect( () => {
        fetchData();
    }, []);

    const headers=['Year', 'Semester', 'CourseId', 'Section', 'Title', 'Credits', 'Grade'];
     
    return(
        <> 
            <h3>Transcript</h3>   
            <h4>{message}</h4>      
            {(courses.length > 0) ? (<p>Student id : {courses[0].studentId} <br/>  Student name : {courses[0].name} </p> ) : '' }
            <table className="Center" > 
                <thead>
                    <tr>
                        {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                    </tr>
                </thead>
                <tbody>
                    {courses.map((c) => (
                            <tr key={c.enrollmentId}>
                            <td>{c.year}</td>
                            <td>{c.semester}</td>
                            <td>{c.courseId}</td>
                            <td>{c.sectionId}</td>
                            <td>{c.title}</td>
                            <td>{c.credits}</td>
                            <td>{c.grade}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </>
    );
}

export default Transcript;