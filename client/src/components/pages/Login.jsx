import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

// The functional component is defined using an arrow function.
//Prop Types and Default Props: Since this is a functional component, prop types and default props are not needed.
const Login = () => {
  //Hooks: The useState hook is used to manage the component's state (email, password, and message). The useNavigate hook from React Router is used for navigation.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    // Destructuring: The event.target.name and event.target.value are destructured in the handleInputChange function for cleaner code.
    const { name, value } = event.target;
    name === 'email' ? setEmail(value) : setPassword(value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await api.login(email, password);
      navigate('/profile');
    } catch (err) {
      setErrorMessage(err.toString());
    }
  };

  return (
    <div className="Login">
      <div className="container">
        <h2>Login</h2>
        <Form>
          <FormGroup>
            <Label for="email">E-mail</Label>
            <Input type="text" value={email} name="email" onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" value={password} name="password" onChange={handleInputChange} />
          </FormGroup>
          <Button tag="a" onClick={handleClick} className="btn-yellow-fill">
            Login
          </Button>
        </Form>
        <p>
          Don't have an account yet?{' '}
          <a href="/signup">
            <span className="badge badge-warning">Signup</span>
          </a>
        </p>
        {errorMessage && (
          <div className="info info-danger">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;