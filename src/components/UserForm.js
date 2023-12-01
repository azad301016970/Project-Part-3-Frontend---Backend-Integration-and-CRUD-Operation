import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const UserForm = () => {
   const apiUrl = process.env.REACT_APP_API_URL?? 'http://localhost:3000';
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [successMessage, setSuccessMessage] = useState('');
   const [errorMessage, setErrorMessage] = useState('');

   useEffect(() => {
      if (successMessage || errorMessage) {
         const timer = setTimeout(() => {
            setSuccessMessage('');
            setErrorMessage('');
         }, 5000);

         return () => clearTimeout(timer);
      }
   }, [successMessage, errorMessage]);


   const onSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.post(`${apiUrl}/api/users`, {
            name,
            email,
            password,
         });

         // If successful, display success message, clear fields, and handle redirection
         setSuccessMessage('User created successfully!');
         console.log('User created:', response.data);

         setName('');
         setEmail('');
         setPassword('');
         setErrorMessage(''); // Clear any previous error messages

         // Redirect to user list or perform other actions upon successful submission
      } catch (error) {
         // Handle errors if the request fails
         console.error('Error creating user:', error);
         setErrorMessage('Operation Unsuccessful!');
         setSuccessMessage(''); // Clear any previous success messages
      }
   };


   const handleNameChange = (e) => {
      setName(e.target.value);
   };

   const handleEmailChange = (e) => {
      setEmail(e.target.value);
   };
   const handlePasswordChange = (e) => {
      setPassword(e.target.value);
   };

   return (
      <form className="row g-3 mt-4" onSubmit={onSubmit}>
         <h3>Create a User</h3>
         {successMessage && (
            <div className="alert alert-success" role="alert">
               {successMessage}
            </div>
         )}
         {errorMessage && (
            <div className="alert alert-danger" role="alert">
               {errorMessage}
            </div>
         )}
         <div className="col-md-12">
            <label htmlFor="name" className="form-label">
               Name
            </label>
            <input
               type="text"
               className="form-control"
               id="name"
               value={name}
               onChange={handleNameChange}
            />
         </div>
         <div className="col-md-6">
            <label htmlFor="inputEmail4" className="form-label">
               Email
            </label>
            <input
               type="email"
               className="form-control"
               id="inputEmail4"
               value={email}
               onChange={handleEmailChange}
            />
         </div>

         <div className="col-md-6">
            <label htmlFor="inputPassword4" className="form-label">
               Password
            </label>
            <input
               type="password"
               className="form-control"
               id="inputPassword4"
               value={password}
               onChange={handlePasswordChange}
            />
         </div>
         {/* Other input fields */}

         <div className="col-12 d-md-flex justify-content-md-end">
            <button type="submit" className="btn btn-success">
               Submit
            </button>
         </div>
      </form>
   );
};

export default UserForm;
