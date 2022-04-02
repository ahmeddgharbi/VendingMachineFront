import React, { useContext } from "react";
import { Link } from "react-router-dom"; //React Router
import Button from "react-bootstrap/Button"; //Bootstrap
import { UserContext } from "../../App";
const NavBar = () => {
  const [user, setUser] = useContext(UserContext);
  return (
    <div className="d-flex justify-content-center pt-5">
      
      <nav className="">
        <Link to="/">
          <Button className=" m-2">To Home</Button>
        </Link>
        {(user?.username) && (
          <>
            <Link to="/dashboard">
              <Button className="bt m-2">To Dashboard</Button>
            </Link>
          </>
        )}
                {(user?.username) && (
          <>
            <Link to="/cart">
              <Button className="bt m-2">Cart {user.cart?.length}</Button>
            </Link>
          </>
        )}
        {
          (!user?.username) && (
            <Link to="/login">
          <Button className="bt-success m-2">Login</Button>
        </Link>
          )
        }
        <Link id="registrationNav" to="/register">
          <Button className="bt-success m-2">Register</Button>
        </Link>
      </nav>
    </div>
  );
};

export default NavBar;
