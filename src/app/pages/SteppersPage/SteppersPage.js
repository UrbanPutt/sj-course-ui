import FullscreenBtn from '../../components/FullScreenBtn';
import MotorStatus from './MotorStatus';
import Header from '../../components/Header';
import { useROS} from '../../components/ROS/ROS';
import React, { useEffect, useState } from 'react'


let listenerMotorStatus = null;
let listenerWebcam = null;

export default function SteppersPage(){

  const { isConnected, createListener, removeListener} = useROS();
  const namespace = "/ns_finale_hole"
  const topicPathMotorStatus = "/motorStatus";
  const topicMotorStatusMsgType = "diagnostic_msgs/msg/KeyValue";
  const imageRawCompressedMsgType = "sensor_msgs/msg/CompressedImage"

  const [ jawMsg, setJawMsg ] = useState('{}');
  const [ torsoMsg, setTorsoMsg ] = useState('{}');

  const [imgUrl, setImageUrl] = useState("");

  const handleMsg = (msg) => {
    //console.log("handleMsg: steppers");
    if (msg.key === '1')
    {
      //console.log(String(msg.value))
      setJawMsg(String(msg.value));

    }
    else if (msg.key === '0'){
      setTorsoMsg(String(msg.value));
    }
  }

  const handleWebcamMsg = (msg) => {
    //console.log("handleMsg: webcam");
    setImageUrl("data:image/jpeg;base64," + msg.data)
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
    
        <div className="flex flex-row justify-evenly sm:justify-start ">
          <MotorStatus statusJson={torsoMsg} name="TORSO" />
          <MotorStatus statusJson={jawMsg} name = "JAW" />
        </div>
        <img className="h-50 w-50" src={imgUrl}></img>
      </div>
      <div className="fixed bottom-1 right-0 z-50">
          <FullscreenBtn />
      </div>
    </div>   
  );
}