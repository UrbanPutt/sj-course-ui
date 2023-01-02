import React from 'react'

export default function MotorStatus(props) {
  
  const status = props.statusJson ? JSON.parse(props.statusJson): JSON.parse("{}");
  const switches = status.switches ? status.switches : "";
  const statusBits = status.statusBits ? status.statusBits : "";
  console.log(statusBits)

  return (

    <div className= "flex flex-col bg-gray-100 p-2 rounded-md">
      <b className="text-xl">{props.name}</b>
       <b></b><br />
      <b>Mode </b> {intToModeString(status.mode)}<br />

      <b>Actual Position </b>{status.actualPosition} <br />
      <b>Reference Position </b>{status.referencePosition} <br />
      <b>Actual Velocity </b>{status.actualVelocity} <br />
      <b>Reference Velocity </b>{status.referenceVelocity} <br />
      <b>Switches </b>PosLimSw: {boolToOnOffString(switches.PositiveLimSw)} <br />
      <b></b>NegLimSw: {boolToOnOffString(switches.NegativeLimSw)} <br />
      <b></b>HomeSw: {boolToOnOffString(switches.HomeSw)} <br />
      <b>Status Bits </b>AtPosition: {String(statusBits.AtPosition)} <br />
      <b></b>Moving: {String(statusBits.Moving)} <br />
      <b></b>Enabled: {String(statusBits.Enabled)} <br />
      <b></b>Faulted: {String(statusBits.Faulted)} <br />
      <b></b>Ready: {String(statusBits.Ready)} <br />
      <b></b>Homed: {String(statusBits.Homed)} <br />
      <b></b><br />
    </div>
  );
}

function boolToOnOffString(x){
  return x ? "on":"off"
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

/*
enum Mode{
  DISABLED=0,
  IDLE=1,
  RUNNING=2,
  HOMING=3,
  STOPPING=4,
  ERROR=9,
}
*/