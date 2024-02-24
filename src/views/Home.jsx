import ProviderLogin from "../components/ProviderLogin";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <h1 style={{ color: "#2bbb7f" }}>Calorator</h1>
      <button style={{ marginRight: "20px" }}>
        <Link as={Link} to="/register">
          Sign Up
        </Link>
      </button>
      <button>
        <Link as={Link} to="/register">
          Login
        </Link>
      </button>
      <br />
      <hr />
      <ProviderLogin />
    </>
  );
}
