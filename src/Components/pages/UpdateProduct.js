import React, { useContext, useEffect, useState } from "react";
import { ProductContext, UserContext } from "../../App";
import { Form } from "react-bootstrap";
const UpdateProduct = (props) => {
  const [theProduct, setTheProduct] = useState({});
  const [user, setUser] = useContext(UserContext);
  const [products, setProducts] = useContext(ProductContext);
  console.log(props)
  let prod = products.find(o => o._id === props.productId );
  console.log(prod)

  const proId = prod._id;
  console.log(proId);

  const handleOnUpdateProduct = (e) => {
    e.preventDefault();
    
    const name = prod.productName;
    const cost = prod.cost;
    const amount = prod.amountAvailable;
    const newProduct = {
      productName: name,
      cost: cost,
      amountAvailable: amount,
      sellerId: user._id,
    };
    //update in local
    const prd = [...products];
    const objIndex = prd.findIndex((obj) => obj._id === proId);
    console.log(objIndex);
    prd[objIndex].productName = name;
    prd[objIndex].cost = cost;
    prd[objIndex].amountAvailable = amount;

    console.log(prd);
    setProducts(prd);
    //update in server
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    };
    fetch(`http://localhost:3005/api/products/update/${proId}`, requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data));

    alert("Product Updated Successfully");
    prod = theProduct;
    console.log(prod);
    props.onSubmit();
  };

  function handleInputChange(e) {
    const { name, value } = e.target;
    setTheProduct({ ...theProduct, [name]: value });
    prod[name] = value;
  }
  
  return (
    <div>
      { !(prod?.productName) ? (
        <div>The prduct list is loading...</div>) : (<>
      <h3>Update Product</h3>
      <Form id="registrationForm">
        <Form.Group className="mb-3">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            id="pname"
            name="productName"
            type="text"
            required
            value={prod.productName}
            placeholder="Pencil Box"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Product Cost</Form.Label>
          <Form.Control type="text" id="pcost" placeholder="10" required
          name="cost" onChange={handleInputChange} value={prod.cost} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Available Amount</Form.Label>
          <Form.Control type="text" id="pamount" placeholder="10" required
          value={prod.amountAvailable} name="amountAvailable" onChange={handleInputChange} />
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
      </>)}
    </div>
  );
};

export default UpdateProduct;
