import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function User() {
  const { currentUser } = useAuth();
  return (
    <>
      <Link as={Link} to="/profile">
        <img
          src={
            currentUser.photoURL ||
            "https://icon-library.com/images/guest-account-icon/guest-account-icon-1.jpg"
          }
          alt="..."
          style={{
            borderRadius: "100px",
            minHeight: "100px",
            height: "100px",
            color: "white",
          }}
        />
      </Link>
      <div> {currentUser.displayName || "User"}</div>
    </>
  );
}
