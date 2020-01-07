import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// Redirect - перекидывает на определённый роут, если был введён несуществующий путь

import RegistrationPage from "./pages/registrationPage/RegistrationPage";
import LoginPage from "./pages/loginPage/LoginPage";
import MainPage from "./pages/mainPage/MainPage";
import ProfilePage from "./pages/profilePage/ProfilePage";
import ViewPage from "./pages/viewPage/ViewPage";
import CreatePage from "./pages/createPage/CreatePage";

export const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/main" exact>
          <MainPage />
        </Route>
        <Route path="/me" exact>
          <ProfilePage />
        </Route>
        <Route path="/create">
          <CreatePage />
        </Route>
        <Route path="/view/:id">
          <ViewPage />
        </Route>
        <Redirect to="/main" />
      </Switch>
    );
  }
  return (
    <Switch>
      <Route path="/registration" exact>
        <RegistrationPage />
      </Route>
      <Route path="/login" exact>
        <LoginPage />
      </Route>
      <Redirect to="/login" />
    </Switch>
  );
};
