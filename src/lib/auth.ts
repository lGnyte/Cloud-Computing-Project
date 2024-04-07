import toast from "react-hot-toast";
import { auth, googleAuthProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";

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