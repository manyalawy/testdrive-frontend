import { Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import Alert from "../SnackBars/Alert";
import React from "react";
import { useHistory } from "react-router-dom";

function NavigationBar() {
  const history = useHistory();
  const handleLogout = () => {
    localStorage.removeItem("user");
    history.push("/login");
  };
  return (
    <div style={{ fontSize: 20 }}>
      <Navbar
        style={{ margin: 0, border: 0, width: "100%" }}
        bg="dark"
        variant="dark"
        expand="lg"
      >
        <Navbar.Brand>XLPROEF</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title="Clients" id="basic-nav-dropdown">
              <NavDropdown.Item href="/client/form">Add form</NavDropdown.Item>
              <NavDropdown.Item href="/client/submission">
                Submissions
              </NavDropdown.Item>
              <NavDropdown.Item href="/client/draft">Draft</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Colleagues" id="basic-nav-dropdown">
              <NavDropdown.Item href="/colleague/form">
                Add form
              </NavDropdown.Item>
              <NavDropdown.Item href="/colleague/submission">
                Submissions
              </NavDropdown.Item>
              <NavDropdown.Item href="/colleague/draft">Draft</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/settings">Settings</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link>
              <Button onClick={handleLogout} variant="danger">
                Logout
              </Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default NavigationBar;
