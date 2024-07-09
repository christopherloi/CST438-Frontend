import React, {useState, useEffect} from 'react';
import {SERVER_URL} from '../../Constants';
import Button from '@mui/material/Button';

// students displays a list of open sections for a 
// use the URL /sections/open
// the REST api returns a list of SectionDTO objects

// the student can select a section and enroll
// issue a POST with the URL /enrollments/sections/{secNo}?studentId=3
// studentId=3 will be removed in assignment 7.

const CourseEnroll = (props) => {
     
    const headers = ['Section No', 'Year', 'Semester',  'Course Id', 'Title', 'Section', 'Building', 'Room', 'Times', 'Instructor', 'Instructor Email', ''];

    const [sections, setSections] = useState([  ]);
    const [enrollments, setEnrollments] = useState([  ]);
    const [message, setMessage] = useState('');

    const fetchOpenSections = async () => {
        try {
          const response = await fetch(`${SERVER_URL}/sections/open`);
          if (response.ok) {
            const data = await response.json();
            setSections(data);
          } else {
            const json = await response.json();
            setMessage("response error: "+json.message);
          }
        } catch (err) {
          setMessage("network error: "+err);
        }  
      }

    useEffect( () => {
      fetchOpenSections();
    }, []);

    const onEnroll = async (secNo) => {
      try {
        const response = await fetch(`${SERVER_URL}/enrollments/sections/${secNo}?studentId=3`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(secNo),
          });
        if (response.ok) {
          setMessage("Enrolled in course")
          fetchOpenSections();
        } else {
          const rc = await response.json();
          setMessage(rc.message);
        }
      } catch (err) {
        setMessage("network error: "+err);
      }   
    }
 
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
                          <td><Button onClick={() => onEnroll(s.secNo)}>ADD COURSE</Button></td>
                          </tr>
                      ))}
                </tbody>
            </table>
        </>
    );
}

export default CourseEnroll;
