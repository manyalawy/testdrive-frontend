import React, { useState } from "react";
import { TextField, Box, uses } from "@material-ui/core";
import { useHistory, Redirect } from "react-router-dom";
import logo from "../Login/xlproef.png";
import { Button } from "react-bootstrap";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import isAuth from "../../Sevices/isAuth";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));
export default function Login() {
  const history = useHistory();
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState(false);
  const [message, setmessage] = useState("");
  const classes = useStyles();
  const [open, setopen] = useState(false);
  const handleClose = (event, reason) => {
    setopen(false);
    if (reason === "clickaway") {
      return;
    }
  };

  const handleLogin = () => {
    if (username === "" || password === "") {
      seterror(true);
      setmessage("Please enter username and password");
      setopen(true);
      return;
    }
    axios
      .post("/login", {
        username: username,
        password: password,
      })
      .then((res) => {
        console.log(res);
        if (res.data.token) {
          localStorage.setItem("user", res.data.token);
          history.push("/client/submission");
        }
      })
      .catch((error) => {
        seterror(true);
        setmessage(error.response.data.error);
        setopen(true);
      });
  };

  return isAuth() ? (
    <Redirect to="/client/submission" />
  ) : (
    <div>
      <Box mt={10} flexDirection="column">
        <Box justifyContent="center" display="flex">
          <img src={logo} alt="" />
        </Box>
        <Box mt={5} justifyContent="center" display="flex">
          <TextField
            label="Usernme"
            value={username}
            onChange={(e) => {
              setusername(e.target.value);
            }}
          />
        </Box>
        <Box mt={5} justifyContent="center" display="flex">
          <TextField
            value={password}
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            label="Password"
            type="password"
          />
        </Box>
        <Box mt={5} justifyContent="center" display="flex">
          <Button onClick={handleLogin} variant="dark">
            Login
          </Button>
        </Box>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={error ? "error" : "success"}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
