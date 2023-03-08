import { useEffect } from 'react'
import { useROS } from '../ROS'



function AutoConnect() {
  const { autoconnect, toggleAutoconnect, url, changeUrl} = useROS();
  //const defaultURL = "ws://192.168.0.219:9090"; //jakers-linux
  //const defaultURL = "ws://192.168.0.245:9090"; //raspberry pi
  //const defaultURL = "ws://98.53.134.144:9090"; //internet access to websocket on robotDungeon network
  //const defaultURL = process.env.WS_URL;

 
  // only runs once when ToggleConnect is first rendered (mounted)
  useEffect(() => {
    
    if (url !== defaultURL) {
      changeUrl(defaultURL);
      console.log('Changed the url for ros websocket');
    }

    if (!autoconnect) {
      console.log('auto connect is now turned on');
      toggleAutoconnect();
    }
  },[changeUrl, autoconnect, toggleAutoconnect, url, defaultURL])
    

}

export default AutoConnect;
