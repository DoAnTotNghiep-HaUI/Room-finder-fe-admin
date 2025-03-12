import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./css/font.css";
import "./css/global.css";
import App from "./App";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
