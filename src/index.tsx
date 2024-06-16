import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Entries from "./pages/Entries";
import Form from "./pages/Form";
import Backup from "./pages/Backup";
import ChangePassword from "./pages/ChangePassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/change_password",
    element: <ChangePassword />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/entries/:categoryId",
    element: <Entries />,
  },
  {
    path: "/form/:categoryId/:entryId",
    element: <Form />,
  },
  {
    path: "/backup",
    element: <Backup />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
