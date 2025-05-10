import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Grid2,
  useMediaQuery,
  createTheme,
  ThemeProvider,
} from "@mui/material";

export default function ProviderLogin() {
  const { googleLogin, guestLogin } = useAuth();
  const navigate = useNavigate();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const handleGuest = async (e) => {
    e.preventDefault();
    await guestLogin().then(() => {
      navigate("/creategoal", { replace: true });
    });
  };

  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Grid2 container spacing={2} sx={{ mt: 2 }}>
        <Grid2 size={6}>
          <Button
            fullWidth
            sx={{
              color: prefersDarkMode ? "#fff" : "#000",
              height: "56px",
              borderRadius: "20px",
              backgroundColor: prefersDarkMode ? "#333" : "#fff",
              "&:hover": {
                backgroundColor: prefersDarkMode ? "#555" : "#f1f1f1",
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
          <Button
            fullWidth
            onClick={handleGuest}
            sx={{
              color: prefersDarkMode ? "#fff" : "#000",
              height: "56px",
              borderRadius: "20px",
              backgroundColor: prefersDarkMode ? "#333" : "#fff",
              "&:hover": {
                backgroundColor: prefersDarkMode ? "#555" : "#f1f1f1",
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
    </ThemeProvider>
  );
}
