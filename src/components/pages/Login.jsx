import { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ProviderLogin from "../ProviderLogin";
import {
  Container,
  Grid2,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Divider,
} from "@mui/material";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/", { replace: true });
    } catch {
      setError("Failed to login");
    }
    setLoading(false);
  }

  return (
    <Container
      maxWidth='lg'
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid2 container sx={{ height: "86vh" }}>
        {/* Left Grid2 - Login Form */}
        <Grid2
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: { xs: 2, md: 8 },
          }}
        >
          <Typography variant='h4' gutterBottom align='center' sx={{ mb: 6 }}>
            Login
          </Typography>
          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleLogin}>
            <Grid2 container spacing={3}>
              <Grid2 item xs={12}>
                <TextField
                  fullWidth
                  id='email'
                  label='Email'
                  placeholder='Enter Email'
                  type='email'
                  inputRef={emailRef}
                  required
                />
              </Grid2>
              <Grid2 item xs={12}>
                <TextField
                  fullWidth
                  id='password'
                  label='Password'
                  placeholder='Enter Password'
                  type='password'
                  inputRef={passwordRef}
                  required
                />
              </Grid2>
              <Grid2 item xs={12} textAlign='center'>
                <Button
                  type='submit'
                  variant='contained'
                  disabled={loading}
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: "#000",
                    "&:hover": {
                      backgroundColor: "#333",
                    },
                    height: "56px",
                  }}
                >
                  Login
                </Button>
              </Grid2>
            </Grid2>
          </form>

          <Box sx={{ mt: 4 }}>
            <Box display='flex' alignItems='center' width='100%'>
              <Divider sx={{ flexGrow: 1 }} />
              <Typography sx={{ mx: 2 }}>Or sign in with</Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </Box>
            <ProviderLogin />
          </Box>

          <Typography align='center' sx={{ mt: 2 }}>
            Don’t have an account?{" "}
            <RouterLink
              to='/register'
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              Register
            </RouterLink>
          </Typography>
        </Grid2>

        {/* Right Grid2 - Full-size Image */}
        <Grid2
          item
          xs={12}
          md={6}
          sx={{
            display: { xs: "none", sm: "block" }, // Hide right Grid2 on mobile
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: "0px 20px 20px 0px",
            }}
          >
            <img
              src='https://cdn.pixabay.com/photo/2017/07/19/16/47/ice-2519682_1280.png'
              alt='Login visual'
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        </Grid2>
      </Grid2>
    </Container>
  );
}
