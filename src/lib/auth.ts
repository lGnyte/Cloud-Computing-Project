import toast from "react-hot-toast";
import { auth, googleAuthProvider } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export const signInWithGoogle = async () => {
  signInWithPopup(auth, googleAuthProvider)
    .then(result => {
      toast.success("Authenticated with Google!");
      //do something with token ? =))
    })
    .catch(err => {
      toast.error(err.message);
    });
};

export const signIn = async (email: string, password: string) => {
  signInWithEmailAndPassword(auth, email, password)
    .then(result => {
      toast.success("Authenticated with email and password!");
    })
    .catch(err => {
      if (err.code === "auth/invalid-login-credentials") {
        toast.error("Invalid credentials");
      } else {
        console.error(err.message);
        toast.error("Login failed!");
      }
    });
}

export const registerUser = async (email: string, password: string) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(result => {
      toast.success("Registered and authenticated with email and password!");
    })
    .catch(err => {
      if (err.code === "auth/invalid-email") {
        toast.error("Invalid email");
      } else if (err.code === "auth/email-already-in-use") {
        toast.error("Email already exists");
      } else {
        toast.error("Registration failed!");
      }
    });
}