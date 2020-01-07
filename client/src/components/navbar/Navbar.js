import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import "./index.scss";

const Navbar = ({ userData }) => {
  if (!userData) {
    return <div>LOADING...</div>;
  }
  return (
    <nav className="navbar">
      <div className="navbar__links">
        <div>
          <NavLink to="/main" activeClassName="active">
            All posts
          </NavLink>
        </div>
        <div>
          <NavLink to="/create" activeClassName="active">
            Create post
          </NavLink>
        </div>
      </div>
      <NavLink to="/me" activeClassName="active" className="navbar__profile">
        <img src={userData.data.cover} alt={userData.data.covername} />
        <p>{userData.data.email}</p>
      </NavLink>
    </nav>
  );
};

let mapStateToProps = state => {
  return {
    userData: state.authReducer.userData
  };
};

export default connect(mapStateToProps)(Navbar);
