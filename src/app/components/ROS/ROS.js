import React, { useContext, useEffect } from 'react'
import ROSLIB from 'roslib'
import { ROSContext, ROSProvider } from './ROSContext'
import PropTypes from 'prop-types'

// ROS Hook that lets others use ROS websocket connection
// returns some useful functions & values
function useROS() {
  const [ros, setROS] = useContext(ROSContext);

  if(!ros.isConnected){
    console.log("ros is disconnected");
  }

  useEffect(() => {
    if (!ros.isConnected) {
      if(ros.autoconnect) {
        handleConnect();
      }
    }

    return(()=>{
      //handleDisconnect();
    })
  },[ros])


  function checkConnection() {

    if (ros.ROS){
      if (ros.isConnected) {
        if (!ros.ROSConfirmedConnected && ros.ROS.isConnected) {
          setROS(ros => ({ ...ros, ROSConfirmedConnected: ros.ROS.isConnected }))
          console.log("Both react-ros and roslibjs have confirmed connection.")
        }
        // Once we have that "confirmation"  we need to continously check for good connection
        else if (ros.ROSConfirmedConnected && !ros.ROS.isConnected) {
          setROS(ros => ({ ...ros, isConnected: false }));
          handleDisconnect();
        }
        else if (!ros.ROS.isConnected) {
          console.log("React-ros has confirmed the connection, roslibjs has not yet.")
        }
      }
    }
    else{
      console.log("Initial connection not established yet")
    }
  }

  setInterval(()=> {
    //checkConnection();
    if(!ros.isConnected){
      //console.log("disconnected from ros, retrying connect");
      //handleConnect();
    }
    
  },1000);

  function toggleConnection() {
    if (ros.isConnected) {
      handleDisconnect();
    } else if (!ros.isConnected) {
      handleConnect();
    }
  }

  function toggleAutoconnect() {
    if (ros.autoconnect) {
      setROS(ros => ({ ...ros, autoconnect: false }));
    } else if (!ros.autoconnect) {
      setROS(ros => ({ ...ros, autoconnect: true }));
    }
  }

  function changeUrl(new_url) {
    if(new_url !== ros.url){
      handleDisconnect();
      setROS(ros => ({ ...ros, url: new_url }));
      //handleConnect();
    }
    
  }

  function getTopics() {
    const topicsPromise = new Promise((resolve, reject) => {
      ros.ROS.getTopics((topics) => {
        const topicList = topics.topics.map((topicName, i) => {
          return {
            path: topicName,
            msgType: topics.types[i],
            type: "topic",
          }
        });
        resolve({
          topics: topicList
        });
        reject({
          topics: []
        });
      }, (message) => {
        console.error("Failed to get topic", message)
        ros.topics = []
      });
    });
    topicsPromise.then((topics) => setROS(ros => ({ ...ros, topics: topics.topics })));
    return ros.topics;
  }

  function getServices() {
    const servicesPromise = new Promise((resolve, reject) => {
      ros.ROS.getServices((services) => {
        const serviceList = services.map((serviceName) => {
          return {
            path: serviceName,
            type: "service",
          }
        });
        resolve({
          services: serviceList
        });
        reject({
          services: []
        });
      }, (message) => {
        console.error("Failed to get services", message)
        ros.services = []
      });
    });
    servicesPromise.then((services) => setROS(ros => ({ ...ros, services: services.services })));
    return ros.services;
  }

  function checkExistingListeners(newListener){
    for (var listener in ros.listeners) {
      if (newListener.name === ros.listeners[listener].name) {
        
        return [true, listener];
      }
    }
    return [false, -1];
  }

  function createListener(topic, msg_type, to_queue, compression_type) {
    var newListener = new ROSLIB.Topic({
      ros: ros.ROS,
      name: topic,
      messageType: msg_type,
      queue_length: to_queue,
      compression: compression_type,
    })
    const[alreadyExists, index]= checkExistingListeners(newListener)
    if (alreadyExists && false) {
        console.log('Listener already available in ros.listeners');
        return ros.listeners[index];
    }
    else{
      ros.listeners.push(newListener);
      console.log('Listener ' + newListener.name + ' created');
      console.log("num of listeners: " + String(ros.listeners.length));
      return newListener;
    }
    
  }

  function checkExistingPublishers(newPublisher){
    for (var publisher in ros.publishers) {
      if (newPublisher.name === ros.publishers[publisher].name) {
  
        return [true, publisher];
      }
    }
    return [false, -1];
  }

  function createPublisher(topic,msg_type){
    var newPublisher = new ROSLIB.Topic({
      ros: ros.ROS,
      name: topic,
      messageType: msg_type
    });
    const[alreadyExists, index] = checkExistingPublishers(newPublisher)
    if (alreadyExists) {
      console.log('Publisher already available in ros.publishers');
      return ros.publishers[index];
  }
  else{
    ros.publishers.push(newPublisher);
    console.log('Publisher ' + newPublisher.name + ' created');
    return newPublisher;
  }
  }

  const handleConnect = () => {

    try {
      console.log("connecting to url: " + ros.url);
      ros.ROS.connect(ros.url)
      ros.ROS.on('connection', () => {
        // console.log(connect)
        setROS(ros => ({ ...ros, isConnected: true }));  // seems to take awhile for the roslibjs library to report connected
        setROS(ros => ({ ...ros, ROSConfirmedConnected: false }));
        getTopics();
        getServices();
        //createServiceClients();
        console.log("connected!")
      })

      ros.ROS.on('close', ()=>{
        resetData(); 
        console.log("connection closed with websocket");
      });

      ros.ROS.on('error', (error) => {  //gets a little annoying on the console, but probably ok for now
        console.log(error);
        resetData(); 
        console.log("roslibjs failed to connect");
      })
    } catch (e) {
      resetData(); 
      console.log("error when trying to connect:" + e);
    }
  }

  const handleDisconnect = () => {
    try {
      resetData(); 
      ros.ROS.close();
    } catch (e) {
      console.log(e);
    }
    console.log('Disconnected');
  }

  function resetData()  {
    setROS(ros => ({ ...ros, isConnected: false }));
    setROS(ros => ({ ...ros, topics: [] }));
    setROS(ros => ({ ...ros, listeners: [] }));
    setROS(ros => ({ ...ros, ROSConfirmedConnected: false }));
  }

  function createServiceClients(){
    //console.log("creating service clients for ros context")
    let serviceName = '/ns_finale_hole/operation_settings';
    const cl = new ROSLIB.Service({
      ros : ros,
      name : serviceName,
      serviceType : 'custom_intefaces/Info'
      });
    console.log("service client created: " + serviceName)
    ros.finaleSettingsClient = cl;
    //setROS(ros => ({ ...ros, finaleSettingsClient: cl }))

  }

  const removeAllListeners = () => {
    for (var mlistener in ros.listeners) {
      ros.listeners[mlistener].removeAllListeners();
    }
    setROS(ros => ({ ...ros, listeners: [] }));
  }

  function removeListener(listener) {
    for (var mlistener in ros.listeners) {
      if (listener.name === ros.listeners[mlistener].name) {
        console.log('Listener: ' + listener.name + ' is removed')
        ros.listeners.splice(mlistener, 1)
        listener.removeAllListeners();
        console.log("num of listeners: " + String(ros.listeners.length));
        return
      }
    }
    console.log('Listener: ' + listener + ' is not a listener')
  }

  function removePublisher(publisher) {
    for (var index in ros.publishers) {
      if (publisher.name === ros.publishers[index].name) {
        console.log('Publisher: ' + publisher.name + ' is removed')
        ros.publishers.splice(index, 1)
        //listener.removeAllListeners();
        console.log("num of publishers: " + String(ros.publishers.length));
        return
      }
    }
    console.log('Publisher: ' + publisher + ' is not a publisher')
  }


  return {
    toggleConnection,
    changeUrl,
    getTopics,
    getServices,
    createListener,
    createPublisher,
    toggleAutoconnect,
    removeAllListeners,
    removeListener,
    removePublisher,
    checkConnection,
    ros: ros.ROS,
    isConnected: ros.isConnected,
    autoconnect: ros.autoconnect,
    url: ros.url,
    topics: ros.topics,
    services: ros.services,
    listeners: ros.listeners,
    finaleSettingsClient: ros.finaleSettingsClient,
  }
}

// ROS Component to manage ROS websocket connection and provide
// it to children props
function ROS(props) {
  return (
    <ROSProvider>
      {props.children}
    </ROSProvider>
  );
}

ROS.propTypes = {
  children: PropTypes.node.isRequired,
}

export { useROS, ROS };
