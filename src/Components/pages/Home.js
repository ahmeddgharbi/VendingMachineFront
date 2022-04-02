import React, { useContext, useEffect, useState } from "react";
import { ProductContext, UserContext } from "../../App";
import NavBar from "../Others/NavBar";
import UserStatus from "../Others/UserStatus";
import "./CommonStyle.css";

const Home = () => {
  const [products, setProducts] = useContext(ProductContext);
  const [user, setUser] = useContext(UserContext);
  
  const [session, setSession] = useState({});

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session"));
    console.log(session);
    if (session?.key) {
      setSession(session);
      fetch(
        `http://localhost:3005/api/users/verify-session/${session.key}/${session.user.email}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (!data.forceLogout) {
            setSession({ ...session, user: data.user });
          }
          else {
            setSession({});
            console.log('session destroyed')
          }
        });
    }
    fetch("http://localhost:3005/api/products/all")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    if (session.key) {
      setUser(session.user);
    }
  }, [session]);

  const handleOnToCart = (e, pid) => {
    e.preventDefault();
    if (!session?.key) {
      alert("Please Login First");
    }
    const thePd = products.find((pd) => pd._id === pid);
    let totalPrice = 0;
    user.cart.map((it) => {
      totalPrice = totalPrice + it.cost;
    });
    console.log(totalPrice + thePd.cost, "asd", user.deposit);
    if (user.username) {
      if (user.role === "seller") {
        alert("Please Login With an Buyer ID");
      } else if (user.role === "buyer") {
        if (thePd.amountAvailable <= 0) {
          alert("Out of Stock");
        } else if (totalPrice + thePd.cost > user.deposit) {
          alert("Insufficient Balance");
        } else {
          console.log("on click");
          e.preventDefault();
          const requestOptions = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pid: pid,
            }),
          };
          fetch(
            `http://localhost:3005/api/users/addToCart/${user._id}`,
            requestOptions
          )
            .then((response) => response.json())
            .then((data) => {
              setUser(data);
              console.log("Element added to cart");
            });
        }
      }
    } else {
      alert("Please Login First");
    }
  };

  return (
    <div>
      <NavBar></NavBar>
      {user?.username && <UserStatus />}

      <div className="container">
        {products?<div className="row d-flex justify-content-center">
          {products.map((pd) => (
            <div
              key={Math.random() + Date.now()}
              className="col-md-6 col-lg-3 py-3 product "
            >
              {}
              <h3 className="d-flex justify-content-center align-items-center">
                {pd.productName}
              </h3>
              <h4 className="d-flex justify-content-center align-items-center">
                Cost: {pd.cost}
              </h4>
              <h4 className="d-flex justify-content-center align-items-center">
                Available:{pd.amountAvailable}
              </h4>
              {/* <h4  className="d-flex justify-content-center align-items-center">SID: {pd.sellerId}</h4> */}
              <h6 className="d-flex justify-content-center align-items-center">
                <button
                  onClick={(e) => handleOnToCart(e, pd._id)}
                  value={pd.cost}
                  className="btn-success rounded px-2 py-1"
                >
                  Add To Cart
                </button>
              </h6>
            </div>
          ))}
        </div> : <div className="d-flex justify-content-center">
          <img src="https://cdn.dribbble.com/users/1186261/screenshots/3718681/_______.gif"/>
        </div>}
          
      </div>
    </div>
  );
};

export default Home;
