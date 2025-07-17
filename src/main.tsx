import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!;
const FRONTEND_API   = import.meta.env.VITE_CLERK_FRONTEND_API!;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      frontendApi={FRONTEND_API}
      afterSignOutUrl="/"
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);