import React, { useEffect, useState } from 'react'
import LogoutButton from './LogoutButton'
import '../assets/styles/Assignment.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

function Assignments() {
    const [authenticated, setAuthenticated] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        subject: '',
        priority: 'high',
        date: '',
        state: 'pending'
    })

    const navigate = useNavigate();

    const createNewAssignment = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://assignment-manager-1.onrender.com/assignment/create-assignment',
                {
                    title: newAssignment.title,
                    subject: newAssignment.subject,
                    priority: newAssignment.priority,
                    date: newAssignment.date
                },
                { withCredentials: true }
            );

            if (response.status === 201) {
                // alert("Assignment created successfully!");
                setAssignments([...assignments, response.data]);
                setNewAssignment({ title: '', subject: '', priority: '', date: '' });

                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "success",
                    title: "Assignment created successfully!"
                });

            } else {
                alert("Error creating assignment");
            }
        } catch (err) {
            alert('An error occured while creating the assignment');
        }
    }

    const userLogout = async () => {
        let response = await axios.post("https://assignment-manager-1.onrender.com/user/logout", {}, { withCredentials: true });

        if (response.status === 200) {
            alert("Logging You Out!");
            setAuthenticated(false);
            navigate("/");
        } else {
            alert("error logging out!");
        }
    }

    const updateAssignmentState = async (assignmentId, newState) => {
        try {
            const response = await axios.put(`https://assignment-manager-1.onrender.com/assignment/update-state/${assignmentId}`, { state: newState }, { withCredentials: true });

            if (response.status === 200) {
                setAssignments(prevAssignments => prevAssignments.map(assignment => assignment._id === assignmentId ? { ...assignment, state: newState } : assignment));
            } else {
                alert("Error update assignment state!");
            }
        } catch (err) {
            console.log("Error in updation: ", err);
            alert("An error occured while updating assignment state");
        }
    }

    const deleteAssignment = async (assignmentId) => {
        const confirmDelete = confirm("Are you sure you want to delete this assignment?");
        if (confirmDelete) {
            try {
                const response = await axios.delete(`https://assignment-manager-1.onrender.com/assignment/${assignmentId}`, { withCredentials: true });
                if (response.status === 200) {
                    setAssignments(assignments.filter(assignment => assignment._id !== assignmentId));
                    // alert("Assignment deleted successfully");
                } else {
                    alert("Error deleting assignment");
                }
            } catch (err) {
                alert("An error occured while deleting the assignmet!");
            }
        }
    }

    useEffect(() => {
        const verifyUserAuth = async () => {
            try {
                let response = await axios.get('https://assignment-manager-1.onrender.com/user/verify-user-auth', { withCredentials: true });

                if (response.status === 200) {
                    setAuthenticated(true);

                    const userId = response.data.userId;

                    try {
                        let assignmentResponse = await axios.get(`https://assignment-manager-1.onrender.com/assignment/${userId}`, { withCredentials: true });
                        // console.log(assignmentResponse);

                        if (assignmentResponse.status === 200) {
                            setAssignments(assignmentResponse.data);
                        } else {
                            setAssignments([])
                        }
                    } catch (err) {
                        if (err.response && err.response.status === 404) {
                            setAssignments([]);
                        } else {
                            throw err;
                        }
                    }
                } else {
                    throw new Error("Unauthorized user!");
                }

            } catch (error) {
                setAuthenticated(false);
                navigate("/Login");
            }
        };

        verifyUserAuth();
    }, [navigate]); // Depend only on navigate


    if (authenticated === null) {
        return <div>Loading...</div>;
    }

    if (!authenticated) {
        return <>
            <div className='notAuth'>
                Please Login to Add and View Assignments!
            </div>
        </>
    }

    return (
        <>
            <div className="assignment-body">
                <div className="left-section">
                    <div className="create-assignment-form">
                        <h3>Create an Assignment</h3>

                        <form onSubmit={createNewAssignment}>
                            <div className="title-subject">

                                <div className="form-group">
                                    <label htmlFor="assignmentTitle">Title</label>
                                    <input type="text" placeholder='Enter assignment title' maxLength={75} required="true" className='create-assignment-input' id='assignmentTitle' value={newAssignment.title} onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="assignmentSubject">Subject</label>
                                    <input type="text" placeholder='Enter subject' required="true" className='create-assignment-input' id='assignmentSubject' value={newAssignment.subject} onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })} />
                                </div>
                            </div>

                            <div className="priority-date">

                                <div className="form-group sub-grouped">
                                    <label htmlFor="assignmentPriority">Priority</label>
                                    <select name="assignment-priority" id="assignmentPriority" value={newAssignment.priority} onChange={(e) => setNewAssignment({ ...newAssignment, priority: e.target.value })}>
                                        <option value="high" defaultChecked>High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                        <option value="none">None</option>
                                    </select>
                                </div>
                                <div className="form-group sub-grouped">
                                    <label htmlFor="assignmentDate">Date</label>
                                    <input type="date" id='assignmentDate' value={newAssignment.date} onChange={(e) => setNewAssignment({ ...newAssignment, date: e.target.value })} />
                                </div>
                            </div>


                            <button type="submit" id='assignment-submit-btn'>Create Assignment</button>
                        </form>

                        <button onClick={userLogout} id='logoutBtn'>Logout</button>
                    </div>
                </div>

                <div className="right-section">
                    <div className="your-assignments-section">
                        <h2>Your Assignments</h2>
                        <div className="straightLine"></div>

                        {assignments.length === 0 ? (
                            <div id='noAssignments'>Hurray, You've no Assignments yet :)</div>
                        ) : (
                            assignments.map((assignment) => (
                                <div className="assignment" key={assignment._id}>
                                    <div className={`stateIndicator ${assignment.state}`}></div>
                                    <h4 className="user-assignment-title">{assignment.title}</h4>
                                    <p className="user-assignment-subject">{assignment.subject}</p>
                                    <p className={`user-assignment-priority priority-${assignment.priority}`}><span>{assignment.priority}</span></p>
                                    <p className="user-assignment-date">
                                        Due: <span>{new Date(assignment.date).toLocaleDateString('en-GB', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                        })}</span>
                                    </p>

                                    <button onClick={() => deleteAssignment(assignment._id)} id='deleteBtn'>Delete</button>

                                    <div className="states">
                                        <button className={`state-management-button ${assignment.state === 'done' ? 'active' : ''}`} onClick={() => updateAssignmentState(assignment._id, 'done')} id='done-state-btn'>Done</button>

                                        <button className={`state-management-button ${assignment.state === 'doing' ? 'active' : ''}`} onClick={() => updateAssignmentState(assignment._id, 'doing')} id='doing-state-btn'>Doing</button>

                                        <button className={`state-management-button ${assignment.state === 'pending' ? 'active' : ''}`} onClick={() => updateAssignmentState(assignment._id, 'pending')} id='pending-state-btn'>Pending</button>
                                    </div>

                                    {/* <button onClick={() => deleteAssignment(assignment._id)} id='deleteBtn'>Delete</button> */}
                                </div>
                            ))
                        )}

                    </div>
                </div>

                <div className="footer">

                </div>
            </div>
        </>
    )
}

export default Assignments
