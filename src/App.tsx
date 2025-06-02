import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from 'react'
import useThemeStore  from "./hooks/Theme";
import './index.css'
import Header from './components/Header';
import InvoiceList from './pages/invoices/InvoiceList';
import InvoiceDetail from "./pages/invoices/InvoiceDetail";
import EditInvoice from "./pages/invoices/EditInvoice";
import CreateInvoice from "./pages/invoices/CreateInvoice";

function App() {
  const { theme, toggle } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }          
  }, [theme])

  return (
    <BrowserRouter>
      <Header onToggleTheme={toggle} current={theme}/>
      <main>
        <Routes>
          <Route path="/" element={<InvoiceList/>} /> 
          <Route path="/invoice/:id" element={<InvoiceDetail/>} />
          <Route path="/create-invoice" element={<CreateInvoice/>} />
          <Route path="/edit-invoice/:id" element={<EditInvoice/>} /> 
          {/* <Route path="*" element={<div>404 Not Found</div>} /> // 404 component */}
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App;