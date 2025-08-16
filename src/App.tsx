// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  useAuth,
  UserButton,
} from "@clerk/clerk-react";
import useThemeStore from "./hooks/Theme";
import Header from "./components/Header";
import Welcome from "./pages/Welcome";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import InvoiceList from "./pages/invoices/InvoiceList";
import InvoiceDetail from "./pages/invoices/InvoiceDetail";
import CreateInvoice from "./pages/forms/CreateInvoice";
import EditInvoice from "./pages/forms/EditInvoice";

function ProtectedLayout() {
  const { theme, toggle } = useThemeStore();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <SignedIn>
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Header onToggleTheme={toggle} current={theme}>
          <UserButton /> 
        </Header>
        <main className="flex-1 bg-white-custom dark:bg-dark-2 p-6">
          <Outlet />
        </main>
      </div>
    </SignedIn>
  );
}

function AuthLayout() {
  return (
    <SignedOut>
      <Outlet />
    </SignedOut>
  );
}

export default function App() {
  const { isLoaded } = useAuth();
  if (!isLoaded) return <div>Loading…</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* unauthenticated */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Welcome />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
        </Route>

        {/* authenticated */}
        <Route element={<ProtectedLayout />}>
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/invoice/:id" element={<InvoiceDetail />} />
          <Route path="/create-invoice" element={<CreateInvoice />} />
          <Route path="/edit-invoice/:id" element={<EditInvoice onCancel={()=>{}} onSave={()=>{}} />} />
        </Route>

        {/* catch-all */}
        <Route 
          path="*"
          element={
            <SignedIn>
              <Navigate to="/invoices" replace />
            </SignedIn>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}