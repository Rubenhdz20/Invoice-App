import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import './index.css'
import InvoiceList from './pages/invoices/InvoiceList';
import React from "react";
import InvoiceDetail from "./pages/invoices/InvoiceDetail";
import EditInvoice from "./pages/invoices/EditInvoice";

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <main>
        <Routes>
          <Route path="/" element={<InvoiceList/>} /> 
          <Route path="/invoice/:id" element={<InvoiceDetail/>} />
          <Route path="/create-invoice" element={<div>About</div>} /> // Create Invoice component
          <Route path="/edit-invoice/:id" element={<EditInvoice/>} /> 
          {/* <Route path="*" element={<div>404 Not Found</div>} /> // 404 component */}
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App;