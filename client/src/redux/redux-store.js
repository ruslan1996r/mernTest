import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";

import authReducer from "./auth-reducer";
import postReducer from "./post-reducer";

let reducers = combineReducers({
  authReducer,
  postReducer
});

//Если установлено расширение redux-devtools, то в объекте window оно найдётся и запустится. Если нет, то compose

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);

window._storeState = store.getState();
window._store = store;

export default store;
