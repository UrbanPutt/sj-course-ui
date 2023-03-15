import FullscreenBtn from '../../components/FullScreenBtn';
import MotorControl from './MotorStatus';
import Header from '../../components/Header';
import { useROS} from '../../components/ROS/ROS';
import React, { useEffect, useState } from 'react'


let listenerMotorStatus = null;


export default function MotorPage(props){

  const motorId = props.motorId;
  const { isConnected, createListener, removeListener} = useROS();
  const namespace = props.namespace;
  const topicPathMotorStatus = namespace + "/motorStatus";
  const topicMotorStatusMsgType = "diagnostic_msgs/msg/KeyValue";


  const [ motorMsg, setmotorMsg ] = useState('{}');

  const handleMsg = (msg) => {
    //console.log("handleMsg: steppers");
    if (msg.key === String(motorId))
    {
      setmotorMsg(String(msg.value));
    }

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



  useEffect(() => {

    return() => {
      removeListener(listenerMotorStatus);
      listenerMotorStatus = null;
      console.log("cleanup: steppers");
    };

  },[]); //leave the array in despite the warning, it is needed for some reason
  


  
  return(
    <div className="h-screen w-screen">
      <Header />
      
      <div className="section w-screen justify-center">
    
        <div className="flex flex-row justify-evenly sm:justify-start ">
          <MotorControl statusJson={motorMsg} name="MOTOR" namespace={namespace} motorId={motorId} />
        </div>

      </div>
      <div className="fixed bottom-1 right-0 z-50">
          <FullscreenBtn />
      </div>
    </div>   
  );
}