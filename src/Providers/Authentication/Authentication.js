import React from "react";
import { useState, useContext, createContext, useEffect } from "react";
import supabase from "../../Config/Config";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 
  useEffect(() => {
    axios
      .get(`/user.json`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []); */

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log(data);
      if (data && data.session) {
        setUser(data.session.user);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      if (event === "SIGNED_IN") {
        setUser(session.user);
        setLoading(false);
      }

      if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
