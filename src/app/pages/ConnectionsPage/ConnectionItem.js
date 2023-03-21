import React, { useEffect, useState } from 'react'
import {useROS} from '../../components/ROS/ROS';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom"


export default function ConnectionItem(props){
  //PROPS
  const name = props.name;
  const statusMsg = props.statusMsg;

  //OTHER VARS
  const image = require("../../img/" + props.name + ".jpg");
  const namespace = "/ns_" + name + "_hole";
  const holeLabel = name.toUpperCase();
  const linkTo = "/" + name.toLowerCase() + "holepage";

  //HOOKS
  const { isConnected, createListener, removeListener} = useROS();
    
  //STATES
  const [status, setStatus ] = useState(false);
  const [listener, setListener] = useState(null);


  const handleMsg = (msg) => {
      console.log("handleMsg - " + namespace);
      if (msg.key === 'serial')
      {   
        console.log(status.toString());
          if(!status & msg.value === 'True'){
            console.log(name + " stepper controller serial connection is connected!");
            
            setStatus(true);
          }
          else if(status & msg.value !== 'True'){
            console.log(name + " stepper controller serial connection is disconnected");
            setStatus(false);
          }
          
      }  
  }

  if(!isConnected & status){
      setStatus(false);
  }
  else if(isConnected & !status){
      console.log(name + " stepper controller serial connection is disconnected");
  }


  useEffect(() => {

      return() => {
          removeListener(listener);
          setListener(null);
      };

  },[]); //leave the array in despite the warning, it is needed for some reason




  function createConnectionListener(namespace) {
      const topicMsgType = "diagnostic_msgs/msg/KeyValue";
      const topicPath = namespace + "/connectionStatus";
      const l = createListener( topicPath,
          topicMsgType,
          Number(0),
          'none');
      l.subscribe(handleMsg,namespace);
      setListener(l);
  }

  if (isConnected & listener === null)
  {
      //listenerConnectionStatus = [];
      createConnectionListener(namespace);
  }

 
  return(
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'gray' }}>
      <ListItemButton 
        alignItems="flex-start" 
        component={Link} to={linkTo} 
        selected={status}
        sx={{
          backgroundColor: 'lightpink',
          "&.Mui-selected": {
            backgroundColor: "MediumSpringGreen"
          },
          "&.Mui-focusVisible": {
            backgroundColor: "#2e8b57"
          },
          ":hover": {
            backgroundColor: "#2e8b57"
          }
        }}
        >
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
                {status? "Good":"Bad"}
              </Typography>
              {statusMsg}
            </React.Fragment>
          }
        />
      </ListItemButton>
    </Box>
  )
}
