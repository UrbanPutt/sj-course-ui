import BasePage from "../BasePage/BasePage"
import MotorStatus from './MotorStatus';
import ROSLIB from 'roslib'
import { useROS} from '../../components/ROS/ROS';
import React, { useEffect, useState } from 'react'


let listenerMotorStatus = null;
let listenerWebcam = null;
let clientMotorInfo = null;

export default function SteppersPage(props){
  const label = props.label;
  const pageName = label + " STEPPERS";
  const { ros, isConnected, createListener, removeListener} = useROS();
  const namespace = props.namespace;
  const topicPathMotorStatus = namespace + "/motorStatus";
  const topicMotorStatusMsgType = "diagnostic_msgs/msg/KeyValue";
  const imageRawCompressedMsgType = "sensor_msgs/msg/CompressedImage"

  const [ motor0Msg, setmotor0Msg ] = useState('{}');
  const [ motor1Msg, setmotor1Msg ] = useState('{}');
  const [ motor2Msg, setmotor2Msg ] = useState('{}');
  const [ motor3Msg, setmotor3Msg ] = useState('{}');
  const [ motorInfoJson, setMotorInfoJson ] = useState(['{}','{}','{}','{}']);
  const [io, setIo] = useState('{}');

  let stepperNames = ["MOTOR0", "MOTOR1", "MOTOR2", "MOTOR3"];
  if(namespace == "/ns_finale_hole"){
    stepperNames = ["LOWER LIFT", "UPPER LIFT", "BALL RETURN", "N/A"]
  }
  else if(namespace == "/ns_shark_hole"){
    stepperNames = ["TORSO", "JAW", "N/A", "N/A"]
  }
 
  

  //const [imgUrl, setImageUrl] = useState("");

  function boolToOnOffString(x){
    return x ? "on":"off";
  }

  const handleMsg = (msg) => {
    //console.log("handleMsg: steppers");
    if (msg.key === '0')
    {
      setmotor0Msg(String(msg.value));
     
    //console.log(io)
    }
    else if (msg.key === '1'){
      setmotor1Msg(String(msg.value));
    }
    else if (msg.key === '2'){
      setmotor2Msg(String(msg.value));
    }
    else if (msg.key === '3'){
      setmotor3Msg(String(msg.value));
    }
    var status = msg.value ? JSON.parse(msg.value): JSON.parse("{}");
    const io = status.io ? status.io : "";
    //console.log(io.IO1);
    setIo(io);
  }

  const handleWebcamMsg = (msg) => {
    //console.log("handleMsg: webcam");
    //setImageUrl("data:image/jpeg;base64," + msg.data)
  }

  async function makeServiceRequest(codeChr,idChr){
    var request = new ROSLIB.ServiceRequest({
      key : codeChr + idChr,
      value : ""
    });
  
    clientMotorInfo.callService(request, function(result) {
      console.log('Result for service call on '
        + clientMotorInfo.name
        + ': '
        + result.key
        + ', '
        + result.value);
      
      var infoJson = motorInfoJson
      var index = parseInt(result.key[1])
      infoJson[index] = result.value;
      setMotorInfoJson(infoJson);
    });

  }
  



  if (isConnected & listenerMotorStatus === null)
  {
    listenerMotorStatus = createListener( topicPathMotorStatus,
      topicMotorStatusMsgType,
      Number(0),
      'none');
      listenerMotorStatus.subscribe(handleMsg);
    console.log("subscribe: steppers")
  }


  if (isConnected & clientMotorInfo === null)
  {
    let serviceName = namespace + '/stepper_info';
    clientMotorInfo = new ROSLIB.Service({
      ros : ros,
      name : serviceName,
      serviceType : 'custom_intefaces/Info'
      });
    console.log("service: " + serviceName)
    /*
    var intervalId = setInterval(async function() {
      makeServiceRequest('P','0');
      makeServiceRequest('P','1');
      makeServiceRequest('P','2');
      makeServiceRequest('P','3')
    }, 1000);
    */
  }


  if (isConnected & listenerWebcam === null & false)
  {
    listenerWebcam = createListener( 
      "/image_raw/compressed",
      imageRawCompressedMsgType,
      Number(0),
      'none');
      listenerWebcam.subscribe(handleWebcamMsg);
  }

  useEffect(() => {

    return() => {
      removeListener(listenerMotorStatus);
      
      //removeListener(listenerWebcam);
      listenerMotorStatus = null;
      listenerWebcam = null;
      clientMotorInfo = null;
      console.log("cleanup: steppers");
    };

  },[]); //leave the array in despite the warning, it is needed for some reason
  

  return(
    <BasePage pageName = {pageName} pageContent={
      
      <div className="section w-screen justify-center">
    
        <div className="flex flex-row justify-evenly sm:justify-start mb-4 ">
          <MotorStatus statusJson={motor0Msg} name={stepperNames[0]} namespace={namespace} motorId="0" showButtons="true" client={clientMotorInfo}/>
          <MotorStatus statusJson={motor1Msg} name={stepperNames[1]} namespace={namespace} motorId="1" showButtons="true" client={clientMotorInfo}/>
          
        </div>
        <div className="flex flex-row justify-evenly sm:justify-start mb-4">
          <MotorStatus statusJson={motor2Msg} name={stepperNames[2]} namespace={namespace} motorId="2" showButtons="true" client={clientMotorInfo}/>
          <MotorStatus statusJson={motor3Msg} name={stepperNames[3]} namespace={namespace} motorId="3" showButtons="false" client={clientMotorInfo}/>
        </div>
        <b>Inputs </b> <br />
        <b> </b>IN0: {boolToOnOffString(io.IO0)} <br />
        <b> </b>IN1: {boolToOnOffString(io.IO1)} <br />
        <b> </b>IN2: {boolToOnOffString(io.IO2)} <br />
        <b> </b>IN3: {boolToOnOffString(io.IO3)} <br />
        <b> </b>IN4: {boolToOnOffString(io.IO4)} <br />
        <b> </b>IN5: {boolToOnOffString(io.IO5)} <br />
        <b> </b>IN6: {boolToOnOffString(io.IO6)} <br />
        <b> </b>IN7: {boolToOnOffString(io.IO7)} <br />
      </div>

    }>
    </BasePage> 
  );
}