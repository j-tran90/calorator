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
        <button style={{ marginRight: "20px" }}>
          <FcGoogle
            type="button"
            title="Google Sign In"
            cursor="pointer"
            onClick={googleLogin}
            style={{ fontSize: "15px", marginRight: "10px" }}
          />
          Google
        </button>
        <FcGoogle
          type="button"
          title="Google Sign In"
          cursor="pointer"
          onClick={googleLogin}
          style={{ fontSize: "15px", marginRight: "10px" }}
        />
        <button>
          <Link as={Link} onClick={handleGuest}>
            <img
              src="https://icon-library.com/images/guest-account-icon/guest-account-icon-1.jpg"
              cursor="pointer"
              title="Guest Sign In"
              style={{
                maxHeight: "15px",
                marginRight: "10px",
                borderRadius: "50px",
              }}
            />
          </Link>
          Guest
        </button>
      </div>
    </>
  );
}
