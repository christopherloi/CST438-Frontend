import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import React, {useState} from 'react';
import {SERVER_URL} from '../../Constants';

// student views a list of assignments and assignment grades 
// use the URL  /assignments?studentId= &year= &semester=
// The REST api returns a list of SectionDTO objects
// Use a value of studentId=3 for now. Until login is implemented in assignment 7.

// display a table with columns  Course Id, Assignment Title, Assignment DueDate, Score

const AssignmentsStudentView = (props) => {

    const headers = ['Course Id', 'Title', 'Due Date', 'Score'];

    const [message, setMessage] = useState('');
    const [search, setSearch] = useState({year:'', semester:''});
    const [assignments, setAssignments] = useState([]);

    const editChange = (event) => {
        setSearch({...search,  [event.target.name]:event.target.value})
    }
    
    const fetchAssignments = async () => {
        if (search.year==='' || search.semester==='' ) {
            setMessage("Enter search parameters");
        } else {
          try {
            const response = await fetch(`${SERVER_URL}/assignments?studentId=3&year=${search.year}&semester=${search.semester}`);
          if (response.ok) {
            const data = await response.json();
            setAssignments(data);
          } else {
            const json = await response.json();
            setMessage("response error: "+json.message);
          }
        } catch (err) {
          setMessage("network error: "+err);
            }  
        }
    }

    return(
        <div> 
            <h4>{message}</h4>
            <table className="Center" > 
                <tbody>
                    <tr>
                        <td>Year:</td>
                        <td><input type="text" id="ayear" name="year" value={search.year} onChange={editChange} /></td>
                    </tr>
                    <tr>
                        <td>Semester:</td>
                        <td><input type="text" id="asemester" name="semester" value={search.semester} onChange={editChange} /></td>
                    </tr>
                </tbody>
            </table>
            <br/>
            <button type="submit" id="search" onClick={fetchAssignments} >Get Assignments</button>
            <br/>
            <br/>
            <table className="Center" > 
                <thead>
                <tr>
                    {headers.map((h, idx) => (<th key={idx}>{h}</th>))}
                </tr>
                </thead>
                <tbody>
                {assignments.map((a) => (
                        <tr key={a.id}>
                        <td>{a.courseId}</td>
                        <td>{a.title}</td>
                        <td>{a.dueDate}</td>
                        <td>{a.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AssignmentsStudentView;