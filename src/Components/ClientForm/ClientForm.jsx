import React, { useState, useEffect, useRef } from "react";
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
import SignatureCanvas from "react-signature-canvas";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

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

function ClientForm() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  const token = localStorage.getItem("user");
  const [greenPlates, setgreenPlates] = useState([]);
  const [open, setopen] = useState(false);
  const [dialog, setdialog] = useState(false);
  const [message, setmessage] = useState("");
  const [error, seterror] = useState(false);
  const [selectedGreenPlate, setselectedGreenPlate] = useState("None");
  const [carplate, setcarplate] = useState("");
  const [plateCheck, setplateCheck] = useState("");
  const [startDate, setstartDate] = useState(
    Moment().format("yyyy-MM-DDTHH:mm")
  );
  const [frontimage, setfrontimage] = useState("");
  const [backimage, setbackimage] = useState("");
  const [phone, setphone] = useState("");
  const [address, setaddress] = useState("");
  const [zipcode, setzipcode] = useState("");
  const [returnDate, setreturnDate] = useState("");
  const [loading, setloading] = useState(false);
  const [signature, setsignature] = useState("");

  let signPad = useRef({});

  const handleClose = (event, reason) => {
    setopen(false);
    if (reason === "clickaway") {
      return;
    }
  };

  const clearSig = () => {
    signPad.current.clear();
  };

  const checkCarPlate = (e) => {
    const url =
      "https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=" + carplate;
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

  const saveAsDraft = async () => {
    if (!frontimage || !backimage) {
      setopen(true);
      setmessage("Please add images");
      seterror(true);
      return;
    }
    const data = {
      greenPlate: selectedGreenPlate,
      licensePlate: carplate,
      startDate: startDate,
      status: "draft",
      phone: phone,
      postal_code: zipcode,
      address: address,
      signature: signature,
    };
    if (returnDate !== "") {
      data.returnDate = returnDate;
    }

    const front = new FormData();
    front.append("upload_preset", "xlproef");
    front.append("file", frontimage);
    setloading(true);
    try {
      const first = await axios.post(
        "https://api.cloudinary.com/v1_1/viral-online-commerce/image/upload",
        front
      );

      data.frontImageURL = first.data.url;
      data.frontImageID = first.data.public_id;

      const back = new FormData();
      back.append("upload_preset", "xlproef");
      back.append("file", backimage);
      const sec = await axios.post(
        "https://api.cloudinary.com/v1_1/viral-online-commerce/image/upload",
        back
      );
      data.backImageURL = sec.data.url;
      data.backImageID = sec.data.public_id;
    } catch (error) {
      setopen(true);
      seterror(true);
      if (error.response.data.error) {
        setmessage("Error: " + error.response.data.error);
      } else {
        setmessage("Error");
        console.log(error);
      }
    }

    await axios
      .post("/client/form", data, { headers: { token: token } })
      .then((res) => {
        if (res.data.success == true) {
          setopen(true);
          seterror(false);
          setmessage("Form saved to drafts");
        }
      })
      .catch((error) => {
        setopen(true);
        seterror(true);
        setmessage("Error: " + error.response.data.error);
      });
    setloading(false);
  };

  const submit = async () => {
    if (!frontimage || !backimage) {
      setopen(true);
      setmessage("Please add images");
      seterror(true);
      return;
    }
    const data = {
      greenPlate: selectedGreenPlate,
      licensePlate: carplate,
      startDate: startDate,
      status: "submitted",
      phone: phone,
      postal_code: zipcode,
      address: address,
      signature: signature,
      returnDate: returnDate,
    };

    const front = new FormData();
    front.append("upload_preset", "xlproef");
    front.append("file", frontimage);
    setloading(true);
    try {
      const first = await axios.post(
        "https://api.cloudinary.com/v1_1/viral-online-commerce/image/upload",
        front
      );

      data.frontImageURL = first.data.url;
      data.frontImageID = first.data.public_id;

      const back = new FormData();
      back.append("upload_preset", "xlproef");
      back.append("file", backimage);
      const sec = await axios.post(
        "https://api.cloudinary.com/v1_1/viral-online-commerce/image/upload",
        back
      );
      data.backImageURL = sec.data.url;
      data.backImageID = sec.data.public_id;
    } catch (error) {
      setopen(true);
      seterror(true);
      if (error.response.data.error) {
        setmessage("Error: " + error.response.data.error);
      } else {
        setmessage("Error");
        console.log(error);
      }
    }

    await axios
      .post("/client/form", data, { headers: { token: token } })
      .then((res) => {
        if (res.data.success == true) {
          setopen(true);
          seterror(false);
          setmessage("Form saved to drafts");
        }
      })
      .catch((error) => {
        setopen(true);
        seterror(true);
        setmessage("Error: " + error.response.data.error);
      });
    setloading(false);
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
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Green plate</InputLabel>
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
          <Box display="flex" alignItems="flex-end" flexDirection="row">
            <TextField
              value={carplate}
              style={{ width: 150, marginTop: 40 }}
              label="Car plate"
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
                <h5>{"Brand:  " + plateCheck[0].merk}</h5>
                <h5>{"Type:   " + plateCheck[0].handelsbenaming}</h5>
              </div>
            )}
          </Box>
          <Box mt={5}>
            <TextField
              id="datetime-local"
              label="Start date"
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
            <InputLabel>Front image</InputLabel>
            <input
              accept=".jpg,.jpeg,.png"
              type="file"
              id="front"
              name="filename"
              onChange={(e) => {
                setfrontimage(e.target.files[0]);
              }}
            ></input>
          </Box>
          <Box mt={5}>
            <InputLabel>Back image</InputLabel>
            <input
              accept=".jpg,.jpeg,.png"
              type="file"
              id="back"
              name="filename"
              onChange={(e) => {
                setbackimage(e.target.files[0]);
              }}
            ></input>
          </Box>
          <Box mt={5}>
            <TextField
              value={phone}
              label="Phone number"
              onChange={(e) => {
                setphone(e.target.value);
              }}
            ></TextField>
          </Box>
          <Box mt={5}>
            <TextField
              value={address}
              label="Address"
              onChange={(e) => {
                setaddress(e.target.value);
              }}
            ></TextField>
          </Box>
          <Box mt={5}>
            <TextField
              value={zipcode}
              onChange={(e) => {
                setzipcode(e.target.value);
              }}
              label="Postal code"
            ></TextField>
          </Box>
          <Box mt={5}>
            <Button
              onClick={() => {
                setdialog(true);
              }}
            >
              Open Signature
            </Button>
          </Box>
          <Box mt={5}>
            <TextField
              id="datetime-local"
              label="Return date"
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
          <Button color="primary" onClick={saveAsDraft}>
            Save as draft
          </Button>
          <Button color="primary" onClick={submit}>
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
      <Dialog
        fullScreen={fullScreen}
        open={dialog}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <InputLabel>Signature</InputLabel>
          <div style={{ backgroundColor: "#f5f5f5", width: 300, height: 300 }}>
            <SignatureCanvas
              ref={signPad}
              penColor="black"
              canvasProps={{
                width: 300,
                height: 300,
                className: "sigCanvas",
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={clearSig} color="primary">
            Clear
          </Button>
          <Button
            onClick={() => {
              const x = signPad.current.toDataURL();
              setsignature(x);
              setdialog(false);
            }}
            color="primary"
            autoFocus
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const getBase64 = (file, cb) => {
  if (file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }
};

export default ClientForm;
