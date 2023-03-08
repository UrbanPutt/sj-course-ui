import FullscreenBtn from '../../components/FullScreenBtn';
import Header from '../../components/Header';
import { useROS } from '../../components/ROS/ROS';
import ROSLIB from 'roslib'
import React, { useEffect, useState } from 'react'
import ExampleP5Sketch from './ExampleP5Sketch';
import { ReactP5Wrapper } from 'react-p5-wrapper';

//DEFINE LISTENERS AND PUBLISHERS

let listenerJointState = null;
let publisherCmdVel = null;
let publisherInputEvents = null;
let listenerStateMachine = null;

export default function SharkHolePage(){

  const { isConnected, createListener, createPublisher, removeListener} = useROS();
  const topicPathMotorStatus = "/motorStatus";
  const keyValueMsgType = "diagnostic_msgs/msg/KeyValue";
  const topicPathJointState = "/jointState";
  const jointStateMsgType = "sensor_msgs/msg/JointState";
  const topicPathStateMachine = "/stateMachine";

  const [ jawMsg, setJawMsg ] = useState('{}');
  const [ torsoMsg, setTorsoMsg ] = useState('{}');
  

  const [jointStateMsg, setJointStateMsg] = useState('');
  const [torsoVelDeg, setTorsoVelDeg ] = useState('0.0');

  const [stateMachineMsg, setStateMachineMsg] = useState(0);
  const [stepMsg, setStepMsg] = useState(0);


  const handleStateMachineMsg = (msg) => {
    if(msg.key === 'State')
    {
      setStateMachineMsg(String(msg.value))
    }

    if(msg.key === 'Step')
    {
      setStepMsg(String(msg.value))
    }
    
  }

  const handleJointStateMsg = (msg) => {
    //console.log("jointState msg: ");
    //console.log(msg);
    

    if(msg.name[0] === "torso_joint"){
      setJointStateMsg(msg);
      const torsoPosDeg = msg.position[0];
      const torsoPosRad = torsoPosDeg*Math.PI/180.0; //convert to radians
      //console.log("torsoVel: " + String(msg.velocity[0]));
      setTorsoVelDeg(msg.velocity[0]);
    }
  }

  var keyValue = new ROSLIB.Message({
    key: '',
    value: ''
  })


  function easyButtonClick(event){
    const sourceId = event.target.id;
    if (sourceId == "easyBtn"){
      keyValue.key = 'easy_btn';
      keyValue.value = 'True';
    }
    if (sourceId == "mediumBtn"){
      keyValue.key = 'medium_btn';
      keyValue.value = 'True';
    }
    if (sourceId == "turboBtn"){
      keyValue.key = 'turbo_btn';
      keyValue.value = 'True';
    }
    
    
    if (publisherInputEvents !== null && isConnected)
    {
      publisherInputEvents.publish(keyValue);
    }
  }


  var jointState = new ROSLIB.Message({
    name: ['torso_joint'],
    position: [0.0],
    velocity: [0.0]
  });

  function jogTorsoMotorPos(event){
    jointState.velocity[0] = 1.0;
    if (publisherCmdVel !== null && isConnected)
    {
      publisherCmdVel.publish(jointState);
    }
  }

  function jogTorsoMotorNeg(event){
    jointState.velocity[0] = -1.0;
    if (publisherCmdVel !== null && isConnected)
    {
      publisherCmdVel.publish(jointState);
    }
  }


  function stopMotor(event){
    jointState.velocity[0] = 0.0;
    if (publisherCmdVel !== null && isConnected)
    {
      publisherCmdVel.publish(jointState);
    }
  }

  useEffect(() => {

    return() => {
      removeListener(listenerJointState);
      removeListener(listenerStateMachine);
      listenerJointState = null;
      listenerStateMachine = null;
      console.log("cleanup: shark");
    };

  },[]); //leave the array in despite the warning, it is needed for some reason


  if (isConnected & listenerJointState=== null)
  {
    listenerJointState = createListener( 
      topicPathJointState,
      jointStateMsgType,
      Number(0),
      'none');
      listenerJointState.subscribe(handleJointStateMsg);
    //publisherCmdVel = createPublisher("/cmd_vel_scaled_twist","geometry_msgs/msg/Twist");
    publisherCmdVel = createPublisher("/cmd_vel_scaled_jointState",jointStateMsgType);
    publisherInputEvents = createPublisher("/input_events",keyValueMsgType);
    console.log("subscribe: shark")
  }

  if(isConnected & listenerStateMachine === null)
  {
    listenerStateMachine = createListener( 
      topicPathStateMachine,
      keyValueMsgType,
      Number(0),
      'none');
      listenerStateMachine.subscribe(handleStateMachineMsg);

  }

  return(
    <div className="h-screen w-screen">
      <Header />
      <div className="section w-screen justify-center">
          <ReactP5Wrapper sketch={ExampleP5Sketch} torsoMsg={torsoMsg} jawMsg={jawMsg} jointStateMsg={jointStateMsg} />
      </div>
      <p>Shark State: {stateMachineMsg}</p>
      <p>Step Number: {stepMsg}</p>
      <div className="section">
        <button id="easyBtn" className="btn btn-blue w-32 m-4 select-none" 
                onClick={easyButtonClick}>
          EASY
        </button>
        <button id="mediumBtn" className="btn btn-blue w-32 m-4 select-none" 
                onClick={easyButtonClick}>
          MEDIUM
        </button>
        <button id="turboBtn" className="btn btn-blue w-32 m-4 select-none" 
                onClick={easyButtonClick}>
          TURBO
        </button>
      </div>

      <div className="fixed bottom-1 right-0 z-50">
          <FullscreenBtn />
      </div>
    </div>   
  );
}