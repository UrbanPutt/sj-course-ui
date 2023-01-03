import React, { useState, useEffect } from 'react'
import {useROS } from '../ROS'
import MotorStatus from './MotorStatus';
let added = false;

function MotorStatusTopicProvider(props) {
  const { createListener, topics,removeAllListeners, checkConnection} = useROS();

  let topicMsgType = "";
  const topicPath = "/motorStatus";


  const [ jawMsg, setJawMsg ] = useState('{}');
  const [ torsoMsg, setTorsoMsg ] = useState('{}');

  
  setInterval(()=>{
    checkConnection();
  },200)
  




  useEffect(() => {
    
   

    if(props.isConnected){
      console.log("connected...")
    }
    return() => {
      removeAllListeners();
      console.log("all listeners removed");
      added = false;
    };

  },[]);

  const handleTopic = () => {

    if (props.isConnected) {
      
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

  if(props.isConnected & !added){
    console.log("adding topic");
    handleTopic();
  }

  return (
    <div className="flex flex-row justify-evenly ">
      <MotorStatus statusJson={torsoMsg} name="TORSO" isConnected={props.isConnected}/>
      <MotorStatus statusJson={jawMsg} name = "JAW" isConnected={props.isConnected}/>
    </div>

  );
}

export default MotorStatusTopicProvider;