import ToggleConnect from './components/examples/ToggleConnect'
import EchoTopic from './components/examples/EchoTopic'
import { ROS} from './components/ROS'
import NavBar from './components/NavBar';
import React from 'react'

function App() {
  return (
    <ROS>
      <div className="flex">
        <NavBar />
      </div>
    </ROS>
  );
}

export default App;
