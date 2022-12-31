//import EchoTopic from './components/examples/EchoTopic'
import EchoMotorStatusTopic from './components/examples/EchoMotorStatusTopic'
import {ROS} from './components/ROS'
import Header from './components/Header';
import FullscreenBtn from './components/FullScreenBtn';
import AutoConnect from './components/AutoConnect'

function App() {

  //const defaultURL = "ws://192.168.0.219:9090";

  
  return (
    <ROS>
      <Header />
      <div className="section h-screen w-screen justify-center">
        <AutoConnect />
        <EchoMotorStatusTopic />
        <div className="fixed bottom-1 right-1 z-50">
          <FullscreenBtn  />
        </div>
      </div>   
    </ROS>
  );
}

export default App;
