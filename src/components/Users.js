import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
    const apiUrl = process.env.REACT_APP_API_URL ?? 'http://localhost:3000';
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/users`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleEdit = async (userId) => {
        try {
            const response = await axios.get(`${apiUrl}/api/users/${userId}`);
            setSelectedUser(response.data);
            setEditedName(response.data.name);
            setEditedEmail(response.data.email);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const handleNameChange = (e) => {
        setEditedName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEditedEmail(e.target.value);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setShowModal(false);
        setEditedName('');
        setEditedEmail('');
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`${apiUrl}/api/users/${selectedUser._id}`, {
                name: editedName,
                email: editedEmail,
                // other fields
            });
            // Handle success, reload users or update state accordingly
            setShowModal(false);
            loadUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (confirmDelete) {
            try {
                await axios.delete(`${apiUrl}/api/users/${userId}`);
                setShowAlert(true);
                loadUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div>
            <h1>Users</h1>
            {showAlert && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    User has been deleted!
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                        onClick={() => setShowAlert(false)}
                    ></button>
                </div>
            )}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button
                                    className="btn btn-outline-primary m-2"
                                    onClick={() => handleEdit(user._id)}
                                >
                                    Edit
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDelete(user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Bootstrap Modal */}
            <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit User</h5>
                            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="editName" className="form-label">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="editName"
                                        value={editedName}
                                        onChange={handleNameChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="editEmail" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="editEmail"
                                        value={editedEmail}
                                        onChange={handleEmailChange}
                                    />
                                </div>
                                {/* Other input fields */}
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                Close
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleUpdate}>
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal backdrop */}
            {showModal && <div className="modal-backdrop fade show" onClick={handleCloseModal}></div>}
        </div>
    );
};

export default Users;
