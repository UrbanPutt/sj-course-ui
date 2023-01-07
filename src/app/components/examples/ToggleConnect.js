import React, { useEffect } from 'react'
import { useROS } from '../ROS'


function ToggleConnect() {
  const { isConnected, topics, url, changeUrl, toggleConnection, toggleAutoconnect} = useROS();

  // Try replacing this with your own unique rosbridge webserver address
  const defaultURL = "ws://0.0.0.0:9090";
  //const defaultURL = "ws://6.tcp.ngrok.io:17064";
 
	
  // only runs once when ToggleConnect is first rendered (mounted)
  useEffect(() => {
    console.log('ToggleConnect is mounted!');
    if (url !== defaultURL) {
      changeUrl(defaultURL);
    }

    if (!isConnected) {
      toggleAutoconnect();
    }
  },[changeUrl, isConnected, toggleAutoconnect, url])
    
  // runs every time there is an update to any state/rerender
  useEffect(() => {
    //console.log('rerender ToggleConnect');
  })

  return (
    <div className= "flex flex-col w-full">
      <button className= "btn btn-blue w-44 mb-4" onClick={ toggleConnection }>Connect</button>
      <b className="mr-4">ROS url input:</b>
      <input  className="block w-44 rounded-md bg-slate-100 border-gray-500 pl-7 pr-12 shadow-lg focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
         defaultValue={ url } 
         onChange={event => changeUrl(event.target.value)} />  
      <b>ROS url to connect to:  </b> {url}  <br />
      <b>Status of ROS:</b> { isConnected ? "connected" : "not connected" }   <br />
      <b>Topics detected:</b><br />
      { topics.map((topic, i) => <li key={i}>    {topic.path}</li> )}
    </div>
  );
}

export default ToggleConnect;
