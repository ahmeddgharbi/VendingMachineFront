import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../App";
const SessionViewer = () => {
  const [user, setUser] = useContext(UserContext);

  const [session, setSession] = useState({});

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session"));
    console.log(session);
    if (session?.key) {
      setSession(session);
    }
  }, []);

  function handleDestroyAllSession() {
    console.log("logout");
    const session = JSON.parse(localStorage.getItem("session"));
    console.log(session);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.user.email, session: session.key }),
    };
    fetch(`http://localhost:3005/api/users/logout/all`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Logged out of all sessions") {
          console.log("session destroyed 222");
          setSession({...session, user: data.user});          
        }
      });
      
  }

  return (
    <div>
      {session.user?.sessions.length > 1 && (
        <>
          <h3
            id="loginText"
            className="d-flex justify-content-center my-3  py-2 rounded bg-warning mx-5"
          >
            Current Session Token: {session.key}
          </h3>
          <ul className="my-0 py-2 bg-info mx-5">
            <div>Other session tokens:</div>
            {session.user?.sessions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
            <div className="mt-2">
              <button
                className="btn-danger rounded mt-2"
                onClick={handleDestroyAllSession}
              >
                Log Out All Sessions
              </button>
            </div>
          </ul>
        </>
      )}
    </div>
  );
};
export default SessionViewer;
