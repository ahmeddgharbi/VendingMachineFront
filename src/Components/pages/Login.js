import React, { useContext } from "react";
import NavBar from "../Others/NavBar";
import LoginForm from "../Others/LoginForm";
import './CommonStyle.css'
import { UserContext,CartContext } from "../../App";
const Login = () => {
  const [user, setUser] = useContext(UserContext);
  const [carts, setCarts] = useContext(CartContext);
  return (
    <div>
      <NavBar></NavBar>
      
      <h3 id="loginText" className="d-flex justify-content-center my-3  py-2 rounded bg-warning mx-5">
        You Are: {user && user.username}
      </h3>
      <div className="row">
        <div className="col-md-6 mt-3">
          <LoginForm></LoginForm>
        </div>
        <div className="col-md-6">
        <img
        id="loginImg"
        className=""
        src="https://image.freepik.com/free-vector/login-concept-illustration_114360-739.jpg"
        alt=""
      />
        </div>
      </div>
    </div>
  );
};

export default Login;
