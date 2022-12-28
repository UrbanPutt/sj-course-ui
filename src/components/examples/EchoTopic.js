import React, { useState, useEffect } from 'react'
import {useROS } from '../ROS'

let listener = null;
let topicName = "";

function EchoTopic() {
  const { createListener,removeListener, topics } = useROS();
  const [ topic, setTopic ] = useState('/');
  const [ queue, setQueue ] = useState(0);
  const [ compression, setCompression ] = useState('none');
  const [ topicMsg, setTopicMsg ] = useState('Nothing');

  useEffect(() => {
    handleTopic(topic);

    //specify how to cleanup after this effect:
    return function cleanup() {
      //unsubscribe();
    };
  });

  const unsubscribe = () => {
    if (listener) {
      console.log("Unsubscribing from " + topicName);
      listener.unsubscribe();
      removeListener(listener)
      listener = null;
      topicName = "";
    }
  }

//checking if topic string is an actual topic from the topics list, if it is, then set the topic
  const checkTopic = (topicInput) => {
    
    for (var i in topics) {
      //console.log(topics[i].path);
      if (topics[i].path === topicInput) {

        setTopic(topics[i]);
        console.log("new topic name: " + topicInput);
        return true;
      }
    }

    return false;
  }

  const subscribe = (topicInput) => {
    listener = createListener( topicInput,
      topic.msgType,
      Number(queue),
      compression);
  }

  const handleTopic = (topicInput) => {
    if (topicName !== topicInput & (typeof topicInput === 'string' || topicInput instanceof String) & topicInput !== "/") {
      
      unsubscribe(); //unsubscribe from old topic
      const isValid = checkTopic(topicInput); //check to see if the topicInput is a valid topic name
      //const isValid = false;
      if (isValid) {
        topicName = topicInput;
        subscribe(topicInput);
        console.log("Subscribing to messages from topic: " + topicInput);
        console.log("topic input: "+topicInput);
        listener.subscribe(handleMsg);

      } else {
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
    //console.log(msg.name[0]);
    if(msg.name[0] === "jaw_joint")
    {
      setTopicMsg("position: " + msg.position);
    }

  }

  return (
    <div>
      <b>Message Queue Length:  </b><input name="queueInput" defaultValue={ queue } onChange={event => handleQueue(event.target.value)} />  <br />
      <b>Compression:  </b><input name="compInput" defaultValue={ compression } onChange={event => handleCompression(event.target.value)} />  <br />
      <b>Topic to echo:  </b><input name="topicInput" defaultValue={ topic } onChange={event => handleTopic(event.target.value)} />  <br />
      <b>msg: </b> {topicMsg} <br />
    </div>
  );
}

export default EchoTopic;
