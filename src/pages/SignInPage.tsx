import { SignIn } from "@clerk/clerk-react";
import React from "react";

// SignInPage.tsx
export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-2">
      <SignIn 
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/invoices"
        appearance={{
          variables: {
            colorPrimary: "#8B5CF6",
            colorBackground: "#FFFFFF",
            colorText: "#1F2937",
            colorTextSecondary: "#6B7280",
            colorInputBackground: "#F9FAFB",
            colorInputText: "#1F2937",
            colorDanger: "#EF4444",
            fontFamily: "Inter, sans-serif",
            borderRadius: "8px",
          },
          elements: {
            card: {
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              borderRadius: "16px",
              border: "1px solid #E5E7EB"
            },
            headerTitle: {
              fontSize: "24px",
              fontWeight: "700",
              color: "#1F2937"
            },
            formButtonPrimary: {
              backgroundColor: "#8B5CF6",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              padding: "12px 24px",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#7C3AED",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)"
              }
            },
            socialButtonsBlockButton: {
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#F3F4F6"
              }
            }
          }
        }}
      />
    </div>
  );
}