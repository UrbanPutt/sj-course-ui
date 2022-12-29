import EchoTopic from './components/examples/EchoTopic'
import {ROS} from './components/ROS'
import Header from './components/Header';
import FullscreenBtn from './components/FullScreenBtn';
import AutoConnect from './components/AutoConnect'

function App() {

  //const defaultURL = "ws://192.168.0.219:9090";

  
  return (
    <ROS>
      <Header />
      <div className="section">
        <AutoConnect />
        <EchoTopic className="section"/>
        <FullscreenBtn />
      </div>
    </ROS>
  );
}

export default App;
