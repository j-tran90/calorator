import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function ProviderLogin() {
  const { googleLogin, guestLogin } = useAuth();
  const navigate = useNavigate();

  const handleGuest = async (e) => {
    e.preventDefault();
    await guestLogin().then(() => {
      navigate("/creategoal", { replace: true });
    });
  };

  return (
    <>
      <div className="text-center">
        <button style={{ marginRight: "20px", background: "none" }}>
          <FcGoogle
            type="button"
            title="Google Sign In"
            cursor="pointer"
            onClick={googleLogin}
            style={{ fontSize: "50px" }}
          />
          <div style={{ fontSize: "15px" }}>Google</div>
        </button>

        <button style={{ marginRight: "0px", background: "none" }}>
          <Link as={Link} onClick={handleGuest}>
            <img
              src="https://icon-library.com/images/guest-account-icon/guest-account-icon-1.jpg"
              cursor="pointer"
              title="Guest Sign In"
              style={{
                maxHeight: "50px",
                borderRadius: "30px",
              }}
            />
          </Link>
          <div style={{ fontSize: "15px" }}>Guest</div>
        </button>
      </div>
    </>
  );
}
