import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ProviderLogin from "../ProviderLogin";

export default function Register() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { register, currentUser } = useAuth();
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
    <>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        {currentUser}
        {error}
        <div className='container'>
          <div className='row'>
            <input
              className='mt-3'
              id='name'
              label='Enter Name'
              placeholder='Enter Name'
              icon='envelope'
              type='name'
              ref={nameRef}
              required
              style={{ border: "1px solid #2bbbad" }}
            />
          </div>

          <div className='row'>
            <input
              defaultValue=''
              className='mt-3'
              id='email'
              label='Enter Email'
              placeholder='Enter Email'
              icon='envelope'
              type='email'
              ref={emailRef}
              required
              style={{ border: "1px solid #2bbbad" }}
            />
          </div>
          <div className='row'>
            <input
              defaultValue=''
              className='mt-3'
              id='password'
              label='Choose Password'
              placeholder='Choose Password'
              icon='lock'
              type='password'
              ref={passwordRef}
              required
              style={{ border: "1px solid #2bbbad" }}
            />
          </div>
          <div className='row'>
            <input
              className='mt-3'
              id='password-confirm'
              label='Confirm Password'
              placeholder='Confirm Password'
              icon='lock'
              type='password'
              ref={passwordConfirmRef}
              required
              style={{ border: "1px solid #2bbbad" }}
            />
          </div>

          <div className='text-center mt-4'>
            <button className='button' disabled={loading} type='submit'>
              Submit
            </button>
          </div>
        </div>
      </form>
      <hr />
      <ProviderLogin />
      <hr />
      <div className='text-center mt-2'>
        Already have an account?
        <div>
          <Link as={Link} to='/login'>
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
