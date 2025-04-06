import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import './index.css'
import InvoiceList from './pages/invoices/InvoiceList';
import React from "react";
import InvoiceDetail from "./pages/invoices/InvoiceDetail";

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <main>
        <Routes>
          <Route path="/" element={<InvoiceList/>} /> 
          <Route path="/invoice/:id" element={<InvoiceDetail/>} /> // Invoice detail component
          <Route path="/create-invoice" element={<div>About</div>} /> // Create Invoice component
          <Route path="/edit-invoice/:id" element={<div>Contact</div>} /> // Edit Invoice component
          {/* <Route path="*" element={<div>404 Not Found</div>} /> // 404 component */}
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App;