import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/config";

// Map Firebase error codes to user-friendly messages
export const getAuthErrorMessage = (error) => {
  switch (error.code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid credentials. Please check and try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact the administrator.";
    case "auth/too-many-requests":
      return "Too many failed login attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    default:
      return error.message || "An error occurred during authentication.";
  }
};

// Login as Admin
export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
