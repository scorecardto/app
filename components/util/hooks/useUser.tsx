import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";

function useUser() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return user;
}
export default useUser;
