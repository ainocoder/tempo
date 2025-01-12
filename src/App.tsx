import { Routes, Route, useRoutes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./components/home";
import BusinessDetail from "./components/directory/BusinessDetail";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import ResetPassword from "./components/auth/ResetPassword";
import ProfilePage from "./components/profile/ProfilePage";
import Header from "./components/shared/Header";
import { supabase } from "./lib/supabase";
import { Toaster } from "./components/ui/toaster";
import routes from "tempo-routes";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header user={session?.user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/profile"
          element={
            session ? (
              <ProfilePage />
            ) : (
              <Navigate to="/login" replace state={{ from: location }} />
            )
          }
        />
        <Route
          path="/business/:id"
          element={
            session ? (
              <BusinessDetail />
            ) : (
              <Navigate to="/login" replace state={{ from: location }} />
            )
          }
        />
      </Routes>
      <Toaster />
      {import.meta.env.VITE_TEMPO && useRoutes(routes)}
    </>
  );
}

export default App;
