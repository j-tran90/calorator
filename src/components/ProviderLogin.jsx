import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button, Grid2 } from "@mui/material";

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
      <Grid2 container spacing={2} sx={{ mt: 2 }}>
        {" "}
        {/* Spacing between the buttons */}
        <Grid2 size={6}>
          {" "}
          {/* Left button takes 60% width */}
          <Button
            fullWidth
            sx={{
              color: "#000",

              height: "56px",
              border: "1px solid black",
              "&:hover": {
                backgroundColor: "#9993",
              },
            }}
            onClick={googleLogin}
          >
            <FcGoogle
              cursor='pointer'
              style={{ fontSize: "25px", marginRight: "5px" }}
            />
            Google
          </Button>
        </Grid2>
        <Grid2 size={6}>
          {" "}
          {/* Right button takes 60% width */}
          <Button
            fullWidth
            onClick={handleGuest}
            sx={{
              color: "#000",
              height: "56px",
              border: "1px solid black",
              "&:hover": {
                backgroundColor: "#9993",
              },
            }}
          >
            <img
              src='https://cdn-icons-png.freepik.com/256/16783/16783993.png?semt=ais_hybrid'
              cursor='pointer'
              title='Guest Sign In'
              style={{
                height: "25px",
                borderRadius: "30px",
                marginRight: "5px",
              }}
            />
            Guest
          </Button>
        </Grid2>
      </Grid2>
    </>
  );
}
