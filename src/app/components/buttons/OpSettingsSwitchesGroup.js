import React, { useEffect, useState } from 'react'
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import ROSLIB from 'roslib'
//import { useROS} from '../../components/ROS/ROS';
import { useROS} from '../ROS/ROS';

let init = false;

export default function OpSettingsSwitchesGroup(props) {
  const [state, setState] = useState({
      occupancyOverridden: false,
      safetyOverridden: false,
      startMode: 0,
      resetMode: 0,
    
  });

  //let client = props.client !== null? props.client: null;
  let client

  const { finaleSettingsClient, ros, isConnected} = useROS();
  //client = finaleSettingsClient;

  useEffect(() => {

    return() => {
      init = false;
    };

  },[]); //leave the array in despite the warning, it is needed for some reason


  const handleChange = (event) => {
    let settingName
    let settingVal
    if (event !== null){
      settingName = event.target.name;
      settingVal = event.target.checked;

    }
    else{
      console.log("initial reading")
      settingName = "";
      settingVal = false;
    }
    //1. make service request to update settings as long as client isn't null
  
    if(isConnected){
      console.log("making request")
      const cl = createServiceClient();
      makeServiceRequest(settingName,settingVal.toString(),cl);
    }
      
    //3. wait for service return then re-update state (this happens inside the makeServiceRequest function)
  
  };

  if(isConnected & !init){
    init = true;
    handleChange(null);
  }
  else if(!isConnected & init){
    init = false;
  }


  function updateOccupancySettingsState(js){
    setState({
      ...state,
      ["safetyOverridden"]: js["safetyOverridden"],
      ["occupancyOverridden"]: js["occupancyOverridden"],
    });
  }

  async function makeServiceRequest(settingName,settingVal,client){
    var request = new ROSLIB.ServiceRequest({
      key : settingName,
      value : settingVal.toString()
    });
  
    client.callService(request, function(result) {
      console.log('Result for service call on '
        + client.name
        + ': '
        + result.key
        + ', '
        + result.value);
      
      var newState = JSON.parse(result.value)
      console.log("newState: ")
      console.log(newState)
      updateOccupancySettingsState(newState);
    });

  }

  

  function createServiceClient(){
    //console.log("creating service clients for ros context")
    let serviceName = '/ns_finale_hole/operation_settings';
    const client = new ROSLIB.Service({
      ros : ros,
      name : serviceName,
      serviceType : 'custom_intefaces/Info'
      });
    console.log("service client created: " + serviceName)

    return client
  }


  
  //console.log("state.occupancyOverridden")
  //console.log(state.occupancyOverridden)

  return (
    <FormControl component="fieldset" variant="standard">
      <FormLabel component="legend">Overrides</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch checked={state.occupancyOverridden} onChange={handleChange} name="occupancyOverridden" />
          }
          label="Occupancy"
        />
        <FormControlLabel
          control={
            <Switch checked={state.safetyOverridden} onChange={handleChange} name="safetyOverridden" />
          }
          label="Safety"
        />
      </FormGroup>
      <FormHelperText>Switch On To Override</FormHelperText>
    </FormControl>
  );
}