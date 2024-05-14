import ProviderLogin from "../components/ProviderLogin";
import { Link } from "react-router-dom";
import { FaUserCheck } from "react-icons/fa6";
import { FaUserPen } from "react-icons/fa6";

export default function Home() {
  return (
    <>
      <h1 style={{ color: "#2bbb7f" }}>Calorator</h1>
      <Link as={Link} to="/register">
        <button style={{ marginRight: "20px", background: "none" }}>
          <FaUserPen style={{ fontSize: "50px" }} />
          <div style={{ fontSize: "15px" }}>Sign Up</div>
        </button>
      </Link>
      <Link as={Link} to="/login">
        <button style={{ background: "none" }}>
          <FaUserCheck style={{ fontSize: "50px" }} />
          <div style={{ fontSize: "15px" }}>Login</div>
        </button>
      </Link>
      <br />
      <ProviderLogin />
    </>
  );
}
