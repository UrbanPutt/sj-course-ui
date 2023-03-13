import React, {useEffect,useState} from 'react'
import ROSLIB from 'roslib'
import { useROS} from '../../components/ROS/ROS';

let publisherCmdVel = null;
let publisherCmds = null;

export default function MotorStatus(props) {
  //const [eventLogPrev, setEventLogPrev]=useState(" ");
  //const [eventLog, setEventLog]=useState(" ");

  const motorId = props.motorId;
  var status = props.statusJson ? JSON.parse(props.statusJson): JSON.parse("{}");
  const switches = status.switches ? status.switches : "";
  const statusBits = status.statusBits ? status.statusBits : "";
  const namespace = props.namespace
  const { isConnected, createPublisher} = useROS();
  //const [publisherCmdVel,setPublisherCmdVel]=useState(null);


  var jointStateCmd = new ROSLIB.Message({
    name: [],
    velocity: []
  });

  var keyValue = new ROSLIB.Message({
    key: "",
    value: ""
  });


  useEffect(() => {


    return() => {
        //cleanup methods
    };

  },[]); //leave the array in despite the warning, it is needed for some reason
  

  if (isConnected && publisherCmdVel === null)
  {
    publisherCmdVel = createPublisher(namespace + "/cmd_vel_scaled_jointState","sensor_msgs/msg/JointState");
    publisherCmds = createPublisher(namespace + "/cmds","diagnostic_msgs/msg/KeyValue")
  }

  function jogMotorPos(event){
    /*
    if(props.name==="JAW"){
      twist.angular.y = 0.5;
    }
    else if(props.name==="TORSO"){
      twist.angular.z = 0.5;
    }*/

    jointStateCmd.name = [String(motorId) + "_joint"];
    jointStateCmd.velocity = [0.5];

    if (publisherCmdVel !== null && isConnected)
    {
      publisherCmdVel.publish(jointStateCmd);
    }
  }

  function jogMotorNeg(event){

    jointStateCmd.name = [String(motorId) + "_joint"];
    jointStateCmd.velocity = [-0.5];

    if (publisherCmdVel !== null && isConnected)
    {
      publisherCmdVel.publish(jointStateCmd);
    }
  }

  function zeroSpeedMotor(event){
    jointStateCmd.name = [String(motorId) + "_joint"];
    jointStateCmd.velocity = [0.0];

    if (publisherCmdVel !== null && isConnected)
    {
      publisherCmdVel.publish(jointStateCmd);
    }
  }

  function publishMotorCmd(codeChr){
    keyValue.key = codeChr + String(motorId);
    keyValue.value = "";
    if (publisherCmds !== null && isConnected)
    {
      publisherCmds.publish(keyValue);
    }
  }

  function homeMotor(event){
    publishMotorCmd("H");
  }

  
  function stopMotor(event){
    publishMotorCmd("S");
    console.log(String(motorId))
  }

  function clearMotor(event){
    publishMotorCmd("C");
    console.log(String(motorId))
  }

  function zeroMotor(event){
    publishMotorCmd("Z");
    console.log(String(motorId))
  }
  
  return (

    <div className= "flex flex-col bg-gray-100 p-2 mr-4 rounded-md w-5/12 md:w-1/4">
      <b className="text-xl">{props.name}</b>
       <b></b><br />
      <b>Mode </b> {intToModeString(status.mode)}<br />
      <b>Act/Ref Position </b>{status.actualPosition} / {status.referencePosition} <br />
      <b>Act/Ref Velocity </b>{parseFloat(status.actualVelocity).toFixed(1)} / {parseFloat(status.referenceVelocity).toFixed(1)}<br />
      <b>Switches </b>
      <p className={`${switches.PositiveLimSw?'text-green-500' : 'text-red-500' }`}> PosLimSw: {boolToOnOffString(switches.PositiveLimSw)}</p> 
      <p className={`${switches.NegativeLimSw?'text-green-500' : 'text-red-500' }`}> NegLimSw: {boolToOnOffString(switches.NegativeLimSw)}</p> 
      <b></b>HomeSw: {boolToOnOffString(switches.HomeSw)} <br />
      <b>Status Bits </b>AtPos: {boolToStatusBit(statusBits.AtPosition)} <br />
      <b></b>Moving: {boolToStatusBit(statusBits.Moving)} <br />
      <b></b>Enabled: {boolToStatusBit(statusBits.Enabled)} <br />
      <b></b>Faulted: {boolToStatusBit(statusBits.Faulted)} <br />
      <b></b>Ready: {boolToStatusBit(statusBits.Ready)} <br />
      <b></b>Homed: {boolToStatusBit(statusBits.Homed)} <br />

      <button className="btn btn-blue w-32 mt-4 select-none" 
              onTouchStart={jogMotorPos} onTouchEnd={zeroSpeedMotor} onTouchCancel={zeroSpeedMotor} 
              onMouseDown={jogMotorPos} onMouseUp={zeroSpeedMotor} onMouseLeave={()=>{}}>
        JOG+
      </button>
      <button className="btn btn-blue w-32 mt-4 mb-2 select-none" 
              onTouchStart={jogMotorNeg} onTouchEnd={zeroSpeedMotor} onTouchCancel={zeroSpeedMotor} 
              onMouseDown={jogMotorNeg} onMouseUp={zeroSpeedMotor} onMouseLeave={()=>{}} >
        JOG-
      </button>
      <button className="btn btn-blue w-32 mt-4 mb-2 select-none" 
              onTouchStart={homeMotor} onTouchEnd={()=>{}} onTouchCancel={()=>{}} 
              onMouseDown={homeMotor} onMouseUp={()=>{}} onMouseLeave={()=>{}} >
        HOME
      </button>
      <button className="btn btn-red w-32 mt-4 mb-2 select-none" 
              onTouchStart={stopMotor} onTouchEnd={()=>{}} onTouchCancel={()=>{}} 
              onMouseDown={stopMotor} onMouseUp={()=>{}} onMouseLeave={()=>{}} >
        STOP
      </button>
      <button className="btn btn-black w-32 mt-4 mb-2 select-none" 
              onTouchStart={clearMotor} onTouchEnd={()=>{}} onTouchCancel={()=>{}} 
              onMouseDown={clearMotor} onMouseUp={()=>{}} onMouseLeave={()=>{}} >
        CLEAR
      </button>
      <button className="btn btn-white w-32 mt-4 mb-2 select-none" 
              onTouchStart={zeroMotor} onTouchEnd={()=>{}} onTouchCancel={()=>{}} 
              onMouseDown={zeroMotor} onMouseUp={()=>{}} onMouseLeave={()=>{}} >
        ZERO
      </button>
    </div>
    
  );
}

function boolToOnOffString(x){
  return x ? "on":"off";
}

function boolToStatusBit(x){
  return String(x) !== 'undefined' ? String(x) : "-";
}

function intToModeString(x){

  switch(x){
    case 0:
      return "DISABLED";
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