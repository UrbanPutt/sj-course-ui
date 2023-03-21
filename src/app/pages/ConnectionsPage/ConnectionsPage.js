import {useROS} from '../../components/ROS/ROS';
import React, {useState} from 'react'
import BasePage from "../BasePage/BasePage"
import ConnectionsList from './ConnectionsList';


//let listenerConnectionStatus = null;

export default function ConnectionsPage(props){
    const pageName = "CONNECTIONS";
    const { isConnected, changeUrl} = useROS();
    const holelist = props.holelist;
    const defaultUrl = process.env.REACT_APP_DEFAULT_WS_URL;
    const homeUrl = "ws://98.53.134.144:9090"; //home
    const shopUrl = "ws://71.205.218.154:9090"; //urban putt shop in denver
    const localUrl = "ws://192.168.0.209:9090"; //local network
    const localUrl245 = "ws://192.168.0.245:9090"; //local network
    const zerotierUrl = "ws://192.168.195.209:9090"; //zeroTier network
    const [url, setUrl] = useState(defaultUrl);


    const websockets = [shopUrl,localUrl, localUrl245, homeUrl,zerotierUrl];
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
                <p className={`${isConnected?'text-green-500' : 'text-red-500' }`}> <b className="text-black">Ros Websocket: </b>{isConnected? "connected":"disconnected"}</p><br/>

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
                <ConnectionsList holelist={holelist} />

            </div>
        }>
        </BasePage>
    )
}