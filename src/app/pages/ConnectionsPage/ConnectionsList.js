import React from 'react'
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ConnectionItem from "./ConnectionItem";
const statusMsg = "  - Connection Status";

export default function ConnectionsList(props) {
  const holelist = props.holelist;
  return (
    <List sx={{ width: '100%', maxWidth: 500}}>
      <ConnectionItem name={holelist[0]} statusMsg={statusMsg} />
      <Divider sx={{ height:"5px",backgroundColor: "white" }} variant="fullWidth" component="li"/>
      <ConnectionItem name={holelist[1]} statusMsg={statusMsg} />
    </List>
  );
}