import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { adminLoggedIn } from "../features/auth/adminAuthSlice";

export default function useAuthAdminCheck() {
  let [authIsReady, setAuthIsReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let localAuth = localStorage.getItem("steeltech-fabricator-admin");

    if (localAuth) {
      let auth = JSON.parse(localAuth);

      if (auth?.token && auth?.user) {
        dispatch(
          adminLoggedIn({
            token: auth?.token,
            user: auth?.user,
          })
        );
      }
    }

    setAuthIsReady(true);
  }, [dispatch]);

  return authIsReady;
}
