import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import {auth} from '../firebase-config'


function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [login, setLogin] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("student")

  // const [user, setUser] = useState({});

  // onAuthStateChanged(auth, (currentUser) => {
  //   console.log(user)
  //   setUser(currentUser)
  // })

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };


  const handleNameChange = (event) => {
    setName(event.target.value);

  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(role + " " + name + " " + email + " " + password);

    const firebase_register = async () => {
      try {
        const user = await createUserWithEmailAndPassword(auth, email, password )
        console.log(user)

        // to do: after firebase register is done, it will return user information,
        // make a request to /register in server to save user's name, role, id to postgres
        navigate('/')
        
      } catch(error) {
        console.log(error.message)
      }
    }

    firebase_register()
  }

 
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
                        onChange={handleRoleChange}
                      />
                      <label className="form-check-label" htmlFor="flexRadioDefault1">
                        Student
                      </label>

                      <input
                        className="form-check-input ml-2 m-1"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        value="instructor"
                        onChange={handleRoleChange}
                      />
                      <label className="form-check-label pl-4" htmlFor="flexRadioDefault2">
                        Instructor
                      </label>
                    </div>

              

                    <div className="form-outline mb-4">
                      <input
                        type="text"
                        id="form3Example1cg"
                        className="form-control form-control-lg"
                        value={name}
                        onChange={handleNameChange}
                        required
                      />
                      <label className="form-label" htmlFor="form3Example1cg">
                        Your Name
                      </label>
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="email"
                        id="form3Example3cg"
                        className="form-control form-control-lg"
                        value={email}
                        onChange={handleEmailChange}
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
                        onChange={handlePasswordChange}
                        required
                      />
                      <label className="form-label" htmlFor="form3Example4cg">
                        Password
                      </label>
                    </div>

                    {/* <div className="form-outline mb-4">
                      <input
                        type="password"
                        id="form3Example4cdg"
                        className="form-control form-control-lg"
                      />
                      <label className="form-label" htmlFor="form3Example4cdg">
                        Repeat your password
                      </label>
                    </div> */}

                    {/* <div className="form-check d-flex justify-content-center mb-5">
                      <input
                        className="mr-2 mt-1"
                        type="checkbox"
                   
                        id="form2Example3cg"
                      />
                      <label className="form-check-label" htmlFor="form2Example3g">
                        I agree all statements in{" "}
                        <a href="#!" className="text-body">
                          <u>Terms of service</u>
                        </a>
                      </label>
                    </div> */}

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
