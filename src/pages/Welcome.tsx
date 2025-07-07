// src/pages/Welcome.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6 bg-white-custom dark:bg-dark-2">
      <h1 className="text-3xl font-bold dark:text-white">Welcome to Invoice App</h1>
      <p className="text-gray-600 dark:text-gray-400">Track and send your invoices easily.</p>
      <div className="flex space-x-4">
        <Link
          to="/sign-in"
          className="px-6 py-2 bg-strong-violet text-white rounded-xl hover:bg-violet-600 transition"
        >
          Sign In
        </Link>
        <Link
          to="/sign-up"
          className="px-6 py-2 border border-strong-violet text-strong-violet rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900 transition"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}