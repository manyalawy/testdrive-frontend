import React from "react";
import ReactDOM from "react-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import ClientForm from "../src/Components/ClientForm/ClientForm";
import ColleagueForm from "./Components/Colleague Form/ColleagueForm";
import Navbar from "./Components/NavBar/NavBar";
import { Route, BrowserRouter as Router } from "react-router-dom";
import ClientDrafts from "./Components/Client drafts/ClientDrafts";
import ColleagueDrafts from "./Components/Colleague drafts/ColleagueDrafts";
import ClienSubmissons from "./Components/Client Submissions/ClientSubmissions";
import ColleagueSubmitions from "./Components/Colleague submissioins/ColleagueSubmissions";
import Settings from "./Components/Settings/Settings";

ReactDOM.render(
  <>
    <Navbar />
    <Router>
      <Route path="/client/draft" component={ClientDrafts} />
      <Route path="/colleague/draft" component={ColleagueDrafts} />
      <Route path="/colleague/submission" component={ColleagueSubmitions} />
      <Route path="/client/submission" component={ClienSubmissons} />
      <Route path="/client/form" component={ClientForm} />
      <Route path="/colleague/form" component={ColleagueForm} />
      <Route path="/settings" component={Settings} />
    </Router>
  </>,
  document.getElementById("root")
);
