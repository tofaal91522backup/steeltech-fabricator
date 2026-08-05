import { useSelector } from "react-redux";

export default function useAdmin() {
  const auth = useSelector((state) => state.authAdmin);

  if (auth?.token && auth?.user) {
    return true;
  } else {
    return false;
  }
}
