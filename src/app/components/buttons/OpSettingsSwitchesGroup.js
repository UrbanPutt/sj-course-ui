import React, { useEffect, useState } from 'react'
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import ROSLIB from 'roslib'
//import { useROS} from '../../components/ROS/ROS';
import { useROS} from '../ROS/ROS';

//let init = false;

export default function OpSettingsSwitchesGroup(props) {
  const [state, setState] = useState({
      occupancyOverridden: 0,
      safetyOverridden: 0,
      startMode: 0,
      resetMode: 0,
    
  });

  const settingsGroup = props.settingsGroup;
  //let client

  const { finaleSettingsClient, ros, isConnected} = useROS();
  //client = finaleSettingsClient;

  const [init,setInit] = useState(false);

  useEffect(() => {

    return() => {
      setInit(false)
      if(isConnected){
        //setInit(true);
        handleChange(null);
      }
    };

  },[]); //leave the array in despite the warning, it is needed for some reason


  const handleRadioButtonChange = (event) => {
    let settingName
    let settingVal
    if (event !== null){
      settingName = event.target.name;
      settingVal = event.target.value? event.target.value : 0;
    }
    else{
      console.log("initial reading")
      settingName = "readAll";
      settingVal = 0;
    }
    //1. make service request to update settings as long as client isn't null
  
    if(isConnected){
      console.log("making request")
      const cl = createServiceClient();
      makeServiceRequest(settingsGroup,settingName,settingVal.toString(),cl);
    }
  };

  const handleChange = (event) => {
    let settingName
    let settingVal
    if (event !== null){
      settingName = event.target.name;
      settingVal = event.target.checked? 1 : 0;

    }
    else{
      console.log("initial reading")
      settingName = "readAll";
      settingVal = 0;
    }
    //1. make service request to update settings as long as client isn't null
  
    if(isConnected){
      console.log("making request")
      const cl = createServiceClient();
      makeServiceRequest(settingsGroup,settingName,settingVal.toString(),cl);
    }
      
    //3. wait for service return then re-update state (this happens inside the makeServiceRequest function)
  
  };

  if(isConnected & !init){
    setInit(true);
    handleChange(null);
  }
  else if(!isConnected & init){
    setInit(false);
  }


  function updateOccupancySettingsState(js){
    setState({
      ...state,
      ["safetyOverridden"]: js["safetyOverridden"],
      ["occupancyOverridden"]: js["occupancyOverridden"],
      ["resetMode"]: js["resetMode"],
      ["startMode"]: js["startMode"],
    });
  }

  async function makeServiceRequest(settingsGroup,settingName,settingVal,client){
    const keyString = settingsGroup + ',' + settingName
    var request = new ROSLIB.ServiceRequest({
      key : keyString,
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
    <div>
      <b>{props.label}</b>
      <div>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">Start Mode</FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="resetMode"
            value={state.resetMode}
            onChange={handleRadioButtonChange}
          >
            <FormControlLabel value="0" control={<Radio />} label="disabled" />
            <FormControlLabel value="1" control={<Radio />} label="auto" />
            <FormControlLabel value="2" control={<Radio />} label="manual" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" variant="standard">
          <FormLabel component="legend">Overrides</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch checked={state.occupancyOverridden===1} onChange={handleChange} name="occupancyOverridden" />
              }
              label="Occupancy"
            />
            <FormControlLabel
              control={
                <Switch checked={state.safetyOverridden===1} onChange={handleChange} name="safetyOverridden" />
              }
              label="Safety"
            />
          </FormGroup>
          <FormHelperText>Switch On To Override</FormHelperText>
        </FormControl>

      </div>
      
    </div>

  );
}