import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'
import ROSLIB from 'roslib'

//const startUrl: "ws://0.0.0.0:9090",
//const startUrl: "ws://jakers-ThinkPad.local:9090",
//const startUrl: "ws://ubuntu-sharkhole-raspi:9090",
//const startUrl: "ws://192.168.0.245:9090",
//const startUrl: "ws://192.168.0.36:9090",
const startUrl = "ws://98.53.134.144:9090"; //home
//const startUrl = "ws://174.29.180.255:9090"; //urban putt shop in denver

const rosObj = {
  url: startUrl,
  ROS: new ROSLIB.Ros(startUrl),

  isConnected: false,
  ROSConfirmedConnected: false,
  autoconnect: true,
  topics: [],
  services:[],
  listeners: [],
  publishers: [],
}

const ROSContext = createContext([{}, () => {}]);

const ROSProvider = (props) => {
  const [ ros, setROS ] = useState(rosObj);
  return (
    <ROSContext.Provider value={[ros, setROS]}>
      {props.children}
    </ROSContext.Provider>
  );
}

ROSProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { ROSContext, ROSProvider };
