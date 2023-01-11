import FullscreenBtn from '../../components/FullScreenBtn';
import Header from '../../components/Header';
import { useROS } from '../../components/ROS/ROS';
import ROSLIB from 'roslib'
import React, { useEffect, useState } from 'react'
import ExampleP5Sketch from './ExampleP5Sketch';
import { ReactP5Wrapper } from 'react-p5-wrapper';


let listenerMotorStatus = null;
let publisherCmdVel = null;

export default function SharkHolePage(){

  const { isConnected, createListener, createPublisher, removeListener} = useROS();
  const topicPathMotorStatus = "/motorStatus";
  const topicMotorStatusMsgType = "diagnostic_msgs/msg/KeyValue";

  const [ jawMsg, setJawMsg ] = useState('{}');
  const [ torsoMsg, setTorsoMsg ] = useState('{}');

  const handleMsg = (msg) => {
    console.log("handleMsg: shark");
    if (msg.key === 'J')
    {
      setJawMsg(String(msg.value));

    }
    else if (msg.key === 'T'){
      setTorsoMsg(String(msg.value));
    }
  }

  var twist = new ROSLIB.Message({
    linear: {
      x: 0.0,
      y: 0.0,
      z: 0.0
    },
    angular: {
      x: 0.0,
      y: 0.0,
      z: 0.0
    }
  });

  function jogTorsoMotorPos(event){
    twist.angular.z = 1.0;
    if (publisherCmdVel !== null && isConnected)
    {
      publisherCmdVel.publish(twist);
    }
  }

  function jogTorsoMotorNeg(event){
    twist.angular.z = -1.0;
    
    if (publisherCmdVel !== null && isConnected)
    {
      publisherCmdVel.publish(twist);
    }
  }

  function stopMotor(event){
    twist.angular.z = 0.0;
    
    if (publisherCmdVel !== null && isConnected)
    {
      publisherCmdVel.publish(twist);
    }
  }

  useEffect(() => {

    return() => {
      removeListener(listenerMotorStatus);
      listenerMotorStatus = null;
      console.log("cleanup: shark");
    };

  },[]); //leave the array in despite the warning, it is needed for some reason


  if (isConnected & listenerMotorStatus === null)
  {
    listenerMotorStatus = createListener( topicPathMotorStatus,
      topicMotorStatusMsgType,
      Number(0),
      'none');
      listenerMotorStatus.subscribe(handleMsg);
    publisherCmdVel = createPublisher("/cmd_vel","geometry_msgs/msg/Twist");
    console.log("subscribe: shark")
  }

  return(
    <div className="h-screen w-screen">
      <Header />
      <div className="section w-screen justify-center">
          <ReactP5Wrapper sketch={ExampleP5Sketch} torsoMsg={torsoMsg} jawMsg={jawMsg} />
      </div>
      <div className="section">
        <button className="btn btn-blue w-32 m-4 select-none" 
                onTouchStart={jogTorsoMotorPos} onTouchEnd={stopMotor} onTouchCancel={stopMotor} 
                onMouseDown={jogTorsoMotorPos} onMouseUp={stopMotor} onMouseLeave={()=>{}}>
          JOG+
        </button>
        <button className="btn btn-blue w-32 m-4 select-none" 
                onTouchStart={jogTorsoMotorNeg} onTouchEnd={stopMotor} onTouchCancel={stopMotor} 
                onMouseDown={jogTorsoMotorNeg} onMouseUp={stopMotor} onMouseLeave={()=>{}} >
          JOG-
        </button>
      </div>

      <div className="fixed bottom-1 right-0 z-50">
          <FullscreenBtn />
      </div>
    </div>   
  );
}