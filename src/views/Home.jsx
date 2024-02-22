import ProviderLogin from "../components/ProviderLogin";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <h1 style={{ color: "#2bbb7f" }}>Calorator</h1> <hr />
      <Link as={Link} to="/register">
        Sign Up
      </Link>
      <br />
      <hr />
      <ProviderLogin />
    </>
  );
}
