import React, { useState, useEffect } from 'react'
import {useROS } from '../ROS'

let listener = null;

function EchoTopic() {
  const { createListener,removeListener, topics, isConnected, autoconnect } = useROS();
  var topicMsgType = "";
  var topicPath = "/";
  

  const [ queue, setQueue ] = useState(0);
  const [ compression, setCompression ] = useState('none');
  const [ topicMsg, setTopicMsg ] = useState('Nothing');

  useEffect(() => {

  });

  const unsubscribe = () => {
    if (listener) {
      console.log("Unsubscribing from " + topicPath);
      listener.unsubscribe();
      removeListener(listener)
      listener = null;
      topicPath = "";
      topicMsgType = "";
    }
  }

//checking if topic string is an actual topic from the topics list, if it is, then set the topic
  const checkTopic = (topicInput) => {
    
    for (var i in topics) {
      //console.log(topics[i].path);
      if (topics[i].path === topicInput) {
        const t = topics[i];
        topicMsgType = t.msgType;
        topicPath = topicInput
        console.log("new topic path: " + topicInput);
        console.log("new topic msg type: " + topicMsgType)
        return true;
      }
    }
    
    return false;
  }

  const subscribe = () => {
    listener = createListener( topicPath,
      topicMsgType,
      Number(queue),
      compression);
  }

  const handleTopic = (topicInput) => {
    if (topicPath !== topicInput & (typeof topicInput === 'string' || topicInput instanceof String) & topicInput !== "/") {
      
      unsubscribe(); //unsubscribe from old topic
      const isValid = checkTopic(topicInput); //check to see if the topicInput is a valid topic name
      //const isValid = false;
      if (isValid) {
        topicPath = topicInput;
        subscribe();
        console.log("Subscribing to messages from topic: " + topicInput);
        console.log("topic input: "+topicInput);
        listener.subscribe(handleMsg);
        setTopicMsg("topic found - waiting for first message");

      } else {
        setTopicMsg("topic not found");
        console.log(topicInput + " is not a valid topic name...make sure to input the full topic path - including the leading '/'");
      }
    }
    return;
  }

  const handleQueue = (queueInput) => {
    setQueue(queueInput);
  }

  const handleCompression = (compInput) => {
    setCompression(compInput);
  }

  const handleMsg = (msg) => {
    if(topicMsgType === "sensor_msgs/msg/JointState")
    {
      if(msg.name[0] === "jaw_joint")
      {
        setTopicMsg("position: " + msg.position);
      }
    }
    else if (topicMsgType === "diagnostic_msgs/msg/KeyValue"){
      if (msg.key === 'J')
      {
        //console.log(String(msg.key))
        setTopicMsg(String(msg.value));
      }
    }
    else if (String(topicMsgType).endsWith("std_msgs/msg/Bool")){
      console.log(String(msg.data));
      //const j = JSON.parse(msg.data);
      setTopicMsg(String(msg.data));
    }


  }

  return (
    <div className= "flex flex-col">
      <b>Status of autoConnect:</b> { autoconnect ? "autoconnect is on" : "not autoconnecting" }   <br />
      <b>Status of ROS:</b> { isConnected ? "connected" : "not connected" }   <br />
      <b>Message Queue Length:  </b><input name="queueInput" defaultValue={ queue } onChange={event => handleQueue(event.target.value)} />  <br />
      <b>Compression:  </b><input name="compInput" defaultValue={ compression } onChange={event => handleCompression(event.target.value)} />  <br />
      <b>Topic to echo:  </b><input name="topicInput" defaultValue={ topicPath } onChange={event => handleTopic(event.target.value)} />  <br />
      <b>msg: </b> {topicMsg} <br />
    </div>
  );
}

export default EchoTopic;
