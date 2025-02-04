import { useRef, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
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
  useMediaQuery,
  ThemeProvider,
} from "@mui/material";
import Brand from "../layouts/Brand";
import { useTheme } from "@mui/material/styles";

export default function Register() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // Define light and dark theme using createTheme
  const theme = useTheme(); // Get current theme

  async function handleSubmit(e) {
    e.preventDefault();

    // Validate password match and strength
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }
    if (passwordRef.current.value.length < 6) {
      return setError("Weak Password: Must be at least 6 characters");
    }

    try {
      setError("");
      setLoading(true);
      // Register user and navigate to the goal creation page
      await register(emailRef.current.value, passwordRef.current.value);
      navigate("/creategoal", { replace: true });
    } catch {
      setError("Failed to create an account");
    }
    setLoading(false);
  }

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ height: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "left",
            justifyContent: "left",
            pt: 2,
            pb: 2,
          }}
        >
          <Brand />
        </Box>
        <Box
          maxWidth='lg'
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid2 container sx={{ height: "86vh" }}>
            {/* Left Grid2 - Full-size Image */}
            <Grid2
              size={{ xs: 12, md: 6 }}
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src='https://cdn.pixabay.com/photo/2022/05/28/07/07/watermelon-7226708_1280.png'
                  alt='Registration visual'
                  style={{
                    width: "576px",
                    height: "778px",
                    objectFit: "cover",
                    borderRadius: "20px 0px 0px 20px",
                  }}
                />
              </Box>
            </Grid2>

            {/* Right Grid2 - Registration Form */}
            <Grid2
              size={{ xs: 12, md: 6 }}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: { xs: 2, md: 8 },
              }}
            >
              <Typography
                variant='h4'
                gutterBottom
                align='center'
                sx={{ mb: 6 }}
              >
                Create an account
              </Typography>
              {error && (
                <Alert severity='error' sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <form onSubmit={handleSubmit}>
                <Grid2 container spacing={3}>
                  <Grid2 size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      id='name'
                      label='Name'
                      placeholder='Enter Name'
                      inputRef={nameRef}
                      required
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12 }}>
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
                  <Grid2 size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      id='password'
                      label='Password'
                      placeholder='Choose Password'
                      type='password'
                      inputRef={passwordRef}
                      required
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      id='password-confirm'
                      label='Confirm Password'
                      placeholder='Confirm Password'
                      type='password'
                      inputRef={passwordConfirmRef}
                      required
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12 }} textAlign='center'>
                    <Button
                      type='submit'
                      variant='contained'
                      disabled={loading}
                      fullWidth
                      sx={{
                        mt: 2,
                        height: "56px",
                      }}
                    >
                      Submit
                    </Button>
                  </Grid2>
                </Grid2>
              </form>

              <Box sx={{ mt: 4 }}>
                <Box display='flex' alignItems='center' width='100%'>
                  <Divider sx={{ flexGrow: 1 }} />
                  <Typography sx={{ mx: 2 }}>Or sign up with</Typography>
                  <Divider sx={{ flexGrow: 1 }} />
                </Box>
                <ProviderLogin />
              </Box>

              <Typography align='center' sx={{ mt: 2 }}>
                Already have an account?{" "}
                <RouterLink
                  to='/login'
                  style={{
                    textDecoration: "none",
                    color: theme.palette.primary.main,
                  }}
                >
                  Login
                </RouterLink>
              </Typography>
            </Grid2>
          </Grid2>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
