import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Box } from "@material-ui/core";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import {
  Button,
  Backdrop,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
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
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ld from "lodash";
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
  const history = useHistory();
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
  const [checked, setchecked] = useState(true);
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
    console.log();
    const url =
      "https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=" +
      ld.replace(carplate, new RegExp("-", "g"), "").toUpperCase();

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
          history.push("/");
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
          history.push("/");
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
    <div style={{ width: "100%" }}>
      <Box m={3}>
        <h1>Proefrit formulier</h1>
        <Box
          mt={10}
          ml={4}
          display="flex"
          justifyContent="flex-start"
          flexDirection="column"
        >
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
              <MenuItem value="None">Selecteer</MenuItem>
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
              label="Kenteken Auto"
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
                <h5>{"Handelsbenaming:   " + plateCheck[0].handelsbenaming}</h5>
              </div>
            )}
          </Box>
          <Box mt={5}>
            <TextField
              id="datetime-local"
              label="Moment klant vertrek"
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
            <InputLabel>Voorkant rijbewijs</InputLabel>
            <input
              capture="camera"
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
            <InputLabel> Achterkant rijbewijs</InputLabel>
            <input
              capture="camera"
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
              label="Telefoon"
              onChange={(e) => {
                setphone(e.target.value);
              }}
            ></TextField>
          </Box>
          <Box mt={5}>
            <TextField
              value={zipcode}
              onChange={(e) => {
                setzipcode(e.target.value);
              }}
              label="Postcode"
            ></TextField>
          </Box>
          <Box mt={5}>
            <TextField
              value={address}
              label="Huisnummer"
              onChange={(e) => {
                setaddress(e.target.value);
              }}
            ></TextField>
          </Box>

          <Box mt={5}>
            <Button
              onClick={() => {
                setdialog(true);
              }}
              variant="outlined"
            >
              Handtekening
            </Button>
            {signature == "" ? null : <CheckCircleIcon />}
          </Box>
          <Box mt={5}>
            <TextField
              id="datetime-local"
              label="Tijd van terugkomst"
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
          <Button
            color="primary"
            onClick={saveAsDraft}
            variant="outlined"
            style={{ marginRight: "15px" }}
          >
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
      <Dialog
        fullScreen={fullScreen}
        open={dialog}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <InputLabel>Handtekening</InputLabel>
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
          <Box mt={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={() => {
                    setchecked(!checked);
                  }}
                  name="primary"
                  color="primary"
                />
              }
              label="U gaat akkoord met de algemene voorwaarden van AutoXL"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={clearSig}
            color="primary"
            variant="outlined"
          >
            Wissen
          </Button>
          <Button
            onClick={() => {
              const x = signPad.current.toDataURL();
              setsignature(x);
              setdialog(false);
              setmessage("Signature Saved");
              setopen(true);
              seterror(false);
            }}
            color="primary"
            autoFocus
            variant="outlined"
          >
            Opslaan
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
