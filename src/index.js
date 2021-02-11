import React from "react";
import ReactDOM from "react-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import ClientForm from "../src/Components/ClientForm/ClientForm";
import ColleagueForm from "./Components/Colleague Form/ColleagueForm";
import Navbar from "./Components/NavBar/NavBar";
import { Route, BrowserRouter as Router } from "react-router-dom";
import ClientDrafts from "./Components/Client drafts/ClientDrafts";

ReactDOM.render(
  <>
    <Navbar />
    <Router>
      <Route path="/" component={ClientDrafts} />
      <Route path="/client/form" component={ClientForm} />
      <Route path="/colleague/form" component={ColleagueForm} />
    </Router>
  </>,
  document.getElementById("root")
);
