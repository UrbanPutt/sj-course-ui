import BasePage from "../BasePage/BasePage"
import {useROS} from '../../components/ROS/ROS';
import React, { useEffect, useState } from 'react'
import HoleList from './HoleList';

let listenerConnectionStatus = null;
export default function HolesPage(){
    const pageName = "HOLES";
    const { isConnected, createListener, removeListener} = useROS();
    const namespace = "/ns_finale_hole"
    const topicPath = namespace + "/connectionStatus";
    const topicMsgType = "diagnostic_msgs/msg/KeyValue";

    const [ serialConnectionStatus, setSerialConnectionStatus ] = useState(false);

    const handleMsg = (msg) => {
        console.log("handleMsg: home");
        if (msg.key === 'serial')
        {   
            //console.log(msg.value === 'True');
            setSerialConnectionStatus(msg.value === 'True');
        }  
    }

    if(!isConnected & serialConnectionStatus){
        setSerialConnectionStatus(false);
    }
    else if(isConnected & !serialConnectionStatus){
        console.log("stepper controller serial connection is disconnected");
    }

    useEffect(() => {

        //cleanup on start and close
        return() => {
            removeListener(listenerConnectionStatus);
            listenerConnectionStatus = null;
        };

    },[]); //leave the array in despite the warning, it is needed for some reason


    if (isConnected & listenerConnectionStatus === null)
    {
    listenerConnectionStatus = createListener( topicPath,
        topicMsgType,
        Number(0),
        'none');
        listenerConnectionStatus.subscribe(handleMsg);
    console.log("subscribe: home")
    }




    return(
        <BasePage pageName = {pageName} pageContent={
            <div className="section w-screen justify-center">
              
                <HoleList/>
            </div>       

        }>
        </BasePage>    
    )
}