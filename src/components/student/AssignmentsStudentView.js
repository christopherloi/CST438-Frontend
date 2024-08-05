import React, {useState} from 'react';
import {SERVER_URL} from '../../Constants';

const AssignmentsStudentView = (props) => {
     
    const [message, setMessage] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [term, setTerm ] = useState({year:'', semester:'' });

   // removed hardcoded studentId=3 after login security implemented

    const fetchData = async () => {
        sessionStorage.setItem('term', JSON.stringify(term));
        try {
            const response = await fetch(`${SERVER_URL}/assignments?studentId=3&year=${term.year}&semester=${term.semester}`);
            if (response.ok) {
                const data = await response.json();
                setAssignments(data);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    const editChange = (event) => {
        setTerm({...term, [event.target.name]:event.target.value});
    }


    const headers=['Course', 'Title', 'DueDate', 'Score'];
     
    return(
        <> 
            <h3>Assignments</h3>   
            <h4>{message}</h4>  

            <table className="Center">
                <tbody>
                    <tr>
                        <td>Year:</td>
                        <td><input type="text" id="year" name="year" value={term.year} onChange={editChange} /></td>
                    </tr>
                    <tr>
                        <td>Semester:</td>
                        <td><input type="text" id="semester" name="semester" value={term.semester} onChange={editChange} /></td>
                    </tr>
                </tbody>
            </table>
            <br/>
            <button type="submit" onClick={fetchData} >Get Assignments</button>
            <br/>
            <br/>
            <table className="Center" > 
                <thead>
                    <tr>
                        {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((c) => (
                            <tr key={c.assignmentId}>
                            <td>{c.courseId+'-'+c.sectionId}</td>
                            <td>{c.title}</td>
                            <td>{c.dueDate}</td>
                            <td>{c.score}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </>
    );
}

export default AssignmentsStudentView;