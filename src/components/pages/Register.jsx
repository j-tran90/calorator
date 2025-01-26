import { useRef, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ProviderLogin from "../ProviderLogin";
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Divider,
} from "@mui/material";

export default function Register() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }
    if (passwordRef.current.value.length < 6) {
      return setError("Weak Password: Must be at least 6 characters");
    }

    try {
      setError("");
      setLoading(true);
      await register(emailRef.current.value, passwordRef.current.value);
      navigate("/creategoal", { replace: true });
    } catch {
      setError("Failed to create an account");
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
      <Grid container>
        {/* Left Grid - Full-size Image */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: { xs: "none", sm: "block" }, // Hide left grid on mobile
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: "20px 0px 0px 20px",
            }}
          >
            <img
              src='https://cdn.pixabay.com/photo/2022/05/28/07/07/watermelon-7226708_1280.png'
              alt='Registration visual'
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        </Grid>

        {/* Right Grid - Login Form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: { xs: "none", md: 8 },
          }}
        >
          <Typography variant='h4' gutterBottom align='center' sx={{ mb: 6 }}>
            Create an account
          </Typography>
          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id='name'
                  label='Name'
                  placeholder='Enter Name'
                  inputRef={nameRef}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id='email'
                  label='Email'
                  placeholder='Enter Email'
                  type='email'
                  inputRef={emailRef}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id='password'
                  label='Password'
                  placeholder='Choose Password'
                  type='password'
                  inputRef={passwordRef}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id='password-confirm'
                  label='Confirm Password'
                  placeholder='Confirm Password'
                  type='password'
                  inputRef={passwordConfirmRef}
                  required
                />
              </Grid>
              <Grid item xs={12} textAlign='center'>
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
                    padding: "16.5px 30px 16.5px 30px",
                  }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
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
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              Login
            </RouterLink>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
