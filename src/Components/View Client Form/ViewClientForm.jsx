import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@material-ui/core";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import { Link } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
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

function ViewClientForm() {
  const classes = useStyles();
  const token = localStorage.getItem("user");
  const [open, setopen] = useState(false);
  const [message, setmessage] = useState("");
  const [error, seterror] = useState(false);
  const [data, setdata] = useState({});

  const { id } = useParams();

  const handleClose = (event, reason) => {
    setopen(false);
    if (reason === "clickaway") {
      return;
    }
  };

  useEffect(() => {
    axios
      .get("/client/form/" + id, { headers: { token: token } })
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
        <h1>Client Form</h1>
        <Box
          mt={10}
          ml={4}
          display="flex"
          justifyContent="flex-start"
          flexDirection="column"
        >
          <Typography variant="h5">
            {"Green plate: " + data.greenPlate}
          </Typography>
          <Box mt={5}>
            <Typography variant="h5">
              {"Car license: " + data.licensePlate}
            </Typography>
          </Box>

          <Box mt={5}>
            <Typography variant="h5">
              {"Start date: " +
                Moment(data.startDate).format("DD/MM/YYYY hh:mm:ss A")}
            </Typography>
          </Box>
          <Box mt={5}>
            <Link target="_blank" href={data.frontImageURL}>
              Front Image
            </Link>
          </Box>
          <Box mt={5}>
            <Link target="_blank" href={data.backImageURL}>
              Back Image
            </Link>
          </Box>
          <Box mt={5}>
            <Typography variant="h5">{"Phone: " + data.phone}</Typography>
          </Box>
          <Box mt={5}>
            <Typography variant="h5">{"Address: " + data.address}</Typography>
          </Box>
          <Box mt={5}>
            <Typography variant="h5">
              {"Postal code: " + data.postal_code}
            </Typography>
          </Box>
          <Box mt={5}>
            <InputLabel>Signature</InputLabel>
            <img src={data.signature} />
          </Box>
          <Box mt={5}>
            <Typography variant="h5">
              {"Return date: " +
                Moment(data.startDate).format("DD/MM/YYYY hh:mm:ss A")}
            </Typography>
          </Box>
        </Box>
      </Box>
      <div className={classes.root}>
        <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={error ? "error" : "success"}>
            {message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default ViewClientForm;
