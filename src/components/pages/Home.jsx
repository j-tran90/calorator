import ProviderLogin from "../ProviderLogin";
import { Link } from "react-router-dom";
import { FaUserCheck } from "react-icons/fa6";
import { FaUserPen } from "react-icons/fa6";

export default function Home() {
  const SimpleTest = () => {
    const { currentUser } = useAuth();
    return (
      <div>
        <h1>Simple Test</h1>
        {currentUser ? <p>User is logged in</p> : <p>No user logged in</p>}
      </div>
    );
  };

  return (
    <>
      <h1 style={{ color: "#2bbb7f" }}>Calorator</h1>
      <Link as={Link} to='/register'>
        <button style={{ marginRight: "20px", background: "none" }}>
          <FaUserPen style={{ fontSize: "50px" }} />
          <div style={{ fontSize: "15px", color: "#000" }}>Signup</div>
        </button>
      </Link>
      <Link as={Link} to='/login'>
        <button style={{ background: "none" }}>
          <FaUserCheck style={{ fontSize: "50px" }} />
          <div style={{ fontSize: "15px", color: "#000" }}>Login</div>
        </button>
      </Link>
      <br />
      <ProviderLogin />
    </>
  );
}
