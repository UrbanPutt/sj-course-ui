import BasePage from "../BasePage/BasePage"
import { useROS } from '../../components/ROS/ROS';
import ROSLIB from 'roslib'
import React, { useEffect, useState } from 'react'
import FinaleP5Sketch from './FinaleP5Sketch';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { Link } from "react-router-dom"
//DEFINE LISTENERS AND PUBLISHERS



let listenerJointState = null;
let publisherCmdVel = null;
let publisherInputEvents = null;
let listenerStateMachine = null;

const StateString = {
  "-3": "aborting",
  "-2": "killed",
  "-1": "error",
  "0": "inactive",
  "50": "resetting",
  "100": "idle",
  "500": "running",
  "800": "stopping"
};

const States = {
  "aborting":-3,
  "killed":-2,
  "error":-1,
  "inactive":0,
  "resetting":50,
  "idle":100,
  "running":500,
  "stopping":800
}



export default function FinaleHolePage(props){
  const pageName = "FINALE HOLE";
  const name = 'STEPPERS';
  const href = '/finaleholepage/steppers';

  const namespace = props.namespace
  const { isConnected, createListener, createPublisher, removeListener} = useROS();
  //const topicPathMotorStatus = namespace + "/motorStatus";
  const keyValueMsgType = "diagnostic_msgs/msg/KeyValue";
  const topicPathJointState = namespace + "/jointState";
  const jointStateMsgType = "sensor_msgs/msg/JointState";
  const topicPathStateMachine = namespace + "/stateMachine";

  //const [ motor0Msg, setmotor0Msg ] = useState('{}');
  //const [ motor1Msg, setmotor1Msg ] = useState('{}');
  //const [ motor2Msg, setmotor2Msg ] = useState('{}');
  //const [ motor3Msg, setmotor3Msg ] = useState('{}');
  

  const [jointStateMsg, setJointStateMsg] = useState('');
  const [motor0VelDeg, setmotor0VelDeg ] = useState('0.0');

  const [stateMsg, setStateMsg] = useState("aborting");
  const [state, setState] = useState(0);
  const [stepMsg, setStepMsg] = useState(0);


  const handleStateMachineMsg = (msg) => {
    if(msg.key === 'State')
    {
      setStateMsg(StateString[msg.value]);
      setState(parseInt(msg.value));
    }

    if(msg.key === 'Step')
    {
      setStepMsg(parseInt(msg.value));
    }
    
  }

  const handleJointStateMsg = (msg) => {
    //console.log("jointState msg: ");
    //console.log(msg);
    
    setJointStateMsg(msg);
    if(msg.name[0] === "bismuth_lift_lower_joint"){
      
      //const motor0PosDeg = msg.position[0];
      //const motor0PosRad = motor0PosDeg*Math.PI/180.0; //convert to radians
      //console.log("torsoVel: " + String(msg.velocity[0]));
      //setmotor0VelDeg(msg.velocity[0]);
    }
  }

  var keyValue = new ROSLIB.Message({
    key: '',
    value: ''
  })


  function btnClick(event){
    const sourceId = event.target.id;
    if (sourceId === "resetBtn"){
      keyValue.key = 'reset_btn';
      keyValue.value = 'True';
    }
    if (sourceId === "startBtn"){
      keyValue.key = 'start_btn';
      keyValue.value = 'True';
    }
    if (sourceId === "stopBtn"){
      keyValue.key = 'stop_btn';
      keyValue.value = 'True';
    }
    if (sourceId === "clearBtn"){
      keyValue.key = 'clear_btn';
      keyValue.value = 'True';
    }
    if (sourceId === "killBtn"){
      keyValue.key = 'kill_btn';
      keyValue.value = 'True';
    }
    
    
    if (publisherInputEvents !== null && isConnected)
    {
      publisherInputEvents.publish(keyValue);
      console.log("publish an input event: ")
      console.log(keyValue.key);
    }
  }


  var jointState = new ROSLIB.Message({
    name: ['bismuth_lift_lower_joint'],
    position: [0.0],
    velocity: [0.0]
  });



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
    publisherCmdVel = createPublisher(namespace + "/cmd_vel_scaled_jointState",jointStateMsgType);
    publisherInputEvents = createPublisher(namespace + "/input_events",keyValueMsgType);
    console.log("subscribe: finale")
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
  
  let startButton;
  let stopButton;
  let killButton;
  let clearButton;
 
  if (stepMsg  === 0) {
    startButton = <button id="resetBtn" className="btn btn-start w-32 m-4 select-none" onClick={btnClick}>START</button>;
  } else if((stepMsg < States["stopping"] && stepMsg >States["inactive"]) || state===States["running"]){
    stopButton = <button id="stopBtn" className="btn btn-stop w-32 m-4 select-none" onClick={btnClick}>STOP</button>;
  }

  if (stepMsg  > States["inactive"] ) {
    killButton = <button id="killBtn" className="btn btn-kill w-32 m-4 select-none" onClick={btnClick}>KILL</button>;
  } 
  if (state  === States["error"]) {
    clearButton = <button id="clearBtn" className="btn btn-clear w-32 m-4 select-none border-black" onClick={btnClick}>CLEAR</button>;
  } 

  return(
    <BasePage pageName = {pageName} pageContent={
      <div className="section w-screen justify-center">
        <div className="max-width-full">
          <ReactP5Wrapper  sketch={FinaleP5Sketch} jointStateMsg={jointStateMsg}/>
        </div>
        <div className="flex flex-col items-center justify-center">

         
          <b>Hole State: </b>{StateString[String(state)]}<br />
          <b> </b> <br />
          <b>Step Number: </b>{stepMsg} <br />
        </div>
        
        <div className="flex flex-row justify-evenly mb-4 ">
          
          {startButton}
          {stopButton}
          {killButton}
          {clearButton}
        </div>

        <div className="flex flex-row justify-evenly mb-4 ">
          <button className="btn btn-black w-32 mt-4 mb-2 select-none">
                <Link to={href}>{name}</Link>
          </button>
        </div>
      </div>
      }>
      </BasePage>  
  );
}