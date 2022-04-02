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
          <div
            id="loginText"
            className="d-flex flex-column justify-content-center my-3  py-2 rounded bg-warning mx-5"
          >
            <h3 className="d-flex justify-content-center">There is already an active session using your account. </h3>
            <div>
            <button
                className="btn-danger rounded mt-2 d-block mx-auto"
                onClick={handleDestroyAllSession}
              >
                Terminate All Other Sessions
              </button>
            </div>
          </div>
          
        </>
      )}
    </div>
  );
};
export default SessionViewer;
