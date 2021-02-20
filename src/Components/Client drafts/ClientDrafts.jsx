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
import EditIcon from "@material-ui/icons/Edit";
import { Button, Backdrop, CircularProgress } from "@material-ui/core";
import moment from "moment";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const columns = [
  { id: "greenPlate", label: "Kenteken groeneplaat", minWidth: 170 },
  { id: "carPlate", label: "Kenteken auto", minWidth: 170 },
  {
    id: "startDate",
    label: "Begin datum",
    minWidth: 170,
  },
  {
    id: "Phone",
    label: "Telefoon",
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
    width: "100%",
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

export default function ClientDrafts() {
  const token = localStorage.getItem("user");
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setrows] = useState([]);
  const [open, setopen] = useState(false);
  const [message, setmessage] = useState("");
  const [error, seterror] = useState(false);
  const [backdrop, setbackdrop] = useState(false);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = (id) => {
    setbackdrop(true);
    axios
      .delete("/client/form/" + id, { headers: { token: token } })
      .then((res) => {
        if (res.data.message) {
          setopen(true);
          setmessage("Form deleted");
          seterror(false);
          axios
            .get("/client/draft", { headers: { token: token } })
            .then((res) => {
              setrows(res.data.forms);
            });
        }
        setbackdrop(false);
      })
      .catch((error) => {
        setopen(true);
        seterror(true);
        setmessage("Error: " + error.response.data.error);
      });
  };

  useEffect(() => {
    axios
      .get("/client/draft", { headers: { token: token } })
      .then((res) => {
        setrows(res.data.forms);
      })
      .catch((error) => {
        console.log(error);
        setopen(true);
        seterror(true);
        setmessage("Error: " + error.response.data.error);
      });
  }, []);
  return (
    <div>
      <Box m={5}>
        <h1>Klanten draft</h1>
      </Box>
      <Box mt={4}>
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
                        <TableCell>{row.greenPlate}</TableCell>
                        <TableCell>{row.licensePlate}</TableCell>
                        <TableCell>
                          {moment(row.startDate).format("YYYY/MM/DD HH:mm:ss")}
                        </TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => {
                              handleDelete(row._id);
                            }}
                          >
                            <DeleteIcon />
                          </Button>
                          <Button href={"/client/form/update/" + row._id}>
                            <EditIcon />
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
      </Box>
      <Backdrop className={classes.backdrop} open={backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
