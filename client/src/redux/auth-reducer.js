import { customAxios } from "../api/customAxios";

//ACTION TYPES
const LOGIN_USER = "LOGIN_USER";
const LOG_OUT = "LOG_OUT";
const GET_USER_INFO = "GET_USER_INFO";

//REDUCERS
let initialState = {
  isAuth: false,
  userData: null
};

const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOGIN_USER: {
      return {
        ...state,
        isAuth: true
      };
    }
    case GET_USER_INFO: {
      return {
        ...state,
        userData: payload
      };
    }
    case LOG_OUT: {
      return {
        ...state,
        isAuth: false
      };
    }
    default:
      return state;
  }
};

//ACTIONS
export const getUserInfo = user => ({
  type: GET_USER_INFO,
  payload: user
});

export const loginUser = () => ({
  type: LOGIN_USER
});

export const logout = () => ({
  type: LOG_OUT
});

//THUNKS
export const registrateNewUser = (email, password, cover) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  formData.append("cover", cover[0], cover[0]["filename"]);

  return async dispatch => {
    await customAxios.post("/auth/register", formData);
  };
};

export const getMe = () => {
  return async dispatch => {
    let response = await customAxios.get("/auth/getme");

    try {
      dispatch(getUserInfo(response.data));
      dispatch(loginUser());
    } catch (e) {
      console.log(e);
    }
  };
};

window.getMe = getMe;

export const authenticateUser = (email, password) => {
  return async dispatch => {
    let response = await customAxios.post("/auth/login", { email, password });
    if (response.status === 200) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: response.data.userId,
          token: response.data.token
        })
      );
      localStorage.setItem("token", response.data.token);
      window.customAxios.defaults.headers[
        "authorization"
      ] = `Bearer ${response.data.token}`;

      dispatch(loginUser());
    }
  };
};

export const logoutUser = () => {
  return dispatch => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.customAxios.defaults.headers["authorization"] = "";
    dispatch(logout());
  };
};

export default authReducer;
