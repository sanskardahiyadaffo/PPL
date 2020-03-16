import { isLogin } from "../actions/toogleActions";
const initialStates = {
  isLogin: false
};

export function toogleReduecer(state = initialStates, action) {
  switch (action.type) {
    case isLogin:
      return {
        ...state,
        isLogin: action.value
      };

    default:
      return state;
  }
}
