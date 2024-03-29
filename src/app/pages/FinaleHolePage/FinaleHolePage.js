import BasePage from "../BasePage/BasePage"
import { useROS } from '../../components/ROS/ROS';
import OpSettingsSwitchesGroup from  '../../components/buttons/OpSettingsSwitchesGroup';
import ROSLIB from 'roslib'
import React, { useEffect, useState } from 'react'
import FinaleP5Sketch from './FinaleP5Sketch';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { Link } from "react-router-dom"
//DEFINE LISTENERS AND PUBLISHERS



let listenerJointState = null;
let publisherInputEvents = null;
let listenerStateMachine = null;
let listenerInfo = null;

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
  
  const href = '/finaleholepage/steppers';

  const namespace = props.namespace
  const { finaleSettingsClient, isConnected, createListener, createPublisher, removeListener} = useROS();
  //const topicPathMotorStatus = namespace + "/motorStatus";
  const keyValueMsgType = "diagnostic_msgs/msg/KeyValue";
  const topicPathJointState = namespace + "/jointState";
  const jointStateMsgType = "sensor_msgs/msg/JointState";
  const topicPathStateMachine = namespace + "/stateMachine";
  const topicPathInfo = namespace + "/info";

  //const [ motor0Msg, setmotor0Msg ] = useState('{}');
  //const [ motor1Msg, setmotor1Msg ] = useState('{}');
  //const [ motor2Msg, setmotor2Msg ] = useState('{}');
  //const [ motor3Msg, setmotor3Msg ] = useState('{}');
  

  const [jointStateMsg, setJointStateMsg] = useState('');
  const [motor0VelDeg, setmotor0VelDeg ] = useState('0.0');

  const [stateMsg, setStateMsg] = useState("aborting");
  const [state, setState] = useState(0);
  const [stepMsg, setStepMsg] = useState(0);
  const [errors, setErrors] = useState(JSON.parse('{"present": false, "list": [""]}'));
  const [warnings, setWarnings] = useState(JSON.parse('{"present": false, "list": [""]}'));
  const [info, setInfo] = useState(JSON.parse('{"cropcircleMotor": false}'));

  const handleKeyValueMsg = (msg) => {
    if(msg.key === 'State')
    {
      setStateMsg(StateString[msg.value]);
      setState(parseInt(msg.value));
    }

    if(msg.key === 'Step')
    {
      setStepMsg(parseInt(msg.value));
    }

    if(msg.key === "Errors")
    {
      console.log("Errors: " + msg.value)
      setErrors(JSON.parse(msg.value));
    }

    if(msg.key === "Warnings")
    {
      setWarnings(JSON.parse(msg.value));
    }

    if(msg.key === "Info")
    {
      setInfo(JSON.parse(msg.value));
    }
    
  }

  const handleJointStateMsg = (msg) => {
    //console.log("jointState msg: ");
    //console.log(msg);
    
    setJointStateMsg(msg);
    if(msg.name[0] === "bismuth_lift_lower_joint"){
      
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
      removeListener(listenerInfo);
      listenerJointState = null;
      listenerStateMachine = null;
      listenerInfo = null;
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
      listenerStateMachine.subscribe(handleKeyValueMsg);

  }

  if(isConnected & listenerInfo === null)
  {
    listenerInfo = createListener( 
      topicPathInfo,
      keyValueMsgType,
      Number(0),
      'none');
      listenerInfo.subscribe(handleKeyValueMsg);

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

  let bannerColor;
  if (state === States.error){
    bannerColor = "bg-red-500";
  }
  else{
    bannerColor =  "bg-gray-800";
  }

  switch(state) {
    case States.error:
      bannerColor = "bg-red-500";
      break;
    case States.killed:
    case States.aborting:
      bannerColor = "bg-red-900";
      break;
    case States.resetting:
      bannerColor =  "bg-blue-500";
      break;
    case States.idle:
      bannerColor =  "bg-gray-200";
      break;
    case States.running:
      bannerColor =  "bg-green-500";
      break;
    case States.stopping:
      bannerColor =  "bg-orange-500";
      break;
    default:
      bannerColor =  "bg-gray-800";
  }

  let errorMsg = "";

  if(errors.present){
    errorMsg = ": " + errors.list[0];
  }

  const ballreturnMotorMode = intToModeString(info["ballreturnMotorMode"]);
  const ballreturnState = StateString[String(info["ballreturnState"])] ? StateString[String(info["ballreturnState"])]:"";
  const cropcircleState = StateString[String(info["cropcircleState"])] ? StateString[String(info["cropcircleState"])]:"";

  return(
    <BasePage pageName = {pageName} bannerColor={bannerColor} pageContent={
      <div className="section w-screen justify-center">
        <div className="max-width-full">
          <ReactP5Wrapper  sketch={FinaleP5Sketch} jointStateMsg={jointStateMsg}/>
        </div>
        <div className="flex flex-col items-start justify-start">
          <b>Hole State: </b>{StateString[String(state)] + errorMsg}<br />
          <b> </b> <br />
          <b>Step Number: </b>{stepMsg} <br />
        </div>
        
        <div className="flex flex-row justify-start mb-4 ">
          
          {startButton}
          {stopButton}
          {killButton}
          {clearButton}
        </div>

        <div className="flex flex-row justify-start mb-4 ">
          <button className="bg-black text-white py-2 px-4 w-50 mt-4 mb-2 select-none">
                <Link to={href}>STEPPERS PAGE</Link>
          </button>
        </div>

        <OpSettingsSwitchesGroup settingsGroup="bismuth" label="Bismuth"/>
        <b> </b> <br />
        <b>Crop Circle Motor Status: </b>{boolToOnOffString(info["cropcircleMotor"])}<br />
        <OpSettingsSwitchesGroup settingsGroup="cropcircle" label="Crop Circle"/>
        <b> </b> <br />
        <b>Ball Return State: </b>{ballreturnState}<br />
        <b>Ball Return Motor Status: </b>{ballreturnMotorMode}<br />
        <b> </b> <br />
        <OpSettingsSwitchesGroup settingsGroup="ballreturn" label="Ball Return"/>
      
      </div>
      }>
      </BasePage>  
  );
}

function boolToOnOffString(x){
  return x ? "on":"off";
}

function intToModeString(x){

  switch(x){
    case 0:
      return "INACTIVE";
    case 1:
      return "IDLE";
    case 2:
      return "RUNNING";
    case 3:
      return "HOMING";
    case 4:
      return "STOPPING";
    case 9:
      return "ERROR";
    default:
      return "";
  }
}