import { LOGIN_SUCCESS, FAILURE, LOGOUT } from "./dispatch-types";

export const initialState = {
  jwt: "",
  username: "",
  user_id: "",
  isLoggedIn: false
};

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        jwt: action.payload.token,
        username: action.payload.user.username,
        user_id: action.payload.user.id,
        isLoggedIn: true
      };
    case FAILURE:
      return {
        ...state,
        ...initialState
      };
    case LOGOUT:
      return {
        ...initialState
      };
    default:
      return state;
  }
}
