import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { UserContext } from "../App";
import apiUrl from "../api-config";

function Login() {
  const navigate = useNavigate();
  const { fetchUserData } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    login();
  };

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      await postRequestSubmit(await user.user.getIdToken(), user.user.email);
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const postRequestSubmit = async (idToken, firebaseEmail) => {
    console.log(idToken);
    const body = { token: idToken, email: firebaseEmail };
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      console.log("Insert user result: ", response);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <form className="w-25 m-5 mx-auto" onSubmit={handleSubmit}>
      <div className="form-outline mb-4">
        <input
          type="email"
          id="form2Example1"
          className="form-control"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <label className="form-label" htmlFor="form2Example1">
          Email address
        </label>
      </div>

      <div className="form-outline mb-4">
        <input
          type="password"
          id="form2Example2"
          className="form-control"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <label className="form-label" htmlFor="form2Example2">
          Password
        </label>
      </div>

      <div className="row mb-4">
        {/* <div className="col d-flex justify-content-center">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"

              id="form2Example31"
              checked
            />
            <label className="form-check-label" htmlFor="form2Example31">
              {" "}
              Remember me{" "}
            </label>
          </div>
        </div> */}

        {/* <div className="col">
          <a href="#!">Forgot password?</a>
        </div> */}
      </div>

      <button type="submit" className="btn btn-primary btn-block mb-4">
        Sign in
      </button>

      <div className="text-center">
        <p>
          Not a member? <Link to="/Register">Register</Link>
        </p>
      </div>
    </form>
  );
}

export default Login;
