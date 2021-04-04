import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@material-ui/core";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import { Button, Backdrop, CircularProgress, Link } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Moment from "moment";
import { useParams } from "react-router-dom";

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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function UpdateColleagueForm() {
  const classes = useStyles();
  const token = localStorage.getItem("user");
  const [open, setopen] = useState(false);
  const [message, setmessage] = useState("");
  const [error, seterror] = useState(false);
  const [returnDate, setreturnDate] = useState("");
  const [loading, setloading] = useState(false);
  const [data, setdata] = useState({});

  const { id } = useParams();

  const handleClose = (event, reason) => {
    setopen(false);
    if (reason === "clickaway") {
      return;
    }
  };

  const submit = () => {
    const data = {
      returnDate: returnDate,
      status: "submitted",
      submissionDate: Moment().format("yyyy-MM-DDTHH:mm"),
    };
    setloading(true);
    axios
      .patch("/collegue/form/" + id, data, { headers: { token: token } })
      .then((res) => {
        setloading(false);
        if (res.data.success == true) {
          setopen(true);
          seterror(false);
          setmessage("Form submitted");
        }
      })
      .catch((error) => {
        setloading(false);
        setopen(true);
        seterror(true);
        setmessage("Error: " + error.response.data.error);
      });
  };

  useEffect(() => {
    axios
      .get("/collegue/form/" + id, { headers: { token: token } })
      .then((res) => {
        console.log(res.data.form);
        setdata(res.data.form);
      })
      .catch((error) => {
        setopen(true);
        seterror(true);
        setmessage("Error: " + error.response.data.error);
      });
  }, []);

  return (
    <div>
      <Box m={3}>
        <h1>Medewerker Form</h1>
        <Box
          mt={10}
          ml={4}
          display="flex"
          justifyContent="flex-start"
          flexDirection="column"
        >
          <Typography variant="h5">
            {"Kenteken groeneplaat: " + data.greenPlate}
          </Typography>
          <Box mt={5}>
            <Typography variant="h5">
              {"Kenteken auto: " + data.licensePlate}
            </Typography>
          </Box>
          <Box mt={5}>
            <Typography variant="h5">
              {"Medewerker: " + data.colName}
            </Typography>
          </Box>
          <Box mt={5}>
            <Typography variant="h5">
              {"Begin datum: " +
                Moment(data.startDate).format("DD/MM/YYYY HH:mm:ss")}
            </Typography>
          </Box>
          <Box mt={5}>
            <TextField
              id="datetime-local"
              label="Retourdatum"
              type="datetime-local"
              style={{ width: 200 }}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              value={returnDate}
              onChange={(e) => {
                setreturnDate(e.target.value);
              }}
            />
          </Box>
        </Box>
        <Box mt={5} display="flex" justifyContent="flex-end">
          <Button color="primary" onClick={submit} variant="outlined">
            Submit
          </Button>
        </Box>
      </Box>
      <div className={classes.root}>
        <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={error ? "error" : "success"}>
            {message}
          </Alert>
        </Snackbar>
      </div>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default UpdateColleagueForm;
