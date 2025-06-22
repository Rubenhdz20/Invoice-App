import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from 'react'
import useThemeStore  from "./hooks/Theme";
import './index.css'
import Header from './components/Header';
import InvoiceList from './pages/invoices/InvoiceList';
import InvoiceDetail from "./pages/invoices/InvoiceDetail";
import EditInvoice from "./pages/forms/EditInvoice";
import CreateInvoice from "./pages/forms/CreateInvoice";

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
      <div className="flex flex-col lg:flex-row min-h-screen lg:w-screen lg:h-screen">
        <Header onToggleTheme={toggle} current={theme}/>
        <main className="flex-1 bg-white-custom dark:bg-dark-2">
          <Routes>
            <Route path="/" element={<InvoiceList/>} /> 
            <Route path="/invoice/:id" element={<InvoiceDetail invoice={{
              id: "",
              createdAt: "",
              paymentDue: "",
              clientEmail: "",
              clientName: "",
              clientAddress: {
                street: "",
                city: "",
                postCode: "",
                country: ""
              },
              senderAddress: {
                street: "",
                city: "",
                postCode: "",
                country: ""
              },
              items: [],
              total: 0,
              status: "",
              description: ""
            }} />} />
            <Route path="/create-invoice" element={<CreateInvoice/>} />
            <Route path="/edit-invoice/:id" element={<EditInvoice onCancel={() => {}} onSave={() => {}} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App;