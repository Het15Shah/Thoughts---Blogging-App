import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import authServices from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import "./App.css";
import { Header, Footer } from "./components";
import { Outlet } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authServices
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-bold text-gray-300 tracking-widest uppercase">Loading</span>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen flex flex-col bg-white font-sans text-black selection:bg-black selection:text-white">
        <Header />
        <main className="flex-grow w-full">
          <Outlet />
        </main>
        <Footer />
      </div>
    );
  }
}

export default App;
