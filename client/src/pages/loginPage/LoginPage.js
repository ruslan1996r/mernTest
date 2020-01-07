import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { authenticateUser } from "../../redux/auth-reducer";
import "./index.scss";

const LoginPage = props => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [show, setShow] = useState(true);

  const login = e => {
    e.preventDefault();
    props.authenticateUser(email, password);
  };

  return (
    <div className="login">
      <h2>LoginPage</h2>
      <form onSubmit={login}>
        <div className="login__field">
          <label htmlFor="email">Email</label>
          <input
            placeholder="Enter email"
            id="email"
            type="email"
            name="email"
            required
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="login__field">
          <label htmlFor="password">Password</label>
          <input
            placeholder="Enter password"
            id="password"
            type={show ? "password" : "text"}
            name="password"
            required
            onChange={e => setPassword(e.target.value)}
          />
          <div className="login__field-show" onClick={() => setShow(!show)}>
            Show
          </div>
        </div>
        <button type="submit" value="login">
          LOGIN
        </button>
      </form>
      <Link to="/registration">Registration</Link>
    </div>
  );
};

export default connect(null, { authenticateUser })(LoginPage);
