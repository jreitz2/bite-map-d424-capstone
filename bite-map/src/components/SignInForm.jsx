import { useState } from "react";
import supabaseClient from "../supabase";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const emailRegex = /^[^\s@]{3,}@[^\s@]+\.[^\s@]{2,}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address (min. 6 characters).");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters and include both letters and numbers."
      );
      return;
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      console.log("User signed in:", data);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email (min. 6 characters).");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters and include both letters and numbers."
      );
      return;
    }

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      console.log("User signed up:", data);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="sign-in-form">
        <p>Sign in with your email address and password:</p>
        {error && <p className="error">{error}</p>}
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Sign In</button>
      </form>

      <form onSubmit={handleSignup} className="sign-in-form">
        <p>Don't have an account? Sign up instead:</p>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
