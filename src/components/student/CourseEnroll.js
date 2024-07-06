import React, {useState, useEffect} from 'react';

// students displays a list of open sections for a 
// use the URL /sections/open
// the REST api returns a list of SectionDTO objects

// the student can select a section and enroll
// issue a POST with the URL /enrollments/sections/{secNo}?studentId=3
// studentId=3 will be removed in assignment 7.

const CourseEnroll = (props) => {
     
    const headers = ['Section No', 'Year', 'Semester',  'Course Id', 'Section', 'Title', 'Building', 'Room', 'Times', 'Instructor', ''];

    const [sections, setSections] = useState([  ]);

    const [message, setMessage] = useState('');

    const fetchEnrollments = async () => {
        try {
          const response = await fetch(`${SERVER_URL}/sections/open`);
          if (response.ok) {
            const data = await response.json();
            setSection(data);
          } else {
            const json = await response.json();
            setMessage("response error: "+json.message);
          }
        } catch (err) {
          setMessage("network error: "+err);
        }  
      }

    useEffect( () => {
    fetchUsers();
    }, []);
 
    return(
        <>
           <h3>Open Sections Available for Enrollment</h3>   
            <h4>{message}</h4>     
            <table className="Center" > 
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
                          <td>{s.semester}</td>
                          <td>{s.courseId}</td>
                          <td>{s.title}</td>
                          <td>{s.secId}</td>
                          <td>{s.building}</td>
                          <td>{s.room}</td>
                          <td>{s.times}</td>
                          <td>{s.instructorName}</td>
                          <td>{s.instructorEmail}</td>
                          <td><UserUpdate user={user} save={saveUser} /></td>
                          <td><Button onClick={onDelete}>Delete</Button></td>
                          </tr>
                      ))}
                </tbody>
            </table>
            <UserAdd save={addUser} />
        </>
    );
}

export default CourseEnroll;
