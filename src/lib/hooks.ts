import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user, setUser] = useState({} as User);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (authUser) => { //when user sign-in state changes
      if (authUser) {
        setUser(authUser); //set the user => next useEffect triggers for the rest of the data
      } else { //no user -> reset everything
        setUsername("");
        setUser({} as User);
      }
    });
  },[]);

  useEffect(() => {
    let unsubscribe;
    if(user && Object.keys(user).length > 0){ //user exists and has some fields <=> a user is auth'ed => load other data
      if(user){
        unsubscribe = onSnapshot(doc(db, 'users', user.uid), doc => {
          setUsername(doc.data()?.username);
        }, err => {
          console.error(`Encountered error: ${err}`);
        });
      } else { //no record
        setUsername("");
      }
    }
    return unsubscribe;
  }, [user]);

  return { user, username };
}