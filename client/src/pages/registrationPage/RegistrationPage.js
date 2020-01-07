import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { registrateNewUser } from "../../redux/auth-reducer";
import "./index.scss";

const RegistrationPage = props => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [cover, setCover] = useState(null);
  const [show, setShow] = useState(true);

  const registrate = e => {
    e.preventDefault();
    props.registrateNewUser(email, password, cover);
  };

  return (
    <div className="registrate">
      <h2>RegistrationPage</h2>
      <form onSubmit={registrate}>
        <div className="registrate__field">
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
        <div className="registrate__field">
          <label htmlFor="password">Password</label>
          <input
            placeholder="Enter password"
            id="password"
            type={show ? "password" : "text"}
            name="password"
            required
            onChange={e => setPassword(e.target.value)}
          />
          <div
            className="registrate__field-show"
            onClick={() => setShow(!show)}
          >
            Show
          </div>
        </div>
        <div className="registrate__field">
          <label htmlFor="cover">Select avatar</label>
          <input
            type="file"
            name="cover"
            id="cover"
            required
            onChange={e => setCover(e.target.files)}
          />
        </div>
        <button type="submit" value="registrate">
          REGISTRATE
        </button>
      </form>
      <Link to="/login">login</Link>
    </div>
  );
};

export default connect(null, { registrateNewUser })(RegistrationPage);
