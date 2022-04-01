import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext, ProductContext } from "../../App";
import NavBar from "../Others/NavBar";
import Table from "react-bootstrap/Table";
const Cart = () => {
  const [user, setUser] = useContext(UserContext);
  const [products, setProducts] = useContext(ProductContext);

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
            localStorage.removeItem("session");
            console.log('session destroyed')
          }
        });
    }
  }, []);

  useEffect(() => {
    if (session.key) {
      setUser(session.user);
    }
  }, [session]);

  const handleOnBuy = (e) => {
    let toDecrease = 0;
    console.log(user.cart);
    user.cart.map((it) => {
      handleBuy(it._id);
      toDecrease = toDecrease + it.cost;
      console.log(toDecrease);
    });
    //Updating Deposit for User
    const requestOptions1 = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deposit: parseInt(user.deposit) - parseInt(toDecrease),
      }),
    };
    fetch(
      `http://localhost:3005/api/users/updateDeposit/${user._id}`,
      requestOptions1
    )
      .then((response) => response.json())
      .then((data) => setUser(data));
    //Clearing Cart For the User
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    };
    fetch(
      `http://localhost:3005/api/users/emptyCart/${user._id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => setUser(data));

    user.cart = [];
  };
  //Decreasing Product Amount
  const handleBuy = (pid) => {
    let allP = [...products];
    console.log(allP);
    const objIndex = allP.findIndex((o) => o._id === pid);
    console.log(objIndex);
    allP[objIndex].amountAvailable = allP[objIndex].amountAvailable - 1;

    setProducts(allP);
    const requestOptions2 = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amountAvailable: parseInt(allP[objIndex].amountAvailable),
      }),
    };

    fetch(
      `http://localhost:3005/api/products/updateQuantity/${pid}`,
      requestOptions2
    )
      .then((response) => response.json())
      .then((data) => setProducts(allP));
  };

  return (
    <div>
      <NavBar></NavBar>
      {user.username ? (
        <div id="cartBox" className="mx-4 px-5 my-4">
          <h1 className=" mt-3">Cart</h1>
          <Table id="productTable" striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Cost</th>
                <th>Available</th>
                <th>Seller Id</th>
              </tr>
            </thead>
            <tbody>
              {user.cart &&
                user.cart.map((pd) => (
                  <tr id={"x" + pd._id} key={Math.random() + Date.now()}>
                    <td>{pd.productName}</td>
                    <td>{pd.cost}</td>
                    <td>{pd.amountAvailable}</td>
                    <td>{pd.sellerId}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <ul>
            {user.cart &&
              user.cart.map((o) => (
                <li key={Math.random() + Date.now()} className="cartList"></li>
              ))}
          </ul>
          <button
            onClick={(e) => handleOnBuy(e)}
            className="btn-success rounded mb-4"
          >
            Confirm Buy
          </button>
        </div>
      ) : (
        <div>
          <h1>Please Login to see your cart</h1>
        </div>
      )}
    </div>
  );
};

export default Cart;
