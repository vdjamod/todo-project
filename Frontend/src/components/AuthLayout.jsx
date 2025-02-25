import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AuthLayout({children}) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if(!token && !authStatus) {
      navigate("/user/signin");
    }
  }, []);

  return (
    <>
      {children}
    </>
  );
}
