import React from "react";
import { useState } from "react";
import { Form } from "react-bootstrap";

const RegistrationForm = () => {



  const [usr, setUsr] = useState({});

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    const newUser = {
      username: username,
      email: email,
      password: password,
      role: role,
    };
    setUsr(newUser);
    
    const requestOptions ={
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
    }
    const response = await fetch('http://localhost:3005/api/users/add', requestOptions);
    const data = await response.json();
    if(data.message === "User already exists"){
        alert("User already exists");
    }
    else{
        document.getElementById('registrationForm').style.display = "none";
        document.getElementById('registrationText').innerHTML = "Registration Successful, Now Login to continue";
    }

  };
  return (
    <div  className="mx-5">
      <h3 id="registrationText">Registration Form</h3>
      <Form id="registrationForm">
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            id="username"
            type="text"
            placeholder="name@example.com"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control id="email" type="text" placeholder="name@example.com" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="text" id="password" placeholder="password" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Select Your Role</Form.Label>
          <Form.Select id="role" aria-label="Default select example">
            <option value="seller">Seller</option>
            <option value="buyer">Buyer</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3 ">
          <button
            onClick={(e) => handleOnSubmit(e)}
            className="btn-success px-3 py-1 rounded"
          >
            Submit
          </button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default RegistrationForm;
