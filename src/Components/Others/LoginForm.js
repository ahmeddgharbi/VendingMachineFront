import React, { useContext, useEffect } from "react";

import { Form } from "react-bootstrap";

import { useState } from "react";

import { UserContext } from "../../App";


const LoginForm = () => {
  // The user state
  const [user, setUser] = useContext(UserContext);

  const [session, setSession] = useState({});

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      window.location.href = "/home";
    }
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("session", JSON.stringify(session));
    console.log(session);
  }, [session]);

  //Login function-----------------------------------------------------
  const loginUpdate =async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    };
    const response = await fetch(
      "http://localhost:3005/api/users/login",
      requestOptions
    );
    const data = await response.json();
    if (data.message === "Invalid Credentials") {
      alert("Invalid Credentials");
    } else {
      console.log(data);
      setUser(data.user);
      
      setSession({ user: data.user, key: data.session_key });
      setIsLoggedIn(true);
      
      document.getElementById("loginForm").style.display = "none";
      document.getElementById("loginImg").style.display = "none";

    }
  };
  //Check Login-----------------------------------------------------

  const checkLogin = async (email, password) => {
    
  };

  return (
    <div id="loginForm" className="mx-5">
      <h3>Login Form {user && user.username}</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control id="email" type="text" placeholder="name@example.com" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" id="password" placeholder="password" />
        </Form.Group>
        <Form.Group className="mb-3 ">
          <button
            onClick={(e) => loginUpdate(e)}
            className="btn-success px-3 py-1 rounded"
          >
            Submit
          </button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default LoginForm;
