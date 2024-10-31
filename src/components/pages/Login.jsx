import { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import ProviderLogin from "../ProviderLogin";
import Brand from "../layout/Brand";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const redirect = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);

      redirect("/", { replace: true });
    } catch {
      setError("Failed to login");
    }
    setLoading(false);
  }

  return (
    <>
      <Brand />
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div style={{ color: "red" }}>{error && error}</div>

        <div className='row'>
          <input
            className='mt-3'
            id='id'
            label='Email'
            placeholder='Email'
            type='email'
            ref={emailRef}
            required
            style={{ border: "1px solid #2bbbad" }}
          />
        </div>
        <div className='row'>
          <input
            className='mt-3'
            id='password'
            label='Password'
            placeholder='Password'
            type='password'
            ref={passwordRef}
            required
            style={{ border: "1px solid #2bbbad" }}
          />
        </div>

        <div className='text-center mt-4'>
          <button className='w-50' disabled={loading} type='submit'>
            Login
          </button>
        </div>
      </form>
      <hr />
      <ProviderLogin />
      <div className='text-center'></div>
      <hr className='mt-4' />
      <div className='text-center mt-2'>
        Don't have an account?
        <div>
          <Link as={Link} to='/register'>
            Register
          </Link>
        </div>
      </div>
    </>
  );
}
