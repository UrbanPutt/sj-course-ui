import FullscreenBtn from '../FullScreenBtn';
import MotorStatusTopicProvider from '../../components/examples/MotorStatusTopicProvider';
import Header from '../../components/Header';
import { useROS } from '../ROS';


export default function StepperStatusPage(){
  const { isConnected} = useROS();
  return(
    <div className="h-screen w-screen">
      <Header />
      <div className="section w-screen justify-center">
        <MotorStatusTopicProvider isConnected={isConnected}/>
      </div>
      <div className="fixed bottom-1 right-0 z-50">
          <FullscreenBtn />
      </div>
    </div>   
  );
}