import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom"

const status = "Running";
const statusMsg = "  - most recent activity log msg here";

function HoleItem(props){
  const image = require("../../img/" + props.name + ".jpg");
  const status = props.status;
  const statusMsg = props.statusMsg;
  const holeLabel = props.name.toUpperCase();
  const linkTo = "/" + String(props.name).toLowerCase() + "holepage";

  return(
    <ListItem alignItems="flex-start" component={Link} to={linkTo}>
      <ListItemAvatar>
        <Avatar alt={props.name} src={image} />
      </ListItemAvatar>
      <ListItemText
      
        primary={holeLabel}
        secondary={
          <React.Fragment >
            <Typography
              sx={{ display: 'inline' }}
              component="span"
              variant="body2"
              color="black"
            >
              {status}
            </Typography>
            {statusMsg}
          </React.Fragment>
        }
      />
    </ListItem>
  )
}

export default function HoleList() {
  return (
    <List sx={{ width: '100%', maxWidth: 500, bgcolor: 'mediumspringgreen' }}>
      <HoleItem name="shark" statusMsg={statusMsg} status={status} />
      <Divider sx={{ height:"5px",bgcolor: "white" }} variant="fullWidth" component="li"/>
      <HoleItem name="finale" statusMsg={statusMsg} status={status} />
    </List>
  );
}