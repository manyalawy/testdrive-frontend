import { Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import React from "react";
import { useHistory } from "react-router-dom";

function NavigationBar() {
  const history = useHistory();
  const handleLogout = () => {
    localStorage.removeItem("user");
    history.push("/login");
  };
  return (
    <div style={{ fontSize: 30, marginRight: -90 }}>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title="Klanten" id="basic-nav-dropdown">
              <NavDropdown.Item href="/client/form">Add form</NavDropdown.Item>
              <NavDropdown.Item href="/client/submission">
                Submissions
              </NavDropdown.Item>
              <NavDropdown.Item href="/client/draft">Draft</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Medewerker" id="basic-nav-dropdown">
              <NavDropdown.Item href="/colleague/form">
                Add form
              </NavDropdown.Item>
              <NavDropdown.Item href="/colleague/submission">
                Submissions
              </NavDropdown.Item>
              <NavDropdown.Item href="/colleague/draft">Draft</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Instellingen" id="basic-nav-dropdown">
              <NavDropdown.Item href="/settings">Instellingen</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default NavigationBar;
