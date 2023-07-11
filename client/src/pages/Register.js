import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase-config";
import uuid from "react-uuid";

function Register() {
  const navigate = useNavigate();
  const [uId, setUId] = useState(uuid);
  const [email, setEmail] = useState("");
  const [fname, setfname] = useState("");
  const [lname, setlname] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  // const [user, setUser] = useState({});

  // onAuthStateChanged(auth, (currentUser) => {
  //   console.log(user)
  //   setUser(currentUser)
  // })

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(
      role + " " + fname + " " + lname + " " + email + " " + password + " " + uId
    );
      var temp;
    const firebase_register = async () => {
      try {
        const user = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )
        // after firebase register is done,
        // it will return user information in user variable
        // todo: extract firebase user id and
        //make a request to /register in server
        //to save user's name, role, firebase user id to postgres
        navigate("/");
      } catch (error) {
        console.error(error.message);
      }
    };
    firebase_register();
    //fetch post request
    const regBody = {
      userid: uId,
      userEmail: email,
      userPassword: password,
      userFname: fname,
      userLname: lname,
      userRole: role,
    };
    console.log(regBody);
    try {
      const response = await fetch("http://localhost:3500/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regBody),
      });
      console.log(response);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <section className="vh-100 bg-image">
      <div className="mask d-flex align-items-center h-100 gradient-custom-3">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card">
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-5">
                    Create an account:
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-check mb-4">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                        defaultChecked
                        value="student"
                        onChange={(e) => setRole(e.target.value)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault1"
                      >
                        Student
                      </label>

                      <input
                        className="form-check-input ml-2 m-1"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        value="instructor"
                        onChange={(e) => setRole(e.target.value)}
                      />
                      <label
                        className="form-check-label pl-4"
                        htmlFor="flexRadioDefault2"
                      >
                        Instructor
                      </label>
                    </div>
                    <div className="form-outline mb-4">
                      <input
                        type="text"
                        id="form3Example1cg"
                        className="form-control form-control-lg"
                        value={fname}
                        onChange={(e) => setfname(e.target.value)}
                        required
                      />
                      <label className="form-label" htmlFor="form3Example1cg">
                        Your First Name
                      </label>
                    </div>{" "}
                    <div className="form-outline mb-4">
                      <input
                        type="text"
                        id="form3Example1cg"
                        className="form-control form-control-lg"
                        value={lname}
                        onChange={(e) => setlname(e.target.value)}
                        required
                      />
                      <label className="form-label" htmlFor="form3Example1cg">
                        Your Last Name
                      </label>
                    </div>
                    <div className="form-outline mb-4">
                      <input
                        type="email"
                        id="form3Example3cg"
                        className="form-control form-control-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <label className="form-label" htmlFor="form3Example3cg">
                        Your Email
                      </label>
                    </div>
                    <div className="form-outline mb-4">
                      <input
                        type="password"
                        id="form3Example4cg"
                        className="form-control form-control-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <label className="form-label" htmlFor="form3Example4cg">
                        Password
                      </label>
                    </div>
                    <div className="d-flex justify-content-center">
                      <button
                        type="submit"
                        className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                      >
                        Register
                      </button>
                    </div>
                    <p className="text-center text-muted mt-5 mb-0">
                      Have already an account?{" "}
                      <Link to="/login" className="fw-bold text-body">
                        <u>Login here</u>
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
