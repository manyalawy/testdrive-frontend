import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Box } from "@material-ui/core";
import axios from "axios";
import DeleteIcon from "@material-ui/icons/Delete";
import { Button, Backdrop, CircularProgress } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const columns = [
  {
    id: "colName",
    label: "Medewerker",
    minWidth: 170,
  },
  {
    id: "options",
    label: "Opties",
    minWidth: 170,
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
    [theme.breakpoints.up("sm")]: {
      width: "40%",
    },
  },
  container: {
    maxHeight: 440,
  },
  alert: {
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

export default function Colleagues() {
  const token = localStorage.getItem("user");
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setrows] = useState([]);
  const [open, setopen] = useState(false);
  const [message, setmessage] = useState("");
  const [error, seterror] = useState(false);
  const [backdrop, setbackdrop] = useState(false);
  const [dialog, setdialog] = useState(false);
  const [name, setname] = useState("");
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAdd = () => {
    setdialog(false);
    axios
      .post("/collegue", { name: name }, { headers: { token: token } })
      .then((res) => {
        setname("");
        if (res.data.success) {
          setopen(true);
          setmessage("Medewerker added");
          seterror(false);
          axios.get("/collegue", { headers: { token: token } }).then((res) => {
            setrows(res.data.colleagues);
          });
        }
      })
      .catch((error) => {
        setname("");
        setopen(true);
        seterror(true);
        setmessage("Error: " + error.response.data.error);
      });
  };

  const handleDelete = (id) => {
    setbackdrop(true);
    axios
      .delete("/collegue/" + id, { headers: { token: token } })
      .then((res) => {
        if (res.data.success) {
          setopen(true);
          setmessage("Medewerker deleted");
          seterror(false);
          axios.get("/collegue", { headers: { token: token } }).then((res) => {
            setrows(res.data.colleagues);
          });
        }
      })
      .catch((error) => {
        setopen(true);
        seterror(true);
        setmessage("Error: " + error.response.data.error);
      });
    setbackdrop(false);
  };

  useEffect(() => {
    axios.get("/collegue", { headers: { token: token } }).then((res) => {
      setrows(res.data.colleagues);
    });
  }, []);
  return (
    <div>
      <Box m={5}>
        <h1>Medewerker</h1>
      </Box>
      <Box mt={5} mr={3} display="flex" justifyContent="flex-end">
        <Button
          onClick={() => {
            setdialog(true);
          }}
          variant="contained"
          color="primary"
        >
          Medewerker toevoegen
        </Button>
      </Box>
      <Box mt={4} display="flex" justifyContent="center">
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        key={row._id}
                        hover
                        role="checkbox"
                        tabIndex={-1}
                      >
                        <TableCell>{row.name}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => {
                              handleDelete(row._id);
                            }}
                          >
                            <DeleteIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      <div className={classes.alert}>
        <Snackbar
          open={open}
          autoHideDuration={10000}
          onClose={() => {
            setopen(false);
          }}
        >
          <Alert
            onClose={() => {
              setopen(false);
            }}
            severity={error ? "error" : "success"}
          >
            {message}
          </Alert>
        </Snackbar>
      </div>

      <Backdrop className={classes.backdrop} open={backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog
        open={dialog}
        onClose={() => {
          setdialog(false);
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add colleague</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => {
              setname(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setdialog(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
