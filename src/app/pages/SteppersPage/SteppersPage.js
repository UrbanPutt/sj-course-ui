import FullscreenBtn from '../../components/FullScreenBtn';
import MotorStatus from './MotorStatus';
import Header from '../../components/Header';
import { useROS} from '../../components/ROS/ROS';
import React, { useEffect, useState } from 'react'


let listenerMotorStatus = null;
let listenerWebcam = null;

export default function SteppersPage(props){

  const { isConnected, createListener, removeListener} = useROS();
  const namespace = props.namespace;
  const topicPathMotorStatus = namespace + "/motorStatus";
  const topicMotorStatusMsgType = "diagnostic_msgs/msg/KeyValue";
  const imageRawCompressedMsgType = "sensor_msgs/msg/CompressedImage"

  const [ motor0Msg, setmotor0Msg ] = useState('{}');
  const [ motor1Msg, setmotor1Msg ] = useState('{}');
  const [ motor2Msg, setmotor2Msg ] = useState('{}');
  const [ motor3Msg, setmotor3Msg ] = useState('{}');

  //const [imgUrl, setImageUrl] = useState("");

  const handleMsg = (msg) => {
    //console.log("handleMsg: steppers");
    if (msg.key === '0')
    {
      setmotor0Msg(String(msg.value));
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
  }

  const handleWebcamMsg = (msg) => {
    //console.log("handleMsg: webcam");
    //setImageUrl("data:image/jpeg;base64," + msg.data)
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
      console.log("cleanup: steppers");
    };

  },[]); //leave the array in despite the warning, it is needed for some reason
  


  
  return(
    <div className="h-screen w-screen">
      <Header />
      
      <div className="section w-screen justify-center">
    
        <div className="flex flex-row justify-evenly sm:justify-start mb-4 ">
          <MotorStatus statusJson={motor0Msg} name="MOTOR0" namespace={namespace} motorId="0" showButtons="true" />
          <MotorStatus statusJson={motor1Msg} name="MOTOR1" namespace={namespace} motorId="1" showButtons="true" />
          
        </div>
        <div className="flex flex-row justify-evenly sm:justify-start mb-4">
          <MotorStatus statusJson={motor2Msg} name="MOTOR2" namespace={namespace} motorId="2" showButtons="true"/>
          <MotorStatus statusJson={motor3Msg} name="MOTOR3" namespace={namespace} motorId="3" showButtons="false"/>
        </div>
      </div>
      <div className="fixed bottom-1 right-0 z-50">
          <FullscreenBtn />
      </div>
    </div>   
  );
}