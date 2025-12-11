// src/pages/Login/Login.tsx
import React from "react";
import LoginLayout from "@/pages/Login/LoginLayout.tsx";
import LoginForm from "@/components/LoginFrom/LoginForm.tsx";

const Login: React.FC = () => {
  return (
    <LoginLayout>
      <LoginForm/>
    </LoginLayout>
  );
};

export default Login;
