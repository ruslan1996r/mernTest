import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import store from "./redux/redux-store";
import Container from "./components/Container";

const App = () => {
  return (
    <Router>
      <Provider store={store}>
        <Container />
      </Provider>
    </Router>
  );
};

export default App;
