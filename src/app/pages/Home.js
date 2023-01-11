import Header from '../components/Header';
import FullscreenBtn from '../components/FullScreenBtn';
import {useROS} from '../components/ROS/ROS';
import React, { useEffect, useState } from 'react'

let listenerConnectionStatus = null;
export default function Home(){
    const { isConnected, createListener, removeListener, changeUrl} = useROS();
    const topicPath = "/connectionStatus";
    const topicMsgType = "diagnostic_msgs/msg/KeyValue";

    const [ serialConnectionStatus, setSerialConnectionStatus ] = useState(false);
    const homeUrl = "ws://98.53.134.144:9090"; //home
    const shopUrl = "ws://174.29.180.255:9090"; //urban putt shop in denver
    const [url, setUrl] = useState(homeUrl);
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

    
    const websockets = [homeUrl, shopUrl];

    let optionItems = websockets.map((item) =>
    <option key={item}>{item}</option>
    );

    const handleChange = (e) => {
        console.log("Websocket Selected: " + e.target.value);
        setUrl(e.target.value);
        changeUrl(e.target.value);
        }

    return(
        <div className="h-screen w-screen">
            <Header />
            <div className="section w-screen justify-center">
                <h1><b>Welcome to my robotics control site!</b></h1>
                <p>Please play with my motors, I have a physical motor sitting on my kitchen you can move, 
                    just go to the steppers page and jog the "jaw" motor around.</p> 
                <p>Also, you can move a simulated motor on the Shark Hole page.
                    ENJOY :)</p>
                <b> </b><br/>
                <p className={`${isConnected?'text-green-500' : 'text-red-500' }`}> <b className="text-black">Ros Websocket: </b>{isConnected? "connected":"disconnected"}</p><br/>
                <p className={`${serialConnectionStatus?'text-green-500' : 'text-red-500' }`}> <b className="text-black">Stepper Controller: </b>{serialConnectionStatus? "connected":"disconnected"}</p><br/>
                
                <div>                
                    <div className="row">
                        <div className="col-9 text-left">
                            <label>Select the Ros websocket to connect to</label>
                        </div>
                        <div className="col-2 text-left">
                            <select value={url} onChange={handleChange}>
                                {optionItems}
                            </select>
                        </div>
                        <div className="col-1 text-left">
                            <label>&nbsp;</label>
                        </div>
                    </div>

                </div>

            </div>


            <div className="fixed bottom-1 right-0 z-50">
                <FullscreenBtn />
            </div>
        </div>     
    )
}