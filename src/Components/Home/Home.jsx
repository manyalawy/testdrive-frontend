import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Box, Divider } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function NestedList() {
  const classes = useStyles();

  const history = useHistory();
  const handleLogout = () => {
    localStorage.removeItem("user");
    history.push("/login");
  };
  return (
    <Box display="flex" justifyContent="center" mt={10}>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Homepagina
          </ListSubheader>
        }
        className={classes.root}
      >
        <ListItem
          button
          onClick={() => {
            history.push("/client/form");
          }}
        >
          <ListItemText primary="Proefrit formulier" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            history.push("/client/draft");
          }}
        >
          <ListItemText primary="Proefrit drafts (datum terugkomst invullen)" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            history.push("/client/submission");
          }}
        >
          <ListItemText primary="Afgewerkte formulieren proefritten" />
        </ListItem>

        <Divider />
        <Box mt={5}>
          <ListItem
            button
            onClick={() => {
              history.push("/settings");
            }}
          >
            <ListItemText primary="Instellingen" />
          </ListItem>
        </Box>
        <Divider />
        <Box mt={5}>
          <ListItem
            button
            onClick={() => {
              history.push("/colleague/form");
            }}
          >
            <ListItemText primary="Medewerker formulier (auto mee naar huis)" />
          </ListItem>
        </Box>
        <Divider />
        <ListItem
          button
          onClick={() => {
            history.push("/colleague/draft");
          }}
        >
          <ListItemText primary="Medewerker drafts (datum terugkomst invullen)" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            history.push("/colleague/submission");
          }}
        >
          <ListItemText primary="Afgewerkte formulieren medewerkers" />
        </ListItem>

        <Divider />
        <Box mt={5}>
          <ListItem button>
            <ListItemText onClick={handleLogout} primary="Logout" />
          </ListItem>
        </Box>
      </List>
    </Box>
  );
}
