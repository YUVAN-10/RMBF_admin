import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin' or 'member'
  const [profile, setProfile] = useState(null); // Firestore document data
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setLoading(true);
        try {
          const uid = firebaseUser.uid;
          
          // 1. Check if user is an active Admin
          const adminRef = doc(db, "admins", uid);
          const adminSnap = await getDoc(adminRef);

          if (adminSnap.exists()) {
            const adminData = adminSnap.data();
            if (adminData.role === "admin" && adminData.status === "active") {
              setUser(firebaseUser);
              setRole("admin");
              setProfile(adminData);
              setAuthError("");
              setLoading(false);
              return;
            } else {
              throw new Error("Admin account is not active.");
            }
          }

          // If admin doesn't exist, user is unauthorized
          throw new Error("Unauthorized admin access.");
          
        } catch (error) {
          console.error("Auth role check failed:", error);
          setAuthError(error.message);
          await signOut(auth);
          setUser(null);
          setRole(null);
          setProfile(null);
        } finally {
          setLoading(false);
        }
      } else {
        // User is signed out
        setUser(null);
        setRole(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setAuthError(""); // Clear any previous auth errors on logout
  };

  const value = {
    user,
    role,
    profile,
    loading,
    isAuthenticated: !!user && !!role,
    authError,
    setAuthError,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
