import React, { useContext, useEffect } from "react";
import { ProductContext, UserContext } from "../../App";
import { Form } from "react-bootstrap";
import { useState } from "react";
const UpdateProduct = (props) => {
    const proId = props.productId;
    const [theProduct, setTheProduct] = useState({});
    const [user, setUser] = useContext(UserContext);
    const [products, setProducts] = useContext(ProductContext)
    console.log(proId);

  const handleOnUpdateProduct = (e) => {
    e.preventDefault();
    const name = document.getElementById("pname").value;
    const cost = document.getElementById("pcost").value;
    const amount = document.getElementById("pamount").value;
    const newProduct = {
      productName: name,
      cost: cost,
      amountAvailable: amount,
      sellerId: user._id,
    };
    //update in local
    const prd = [...products];
    const objIndex = prd.findIndex((obj => obj._id === proId));
    console.log(objIndex)
    prd[objIndex].productName = name;
    prd[objIndex].cost = cost;
    prd[objIndex].amountAvailable = amount;

    console.log(prd)
    setProducts(prd)
    //update in server
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    };
    fetch(
      `http://localhost:3005/api/products/update/${proId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => console.log(data));
     
 
      alert('Product Updated Successfully');
      document.getElementById('productTable').style.display = 'block';
      document.getElementById('updateProductForm').style.display = 'none';
  };
  return (
    <div>
      <h3>Update Product</h3>
      <Form id="registrationForm">
        <Form.Group className="mb-3">
          <Form.Label>Product Name</Form.Label>
          <Form.Control id="pname" type="text" required value={theProduct.productName} placeholder="Pencil Box" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Product Cost</Form.Label>
          <Form.Control type="text" id="pcost" placeholder="10" required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Available Amount</Form.Label>
          <Form.Control type="text" id="pamount" placeholder="10" required />
        </Form.Group>
        <Form.Group className="mb-3 ">
          <button
            onClick={(e) => handleOnUpdateProduct(e)}
            className="btn-success px-3 py-1 rounded"
          >
            Submit
          </button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default UpdateProduct;
