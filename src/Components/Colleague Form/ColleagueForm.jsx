import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Box } from "@material-ui/core";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import { Button, Backdrop, CircularProgress } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Moment from "moment";
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

function ColleagueForm() {
  const history = useHistory();
  const classes = useStyles();
  const token = localStorage.getItem("user");
  const [greenPlates, setgreenPlates] = useState([]);
  const [open, setopen] = useState(false);
  const [message, setmessage] = useState("");
  const [error, seterror] = useState(false);
  const [selectedGreenPlate, setselectedGreenPlate] = useState("None");
  const [carplate, setcarplate] = useState("");
  const [plateCheck, setplateCheck] = useState("");

  const [startDate, setstartDate] = useState(
    Moment().format("yyyy-MM-DDTHH:mm")
  );
  const [returnDate, setreturnDate] = useState("");
  const [loading, setloading] = useState(false);
  const [colleague, setcolleague] = useState([]);
  const [selectedcol, setselectedcol] = useState("");

  const handleClose = (event, reason) => {
    setopen(false);
    if (reason === "clickaway") {
      return;
    }
  };

  const checkCarPlate = (e) => {
    const url =
      "https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=" +
      carplate.toUpperCase();
    if (carplate == "") {
      setopen(true);
      seterror(true);
      setmessage("Please enter car plate first");
      return;
    }
    axios.get(url).then((res) => {
      setplateCheck(res.data);
    });
  };

  const saveAsDraft = () => {
    const data = {
      greenPlate: selectedGreenPlate,
      licensePlate: carplate,
      startDate: startDate,
      status: "draft",
      colName: selectedcol,
    };
    if (returnDate !== "") {
      data.returnDate = returnDate;
    }
    setloading(true);
    axios
      .post("/collegue/form", data, { headers: { token: token } })
      .then((res) => {
        setloading(false);
        if (res.data.message) {
          setopen(true);
          seterror(false);
          setmessage("Form saved to drafts");
          history.push("/");
        }
      })
      .catch((error) => {
        setloading(false);
        setopen(true);
        seterror(true);
        setmessage("Error: " + error.response.data.error);
      });
  };

  const submit = () => {
    const data = {
      colName: selectedcol,
      greenPlate: selectedGreenPlate,
      licensePlate: carplate,
      returnDate: returnDate,
      startDate: startDate,
      status: "submitted",
      submissionDate: Moment().format("yyyy-MM-DDTHH:mm"),
    };
    setloading(true);
    axios
      .post("/collegue/form", data, { headers: { token: token } })
      .then((res) => {
        setloading(false);
        if (res.data.message) {
          setopen(true);
          seterror(false);
          setmessage("Form submitted");
          history.push("/");
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
      .get("/greenPlate", { headers: { token: token } })
      .then((res) => {
        setgreenPlates(res.data.plates);
      })
      .catch((error) => {
        setopen(true);
        seterror(true);
        setmessage("Error: " + error.response.data.error);
      });

    axios
      .get("/collegue", { headers: { token: token } })
      .then((res) => {
        setcolleague(res.data.colleagues);
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
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">
              Kies medewerker
            </InputLabel>
            <Select
              style={{ width: 200 }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedcol}
              onChange={(e) => {
                setselectedcol(e.target.value);
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {colleague.map((col) => {
                return (
                  <MenuItem key={col._id} value={col.username}>
                    {col.username}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Box mt={5}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">
                Kenteken groeneplaat
              </InputLabel>
              <Select
                style={{ width: 200 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedGreenPlate}
                onChange={(e) => {
                  setselectedGreenPlate(e.target.value);
                }}
              >
                <MenuItem value="None">None</MenuItem>
                {greenPlates.map((plate) => {
                  return (
                    <MenuItem key={plate._id} value={plate.number}>
                      {plate.number}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          <Box display="flex" alignItems="flex-end" flexDirection="row">
            <TextField
              value={carplate}
              style={{ width: 150, marginTop: 40 }}
              label="Kenteken auto"
              onChange={(e) => {
                setcarplate(e.target.value);
              }}
            />
            <Button
              onClick={checkCarPlate}
              style={{ marginLeft: "5%" }}
              variant="contained"
            >
              Check car
            </Button>
          </Box>
          <Box mt={5}>
            {plateCheck === "" ? null : plateCheck.length === 0 ? (
              <h5>Car not found</h5>
            ) : (
              <div>
                <h5>{"Merk:  " + plateCheck[0].merk}</h5>
                <h5>{"Handeksbenaming:   " + plateCheck[0].handelsbenaming}</h5>
              </div>
            )}
          </Box>
          <Box mt={5}>
            <TextField
              id="datetime-local"
              label="Begin datum"
              type="datetime-local"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              value={startDate}
              onChange={(e) => {
                setstartDate(e.target.value);
              }}
            />
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
          <Button color="primary" onClick={saveAsDraft} variant="outlined">
            Bewaar als concept
          </Button>
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

export default ColleagueForm;
