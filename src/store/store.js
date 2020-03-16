import { createStore, combineReducers } from "redux";
import { toogleReduecer } from "../reducers/toogleReducer";

export default createStore(
  combineReducers({ toogleReduecer }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
