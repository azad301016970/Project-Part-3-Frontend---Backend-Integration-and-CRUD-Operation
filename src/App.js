import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
import Users from './components/Users';
import UserForm from './components/UserForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const App = () => {
  const apiUrl = process.env.REACT_APP_API_URL ?? 'http://localhost:3000';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (credentials) => {
    try {
      // Replace with your actual login logic using credentials (username, password)
      const response = await axios.post(`${apiUrl}/auth/signin`, credentials);
      // console.log('response:', response);
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsLoggedIn(true);
        return <Navigate to="/users" />;
      }
      //Simulating login success by setting isLoggedIn to true and storing token in localStorage
      setIsLoggedIn(true);
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid email or password');
      return <Navigate to="/" />;
    }
  };

  const handleLogout = () => {
    // Remove token from localStorage and set isLoggedIn to false
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    return <Navigate to="/" />;
  };

  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {isLoggedIn && (
                <React.Fragment>
                  <li className="nav-item">
                    <Link className="nav-link" to="/users">Users</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/users/create">Create User</Link>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </div>
        </nav>
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              onClick={() => setError('')}
            ></button>
          </div>
        )}
        <Routes>
          {!isLoggedIn ? (
            <Route path="/" element={<SignIn handleLogin={handleLogin} />} />
          ) : (
            <React.Fragment>
              <Route path="/users" element={<Users />} />
              <Route path="/users/create" element={<UserForm />} />
            </React.Fragment>
          )}
        </Routes>
      </div>
    </Router>
  );
};


const SignIn = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin({ email, password });
      return <Navigate to="/users" />;
    } catch (error) {
      console.log('Error signing in:', error);
      setError('Invalid email or password');
      return <Navigate to="/" />;
    }
  };

  return (
    <div className="card">
      <h5 className="card-header">Sign In</h5>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="email">Username:</label>
            <input
              type="email"
              className="form-control"

              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              className="form-control"

              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="col-12 d-md-flex justify-content-md-end">
            <button type="submit" className="btn btn-success">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default App;
