// createContext() creates a context that allows components to share data.
// useState() stores data that can change over time.

import { createContext, useState } from "react";

// Think of it as a shared data channel for authentication information.
export const AuthContext = createContext();

// This defines a component that will provide authentication data to its child components.
export const AuthProvider = ({ children }) => {

// user: stores the current user's information.
// setUser: updates that information. 

  const [user, setUser] = useState(null);

// This tracks whether an authentication-related operation is in progress.  
  const [loading, setLoading] = useState(false);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};


// state layer is used to store data of auth.context.jsx
