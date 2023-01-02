import React, { useState, useEffect } from 'react'
import {useROS } from '../ROS'
import MotorStatus from './MotorStatus';
let added = false;
function MotorStatusTopicProvider() {
  const { createListener, topics, isConnected } = useROS();


  var topicMsgType = "";
  const topicPath = "/motorStatus";


  const [ jawMsg, setJawMsg ] = useState('{}');
  const [ torsoMsg, setTorsoMsg ] = useState('{}');


  useEffect(() => {
    handleTopic(topicPath);
  });




//checking if topic string is an actual topic from the topics list, if it is, then set the topic
  const checkTopic = (topicInput) => {
    
    for (var i in topics) {
      //console.log(topics[i].path);
      if (topics[i].path === topicInput) {
        const t = topics[i];
        topicMsgType = t.msgType;
        //console.log("new topic path: " + topicInput);
        //console.log("new topic msg type: " + topicMsgType)
        return true;
      }
    }
    
    return false;
  }

  const subscribe = () => {
    var l = createListener( topicPath,
      topicMsgType,
      Number(0),
      'none');
    l.subscribe(handleMsg);
  }

  
  const handleTopic = (topicPath) => {
    console.log("handleTopic fired");
    if (isConnected & !added) {
      
      const isValid = checkTopic(topicPath); //check to see if the topicInput is a valid topic name
      //const isValid = false;
      if (isValid) {
        subscribe();
        added = true;
        //console.log("Subscribing to messages from topic: " + topicInput);
        //console.log("topic input: "+topicInput);
        
        //jawMsg = "topic found - waiting for first message");

      } else {
        //jawMsg("topic not found");
        console.log(topicPath + " is not a valid topic name...make sure to input the full topic path - including the leading '/'");
      }
    }
    else{
      //setListener(null);
    }
    return;
  }


  const handleMsg = (msg) => {
    if (topicMsgType === "diagnostic_msgs/msg/KeyValue"){
      if (msg.key === 'J')
      {
        //console.log(String(msg.value))
        setJawMsg(String(msg.value));
        //jawMsg = String(msg.value);
      }
      else if (msg.key === 'T'){
        setTorsoMsg(String(msg.value))
        //torsoMsg = String(msg.value);
      }
    }
  }


  return (
    <div>
      <MotorStatus statusJson={jawMsg} name="JAW"/>
      <b></b><br />
      <MotorStatus statusJson={torsoMsg} name = "TORSO" />
    </div>

  );
}

export default MotorStatusTopicProvider;