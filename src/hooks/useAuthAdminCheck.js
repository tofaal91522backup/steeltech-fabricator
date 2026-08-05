import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { adminLoggedIn } from "../features/auth/adminAuthSlice";
import safeStorage from "../utils/safeStorage";

export default function useAuthAdminCheck() {
  let [authIsReady, setAuthIsReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let localAuth = safeStorage.getItem("steeltech-fabricator-admin");

    if (localAuth) {
      try {
        let auth = JSON.parse(localAuth);

        if (auth?.token && auth?.user) {
          dispatch(
            adminLoggedIn({
              token: auth?.token,
              user: auth?.user,
            })
          );
        }
      } catch {
        safeStorage.removeItem("steeltech-fabricator-admin");
      }
    }

    setAuthIsReady(true);
  }, [dispatch]);

  return authIsReady;
}
