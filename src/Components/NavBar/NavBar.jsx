import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Badge } from "@material-ui/core";
import MailIcon from "@material-ui/icons/ListAlt";
import axios from "axios";

function NavigationBar() {
  const history = useHistory();
  const isBigScreen = useMediaQuery({ query: "(min-device-width: 700px)" });
  const [invisible, setinvisible] = useState(true);
  const token = localStorage.getItem("user");
  const handleLogout = () => {
    localStorage.removeItem("user");
    history.push("/login");
  };
  useEffect(async () => {
    const clientDrafts = await axios.get("/client/draft", {
      headers: { token: token },
    });
    const colDrafts = await axios.get("/collegue/draft", {
      headers: { token: token },
    });
    if (
      colDrafts.data.forms.length != 0 ||
      clientDrafts.data.forms.length != 0
    ) {
      setinvisible(false);
    } else {
      setinvisible(true);
    }
  }, []);

  return (
    <div style={{ fontSize: 30, marginRight: isBigScreen ? 0 : -55 }}>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title="Klanten" id="basic-nav-dropdown">
              <NavDropdown.Item href="/client/form">Add form</NavDropdown.Item>

              <NavDropdown.Item href="/client/draft">Draft</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Medewerker" id="basic-nav-dropdown">
              <NavDropdown.Item href="/colleague/form">
                Add form
              </NavDropdown.Item>

              <NavDropdown.Item href="/colleague/draft">Draft</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Instellingen" id="basic-nav-dropdown">
              <NavDropdown.Item href="/colleague/submission">
                Colleage Submissions
              </NavDropdown.Item>
              <NavDropdown.Item href="/client/submission">
                Client Submissions
              </NavDropdown.Item>
              <NavDropdown.Item href="/settings">Instellingen</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        <Nav>
          <Badge
            color="secondary"
            style={{ marginRight: "50px", color: "white" }}
            variant="dot"
            invisible={invisible}
          >
            <MailIcon />
          </Badge>
        </Nav>
      </Navbar>{" "}
    </div>
  );
}

export default NavigationBar;
