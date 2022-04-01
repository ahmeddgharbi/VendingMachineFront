import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { ProductContext } from "../../App";
import NavBar from "../Others/NavBar";
import UserStatus from "../Others/UserStatus";
import UpdateProduct from "./UpdateProduct";
import { Form, Table } from "react-bootstrap";
import "./CommonStyle.css";
import SessionViewer from "../Others/SessionViewer";

const Dashboard = () => {
  const [formName, setFormName] = useState("addProduct");
  const [user, setUser] = useContext(UserContext);
  const [products, setProducts] = useContext(ProductContext);
  const [toUpdate, setToUpdate] = useState("");

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
          } else {
            setSession({});
            console.log("session destroyed");
          }
        });
    }
  }, []);

  useEffect(() => {
    if (session.key) {
      setUser(session.user);
    }
    console.log(session, "sdflksdfd");
    localStorage.setItem("session", JSON.stringify(session));
  }, [session]);

  const handleOnDeposit = (e) => {
    e.preventDefault();
    const toDeposit = document.getElementById("deposit").value;
    console.log(toDeposit);
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deposit: parseInt(user.deposit) + parseInt(toDeposit),
      }),
    };
    console.log(user._id);
    fetch(
      `http://localhost:3005/api/users/updateDeposit/${user._id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUser(data);
      });
  };
  const handleResetDeposit = (e) => {
    e.preventDefault();
    const toDeposit = document.getElementById("deposit").value;
    console.log(toDeposit);
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deposit: 0,
      }),
    };
    console.log(user._id);
    fetch(
      `http://localhost:3005/api/users/updateDeposit/${user._id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUser(data);
      });
    alert("Deposit Reset Successfully");
  };

  const handleOnAddProduct = async (e) => {
    e.preventDefault();
    const name = document.getElementById("pname").value;
    const cost = document.getElementById("pcost").value;
    const amount = document.getElementById("pamount").value;
    const newProduct = {
      productName: name,
      cost: cost,
      amountAvailable: amount,
      sellerId: user._id,
      sellerName: user.username,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    };
    const response = await fetch(
      "http://localhost:3005/api/products/add",
      requestOptions
    );
    const data = await response.json();
    if (data) alert("Product Added");
    const prd = [...products];
    prd.push(newProduct);
    setProducts(prd);
  };
  const handleOnUpdateClick = (e) => {
    e.preventDefault();
    const productId = e.target.value;
    setToUpdate(productId);
    document.getElementById("productTable").style.display = "none";
    document.getElementById("updateProductForm").style.display = "block";
  };
  const handleOnDeleteClick = (e) => {
    e.preventDefault();
    const productId = e.target.value;
    fetch(`http://localhost:3005/api/products/delete/${productId}`, {
      method: "DELETE",
    }).then(() => alert("Deleted Successfully"));
    //document.getElementById(`x${productId}`).style.display = 'none';
    const prd = [...products];
    prd.splice(
      prd.findIndex((a) => a._id === productId),
      1
    );
    setProducts(prd);
  };
  const handleDisplay = (e) => {
    e.preventDefault();
    setFormName("manageProducts");
    document.getElementById("productTable").style.display = "block";
    document.getElementById("updateProductForm").style.display = "none";
  };
  return (
    <div>
      <NavBar></NavBar>
      <UserStatus />
      <div className="container">
        <SessionViewer />
      </div>
      {user.role === "seller" && (
        <div className="row">
          <h3 className="mx-5">Seller Dashboard</h3>
          <div className="col-md-3">
            <ul className="">
              <li className="liSt">
                <button
                  onClick={() => setFormName("addProduct")}
                  className="dList"
                >
                  Add Product
                </button>
              </li>

              <li className="liSt">
                <button onClick={(e) => handleDisplay(e)} className="dList">
                  Manage Products
                </button>
              </li>
            </ul>
          </div>
          <div className="col-md-8">
            {formName === "addProduct" && (
              <div>
                <h3>Add Product</h3>
                <Form id="registrationForm">
                  <Form.Group className="mb-3">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      id="pname"
                      type="text"
                      placeholder="Pencil Box"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Product Cost</Form.Label>
                    <Form.Control type="text" id="pcost" placeholder="10" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Available Amount</Form.Label>
                    <Form.Control type="text" id="pamount" placeholder="10" />
                  </Form.Group>
                  <Form.Group className="mb-3 ">
                    <button
                      onClick={(e) => handleOnAddProduct(e)}
                      className="btn-success px-3 py-1 rounded"
                    >
                      Submit
                    </button>
                  </Form.Group>
                </Form>
              </div>
            )}
            {formName === "updateProduct" && <h1>Update Product</h1>}
            {formName === "manageProducts" && (
              <div>
                <Table id="productTable" striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Cost</th>
                      <th>Available</th>
                      <th>Seller Id</th>
                      <th>Username</th>
                      <th>Update/Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((pd) => (
                      <tr id={"x" + pd._id} key={Math.random() + Date.now()}>
                        <td>{pd.productName}</td>
                        <td>{pd.cost}</td>
                        <td>{pd.amountAvailable}</td>
                        <td>{pd.sellerId}</td>
                        <td>{pd.sellerName}</td>
                        {user._id === pd.sellerId && (
                          <td>
                            <button
                              onClick={(e) => handleOnUpdateClick(e)}
                              value={pd._id}
                              className="mx-2 btn-warning rounded"
                            >
                              Update
                            </button>
                            <button
                              onClick={(e) => handleOnDeleteClick(e)}
                              value={pd._id}
                              className="mx-2 btn-danger rounded"
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div id="updateProductForm" display="block">
                  <UpdateProduct productId={toUpdate}></UpdateProduct>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {user.role === "buyer" && (
        <div className="row">
          <h3 className="mx-5">Buyer Dashboard</h3>
          <div className="col-md-3">
            <ul className="">
              <li className="liSt">
                <button className="dList">Deposit Money</button>
              </li>
            </ul>
          </div>
          <div className="col-md-9">
            <div>
              <h3> Deposit Money</h3>
              <div className="row">
                <div className="col-md-6">
                  <img
                    id="centsImage"
                    className=""
                    src="https://gallery.yopriceville.com/var/albums/Free-Clipart-Pictures/Money.PNG/Transparent_Cents_PNG_Clipart.png?m=1434276666"
                    alt=""
                  />
                </div>
                <div className="col-md-6">
                  <Form id="depositeForm">
                    <Form.Group className="mb-3">
                      <Form.Label>Select Amount to Deposit</Form.Label>
                      <Form.Select
                        id="deposit"
                        aria-label="Default select example"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <button
                        onClick={(e) => handleOnDeposit(e)}
                        className="btn-success px-2 rounded"
                      >
                        Deposit this amount
                      </button>
                      <button
                        onClick={(e) => handleResetDeposit(e)}
                        className="mx-5 btn-danger px-2 rounded"
                      >
                        Reset Deposit
                      </button>
                    </Form.Group>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
