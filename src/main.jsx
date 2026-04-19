import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import About from "./components/About";
import PageLoader from "./components/PageLoader";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <>
      <PageLoader />
      <Header />
      <About />
    </>
  </React.StrictMode>
);
