import React from "react";

function Login() {
  return (
    <div>
      Login
      <div>
        <form>
            <input type="radio" name="rad" defaultChecked></input>
            <label>Student</label>
            <input type="radio" name="rad"></input>
            <label>Instructor</label><br></br>
          <label>Username: </label>
          <input type="text" required></input><br></br>
          <label>Password: </label>
          <input type="text" required></input><br></br>
          <button>Log In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
