import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useAuth,
} from "@clerk/clerk-react";
import { useInvoiceStore } from "./store/InvoiceStore";
import useThemeStore from "./hooks/Theme";
import Header from "./components/Header";

import Welcome     from "./pages/Welcome";
import SignInPage  from "./pages/SignInPage";
import SignUpPage  from "./pages/SignUpPage";
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
        <Header onToggleTheme={toggle} current={theme} />
        <main className="flex-1 bg-white-custom dark:bg-dark-2">
          <Outlet />
        </main>
      </div>
    </SignedIn>
  );
}

function AuthRedirectLayout() {
  return (
    <SignedOut>
      <Outlet />
    </SignedOut>
  );
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white-custom dark:bg-dark-2">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600" />
    </div>
  );
}

export default function App() {
  const { isLoaded, userId } = useAuth();
  const clearCurrentUser = useInvoiceStore((state) => state.clearCurrentUser);
  
  // ✅ Clear store when user logs out
  useEffect(() => {
    if (isLoaded && !userId) {
      // User has logged out
      console.log('App - User logged out, clearing store');
      clearCurrentUser();
    }
  }, [isLoaded, userId, clearCurrentUser]);

  if (!isLoaded) return <LoadingScreen />;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public / unauthenticated */}
        <Route element={<AuthRedirectLayout />}>
          <Route path="/" element={<Welcome />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Route>

        {/* Protected */}
        <Route element={<ProtectedLayout />}>
          <Route path="/invoices"      element={<InvoiceList />} />
          <Route path="/invoice/:id"   element={<InvoiceDetail />} />
          <Route path="/create-invoice" element={<CreateInvoice />} />
          <Route path="/edit-invoice/:id" element={<EditInvoice onCancel={()=>{}} onSave={()=>{}} />} />
        </Route>

        {/* Catch-all */}
        <Route
          path="*"
          element={
            <>
              <SignedIn>
                <Navigate to="/invoices" replace />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}