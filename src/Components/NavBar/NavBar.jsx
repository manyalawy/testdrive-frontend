import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Badge } from "@material-ui/core";
import MailIcon from "@material-ui/icons/ListAlt";
import axios from "axios";
import logo from "./xlproef.png";

function NavigationBar() {
  const history = useHistory();
  const isBigScreen = useMediaQuery({ query: "(min-device-width: 700px)" });
  const [invisible, setinvisible] = useState(true);
  const token = localStorage.getItem("user");
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
    <div style={{ fontSize: 20, marginRight: isBigScreen ? 0 : -36 }}>
      <Navbar bg="dark" variant="dark" expand="xs">
        <Nav className="mr-auto">
          <Nav.Link href="/">Home pagina</Nav.Link>
        </Nav>

        <Nav>
          <Badge
            color="secondary"
            style={{
              marginRight: "50px",
              color: "white",
            }}
            variant="dot"
            invisible={invisible}
          >
            <MailIcon />
          </Badge>
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavigationBar;
