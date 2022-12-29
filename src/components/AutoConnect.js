import { useEffect } from 'react'
import { useROS } from './ROS'


function AutoConnect() {
  const { autoconnect, toggleAutoconnect, url, changeUrl} = useROS();
  const defaultURL = "ws://192.168.0.219:9090";

 
  // only runs once when ToggleConnect is first rendered (mounted)
  useEffect(() => {
    
    console.log('AutoConnect is mounted!');
    if (url !== defaultURL) {
      changeUrl(defaultURL);
    }

    if (!autoconnect) {
      toggleAutoconnect();
    }
  },[changeUrl, autoconnect, toggleAutoconnect, url])
    
  // runs every time there is an update to any state/rerender
  useEffect(() => {
    //console.log('rerender ToggleConnect');
  })

}

export default AutoConnect;
