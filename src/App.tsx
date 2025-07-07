// App.tsx
import React, { useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom'
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useAuth
} from '@clerk/clerk-react'
import useThemeStore from './hooks/Theme'
import Header from './components/Header'
import Welcome from './pages/Welcome'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import InvoiceList from './pages/invoices/InvoiceList'
import InvoiceDetail from './pages/invoices/InvoiceDetail'
import CreateInvoice from './pages/forms/CreateInvoice'
import EditInvoice from './pages/forms/EditInvoice'

function ProtectedLayout() {
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
    <SignedIn>
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Header onToggleTheme={toggle} current={theme}/>
        <main className="flex-1 bg-white-custom dark:bg-dark-2">
          <Outlet/>
        </main>
      </div>
    </SignedIn>
  )
}

function AuthRedirectLayout() {
  return (
    <SignedOut>
      <Outlet/>
    </SignedOut>
  )
}

// Loading component while Clerk is initializing
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white-custom dark:bg-dark-2">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
    </div>
  )
}

export default function App() {
  const { isLoaded } = useAuth();

  // Show loading screen while Clerk is initializing
  if (!isLoaded) {
    return <LoadingScreen />
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public / unauthenticated routes */}
        <Route element={<AuthRedirectLayout/>}>
          <Route path="/" element={<Welcome/>} />
          <Route path="/sign-in/*" element={<SignInPage/>} />
          <Route path="/sign-up/*" element={<SignUpPage/>} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedLayout/>}>
          <Route path="/invoices" element={<InvoiceList/>} />
          <Route path="/invoice/:id" element={<InvoiceDetail/>} />
          <Route path="/create-invoice" element={<CreateInvoice/>} />
          <Route path="/edit-invoice/:id" element={<EditInvoice onCancel={()=>{}} onSave={()=>{}}/>} />
        </Route>

        {/* Catch-all route - redirect based on auth state */}
        <Route path="*" element={
          <>
            <SignedIn>
              <Navigate to="/invoices" replace />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}