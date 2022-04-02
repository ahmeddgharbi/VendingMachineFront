import "./App.css";
//React Router

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importing Components
import Home from "../src/Components/pages/Home";
import Dashboard from "./Components/pages/Dashboard";
import Login from "./Components/pages/Login";
//Context Api
import { createContext, useState } from "react";
import Registration from "./Components/pages/Registration";
import Cart from "./Components/pages/Cart";
export const UserContext = createContext();
export const ProductContext = createContext();
export const AllUserContext = createContext();
export const CartContext = createContext()
function App() {
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [carts, setCarts] = useState([]);
  return (
    <UserContext.Provider value={[user, setUser]}>
      <ProductContext.Provider value={[products, setProducts]}>
        <AllUserContext.Provider value={[allUsers, setAllUsers]}>
          <CartContext.Provider value={[carts, setCarts]}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Registration />} />
            </Routes>
          </BrowserRouter>
          </CartContext.Provider>
        </AllUserContext.Provider>
      </ProductContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
