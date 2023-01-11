import React, {useEffect,useState} from 'react'
import ROSLIB from 'roslib'
import { useROS} from '../../components/ROS/ROS';

let publisherCmdVel = null;

export default function MotorStatus(props) {
  //const [eventLogPrev, setEventLogPrev]=useState(" ");
  //const [eventLog, setEventLog]=useState(" ");

  var status = props.statusJson ? JSON.parse(props.statusJson): JSON.parse("{}");
  const switches = status.switches ? status.switches : "";
  const statusBits = status.statusBits ? status.statusBits : "";

  const { isConnected, createPublisher} = useROS();
  //const [publisherCmdVel,setPublisherCmdVel]=useState(null);

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


  useEffect(() => {


    return() => {
        //cleanup methods
    };

  },[]); //leave the array in despite the warning, it is needed for some reason
  

  if (isConnected && publisherCmdVel === null)
  {
    publisherCmdVel = createPublisher("/cmd_vel","geometry_msgs/msg/Twist");
  }

  function jogMotorPos(event){

    if(props.name==="JAW"){
      twist.angular.y = 1.0;
    }
    else if(props.name==="TORSO"){
      twist.angular.z = 1.0;
    }
    if (publisherCmdVel !== null && isConnected)
    {
      publisherCmdVel.publish(twist);
    }
  }

  function jogMotorNeg(event){

    if(props.name==="JAW"){
      twist.angular.y = -1.0;
    }
    else if(props.name==="TORSO"){
      twist.angular.z = -1.0;
    }
    if (publisherCmdVel !== null && isConnected)
    {
      publisherCmdVel.publish(twist);
    }
  }

  function stopMotor(event){

    if(props.name==="JAW"){
      twist.angular.y = 0.0;
    }
    else if(props.name==="TORSO"){
      twist.angular.z = 0.0;
    }
    if (publisherCmdVel !== null && isConnected)
    {
      publisherCmdVel.publish(twist);
    }
  }

  
  

  return (

    <div className= "flex flex-col bg-gray-100 p-2 mr-4 rounded-md w-5/12 md:w-1/4">
      <b className="text-xl">{props.name}</b>
       <b></b><br />
      <b>Mode </b> {intToModeString(status.mode)}<br />
      <b>Act/Ref Position </b>{status.actualPosition} / {status.referencePosition} <br />
      <b>Act/Ref Velocity </b>{status.actualVelocity} / {status.referenceVelocity}<br />
      <b>Switches </b>PosLimSw: {boolToOnOffString(switches.PositiveLimSw)} <br />
      <b></b>NegLimSw: {boolToOnOffString(switches.NegativeLimSw)} <br />
      <b></b>HomeSw: {boolToOnOffString(switches.HomeSw)} <br />
      <b>Status Bits </b>AtPos: {boolToStatusBit(statusBits.AtPosition)} <br />
      <b></b>Moving: {boolToStatusBit(statusBits.Moving)} <br />
      <b></b>Enabled: {boolToStatusBit(statusBits.Enabled)} <br />
      <b></b>Faulted: {boolToStatusBit(statusBits.Faulted)} <br />
      <b></b>Ready: {boolToStatusBit(statusBits.Ready)} <br />
      <b></b>Homed: {boolToStatusBit(statusBits.Homed)} <br />

      <button className="btn btn-blue w-32 mt-4 select-none" 
              onTouchStart={jogMotorPos} onTouchEnd={stopMotor} onTouchCancel={stopMotor} 
              onMouseDown={jogMotorPos} onMouseUp={stopMotor} onMouseLeave={()=>{}}>
        JOG+
      </button>
      <button className="btn btn-blue w-32 mt-4 mb-2 select-none" 
              onTouchStart={jogMotorNeg} onTouchEnd={stopMotor} onTouchCancel={stopMotor} 
              onMouseDown={jogMotorNeg} onMouseUp={stopMotor} onMouseLeave={()=>{}} >
        JOG-
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