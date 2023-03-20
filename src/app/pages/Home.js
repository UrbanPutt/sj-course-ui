import {useROS} from '../components/ROS/ROS';
import React, { useEffect, useState } from 'react'
import BasePage from "./BasePage/BasePage"
let listenerConnectionStatus = null;
export default function Home(){
    const pageName = "HOME";
    const { isConnected, createListener, removeListener, changeUrl} = useROS();
    const namespace = "/ns_finale_hole"
    const topicPath = namespace + "/connectionStatus";
    const topicMsgType = "diagnostic_msgs/msg/KeyValue";

    const [ serialConnectionStatus, setSerialConnectionStatus ] = useState(false);
    const homeUrl = "ws://98.53.134.144:9090"; //home
    const shopUrl = "ws://71.205.218.154:9090"; //urban putt shop in denver
    const localUrl = "ws://192.168.0.209:9090"; //local network
    const localUrl245 = "ws://192.168.0.245:9090"; //local network
    const [url, setUrl] = useState(shopUrl);
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

        return() => {
            removeListener(listenerConnectionStatus);
            listenerConnectionStatus = null;
            console.log("cleanup: shark");
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

    
    const websockets = [shopUrl,localUrl, localUrl245, homeUrl];
    //const socketNames = ["shop","local","jake"];

    let optionItems = websockets.map((item) =>
    <option key={item}>{item}</option>
    );

    const handleChange = (e) => {
        console.log("Websocket Selected: " + e.target.value);
        setUrl(e.target.value);
        changeUrl(e.target.value);
        }

    return(
        <BasePage pageName = {pageName} pageContent={
            <div className="section w-screen justify-center">
                <h1><b>Welcome to the urban putt san jose control site!</b></h1>
                <p>This site is intended for urban putt personnel only.</p> 
                <p>Enjoy!</p>

     
            </div>
        }>
        </BasePage>
    )
}