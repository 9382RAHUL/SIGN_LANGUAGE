import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App3 from './App3.jsx'
// import App from './App.jsx'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "../src/SignIn";
import SignUp from "../src/SignUp";
import Home from "./components/Home";
import Dashboard from "./Dashboard";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/isl-converter" element={<App3 />} />
        </Routes>
      </BrowserRouter>
    </>
  </StrictMode>,
)
