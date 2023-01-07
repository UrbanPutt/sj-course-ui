import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'
import ROSLIB from 'roslib'

const rosObj = {
  ROS: new ROSLIB.Ros(),
  url: "ws://98.53.134.144:9090",
  //url: "ws://0.0.0.0:9090",
  //url: "ws://jakers-ThinkPad.local:9090",
  //url: "ws://ubuntu-sharkhole-raspi:9090",
  //url: "ws://192.168.0.245:9090",
  //url: "ws://192.168.0.36:9090",

  
  isConnected: false,
  ROSConfirmedConnected: false,
  autoconnect: true,
  topics: [],
  services:[],
  listeners: [],
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
