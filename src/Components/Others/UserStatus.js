import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import "./OthersCommon.css";
const UserStatus = () => {
  const [user, setUser] = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

    useEffect(() => {
        if (!isLoggedIn) {
            window.location.href = '/login';
        }
    }, [isLoggedIn]);

  function handleLogout() {
    console.log("logout");
    const session = JSON.parse(localStorage.getItem("session"));
    console.log(session);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.user.email, session: session.key }),
    };
    fetch(`http://localhost:3005/api/users/logout`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Logged out") {
            console.log('session destroyed 222')
          localStorage.removeItem("session");
          setIsLoggedIn(false);
        }
      });
  }

  return (
    <div>
      <ul id="statusBar" className="d-flex justify-content-center ">
        <li className="liIt">Username: {user && user.username}</li>
        <li className="liIt">Role: {user && user.role} </li>
        <li className="liIt">Deposit: {user && user.deposit} </li>
        <li style={{ listStyle: "none", fontSize: "18px" }}>
          <button onClick={handleLogout} className="btn-danger rounded mt-2">
            Log Out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserStatus;
