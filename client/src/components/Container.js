import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { getMe } from "../redux/auth-reducer";
import { useRoutes } from "../routes";
import Loader from "../components/loader/loader";

const Container = props => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    props
      .getMe()
      .then(() => setLoading(false))
      .catch(e => setLoading(false));
  }, [localStorage.length]);

  //передаёт Boolean, в зависимости от которого меняются доступные роуты
  const routes = useRoutes(props.isAuth);

  if (loading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      {props.isAuth && <Navbar />}
      <div className="container">{routes}</div>
      {props.isAuth && <Footer />}
    </React.Fragment>
  );
};

let mapStateToProps = state => {
  return {
    isAuth: state.authReducer.isAuth
  };
};

export default connect(mapStateToProps, { getMe })(Container);
