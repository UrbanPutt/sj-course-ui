import FullscreenBtn from '../components/FullScreenBtn';
import Header from '../components/Header';
import { useROS } from '../components/ROS';
import React, { useEffect, useState } from 'react'
import ExampleP5Sketch from '../components/ExampleP5Sketch';
import { ReactP5Wrapper } from 'react-p5-wrapper';


let listenerMotorStatus = null;
let added = false;
export default function SharkHolePage(){

  const { isConnected, createListener} = useROS();
  const topicPathMotorStatus = "/motorStatus";
  const topicMotorStatusMsgType = "diagnostic_msgs/msg/KeyValue";

  const [ jawMsg, setJawMsg ] = useState('{}');
  const [ torsoMsg, setTorsoMsg ] = useState('{}');




  const handleMsg = (msg) => {
    //console.log("handleMsg: " + msg.value);
    if (msg.key === 'J')
    {
      //console.log(String(msg.value))
      setJawMsg(String(msg.value));

    }
    else if (msg.key === 'T'){
      setTorsoMsg(String(msg.value));
    }
    
  }

  if (isConnected & !added){
    listenerMotorStatus = createListener( topicPathMotorStatus,
      topicMotorStatusMsgType,
      Number(0),
      'none');
    if (listenerMotorStatus != null){
        //console.log("listener added and topic is good");
        listenerMotorStatus.subscribe(handleMsg); //adds handleMsg as a callback function anytime new msg on topic is received
        added = true;
    }
  }

  useEffect(() => {

    return() => {
      //removeAllListeners();
      //console.log("all listeners removed");
      //added = false;
      //listenerMotorStatus = null;
    };

  },[]); //leave the array in despite the warning, it is needed for some reason
  

  return(
    <div className="h-screen w-screen">
      <Header />
      <div className="section w-screen justify-center">
          <ReactP5Wrapper sketch={ExampleP5Sketch} torsoMsg={torsoMsg} jawMsg={jawMsg} />
      </div>
      <div className="fixed bottom-1 right-0 z-50">
          <FullscreenBtn />
      </div>
    </div>   
  );
}