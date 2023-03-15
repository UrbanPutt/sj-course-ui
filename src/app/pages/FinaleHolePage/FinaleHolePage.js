import FullscreenBtn from '../../components/FullScreenBtn';
import Header from '../../components/Header';
import { useROS } from '../../components/ROS/ROS';
import ROSLIB from 'roslib'
import React, { useEffect, useState } from 'react'
import FinaleP5Sketch from './FinaleP5Sketch';
import { ReactP5Wrapper } from 'react-p5-wrapper';

//DEFINE LISTENERS AND PUBLISHERS

let listenerJointState = null;
let publisherCmdVel = null;
let publisherInputEvents = null;
let listenerStateMachine = null;

export default function SharkHolePage(props){

  const namespace = props.namespace
  const { isConnected, createListener, createPublisher, removeListener} = useROS();
  const topicPathMotorStatus = namespace + "/motorStatus";
  const keyValueMsgType = "diagnostic_msgs/msg/KeyValue";
  const topicPathJointState = namespace + "/jointState";
  const jointStateMsgType = "sensor_msgs/msg/JointState";
  const topicPathStateMachine = namespace + "/stateMachine";

  const [ motor0Msg, setmotor0Msg ] = useState('{}');
  const [ motor1Msg, setmotor1Msg ] = useState('{}');
  const [ motor2Msg, setmotor2Msg ] = useState('{}');
  //const [ motor3Msg, setmotor3Msg ] = useState('{}');
  

  const [jointStateMsg, setJointStateMsg] = useState('');
  const [motor0VelDeg, setmotor0VelDeg ] = useState('0.0');

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
    

    if(msg.name[0] === "bismuth_lift_lower_joint"){
      setJointStateMsg(msg);
      const motor0PosDeg = msg.position[0];
      const motor0PosRad = motor0PosDeg*Math.PI/180.0; //convert to radians
      //console.log("torsoVel: " + String(msg.velocity[0]));
      setmotor0VelDeg(msg.velocity[0]);
    }
  }

  var keyValue = new ROSLIB.Message({
    key: '',
    value: ''
  })


  function btnClick(event){
    const sourceId = event.target.id;
    if (sourceId == "resetBtn"){
      keyValue.key = 'reset_btn';
      keyValue.value = 'True';
    }
    if (sourceId == "startBtn"){
      keyValue.key = 'start_btn';
      keyValue.value = 'True';
    }
    if (sourceId == "stopBtn"){
      keyValue.key = 'stop_btn';
      keyValue.value = 'True';
    }
    
    
    if (publisherInputEvents !== null && isConnected)
    {
      publisherInputEvents.publish(keyValue);
    }
  }


  var jointState = new ROSLIB.Message({
    name: ['bismuth_lift_lower_joint'],
    position: [0.0],
    velocity: [0.0]
  });


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
          <ReactP5Wrapper sketch={FinaleP5Sketch} torsoMsg={motor0Msg} jawMsg={motor1Msg} jointStateMsg={jointStateMsg} />
      </div>
      <p>Hole State: {stateMachineMsg}</p>
      <p>Step Number: {stepMsg}</p>
      <div className="section">
        <button id="resetBtn" className="btn btn-blue w-32 m-4 select-none" 
                onClick={btnClick}>
          RESET
        </button>

      </div>

      <div className="fixed bottom-1 right-0 z-50">
          <FullscreenBtn />
      </div>
    </div>   
  );
}