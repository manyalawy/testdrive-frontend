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
import UpdateClientForm from "./Components/UpdateClientForm/UpdateClientForm";
import ViewClientForm from "./Components/View Client Form/ViewClientForm";
import UpdateColleagueForm from "./Components/Update colleague form/UpdateColleagueFrom";
import Login from "./Components/Login/Login";
import ProtectedRoute from "./Sevices/ProtectedRoute";

ReactDOM.render(
  <>
    <Router>
      <ProtectedRoute component={Navbar} />
      <Route path="/login" component={Login} />
      <ProtectedRoute
        path="/client/form/update/:id"
        exact
        component={UpdateClientForm}
      />
      <ProtectedRoute
        path="/client/form/view/:id"
        exact
        component={ViewClientForm}
      />
      <ProtectedRoute
        path="/colleague/form/update/:id"
        exact
        component={UpdateColleagueForm}
      />
      <ProtectedRoute path="/client/draft" exact component={ClientDrafts} />
      <ProtectedRoute
        path="/colleague/draft"
        exact
        component={ColleagueDrafts}
      />
      <ProtectedRoute
        path="/colleague/submission"
        exact
        component={ColleagueSubmitions}
      />
      <ProtectedRoute
        path="/client/submission"
        exact
        component={ClienSubmissons}
      />
      <ProtectedRoute path="/client/form" exact component={ClientForm} />
      <ProtectedRoute path="/colleague/form" exact component={ColleagueForm} />
      <ProtectedRoute path="/settings" exact component={Settings} />
    </Router>
  </>,
  document.getElementById("root")
);
